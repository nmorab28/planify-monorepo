import React,{useState} from 'react';
import Select from 'react-select';
import { DatePicker } from 'rsuite';
import { useNavigate } from "react-router-dom";

import { createTeacher } from "../../../services/teacherService";
import PageTitle from '../../layouts/PageTitle';

const options = [
    { value: '1', label: 'Gender' },
    { value: '2', label: 'Male' },
    { value: '3', label: 'Female' }
]

const options1 = [
    { value: '1', label: 'Department' },
    { value: '2', label: 'Medicine' },
    { value: '3', label: 'Dentistry' },
    { value: '4', label: 'Nursing' },
    { value: '4', label: 'Psychology' },
    { value: '4', label: 'Engineering' },
    { value: '4', label: 'Economic and Administrative Sciences' },
    { value: '4', label: 'Legal and Political Sciences' },
    { value: '4', label: 'Creation and Communication' },
    { value: '4', label: 'Education' },
    { value: '4', label: 'Sciences' }
]

const AddProfessor = () => {

    const navigate = useNavigate();

    const [changeText, setChangeText] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        code: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        isActive: true
    });

    const handleChange = (e) => {
        const { id, value } = e.target;

        setFormData(prev => ({
            
            ...prev,
            [id === "teacher_code" ? "code" :
            id === "first_name" ? "firstName" :
            id === "last_name" ? "lastName" :
            id === "email_here" ? "email" :
            id]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.firstName || !formData.lastName || !formData.email) {
            alert("Completa los campos obligatorios");
            return;
        }

        try {
            const payload = {
                code: formData.code,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                isActive: true
            };

            const res = await createTeacher(payload);

            if (!res || res.error) {
                throw new Error("Error en Strapi");
            }

            alert("Docente creado correctamente");

            setFormData({
                code: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                isActive: true
            });

            navigate("/all-professors");

        } catch (err) {
            console.error(err);
            alert("Error creando docente");
        }
    };

    return (
        <>
            <PageTitle activeMenu={"Add Professor"} motherMenu={"Professors"} />   
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Info</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} id="addStaffForm">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="first_name">First Name</label>
                                            <input placeholder="Enter First Name" id="first_name" type="text" className="form-control" value={formData.firstName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="last_name">Last Name</label>
                                            <input placeholder="Enter Last Name" id="last_name" type="text" className="form-control" value={formData.lastName} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="email_here">Email Here</label>
                                            <input placeholder="Email Here" id="email_here" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker">Joining Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker                                                                                                         
                                                    placeholder="Joining Date"
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="password">Password</label>
                                            <div className="input-group pass-group">
                                                <input placeholder="Password" id="password" 
                                                    type={showPassword ? "text" : "password"} 
                                                    className="form-control pass-input" required 
                                                 />                                              
                                                <span className={`input-group-text pass-handle ${showPassword ? "active" : ""}`}
                                                    onClick={()=>setShowPassword(!showPassword)}
                                                > 
                                                    <i className="fa fa-eye-slash" />
                                                    <i className="fa fa-eye" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
                                            <div className="input-group pass-group">
                                                <input placeholder="Confirm Password" id="confirm_password" 
                                                    type={changeText ? "text" : "password"} 
                                                    className="form-control pass-input" required 
                                                />
                                                
                                                <span className={`input-group-text pass-handle ${changeText ? "active" : ""}`}
                                                    onClick={()=>setChangeText(!changeText)}
                                                > 
                                                    <i className="fa fa-eye-slash" />
                                                    <i className="fa fa-eye" />
                                                </span>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="mobile_number">Mobile Number</label>
                                            <input placeholder="Mobile Number" id="mobile_number" type="number" maxLength="10" name="phoneNumber" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Gender</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options[0]}
                                                options={options} 
                                                className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="designation">Designation</label>
                                            <input placeholder="Designation" id="designation" type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Department</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options1[0]}
                                                options={options1} className="custom-react-select" 
                                            /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker1">Date of Birth</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker                                                    
                                                    placeholder="Date of Birth"
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="teacher_code">Teacher Code</label>
                                            <input placeholder="Teacher Code" id="teacher_code" type="number" maxLength="4" name="teacherCode" className="form-control" value={formData.code} onChange={handleChange} required/>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-4 col-md-6">
                                        <div className="form-group fallback w-100">
                                            <input type="file" className="form-control" data-default-file="" />
                                        </div>
                                    </div> */}
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button type="submit" className="btn btn-primary me-1">Submit</button>
                                        <button type="button" className="btn btn-danger light">Cancel</button>
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

export default AddProfessor;