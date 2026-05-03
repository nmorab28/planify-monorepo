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

/**
 * Strapi 5 exige el formato HH:mm:ss.SSS para campos `time` vía REST.
 * Aceptamos HH:MM, HH:MM:SS o HH:MM:SS.SSS y normalizamos.
 * Devuelve undefined si la entrada no es parseable (deja que el backend lo rechace).
 */
const normalizeTime = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed === "") return undefined;

  const re = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/;
  const match = re.exec(trimmed);
  if (!match) return trimmed;

  const hh = match[1].padStart(2, "0");
  const mm = match[2];
  const ss = (match[3] || "00").padStart(2, "0");
  const ms = (match[4] || "000").padEnd(3, "0").slice(0, 3);

  return `${hh}:${mm}:${ss}.${ms}`;
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
        startTime: normalizeTime(startTime),
        endTime: normalizeTime(endTime),
        isAvailable,
        teacher: { connect: [{ documentId: teacherDocumentId }] },
      },
    }),
  });

  return await handleResponse(res);
};

export const updateAvailability = async (documentId, payload) => {
  const { teacherDocumentId, startTime, endTime, ...rest } = payload || {};

  const data = { ...rest };
  if (startTime !== undefined) data.startTime = normalizeTime(startTime);
  if (endTime !== undefined) data.endTime = normalizeTime(endTime);
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
