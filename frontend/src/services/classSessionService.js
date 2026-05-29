const API_URL = process.env.REACT_APP_API_URL;
const STATIC_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;

const getStoredToken = () => {
  try {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    return userDetails?.idToken || userDetails?.jwt || null;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const token = getStoredToken() || STATIC_API_TOKEN;
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const details = data?.error?.details?.errors;
    const message =
      details?.[0]?.message ||
      data?.error?.message ||
      data?.message ||
      'No se pudo completar la solicitud';
    throw new Error(message);
  }

  return data;
};

const relation = (documentId) => ({
  connect: [{ documentId }],
});

const normalizeTime = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed === '') return undefined;

  const re = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/;
  const match = re.exec(trimmed);
  if (!match) return trimmed;

  const hh = match[1].padStart(2, '0');
  const mm = match[2];
  const ss = (match[3] || '00').padStart(2, '0');
  const ms = (match[4] || '000').padEnd(3, '0').slice(0, 3);

  return `${hh}:${mm}:${ss}.${ms}`;
};

const normalizePayload = (payload) => {
  const data = {
    dayOfWeek: Number(payload.dayOfWeek),
    startTime: normalizeTime(payload.startTime),
    endTime: normalizeTime(payload.endTime),
    sessionOrder: Number(payload.sessionOrder || 1),
    status: payload.status || 'draft',
    isLocked: !!payload.isLocked,
  };

  if (payload.academicGroupDocumentId) {
    data.academicGroup = relation(payload.academicGroupDocumentId);
  }

  if (payload.classroomDocumentId) {
    data.classroom = relation(payload.classroomDocumentId);
  }

  return data;
};

export const getClassSessions = async () => {
  const params = new URLSearchParams();
  params.set('sort[0]', 'dayOfWeek:asc');
  params.set('sort[1]', 'startTime:asc');

  const res = await fetch(`${API_URL}/api/class-sessions?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data || [];
};

export const getClassSessionById = async (documentId) => {
  const res = await fetch(`${API_URL}/api/class-sessions/${documentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const createClassSession = async (payload) => {
  const res = await fetch(`${API_URL}/api/class-sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data: normalizePayload(payload) }),
  });

  return handleResponse(res);
};

export const updateClassSession = async (documentId, payload) => {
  const res = await fetch(`${API_URL}/api/class-sessions/${documentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data: normalizePayload(payload) }),
  });

  return handleResponse(res);
};

export const patchClassSession = async (documentId, data) => {
  const res = await fetch(`${API_URL}/api/class-sessions/${documentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data }),
  });

  return handleResponse(res);
};

export const publishClassSessions = async (sessions) => {
  const publishable = (sessions || []).filter(
    (session) => !session.isLocked && ['draft', 'planned'].includes(session.status)
  );

  const results = await Promise.allSettled(
    publishable.map((session) => patchClassSession(session.documentId, { status: 'published' }))
  );

  const failed = results.filter((result) => result.status === 'rejected');

  return {
    attempted: publishable.length,
    published: publishable.length - failed.length,
    failed: failed.length,
  };
};

export const deleteClassSession = async (documentId) => {
  const res = await fetch(`${API_URL}/api/class-sessions/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};
