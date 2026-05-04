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
  const storedToken = getStoredToken();
  const token = storedToken || STATIC_API_TOKEN;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage = data?.error?.message || data?.message || 'Unexpected error';
    const error = new Error(errorMessage);
    error.status = res.status;
    error.code = data?.error?.details?.code;
    throw error;
  }

  return data;
};

const buildClassroomsUrl = ({ search } = {}) => {
  const params = new URLSearchParams();
  params.set('populate', 'features');

  if (search && typeof search === 'string' && search.trim().length > 0) {
    params.set('filters[$or][0][code][$containsi]', search.trim());
    params.set('filters[$or][1][name][$containsi]', search.trim());
  }

  return `${API_URL}/api/classrooms?${params.toString()}`;
};

const buildFeatureRelation = (featureDocumentIds) => {
  if (!Array.isArray(featureDocumentIds)) return undefined;
  return {
    set: featureDocumentIds.map((documentId) => ({ documentId })),
  };
};

export const getClassrooms = async ({ search } = {}) => {
  const res = await fetch(buildClassroomsUrl({ search }), {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const getClassroomById = async (documentId) => {
  const res = await fetch(`${API_URL}/api/classrooms/${documentId}?populate=features`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const createClassroom = async ({ code, name, capacity, isActive, featureDocumentIds }) => {
  const data = {
    code,
    name,
    capacity: Number(capacity),
    isActive: !!isActive,
  };

  const features = buildFeatureRelation(featureDocumentIds);
  if (features) data.features = features;

  const res = await fetch(`${API_URL}/api/classrooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data }),
  });

  return await handleResponse(res);
};

export const updateClassroom = async (documentId, payload) => {
  const { featureDocumentIds, capacity, isActive, ...rest } = payload || {};

  const data = { ...rest };
  if (capacity !== undefined) data.capacity = Number(capacity);
  if (isActive !== undefined) data.isActive = !!isActive;

  const features = buildFeatureRelation(featureDocumentIds);
  if (features) data.features = features;

  const res = await fetch(`${API_URL}/api/classrooms/${documentId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ data }),
  });

  return await handleResponse(res);
};

export const deleteClassroom = async (documentId) => {
  const res = await fetch(`${API_URL}/api/classrooms/${documentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  return await handleResponse(res);
};
