import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

import PageTitle from "../../layouts/PageTitle";
import {
  getClassroomById,
  updateClassroom,
} from "../../../services/classroomService";
import { getClassroomFeatures } from "../../../services/classroomFeatureService";
import { validateClassroom } from "./classroomValidation";
import FeatureModal from "./FeatureModal";

const EditClassroom = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();

  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    capacity: 30,
    isActive: true,
    featureDocumentIds: [],
  });

  const fetchFeatures = async () => {
    try {
      const res = await getClassroomFeatures();
      setFeatures(res || []);
    } catch (err) {
      console.error("Error fetching features", err);
    }
  };

  useEffect(() => {
    if (!documentId) {
      navigate("/all-classrooms");
      return;
    }

    const load = async () => {
      try {
        const classroom = await getClassroomById(documentId);
        if (!classroom || !classroom.documentId) {
          navigate("/all-classrooms");
          return;
        }

        setFormData({
          code: classroom.code || "",
          name: classroom.name || "",
          capacity:
            classroom.capacity === undefined || classroom.capacity === null
              ? 30
              : classroom.capacity,
          isActive: classroom.isActive ?? true,
          featureDocumentIds: Array.isArray(classroom.features)
            ? classroom.features
                .map((f) => f.documentId)
                .filter((v) => typeof v === "string" && v.length > 0)
            : [],
        });

        await fetchFeatures();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "No se pudo cargar el aula",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [documentId, navigate]);

  const featureOptions = useMemo(
    () =>
      features.map((f) => ({
        value: f.documentId,
        label: `${f.code} — ${f.name}`,
      })),
    [features]
  );

  const selectedFeatures = useMemo(
    () =>
      featureOptions.filter((opt) =>
        formData.featureDocumentIds.includes(opt.value)
      ),
    [featureOptions, formData.featureDocumentIds]
  );

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureCreated = async (created) => {
    await fetchFeatures();
    if (created?.documentId) {
      setFormData((prev) => ({
        ...prev,
        featureDocumentIds: [...prev.featureDocumentIds, created.documentId],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const errors = validateClassroom({
      code: formData.code,
      name: formData.name,
      capacity: formData.capacity,
    });

    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Datos inválidos",
        text: errors[0],
      });
      return;
    }

    setSubmitting(true);
    try {
      await updateClassroom(documentId, {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        capacity: Number(formData.capacity),
        isActive: !!formData.isActive,
        featureDocumentIds: formData.featureDocumentIds,
      });

      await Swal.fire({
        icon: "success",
        title: "Aula actualizada",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/all-classrooms");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo actualizar el aula",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <PageTitle activeMenu={"Edit Classroom"} motherMenu={"Classrooms"} />
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Editar aula</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} id="editClassroomForm">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="code">
                        Código
                      </label>
                      <input
                        id="code"
                        type="text"
                        className="form-control"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value.toUpperCase(),
                          }))
                        }
                        maxLength={20}
                        required
                      />
                      <small className="text-muted">
                        Mayúsculas, números o guiones (2-20 caracteres).
                      </small>
                    </div>
                  </div>

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
                        maxLength={120}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="capacity">
                        Capacidad
                      </label>
                      <input
                        id="capacity"
                        type="number"
                        min={1}
                        max={1000}
                        className="form-control"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label d-block">Estado</label>
                      <div className="form-check">
                        <input
                          id="isActive"
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.isActive}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isActive"
                        >
                          Activa
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="form-group">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label mb-0">
                          Características
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setShowFeatureModal(true)}
                        >
                          + Nueva característica
                        </button>
                      </div>
                      <Select
                        isMulti
                        isSearchable
                        options={featureOptions}
                        value={selectedFeatures}
                        onChange={(opts) =>
                          setFormData((prev) => ({
                            ...prev,
                            featureDocumentIds: (opts || []).map(
                              (o) => o.value
                            ),
                          }))
                        }
                        placeholder="Selecciona una o varias características"
                        className="custom-react-select"
                        noOptionsMessage={() =>
                          "No hay características registradas. Crea una nueva."
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <button
                      type="submit"
                      className="btn btn-primary me-1"
                      disabled={submitting}
                    >
                      {submitting ? "Guardando..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger light"
                      onClick={() => navigate("/all-classrooms")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <FeatureModal
        show={showFeatureModal}
        onHide={() => setShowFeatureModal(false)}
        onCreated={handleFeatureCreated}
      />
    </>
  );
};

export default EditClassroom;
