import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import {
    getClassroomFeatureById,
    updateClassroomFeature
} from "../../../services/classroomFeatureService";
import PageTitle from '../../layouts/PageTitle';

const EditClassroomFeature = () => {

    const { documentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        documentId: "",
        code: "",
        name: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!documentId) {
            navigate("/all-classroom-features");
            return;
        }

        const fetchFeature = async () => {
            try {
                const f = await getClassroomFeatureById(documentId);

                if (!f || !f.documentId) {
                    navigate("/all-classroom-features");
                    return;
                }

                setFormData({
                    documentId: f.documentId,
                    code: f.code || "",
                    name: f.name || ""
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeature();
    }, [documentId]);

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [id === "feature_code" ? "code" :
             id === "feature_name" ? "name" :
             id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.name) {
            alert("Completa los campos obligatorios");
            return;
        }

        try {
            const payload = {
                code: formData.code,
                name: formData.name
            };

            const res = await updateClassroomFeature(formData.documentId, payload);

            if (!res || res.error) {
                throw new Error("Error en Strapi");
            }

            alert("Característica actualizada correctamente");
            navigate("/all-classroom-features");

        } catch (err) {
            console.error(err);
            alert(err.message || "Error actualizando característica");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <>
            <PageTitle activeMenu={"Edit Classroom Feature"} motherMenu={"Classroom Features"} />
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Info</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} id="editClassroomFeatureForm">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="feature_code">Code</label>
                                            <input
                                                placeholder="Enter Code"
                                                id="feature_code"
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
                                            <label className="form-label" htmlFor="feature_name">Name</label>
                                            <input
                                                placeholder="Enter Name"
                                                id="feature_name"
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button type="submit" className="btn btn-primary me-1">Submit</button>
                                        <button
                                            type="button"
                                            className="btn btn-danger light"
                                            onClick={() => navigate("/all-classroom-features")}
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

export default EditClassroomFeature;
