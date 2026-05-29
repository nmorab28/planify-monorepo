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
    throw new Error(data?.error?.message || data?.message || 'No se pudo completar la solicitud');
  }

  return data;
};

export const getAcademicGroups = async () => {
  const params = new URLSearchParams();
  params.set('populate[course]', 'true');
  params.set('populate[teacher]', 'true');
  params.set('populate[scheduleConfig]', 'true');
  params.set('sort', 'code:asc');

  const res = await fetch(`${API_URL}/api/academic-groups?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data || [];
};
