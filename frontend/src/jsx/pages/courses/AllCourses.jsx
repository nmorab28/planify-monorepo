import React from 'react';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { Card, Col, Row } from 'react-bootstrap';
import { IMAGES } from '../../constant/theme';

const coursesData = [
    {image: IMAGES.course1, title:'Matematicas basicas para primer semestre', like:'400',  proferssor:'Carlos Ramirez'  },
    {image: IMAGES.course2, title:'Introduccion a la programacion', like:'320',  proferssor:'Laura Gomez'  },
    {image: IMAGES.course3, title:'Fundamentos de fisica mecanica', like:'250',  proferssor:'Andres Torres'  },
    {image: IMAGES.course4, title:'Biologia general y laboratorio', like:'350',  proferssor:'Paola Martinez'  },
    {image: IMAGES.course5, title:'Comunicacion oral y escrita', like:'450',  proferssor:'Carlos Ramirez'  },
    {image: IMAGES.course6, title:'Calculo diferencial aplicado', like:'120',  proferssor:'Laura Gomez'  },
    {image: IMAGES.course7, title:'Quimica general', like:'250',  proferssor:'Andres Torres'  },
    {image: IMAGES.course8, title:'Etica profesional universitaria', like:'302',  proferssor:'Paola Martinez' },
    
];

const AllCourses = () => {
    return (
        <>
            <PageTitle activeMenu={"Todos los cursos"} motherMenu={"Cursos"} />
            <Row>
                {coursesData.map((data, ind)=>(
                    <Col xl={3} xxl={4} lg={4} md={6} sm={6} key={ind}>
                        <Card>
                            <img className="img-fluid rounded-top" src={data.image} alt="" />
                            <div className="card-body">
                                <h4>{data.title}</h4>
                                <ul className="list-group mb-3 list-group-flush">
                                    <li className="list-group-item px-0 border-top-0 d-flex justify-content-between">
                                        <span className="mb-0">23 de abril</span>
                                        <Link to={"#"} className="add-wishlist-btn">
                                            <i className="la la-heart-o outline"></i>
                                            <i className="la la-heart fill" />
                                            {" "}<span>{data.like}</span>
                                        </Link>
                                    </li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="mb-0">Duracion :</span><strong>12 meses</strong>
                                    </li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="mb-0">Docente :</span><strong>{data.proferssor}</strong></li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span><i className="fa fa-graduation-cap text-primary me-2" />Estudiantes</span><strong>+120</strong></li>
                                </ul>
                                <Link to={"/about-courses"} className="btn btn-primary">Ver mas</Link>
                            </div>
                        </Card>                
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default AllCourses;
