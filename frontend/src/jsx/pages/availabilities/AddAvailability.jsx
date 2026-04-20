import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

import { createAvailability } from "../../../services/availabilityService";
import { getTeachers } from "../../../services/teacherService";
import PageTitle from '../../layouts/PageTitle';

const dayOptions = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' }
];

const toTimeString = (value) => {
    if (!value) return "";
    return value.length === 5 ? `${value}:00.000` : value;
};

const AddAvailability = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        dayOfWeek: dayOptions[0],
        startTime: "",
        endTime: "",
        isAvailable: true,
        teacher: null
    });

    const [teacherOptions, setTeacherOptions] = useState([]);

    useEffect(() => {
        const loadTeachers = async () => {
            try {
                const teachers = await getTeachers();

                setTeacherOptions(
                    (teachers || []).map(t => ({
                        value: t.id,
                        label: `${t.firstName || ""} ${t.lastName || ""}`.trim()
                    }))
                );

            } catch (err) {
                console.error("Error cargando docentes", err);
            }
        };

        loadTeachers();
    }, []);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [id === "start_time" ? "startTime" :
             id === "end_time" ? "endTime" :
             id === "is_available" ? "isAvailable" :
             id]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.startTime || !formData.endTime) {
            alert("Completa los campos horarios obligatorios");
            return;
        }

        if (!formData.teacher) {
            alert("Debes seleccionar un docente");
            return;
        }

        if (formData.startTime >= formData.endTime) {
            alert("La hora de inicio debe ser menor que la hora de fin");
            return;
        }

        try {
            const payload = {
                dayOfWeek: Number(formData.dayOfWeek.value),
                startTime: toTimeString(formData.startTime),
                endTime: toTimeString(formData.endTime),
                isAvailable: !!formData.isAvailable,
                teacher: formData.teacher.value
            };

            const res = await createAvailability(payload);

            if (!res || res.error) {
                throw new Error("Error en Strapi");
            }

            alert("Disponibilidad creada correctamente");
            navigate("/all-availabilities");

        } catch (err) {
            console.error(err);
            alert(err.message || "Error creando disponibilidad");
        }
    };

    return (
        <>
            <PageTitle activeMenu={"Add Availability"} motherMenu={"Availabilities"} />
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Info</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} id="addAvailabilityForm">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Teacher *</label>
                                            <Select
                                                value={formData.teacher}
                                                options={teacherOptions}
                                                className="custom-react-select"
                                                onChange={(opt) =>
                                                    setFormData(prev => ({ ...prev, teacher: opt }))
                                                }
                                                placeholder="Selecciona un docente"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Day of Week</label>
                                            <Select
                                                isSearchable={false}
                                                value={formData.dayOfWeek}
                                                options={dayOptions}
                                                className="custom-react-select"
                                                onChange={(opt) =>
                                                    setFormData(prev => ({ ...prev, dayOfWeek: opt }))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="start_time">Start Time</label>
                                            <input
                                                id="start_time"
                                                type="time"
                                                className="form-control"
                                                value={formData.startTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="end_time">End Time</label>
                                            <input
                                                id="end_time"
                                                type="time"
                                                className="form-control"
                                                value={formData.endTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group form-check mt-4">
                                            <input
                                                id="is_available"
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={formData.isAvailable}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="is_available">
                                                Disponible
                                            </label>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button type="submit" className="btn btn-primary me-1">Submit</button>
                                        <button
                                            type="button"
                                            className="btn btn-danger light"
                                            onClick={() => navigate("/all-availabilities")}
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
        </>
    );
};

export default AddAvailability;
