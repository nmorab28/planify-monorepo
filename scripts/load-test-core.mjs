const DEFAULT_API_URL = process.env.PLANIFY_API_URL || 'http://localhost:1337';
const DEFAULT_FRONTEND_URL = process.env.PLANIFY_FRONTEND_URL || 'http://localhost:3000';
const DEFAULT_EMAIL = process.env.PLANIFY_LOAD_EMAIL || 'coordinator@planify.edu';
const DEFAULT_PASSWORD = process.env.PLANIFY_LOAD_PASSWORD || 'Planify123*';

export const configByMode = {
  smoke: { durationSeconds: 1, concurrency: 1, warmup: false },
  load: { durationSeconds: 20, concurrency: 8, warmup: true },
  stress: { durationSeconds: 30, concurrency: 24, warmup: true },
};

const now = () => performance.now();

const percentile = (values, p) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.min(Math.max(index, 0), sorted.length - 1)];
};

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const buildLoadConfig = (options = {}) => {
  const mode = options.mode || process.env.PLANIFY_LOAD_MODE || 'load';
  const modeConfig = configByMode[mode];

  if (!modeConfig) {
    throw new Error(`Modo inválido: ${mode}. Usa smoke, load o stress.`);
  }

  return {
    ...modeConfig,
    mode,
    apiUrl: options.apiUrl || DEFAULT_API_URL,
    frontendUrl: options.frontendUrl || DEFAULT_FRONTEND_URL,
    email: options.email || DEFAULT_EMAIL,
    password: options.password || DEFAULT_PASSWORD,
    durationSeconds: toNumber(
      options.durationSeconds || process.env.PLANIFY_LOAD_DURATION,
      modeConfig.durationSeconds
    ),
    concurrency: toNumber(options.concurrency || process.env.PLANIFY_LOAD_CONCURRENCY, modeConfig.concurrency),
  };
};

export const buildEndpoints = ({ apiUrl, frontendUrl }) => [
  { label: 'frontend', url: frontendUrl, auth: false },
  { label: 'docentes', url: `${apiUrl}/api/teachers?pagination[pageSize]=25`, auth: true },
  { label: 'cursos', url: `${apiUrl}/api/courses?pagination[pageSize]=25`, auth: true },
  { label: 'aulas', url: `${apiUrl}/api/classrooms?populate=features&pagination[pageSize]=25`, auth: true },
  {
    label: 'disponibilidad',
    url: `${apiUrl}/api/availabilities?populate=teacher&pagination[pageSize]=25`,
    auth: true,
  },
  { label: 'grupos', url: `${apiUrl}/api/academic-groups?pagination[pageSize]=25`, auth: true },
  { label: 'sesiones', url: `${apiUrl}/api/class-sessions?pagination[pageSize]=25`, auth: true },
  { label: 'reglas obligatorias', url: `${apiUrl}/api/hard-rules?pagination[pageSize]=25`, auth: true },
  { label: 'reglas blandas', url: `${apiUrl}/api/soft-rules?pagination[pageSize]=25`, auth: true },
];

const requestText = async (url, options = {}) => {
  const started = now();
  const response = await fetch(url, options);
  const duration = now() - started;
  await response.text().catch(() => '');
  return { status: response.status, ok: response.ok, duration };
};

const login = async ({ apiUrl, email, password }) => {
  const response = await fetch(`${apiUrl}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password }),
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok || !body?.jwt) {
    throw new Error(`Login fallido (${response.status}) para ${email}`);
  }

  return body.jwt;
};

const createMetrics = (endpoints) =>
  endpoints.reduce((acc, endpoint) => {
    acc[endpoint.label] = {
      count: 0,
      ok: 0,
      failed: 0,
      durations: [],
      statuses: {},
    };
    return acc;
  }, {});

const record = (metrics, label, result) => {
  const bucket = metrics[label];
  bucket.count += 1;
  bucket.durations.push(result.duration);
  bucket.statuses[result.status] = (bucket.statuses[result.status] || 0) + 1;

  if (result.ok) {
    bucket.ok += 1;
  } else {
    bucket.failed += 1;
  }
};

const hitEndpoint = async (endpoint, token) => {
  const headers = endpoint.auth ? { Authorization: `Bearer ${token}` } : undefined;
  return requestText(endpoint.url, { headers });
};

const runSmoke = async (endpoints, token) => {
  const metrics = createMetrics(endpoints);

  for (const endpoint of endpoints) {
    try {
      const result = await hitEndpoint(endpoint, token);
      record(metrics, endpoint.label, result);
    } catch {
      record(metrics, endpoint.label, { status: 'ERR', ok: false, duration: 0 });
    }
  }

  return metrics;
};

const runConcurrent = async (config, endpoints, token) => {
  const metrics = createMetrics(endpoints);
  const stopAt = Date.now() + config.durationSeconds * 1000;

  const worker = async (workerIndex) => {
    let index = workerIndex;

    while (Date.now() < stopAt) {
      const endpoint = endpoints[index % endpoints.length];
      index += config.concurrency;

      try {
        const result = await hitEndpoint(endpoint, token);
        record(metrics, endpoint.label, result);
      } catch {
        record(metrics, endpoint.label, { status: 'ERR', ok: false, duration: 0 });
      }
    }
  };

  await Promise.all(Array.from({ length: config.concurrency }, (_, index) => worker(index)));
  return metrics;
};

const summarize = (config, endpoints, metrics, elapsedSeconds) => {
  const totals = Object.values(metrics).reduce(
    (acc, item) => ({
      count: acc.count + item.count,
      ok: acc.ok + item.ok,
      failed: acc.failed + item.failed,
    }),
    { count: 0, ok: 0, failed: 0 }
  );

  return {
    mode: config.mode,
    apiUrl: config.apiUrl,
    frontendUrl: config.frontendUrl,
    durationSeconds: config.durationSeconds,
    concurrency: config.concurrency,
    elapsedSeconds,
    totals: {
      ...totals,
      throughput: elapsedSeconds > 0 ? totals.count / elapsedSeconds : 0,
      errorRate: totals.count === 0 ? 1 : totals.failed / totals.count,
    },
    endpoints: endpoints.map((endpoint) => {
      const item = metrics[endpoint.label];
      const max = item.durations.length ? Math.max(...item.durations) : 0;

      return {
        label: endpoint.label,
        count: item.count,
        ok: item.ok,
        failed: item.failed,
        p50: percentile(item.durations, 50),
        p95: percentile(item.durations, 95),
        max,
        statuses: item.statuses,
      };
    }),
  };
};

export const runLoadTest = async (options = {}) => {
  const config = buildLoadConfig(options);
  const endpoints = buildEndpoints(config);
  const token = await login(config);

  if (config.warmup) {
    await runSmoke(endpoints, token);
  }

  const started = now();
  const metrics = config.mode === 'smoke' ? await runSmoke(endpoints, token) : await runConcurrent(config, endpoints, token);
  const elapsedSeconds = (now() - started) / 1000;

  return summarize(config, endpoints, metrics, elapsedSeconds);
};

export const formatMs = (value) => `${Math.round(value)}ms`;
