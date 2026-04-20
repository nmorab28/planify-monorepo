import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { createClassroomFeature } from "../../../services/classroomFeatureService";
import PageTitle from '../../layouts/PageTitle';

const AddClassroomFeature = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code: "",
        name: ""
    });

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

            const res = await createClassroomFeature(payload);

            if (!res || res.error) {
                throw new Error("Error en Strapi");
            }

            alert("Característica creada correctamente");

            setFormData({ code: "", name: "" });
            navigate("/all-classroom-features");

        } catch (err) {
            console.error(err);
            alert(err.message || "Error creando característica");
        }
    };

    return (
        <>
            <PageTitle activeMenu={"Add Classroom Feature"} motherMenu={"Classroom Features"} />
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Info</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} id="addClassroomFeatureForm">
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

export default AddClassroomFeature;
