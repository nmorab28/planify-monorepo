const BASE_URL = process.env.PLANIFY_API_URL || 'http://localhost:1337';
const FRONTEND_URL = process.env.PLANIFY_FRONTEND_URL || 'http://localhost:3000';
const PASSWORD = process.env.PLANIFY_SEED_PASSWORD || 'Planify123*';

const users = [
  ['coordinator', 'coordinator@planify.edu'],
  ['teacher', 'teacher@planify.edu'],
  ['student', 'student@planify.edu'],
];

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => null);
  return { response, body };
}

async function login(email) {
  const { response, body } = await request(`${BASE_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password: PASSWORD }),
  });

  if (!response.ok || !body?.jwt) {
    throw new Error(`Login fallido para ${email}: ${response.status}`);
  }

  return body.jwt;
}

async function checkJson(label, path, token, expectedStatus = 200) {
  const { response, body } = await request(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (response.status !== expectedStatus) {
    throw new Error(`${label}: esperado ${expectedStatus}, recibido ${response.status}`);
  }

  const count = Array.isArray(body?.data) ? body.data.length : '-';
  console.log(`OK ${label} (${response.status}, registros: ${count})`);
  return body;
}

async function checkFrontend() {
  const response = await fetch(FRONTEND_URL);
  if (!response.ok) {
    throw new Error(`Frontend no responde: ${response.status}`);
  }
  console.log(`OK frontend (${response.status})`);
}

async function main() {
  await checkFrontend();

  const tokens = {};
  for (const [key, email] of users) {
    tokens[key] = await login(email);
    console.log(`OK login ${email}`);
  }

  await checkJson('docentes', '/api/teachers', tokens.coordinator);
  await checkJson('cursos', '/api/courses', tokens.coordinator);
  await checkJson('aulas', '/api/classrooms?populate=features', tokens.coordinator);
  await checkJson('disponibilidad', '/api/availabilities?populate=teacher', tokens.coordinator);
  await checkJson('configuracion', '/api/schedule-configs', tokens.coordinator);
  await checkJson('reglas obligatorias', '/api/hard-rules', tokens.coordinator);
  await checkJson('reglas blandas', '/api/soft-rules', tokens.coordinator);
  await checkJson('sesiones', '/api/class-sessions', tokens.coordinator);
  await checkJson('estudiante sin sesiones', '/api/class-sessions', tokens.student, 403);

  console.log('OK demo verificada');
}

main().catch((error) => {
  console.error(`ERROR ${error.message}`);
  process.exit(1);
});
