import React from 'react';
import {DatePicker} from 'rsuite'

import PageTitle from '../../layouts/PageTitle';

const EditDepartments = () => {
    return (
        <>
            <PageTitle activeMenu={"Edit Departments"} motherMenu={"Departments"} />   
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Edit Department</h5>
                        </div>
                        <div className="card-body">
                            <form action="#" method="post">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="Department_Name" className="form-label">Department Name</label>
                                            <input id="Department_Name" type="text" className="form-control" defaultValue="Sales Assistant" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="Head_Of_Department" className="form-label">Head Of Department</label>
                                            <input id="Head_Of_Department" type="text" className="form-control" defaultValue="Tiger Nixon" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="datepicker" className="form-label">Department Start Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker                   
                                                    defaultValue={new Date("August 2 2020")}                                                    
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="Student_Capacity" className="form-label">Student Capacity</label>
                                            <input id="Student_Capacity" type="text" className="form-control" defaultValue="200" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="Department_Details" className="form-label">Department Details</label>
                                            <textarea id="Department_Details" className="form-control" rows="5" 
                                                defaultValue={"Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                                                required 
                                            />                                                
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

export default EditDepartments;