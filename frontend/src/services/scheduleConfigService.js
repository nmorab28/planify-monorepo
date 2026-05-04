const API_URL = process.env.REACT_APP_API_URL;
const STATIC_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;

const DEFAULT_API_URL = "http://localhost:1337";

const getApiUrl = () => API_URL || DEFAULT_API_URL;

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

export const normalizeTime = (value) => {
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

export const toInputTime = (value) => {
  if (typeof value !== "string") return "";
  const match = /^(\d{2}):(\d{2})/.exec(value);
  return match ? `${match[1]}:${match[2]}` : value;
};

export const getActiveScheduleConfig = async () => {
  const params = new URLSearchParams();
  params.set("filters[isActive][$eq]", "true");
  params.set("sort", "createdAt:desc");
  params.set("pagination[pageSize]", "1");

  const res = await fetch(`${getApiUrl()}/api/schedule-configs?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);
  return Array.isArray(data.data) ? data.data[0] || null : null;
};

const buildPayload = (formData) => ({
  name: formData.name.trim(),
  academicPeriod: formData.academicPeriod.trim(),
  weekdayStart: normalizeTime(formData.weekdayStart),
  weekdayEnd: normalizeTime(formData.weekdayEnd),
  lunchStart: normalizeTime(formData.lunchStart),
  lunchEnd: normalizeTime(formData.lunchEnd),
  saturdayEnabled: !!formData.saturdayEnabled,
  saturdayStart: formData.saturdayEnabled
    ? normalizeTime(formData.saturdayStart)
    : null,
  saturdayEnd: formData.saturdayEnabled
    ? normalizeTime(formData.saturdayEnd)
    : null,
  isActive: true,
});

export const saveScheduleConfig = async (documentId, formData) => {
  const method = documentId ? "PUT" : "POST";
  const url = documentId
    ? `${getApiUrl()}/api/schedule-configs/${documentId}`
    : `${getApiUrl()}/api/schedule-configs`;

  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify({ data: buildPayload(formData) }),
  });

  return await handleResponse(res);
};
