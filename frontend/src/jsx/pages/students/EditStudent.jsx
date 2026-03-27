import React from 'react';
import Select from 'react-select';
import { DatePicker } from 'rsuite';

import PageTitle from '../../layouts/PageTitle';


const options = [
    { value: '1', label: 'Gender' },
    { value: '2', label: 'Male' },
    { value: '3', label: 'Female' }
]

const options1 = [
    { value: '1', label: 'Department' },
    { value: '2', label: 'React' },
    { value: '3', label: 'CSS' },
    { value: '4', label: 'JavaScript' },
    { value: '4', label: 'Angular' },
    { value: '4', label: 'HTML' },
    { value: '4', label: 'VueJs' },
    { value: '4', label: 'Ruby' },
    { value: '4', label: 'PHP' },
    { value: '4', label: 'ASP.NET' },
    { value: '4', label: 'Python' },
    { value: '4', label: 'MySQL' }
]

const EditStudent = () => {
    return (
        <>
            <PageTitle activeMenu={"Edit Student"} motherMenu={"Students"}/>   
            <div className="row">
                <div className="col-xl-12 col-xxl-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Basic Info</h5>
                        </div>
                        <div className="card-body">
                            <form action="#" method="post">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Enter_First_Name">First Name</label>
                                            <input id="Enter_First_Name" type="text" className="form-control" defaultValue="Deangelo" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Enter_Last_Name">Last Name</label>
                                            <input id="Enter_Last_Name" type="text" className="form-control" defaultValue="Sena" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Email">Email</label>
                                            <input id="Email" type="email" className="form-control" defaultValue="info@example.com" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker">Registration Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker 
                                                    defaultValue={new Date("june 07 2007")}
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Roll_No">Roll No.</label>
                                            <input id="Roll_No" type="text" className="form-control" defaultValue="52" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Class</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options1[1]}
                                                options={options1} className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Gender</label>                                            
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options[1]}
                                                options={options} 
                                                className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Mobile_Number">Mobile Number</label>
                                            <input id="Mobile_Number" type="number" maxLength="10" name="phoneNumber" className="form-control" defaultValue="+01 987 654 3210" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Parents_Name">Parents Name</label>
                                            <input id="Parents_Name" type="text" className="form-control" defaultValue="James Jones" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Parents_Mobile_Number">Parents Mobile Number</label>
                                            <input id="Parents_Mobile_Number" type="number" maxLength="10" name="phoneNumber" className="form-control" defaultValue="+01 987 654 3210" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker1">Date of Birth</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker 
                                                    defaultValue={new Date("July 31 1998")}
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Blood_Group">Blood Group</label>
                                            <input id="Blood_Group" type="text" className="form-control" defaultValue="+AB" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Address">Address</label>
                                            <textarea id="Address" className="form-control" rows="5" required
                                                defaultValue={"Demo Address #8901 Marmora Road Chi Minh City, Vietnam"}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="form-group fallback w-100">
                                            <input type="file" className="form-control" data-default-file="" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <button type="submit" className="btn btn-primary me-1">Submit</button>
                                        <button type="submit" className="btn btn-light">Cancel</button>
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

export default EditStudent;