import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { DatePicker } from 'rsuite';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { updateTeacher } from '../../../services/teacherService';
import { getTeacherById } from '../../../services/teacherService';

import PageTitle from '../../layouts/PageTitle';

const options = [
  { value: '1', label: 'Género' },
  { value: '2', label: 'Masculino' },
  { value: '3', label: 'Femenino' },
];

const options1 = [
  { value: '1', label: 'Departamento' },
  { value: '2', label: 'Medicina' },
  { value: '3', label: 'Odontología' },
  { value: '4', label: 'Enfermería' },
  { value: '5', label: 'Psicología' },
  { value: '6', label: 'Ingeniería' },
  { value: '7', label: 'Ciencias económicas y administrativas' },
  { value: '8', label: 'Ciencias jurídicas y políticas' },
  { value: '9', label: 'Creación y comunicación' },
  { value: '10', label: 'Educación' },
  { value: '11', label: 'Ciencias' },
];

const EditProfessor = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    documentId: '',
    code: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) {
      navigate('/all-professors');
      return;
    }

    const fetchTeacher = async () => {
      try {
        const t = await getTeacherById(documentId);

        if (!t || !t.documentId) {
          navigate('/all-professors');
          return;
        }

        setFormData({
          documentId: t.documentId,
          code: t.code || '',
          firstName: t.firstName || '',
          lastName: t.lastName || '',
          email: t.email || '',
          isActive: t.isActive ?? true,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [documentId, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id === 'teacher_code'
        ? 'code'
        : id === 'first_name'
          ? 'firstName'
          : id === 'last_name'
            ? 'lastName'
            : id === 'email_here'
              ? 'email'
              : id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.firstName || !formData.lastName || !formData.email) {
      alert('Completa los campos obligatorios');
      return;
    }

    try {
      const payload = {
        code: formData.code,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        isActive: true,
      };

      const res = await updateTeacher(formData.documentId, payload);

      if (!res || res.error) {
        throw new Error('Error en Strapi');
      }

      alert('Docente actualizado correctamente');

      setFormData({
        code: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        isActive: true,
      });

      navigate('/all-professors');
    } catch (err) {
      console.error(err);
      alert('Error actualizando docente');
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <PageTitle activeMenu={'Editar docente'} motherMenu={'Docente'} />
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Información básica</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} id="editProfessorForm">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="first_name">
                        Nombres
                      </label>
                      <input
                        placeholder="Nombres"
                        id="first_name"
                        type="text"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="last_name">
                        Apellidos
                      </label>
                      <input
                        placeholder="Apellidos"
                        id="last_name"
                        type="text"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email_here">
                        Correo electrónico
                      </label>
                      <input
                        placeholder="correo@planify.edu"
                        id="email_here"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="datepicker">
                        Fecha de ingreso
                      </label>
                      <div className="input-hasicon mb-xl-0 mb-3">
                        <DatePicker placeholder="Fecha de ingreso" className="picker-suit" />
                        <div className="icon">
                          <i className="far fa-calendar" />
                        </div>
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
                                                    onClick={()=>setMostrarPassword(!showPassword)}
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
                      <label className="form-label" htmlFor="mobile_number">
                        Teléfono
                      </label>
                      <input
                        placeholder="Teléfono"
                        id="mobile_number"
                        type="number"
                        maxLength="10"
                        name="phoneNumber"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Género</label>
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
                      <label className="form-label" htmlFor="designation">
                        Cargo
                      </label>
                      <input
                        placeholder="Cargo"
                        id="designation"
                        type="text"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Departamento</label>
                      <Select
                        isSearchable={false}
                        defaultValue={options1[0]}
                        options={options1}
                        className="custom-react-select"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="datepicker1">
                        Fecha de nacimiento
                      </label>
                      <div className="input-hasicon mb-xl-0 mb-3">
                        <DatePicker placeholder="Fecha de nacimiento" className="picker-suit" />
                        <div className="icon">
                          <i className="far fa-calendar" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="teacher_code">
                        Código docente
                      </label>
                      <input
                        placeholder="Código docente"
                        id="teacher_code"
                        type="number"
                        maxLength="4"
                        name="teacherCode"
                        className="form-control"
                        value={formData.code}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  {/* <div className="col-lg-4 col-md-6">
                                        <div className="form-group fallback w-100">
                                            <input type="file" className="form-control" data-default-file="" />
                                        </div>
                                    </div> */}
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <button type="submit" className="btn btn-primary me-1">
                      Guardar
                    </button>
                    <button type="button" className="btn btn-danger light">
                      Cancelar
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

export default EditProfessor;
