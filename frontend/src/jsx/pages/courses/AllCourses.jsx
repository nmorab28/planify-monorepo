import React from 'react';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { Card, Col, Row } from 'react-bootstrap';
import { IMAGES } from '../../constant/theme';

const coursesData = [
    {image: IMAGES.course1, title:'Why Should You Consider Taking an Education Course?', like:'400',  proferssor:'Jack Ronan'  },
    {image: IMAGES.course2, title:'Education Courses: A Guide to Unlocking Your Potential', like:'320',  proferssor:'Jimmy Morris'  },
    {image: IMAGES.course3, title:'A Comprehensive Guide to Taking an Education Course', like:'250',  proferssor:'Konne Backfield'  },
    {image: IMAGES.course4, title:'When Is the Best Time to Take an Education Course?', like:'350',  proferssor:'Nashid Martines'  },
    {image: IMAGES.course5, title:'When Is the Best Time to Take an Education Course?', like:'450',  proferssor:'Jack Ronan'  },
    {image: IMAGES.course6, title:'Education Courses: A Guide to Unlocking Your Potential', like:'120',  proferssor:'Jimmy Morris'  },
    {image: IMAGES.course7, title:'A Comprehensive Guide to Taking an Education Course', like:'250',  proferssor:'Konne Backfield'  },
    {image: IMAGES.course8, title:'Why Should You Consider Taking an Education Course?', like:'302',  proferssor:'Nashid Martines' },
    
];

const AllCourses = () => {
    return (
        <>
            <PageTitle activeMenu={"All Courses"} motherMenu={"Courses"} />
            <Row>
                {coursesData.map((data, ind)=>(
                    <Col xl={3} xxl={4} lg={4} md={6} sm={6} key={ind}>
                        <Card>
                            <img className="img-fluid rounded-top" src={data.image} alt="" />
                            <div className="card-body">
                                <h4>{data.title}</h4>
                                <ul className="list-group mb-3 list-group-flush">
                                    <li className="list-group-item px-0 border-top-0 d-flex justify-content-between">
                                        <span className="mb-0">April 23</span>
                                        <Link to={"#"} className="add-wishlist-btn">
                                            <i className="la la-heart-o outline"></i>
                                            <i className="la la-heart fill" />
                                            {" "}<span>{data.like}</span>
                                        </Link>
                                    </li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="mb-0">Duration :</span><strong>12 Months</strong>
                                    </li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="mb-0">Professor :</span><strong>{data.proferssor}</strong></li>
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span><i className="fa fa-graduation-cap text-primary me-2" />Student</span><strong>+120</strong></li>
                                </ul>
                                <Link to={"/about-courses"} className="btn btn-primary">Read More</Link>
                            </div>
                        </Card>                
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default AllCourses;