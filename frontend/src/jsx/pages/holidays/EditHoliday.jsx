import React from 'react';
import Select from 'react-select';
import { DatePicker } from 'rsuite';

import PageTitle from '../../layouts/PageTitle';


const options = [
    { value: '1', label: 'Holiday Types' },
    { value: '2', label: 'Republic Day' },
    { value: '3', label: 'Independence Day' },
    { value: '4', label: 'Memorial Day' },
]

const EditHoliday = () => {
    return (
        <>
            <PageTitle activeMenu={"Edit Holiday"} motherMenu={"Holiday"} />  
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Edit Holiday</h4>
                        </div>
                        <div className="card-body">
                            <form action="#" method="post">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Title">Title</label>
                                            <input id="Title" defaultValue="Festival" type="text" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label">Holiday Types</label>                                           
                                            <Select 
                                                options={options} 
                                                isSearchable={false}
                                                defaultValue={options[1]}
                                                className="custom-react-select" 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker">Holiday Start Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                               
                                                <DatePicker 
                                                    placeholder="Holiday Start Date" 
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>                                             
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="datepicker1">Holiday End Date</label>
                                            <div className="input-hasicon mb-xl-0 mb-3">                                                
                                                <DatePicker 
                                                    placeholder="Holiday End Date" 
                                                    className="picker-suit"
                                                />
                                                <div className="icon"><i className="far fa-calendar" /></div>                                                   
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="Holiday_Details">Holiday Details</label>
                                            <textarea id="Holiday_Details" 
                                                defaultValue={"Lorem Ipsum is simply dummy"}
                                                placeholder="Holiday Details" 
                                                className="form-control" rows="5" required 
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

export default EditHoliday;