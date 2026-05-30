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

const endpointByType = {
  hard: 'hard-rules',
  soft: 'soft-rules',
};

const normalizeParameters = (value) => {
  if (!value || value.trim() === '') return {};
  return JSON.parse(value);
};

const scheduleConfigRelation = (documentId) =>
  documentId
    ? {
        connect: [{ documentId }],
      }
    : undefined;

const buildPayload = (ruleType, payload) => {
  const data = {
    code: payload.code.trim().toUpperCase(),
    name: payload.name.trim(),
    isEnabled: !!payload.isEnabled,
    parameters: normalizeParameters(payload.parameters),
  };

  if (ruleType === 'soft') {
    data.weight = Number(payload.weight || 50);
  }

  const relation = scheduleConfigRelation(payload.scheduleConfigDocumentId);
  if (relation) data.scheduleConfig = relation;

  return data;
};

export const getRules = async (ruleType) => {
  const endpoint = endpointByType[ruleType];
  const params = new URLSearchParams();
  params.set('populate', 'scheduleConfig');
  params.set('pagination[pageSize]', '1000');
  params.set('sort', 'code:asc');

  const res = await fetch(`${API_URL}/api/${endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data || [];
};

export const createRule = async (ruleType, payload) => {
  const endpoint = endpointByType[ruleType];
  const res = await fetch(`${API_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data: buildPayload(ruleType, payload) }),
  });

  return handleResponse(res);
};

export const updateRule = async (ruleType, documentId, payload) => {
  const endpoint = endpointByType[ruleType];
  const res = await fetch(`${API_URL}/api/${endpoint}/${documentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data: buildPayload(ruleType, payload) }),
  });

  return handleResponse(res);
};
