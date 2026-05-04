import axiosInstance from "./AxiosInstance";
import {
  getActiveScheduleConfig,
  normalizeTime,
  saveScheduleConfig,
  toInputTime,
} from "./scheduleConfigService";

jest.mock("./AxiosInstance", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

describe("scheduleConfigService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normalizes Strapi time values", () => {
    expect(normalizeTime("7:05")).toBe("07:05:00.000");
    expect(normalizeTime("07:05:09.4")).toBe("07:05:09.400");
    expect(normalizeTime("bad-value")).toBe("bad-value");
    expect(normalizeTime("")).toBeUndefined();
  });

  it("converts Strapi time values to input time", () => {
    expect(toInputTime("07:30:00.000")).toBe("07:30");
    expect(toInputTime("bad-value")).toBe("bad-value");
    expect(toInputTime(null)).toBe("");
  });

  it("loads the newest active schedule config", async () => {
    const config = { documentId: "cfg-1", name: "Semestre 2026-1" };
    axiosInstance.get.mockResolvedValue({ data: { data: [config] } });

    await expect(getActiveScheduleConfig()).resolves.toBe(config);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/schedule-configs?filters%5BisActive%5D%5B%24eq%5D=true&sort=createdAt%3Adesc&pagination%5BpageSize%5D=1"
    );
  });

  it("returns null when there is no active schedule config", async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: [] } });

    await expect(getActiveScheduleConfig()).resolves.toBeNull();
  });

  it("creates a schedule config with normalized times", async () => {
    axiosInstance.post.mockResolvedValue({ data: { data: { documentId: "new" } } });

    await saveScheduleConfig(null, {
      name: " Config ",
      academicPeriod: " 2026-1 ",
      weekdayStart: "7:00",
      weekdayEnd: "18:00",
      lunchStart: "12:00",
      lunchEnd: "13:00",
      saturdayEnabled: true,
      saturdayStart: "8:00",
      saturdayEnd: "12:00",
    });

    expect(axiosInstance.post).toHaveBeenCalledWith("/schedule-configs", {
      data: {
        name: "Config",
        academicPeriod: "2026-1",
        weekdayStart: "07:00:00.000",
        weekdayEnd: "18:00:00.000",
        lunchStart: "12:00:00.000",
        lunchEnd: "13:00:00.000",
        saturdayEnabled: true,
        saturdayStart: "08:00:00.000",
        saturdayEnd: "12:00:00.000",
        isActive: true,
      },
    });
  });

  it("updates and clears saturday hours when saturday is disabled", async () => {
    axiosInstance.put.mockResolvedValue({ data: { data: { documentId: "cfg-1" } } });

    await saveScheduleConfig("cfg-1", {
      name: "Config",
      academicPeriod: "2026-1",
      weekdayStart: "07:00",
      weekdayEnd: "18:00",
      lunchStart: "12:00",
      lunchEnd: "13:00",
      saturdayEnabled: false,
      saturdayStart: "08:00",
      saturdayEnd: "12:00",
    });

    expect(axiosInstance.put).toHaveBeenCalledWith("/schedule-configs/cfg-1", {
      data: expect.objectContaining({
        saturdayEnabled: false,
        saturdayStart: null,
        saturdayEnd: null,
      }),
    });
  });
});
