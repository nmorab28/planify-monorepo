import React from 'react';
import Select from 'react-select';
import {DatePicker} from 'rsuite';

import PageTitle from '../../layouts/PageTitle';

const options = [
    { value: '1', label: 'Subject' },
    { value: '2', label: 'Politics' },
    { value: '3', label: 'Designing' },
    { value: '4', label: 'Computer' }
]

const options2 = [
    { value: '1', label: 'Department' },
    { value: '2', label: 'Computer' },
    { value: '3', label: 'Data Entry' },
    { value: '4', label: 'Management' }
]

const options3 = [
    { value: '1', label: 'Asset type' },
    { value: '2', label: 'Book' },
    { value: '3', label: 'Newspaper' },
    { value: '4', label: 'Comics' }
]

const options4 = [
    { value: '1', label: 'Status' },
    { value: '2', label: 'In Stock' },
    { value: '3', label: 'Out of Stock' }    
]

const AddLibrary = () => {
    return (
        <>
            <PageTitle activeMenu={"Add Library"} motherMenu={"Library"} />
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Add Library Assets</h4>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Title">Title</label>
                                            <input placeholder="Title" id="Title" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Subject</label>
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
                                            <label className="form-label" htmlFor="Auther_Name">Auther Name</label>
                                            <input placeholder="Auther Name" id="Auther_Name" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Publisher">Publisher</label>
                                            <input placeholder="Publisher" id="Publisher" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Department</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options2[0]}
                                                options={options2} 
                                                className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Asset type</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options3[0]}
                                                options={options3} 
                                                className="custom-react-select" 
                                            /> 
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker">Purchase Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker                                                    
                                                    placeholder="Purchase Date"  
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Price">Price</label>
                                            <input placeholder="Price" id="Price" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Status</label>
                                            <Select 
                                                isSearchable={false}
                                                defaultValue={options4[0]}
                                                options={options4} 
                                                className="custom-react-select" 
                                            /> 
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Assets_Details">Assets Details</label>
                                            <textarea placeholder="Assets Details" 
                                                defaultValue={"Assets Details"}
                                                id="Assets_Details" className="form-control" rows="5" required 
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

export default AddLibrary;