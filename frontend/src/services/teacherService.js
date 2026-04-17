const API_URL = process.env.REACT_APP_API_URL;
const STATIC_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;

const getStoredToken = () => {
  try {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    return userDetails?.idToken || userDetails?.jwt || null;
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const storedToken = getStoredToken();
  const token = storedToken || STATIC_API_TOKEN;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMessage =
      data?.error?.message || data?.message || "Unexpected error";
    throw new Error(errorMessage);
  }

  return data;
};

export const getTeachers = async () => {
  const res = await fetch(`${API_URL}/api/teachers`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const createTeacher = async (teacher) => {
  const res = await fetch(`${API_URL}/api/teachers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: teacher,
    }),
  });

  return await handleResponse(res);
};

export const updateTeacher = async (documentId, teacher) => {
  const res = await fetch(`${API_URL}/api/teachers/${documentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: teacher,
    }),
  });

  return await handleResponse(res);
};

export const deleteTeacher = async (documentId) => {
  const res = await fetch(`${API_URL}/api/teachers/${documentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return await handleResponse(res);
};

export const getTeacherById = async (documentId) => {
  const res = await fetch(`${API_URL}/api/teachers/${documentId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};
