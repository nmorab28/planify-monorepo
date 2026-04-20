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

const LIST_POPULATE = "populate[classrooms]=true&populate[courses]=true";

export const getClassroomFeatures = async () => {
  const res = await fetch(`${API_URL}/api/classroom-features?${LIST_POPULATE}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const getClassroomFeatureById = async (documentId) => {
  const res = await fetch(
    `${API_URL}/api/classroom-features/${documentId}?${LIST_POPULATE}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(res);
  return data.data;
};

export const createClassroomFeature = async (feature) => {
  const res = await fetch(`${API_URL}/api/classroom-features`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: feature,
    }),
  });

  return await handleResponse(res);
};

export const updateClassroomFeature = async (documentId, feature) => {
  const res = await fetch(`${API_URL}/api/classroom-features/${documentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: feature,
    }),
  });

  return await handleResponse(res);
};

export const deleteClassroomFeature = async (documentId) => {
  const res = await fetch(`${API_URL}/api/classroom-features/${documentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return await handleResponse(res);
};
