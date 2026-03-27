import React from 'react';
import {DatePicker} from 'rsuite';

import PageTitle from '../../layouts/PageTitle';

const AddDepartments = () => {
    return (
        <>
            <PageTitle activeMenu={"Add Departments"} motherMenu={"Departments"} />
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Add Department</h5>
                        </div>
                        <div className="card-body">
                            <form action="#" method="post">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="Department_Name" className="form-label">Department Name</label>
                                            <input id="Department_Name" placeholder="Department Name" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="Head_Of_Department" className="form-label">Head Of Department</label>
                                            <input id="Head_Of_Department" placeholder="Head of Department" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="datepicker" className="form-label">Department Start Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker                                                    
                                                    placeholder="Department Start Date"                                                   
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="Student_Capacity" className="form-label">Student Capacity</label>
                                            <input id="Student_Capacity" placeholder="Student Capacity" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="Department_Details" className="form-label">Department Details</label>
                                            <textarea id="Department_Details" defaultValue={"Department Details"} className="form-control" rows="5" required />
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

export default AddDepartments;