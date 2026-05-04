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

export const getClassroomFeatures = async () => {
  const res = await fetch(`${API_URL}/api/classroom-features`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const createClassroomFeature = async ({ code, name }) => {
  const res = await fetch(`${API_URL}/api/classroom-features`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: { code, name },
    }),
  });

  return await handleResponse(res);
};
