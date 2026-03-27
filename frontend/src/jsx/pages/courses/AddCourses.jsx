import React from 'react';
import {DatePicker} from 'rsuite';

import PageTitle from '../../layouts/PageTitle';

const AddCourses = () => {
    return (
        <>
            <PageTitle activeMenu={"Add Course"} motherMenu={"Courses"} />
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Courses Details</h4>
                        </div>
                        <div className="card-body">
                            <form action="#" method="post">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Course_Name">Course Name</label>
                                            <input placeholder="Course Name" id="Course_Name" type="text" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Course_Code">Course Code</label>
                                            <input placeholder="Course Code" id="Course_Code" type="text" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Course_Details">Course Details</label>
                                            <textarea placeholder="Course Details" id="Course_Details" className="form-control" rows="5" required
                                                defaultValue={"Course Details"}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker">Start Form</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker                                                                                                        
                                                    placeholder="Start Form"
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Course_Duration">Course Duration</label>
                                            <input placeholder="Course Duration" id="Course_Duration" type="text" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Course_Price">Course Price</label>
                                            <input placeholder="Course Price" id="Course_Price" type="text" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Professor_Name">Professor Name</label>
                                            <input placeholder="Professor Name" id="Professor_Name" type="text" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Maximum_Students">Maximum Students</label>
                                            <input placeholder="Maximum Students" id="Maximum_Students" type="text" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Contact_Number">Contact Number</label>
                                            <input placeholder="Contact Number" id="Contact_Number" type="number" className="form-control" required /> 
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-group fallback w-100">
                                            <label className="form-label d-block" htmlFor="Course_Photo">Course Photo</label>
                                            <input id="Course_Photo" type="file" className="form-control" data-default-file="" required /> 
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button type="submit" className="btn btn-primary me-1">Submit</button>
                                        <button type="submit" className="btn btn-danger light">Cancel</button>
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

export default AddCourses;