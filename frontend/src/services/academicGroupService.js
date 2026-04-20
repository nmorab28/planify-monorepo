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

const LIST_POPULATE =
  "populate[course]=true&populate[teacher]=true&populate[scheduleConfig]=true";

export const getAcademicGroups = async () => {
  const res = await fetch(`${API_URL}/api/academic-groups?${LIST_POPULATE}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const getAcademicGroupById = async (documentId) => {
  const res = await fetch(
    `${API_URL}/api/academic-groups/${documentId}?${LIST_POPULATE}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(res);
  return data.data;
};

export const createAcademicGroup = async (group) => {
  const res = await fetch(`${API_URL}/api/academic-groups`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: group,
    }),
  });

  return await handleResponse(res);
};

export const updateAcademicGroup = async (documentId, group) => {
  const res = await fetch(`${API_URL}/api/academic-groups/${documentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: group,
    }),
  });

  return await handleResponse(res);
};

export const deleteAcademicGroup = async (documentId) => {
  const res = await fetch(`${API_URL}/api/academic-groups/${documentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return await handleResponse(res);
};

export const getCourses = async () => {
  const res = await fetch(`${API_URL}/api/courses`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};
