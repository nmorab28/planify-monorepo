import React from 'react';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { IMAGES } from '../../constant/theme';


const detailblog = [
    {title:'Duration', subtitle:'3 Year'},
    {title:'Professor', subtitle:'Jimmy Morris'},
    {title:'Price', subtitle:'$ 1500'},
    {title:'Date', subtitle:'07 August 2021'},
];

const AboutCourses = () => {
    return (
        <>
            <PageTitle activeMenu={"About Courses"} motherMenu={"Courses"} />
            <div className="row">
                <div className="col-xl-3 col-xxl-4 col-lg-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <img className="img-fluid" src={IMAGES.course1} alt="" />
                                <div className="card-body">
                                    <h4 className="mb-0">Why is Early Education Essential</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="card overflow-hidden">
                                <div className="card-header">
                                    <h2 className="card-title">About Course</h2>
                                </div>
                                <div className="card-body pb-0">
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting.</p>
                                    <ul className="list-group list-group-flush">
                                        {detailblog.map((item, ind)=>(
                                            <li className="list-group-item d-flex px-0 justify-content-between" key={ind}>
                                                <strong>{item.title}</strong>
                                                <span className="mb-0">{item.subtitle}</span>
                                            </li>
                                        ))}                                        
                                    </ul>
                                </div>
                                <div className="card-footer pt-0 pb-0 text-center">
                                    <div className="row">
                                        <div className="col-4 pt-3 pb-3 border-end">
                                            <h3 className="mb-1 text-primary">07</h3>
                                            <span>Years</span>
                                        </div>
                                        <div className="col-4 pt-3 pb-3 border-end">
                                            <h3 className="mb-1 text-primary">240</h3>
                                            <span>Students</span>
                                        </div>
                                        <div className="col-4 pt-3 pb-3">
                                            <h3 className="mb-1 text-primary">05</h3>
                                            <span>Batches</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-9 col-xxl-8 col-lg-8">
                    <div className="card">
                        <div className="card-body">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            <p>A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence was created for the bliss of souls like mine.I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents.</p>
                            <p className="mb-5">A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.</p>
                            <h4 className="text-primary">Our Courses</h4>
                            <div className="profile-skills pt-2 border-bottom-1 pb-2">
                                <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 my-3 my-sm-0 me-3 m-b-10">Computer</Link>
                                <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 my-3 my-sm-0 me-3 m-b-10">Programming</Link>
                                <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 my-3 my-sm-0 me-3 m-b-10">Photoshop</Link>
                                <Link to={"#"} className="btn btn-outline-dark btn-rounded px-4 my-3 my-sm-0 me-3 m-b-10">Management</Link>
                            </div>
                            <div className="profile-lang pt-5 border-bottom-1 pb-5">
                                <h4 className="text-primary mb-4">Language</h4>
                                <Link to={"#"} className="badge badge-primary light me-1"><i className="flag-icon flag-icon-us" /> English</Link>
                                <Link to={"#"} className="badge badge-primary light me-1"><i className="flag-icon flag-icon-fr" /> French</Link>
                                <Link to={"#"} className="badge badge-primary light"><i className="flag-icon flag-icon-bd" /> Bangla</Link>
                            </div>
                            <h4 className="text-primary">Courses Information</h4>
                            <ul className="list-group mb-3 list-group-flush">
                                <li className="list-group-item border-0 px-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</li>
                                <li className="list-group-item -0 px-0">It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.</li>
                                <li className="list-group-item -0 px-0">A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence was created for the bliss of souls like mine.</li>
                                <li className="list-group-item -0 px-0">A collection of textile samples lay spread out on the table - Samsa was a travelling salesman - and above it there hung a picture that he had recently cut out of an illustrated magazine and housed in a nice, gilded frame.</li>
                                <li className="list-group-item border-0 px-0">It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutCourses;