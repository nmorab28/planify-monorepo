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

const buildAvailabilitiesUrl = ({ teacherDocumentId } = {}) => {
  const params = new URLSearchParams();
  params.set("populate", "teacher");

  if (teacherDocumentId) {
    params.set("filters[teacher][documentId][$eq]", teacherDocumentId);
  }

  return `${API_URL}/api/availabilities?${params.toString()}`;
};

export const getAvailabilities = async ({ teacherDocumentId } = {}) => {
  const res = await fetch(buildAvailabilitiesUrl({ teacherDocumentId }), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return data.data;
};

export const getAvailabilityById = async (documentId) => {
  const res = await fetch(
    `${API_URL}/api/availabilities/${documentId}?populate=teacher`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await handleResponse(res);
  return data.data;
};

export const createAvailability = async ({
  dayOfWeek,
  startTime,
  endTime,
  isAvailable,
  teacherDocumentId,
}) => {
  const res = await fetch(`${API_URL}/api/availabilities`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        isAvailable,
        teacher: { connect: [{ documentId: teacherDocumentId }] },
      },
    }),
  });

  return await handleResponse(res);
};

export const updateAvailability = async (documentId, payload) => {
  const { teacherDocumentId, ...rest } = payload || {};

  const data = { ...rest };
  if (teacherDocumentId) {
    data.teacher = { connect: [{ documentId: teacherDocumentId }] };
  }

  const res = await fetch(`${API_URL}/api/availabilities/${documentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ data }),
  });

  return await handleResponse(res);
};

export const deleteAvailability = async (documentId) => {
  const res = await fetch(`${API_URL}/api/availabilities/${documentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return await handleResponse(res);
};
