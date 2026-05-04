import { validateScheduleConfig } from "./scheduleConfigValidation";

const validForm = {
  name: "Configuracion semestre",
  academicPeriod: "2026-1",
  weekdayStart: "07:00",
  weekdayEnd: "18:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  saturdayEnabled: false,
  saturdayStart: "08:00",
  saturdayEnd: "12:00",
};

describe("validateScheduleConfig", () => {
  it("accepts a valid weekday schedule without saturday", () => {
    expect(validateScheduleConfig(validForm)).toEqual([]);
  });

  it("requires name and academic period", () => {
    const errors = validateScheduleConfig({
      ...validForm,
      name: " ",
      academicPeriod: "",
    });

    expect(errors).toContain("El nombre de la configuracion es obligatorio.");
    expect(errors).toContain("El periodo academico es obligatorio.");
  });

  it("rejects inverted weekday ranges", () => {
    expect(
      validateScheduleConfig({
        ...validForm,
        weekdayStart: "18:00",
        weekdayEnd: "07:00",
      })
    ).toContain(
      "Jornada entre semana: la hora de inicio debe ser menor que la de fin."
    );
  });

  it("rejects lunch outside weekday hours", () => {
    expect(
      validateScheduleConfig({
        ...validForm,
        lunchStart: "06:00",
        lunchEnd: "07:30",
      })
    ).toContain("La franja de almuerzo debe estar dentro de la jornada.");
  });

  it("validates saturday hours only when saturday is enabled", () => {
    expect(
      validateScheduleConfig({
        ...validForm,
        saturdayEnabled: true,
        saturdayStart: "12:00",
        saturdayEnd: "08:00",
      })
    ).toContain("Jornada de sabado: la hora de inicio debe ser menor que la de fin.");
  });
});
