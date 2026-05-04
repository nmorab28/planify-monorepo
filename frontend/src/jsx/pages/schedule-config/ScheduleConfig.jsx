import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import PageTitle from "../../layouts/PageTitle";
import {
  getActiveScheduleConfig,
  saveScheduleConfig,
  toInputTime,
} from "../../../services/scheduleConfigService";
import { validateScheduleConfig } from "./scheduleConfigValidation";

const DEFAULT_FORM = {
  name: "Configuracion semestre",
  academicPeriod: "",
  weekdayStart: "07:00",
  weekdayEnd: "18:00",
  lunchStart: "12:00",
  lunchEnd: "14:00",
  saturdayEnabled: false,
  saturdayStart: "08:00",
  saturdayEnd: "12:00",
};

const ScheduleConfig = () => {
  const [documentId, setDocumentId] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadConfig = async () => {
      try {
        const config = await getActiveScheduleConfig();
        if (!alive || !config) return;

        setDocumentId(config.documentId);
        setFormData({
          name: config.name || DEFAULT_FORM.name,
          academicPeriod: config.academicPeriod || "",
          weekdayStart: toInputTime(config.weekdayStart) || "07:00",
          weekdayEnd: toInputTime(config.weekdayEnd) || "18:00",
          lunchStart: toInputTime(config.lunchStart) || "12:00",
          lunchEnd: toInputTime(config.lunchEnd) || "14:00",
          saturdayEnabled: !!config.saturdayEnabled,
          saturdayStart: toInputTime(config.saturdayStart) || "08:00",
          saturdayEnd: toInputTime(config.saturdayEnd) || "12:00",
        });
      } catch (err) {
        console.error("Error loading schedule config", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "No se pudo cargar la configuracion.",
        });
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadConfig();

    return () => {
      alive = false;
    };
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const errors = validateScheduleConfig(formData);
    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Datos invalidos",
        text: errors[0],
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await saveScheduleConfig(documentId, formData);
      setDocumentId(res?.data?.documentId || documentId);
      await Swal.fire({
        icon: "success",
        title: "Configuracion guardada",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo guardar la configuracion.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle
        activeMenu={"Configuracion del semestre"}
        motherMenu={"Planificacion"}
      />

      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Parametros del semestre</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-muted">Cargando configuracion...</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">
                          Nombre
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="academicPeriod">
                          Periodo academico
                        </label>
                        <input
                          id="academicPeriod"
                          type="text"
                          className="form-control"
                          placeholder="Ej: 2026-1"
                          value={formData.academicPeriod}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="weekdayStart">
                          Inicio de jornada
                        </label>
                        <input
                          id="weekdayStart"
                          type="time"
                          className="form-control"
                          value={formData.weekdayStart}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="weekdayEnd">
                          Fin de jornada
                        </label>
                        <input
                          id="weekdayEnd"
                          type="time"
                          className="form-control"
                          value={formData.weekdayEnd}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="lunchStart">
                          Inicio almuerzo
                        </label>
                        <input
                          id="lunchStart"
                          type="time"
                          className="form-control"
                          value={formData.lunchStart}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="lunchEnd">
                          Fin almuerzo
                        </label>
                        <input
                          id="lunchEnd"
                          type="time"
                          className="form-control"
                          value={formData.lunchEnd}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <div className="form-group">
                        <div className="form-check">
                          <input
                            id="saturdayEnabled"
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.saturdayEnabled}
                            onChange={handleChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="saturdayEnabled"
                          >
                            Habilitar jornada de sabado
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.saturdayEnabled && (
                      <>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="saturdayStart"
                            >
                              Inicio sabado
                            </label>
                            <input
                              id="saturdayStart"
                              type="time"
                              className="form-control"
                              value={formData.saturdayStart}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="form-group">
                            <label
                              className="form-label"
                              htmlFor="saturdayEnd"
                            >
                              Fin sabado
                            </label>
                            <input
                              id="saturdayEnd"
                              type="time"
                              className="form-control"
                              value={formData.saturdayEnd}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <button
                        type="submit"
                        className="btn btn-primary me-1"
                        disabled={submitting}
                      >
                        {submitting ? "Guardando..." : "Guardar parametros"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleConfig;
