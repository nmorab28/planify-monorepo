import axiosInstance from "./AxiosInstance";

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

  const { data } = await axiosInstance.get(`/schedule-configs?${params}`);
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
  const url = documentId ? `/schedule-configs/${documentId}` : "/schedule-configs";
  const request = documentId ? axiosInstance.put : axiosInstance.post;
  const { data } = await request(url, { data: buildPayload(formData) });

  return data;
};
