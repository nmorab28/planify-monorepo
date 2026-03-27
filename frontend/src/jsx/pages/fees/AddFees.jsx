import React from 'react';
import Select from 'react-select';
import { DatePicker } from 'rsuite';

import PageTitle from '../../layouts/PageTitle';

const options = [
    { value: '1', label: 'Department' },
    { value: '2', label: 'Computer' },
    { value: '3', label: 'Arts' },
    { value: '4', label: 'Commerce' },
]

const option2 = [
    { value: '1', label: 'Fess Type' },
    { value: '2', label: 'Annual' },
    { value: '3', label: 'Exam' },
    { value: '4', label: 'Other' },
]


const option3 = [
    { value: '1', label: 'Payment Type' },
    { value: '2', label: 'Cash' },
    { value: '3', label: 'Cheque' },
    { value: '4', label: 'Other' },
]


const option4 = [
    { value: '1', label: 'Status' },
    { value: '2', label: 'Paid' },
    { value: '3', label: 'Unpaid' },
    { value: '4', label: 'Pending' },
]

const AddFees = () => {
    return (
        <>
            <PageTitle activeMenu={"Add Fees"} motherMenu={"Fees"} />
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
                                            <label className="form-label" htmlFor="Roll_No">Roll No.</label>
                                            <input placeholder="Roll No" id="Roll_No" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Student_Name">Student Name</label>
                                            <input placeholder="Student Name" id="Student_Name" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Department</label>                                           
                                            <Select 
                                                options={options} 
                                                isSearchable={false}
                                                defaultValue={options[1]}
                                                className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4">
                                            <label className="form-label">Type</label>                                            
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={option2[1]}
                                                options={option2} className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-group row">
                                            <div className="form-check col-lg-3 ms-3">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" required />
                                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                    Option 1
                                                </label>
                                            </div>
                                            <div className="form-check col-lg-3 ms-3">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" required />
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    Option 2
                                                </label>
                                            </div>
                                            <div className="form-check col-lg-3 ms-3">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" required />
                                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                    Option 3
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Ammount">Ammount</label>
                                            <input placeholder="Ammount" id="Ammount" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4">
                                            <label className="form-label" htmlFor="datepicker">Collection Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                               
                                                <DatePicker 
                                                    placeholder="Collection Date" 
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4">
                                            <label className="form-label">Payment Type</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={option3[1]}
                                                options={option3} className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Payment_Reference_Number">Payment Reference Number</label>
                                            <input placeholder="Payment Reference Number" id="Payment_Reference_Number" type="number" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group mb-4">
                                            <label className="form-label">Status</label>                                            
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={option4[1]}
                                                options={option4} className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Payment_Details">Payment Details</label>
                                            <textarea placeholder="Payment Details" id="Payment_Details" className="form-control" rows="5" required></textarea>
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

export default AddFees;