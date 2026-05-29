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

const normalizePayload = (payload) => {
  const data = {
    dayOfWeek: Number(payload.dayOfWeek),
    startTime: payload.startTime,
    endTime: payload.endTime,
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

export const deleteClassSession = async (documentId) => {
  const res = await fetch(`${API_URL}/api/class-sessions/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
};
