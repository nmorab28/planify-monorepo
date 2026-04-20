import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useParams, useNavigate } from "react-router-dom";

import {
    getAcademicGroupById,
    updateAcademicGroup,
    getCourses
} from "../../../services/academicGroupService";
import { getTeachers } from "../../../services/teacherService";
import PageTitle from '../../layouts/PageTitle';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'planned', label: 'Planned' },
    { value: 'published', label: 'Published' },
    { value: 'closed', label: 'Closed' }
];

const EditAcademicGroup = () => {

    const { documentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        documentId: "",
        code: "",
        capacityTarget: "",
        minStudents: 10,
        maxStudents: 40,
        status: "draft",
        course: null,
        teacher: null
    });

    const [courseOptions, setCourseOptions] = useState([]);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!documentId) {
            navigate("/all-academic-groups");
            return;
        }

        const loadAll = async () => {
            try {
                const [group, courses, teachers] = await Promise.all([
                    getAcademicGroupById(documentId),
                    getCourses(),
                    getTeachers()
                ]);

                const courseOpts = (courses || []).map(c => ({
                    value: c.id,
                    label: `${c.code || ""} - ${c.name || ""}`.trim()
                }));

                const teacherOpts = (teachers || []).map(t => ({
                    value: t.id,
                    label: `${t.firstName || ""} ${t.lastName || ""}`.trim()
                }));

                setCourseOptions(courseOpts);
                setTeacherOptions(teacherOpts);

                if (!group || !group.documentId) {
                    navigate("/all-academic-groups");
                    return;
                }

                setFormData({
                    documentId: group.documentId,
                    code: group.code || "",
                    capacityTarget: group.capacityTarget ?? "",
                    minStudents: group.minStudents ?? 10,
                    maxStudents: group.maxStudents ?? 40,
                    status: group.status || "draft",
                    course: group.course
                        ? courseOpts.find(o => o.value === group.course.id) || null
                        : null,
                    teacher: group.teacher
                        ? teacherOpts.find(o => o.value === group.teacher.id) || null
                        : null
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    }, [documentId]);

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [id === "group_code" ? "code" :
             id === "capacity_target" ? "capacityTarget" :
             id === "min_students" ? "minStudents" :
             id === "max_students" ? "maxStudents" :
             id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.capacityTarget) {
            alert("Completa los campos obligatorios");
            return;
        }

        if (!formData.course || !formData.teacher) {
            alert("Debes seleccionar curso y docente");
            return;
        }

        try {
            const payload = {
                code: formData.code,
                capacityTarget: Number(formData.capacityTarget),
                minStudents: Number(formData.minStudents),
                maxStudents: Number(formData.maxStudents),
                status: formData.status,
                course: formData.course.value,
                teacher: formData.teacher.value
            };

            const res = await updateAcademicGroup(formData.documentId, payload);

            if (!res || res.error) {
                throw new Error("Error en Strapi");
            }

            alert("Grupo académico actualizado correctamente");
            navigate("/all-academic-groups");

        } catch (err) {
            console.error(err);
            alert(err.message || "Error actualizando grupo académico");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <>
            <PageTitle activeMenu={"Edit Academic Group"} motherMenu={"Academic Groups"} />
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Info</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} id="editAcademicGroupForm">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="group_code">Code</label>
                                            <input
                                                placeholder="Enter Code"
                                                id="group_code"
                                                type="text"
                                                className="form-control"
                                                value={formData.code}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="capacity_target">Capacity Target</label>
                                            <input
                                                placeholder="Enter Capacity Target"
                                                id="capacity_target"
                                                type="number"
                                                min="1"
                                                className="form-control"
                                                value={formData.capacityTarget}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="min_students">Min Students</label>
                                            <input
                                                id="min_students"
                                                type="number"
                                                min="0"
                                                className="form-control"
                                                value={formData.minStudents}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="max_students">Max Students</label>
                                            <input
                                                id="max_students"
                                                type="number"
                                                min="1"
                                                className="form-control"
                                                value={formData.maxStudents}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <Select
                                                isSearchable={false}
                                                value={statusOptions.find(o => o.value === formData.status)}
                                                options={statusOptions}
                                                className="custom-react-select"
                                                onChange={(opt) =>
                                                    setFormData(prev => ({ ...prev, status: opt.value }))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Course *</label>
                                            <Select
                                                value={formData.course}
                                                options={courseOptions}
                                                className="custom-react-select"
                                                onChange={(opt) =>
                                                    setFormData(prev => ({ ...prev, course: opt }))
                                                }
                                                placeholder="Selecciona un curso"
                                            />
                                        </div>
                                    </div>
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

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button type="submit" className="btn btn-primary me-1">Submit</button>
                                        <button
                                            type="button"
                                            className="btn btn-danger light"
                                            onClick={() => navigate("/all-academic-groups")}
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

export default EditAcademicGroup;
