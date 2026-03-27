import React from 'react';
import {Link} from 'react-router-dom';
import { 
	SparklinesLine,Sparklines
} 
from "react-sparklines"

import TotalStudentDougnut from '../../elements/dashboard/TotalStudentDougnut';
import NewStudent from '../widget/WidgetBasic/NewStudent';
import TotalCourse from '../widget/WidgetBasic/TotalCourse';
import IncomeBarChart from '../../elements/dashboard/IncomeBarChart';
import ExpenseAreaChart from '../../elements/dashboard/ExpenseAreaChart';
import { IMAGES } from '../../constant/theme';

const assignTable = [
    {task:'Working Design report', prof:'Herman Beck', status:'Done', color:'primary', progres:'60%'},
    {task:'Fees Collection report', prof:'Emma Watson', status:'Pending', color:'warning', progres:'70%'},
    {task:'Management report', prof:'Mary Adams', status:'Pending', color:'warning', progres:'65%'},
    {task:'Library book status', prof:'Caleb Richards', status:'Suspended', color:'danger', progres:'55%'},
    {task:'Placement status', prof:'June Lane', status:'Pending', color:'warning', progres:'60%'},
    {task:'Working Design report', prof:'Herman Beck', status:'Done', color:'primary', progres:'70%'},
];

const notifyData = [
    { image:IMAGES.education1, title:'Dr sultads Send you Photo' },
    { image:IMAGES.education2, title:'Report created successfully' },
    { image:IMAGES.education3, title:'Reminder : Treatment Time!' },
    { image:IMAGES.education4, title:'Dr sultads Send you Photo' },
    { image:IMAGES.education5, title:'Report created successfully' },
    { image:IMAGES.education6, title:'Reminder : Treatment Time!' },
    { image:IMAGES.education7, title:'Dr sultads Send you Photo' },
    { image:IMAGES.education8, title:'Report created successfully' },
    { image:IMAGES.education9, title:'Reminder : Treatment Time!' },
    { image:IMAGES.education10, title:'Dr sultads Send you Photo' },
];

const studentTable =[
    {image:IMAGES.Avatpng1, name:'Ricky Antony', prof:'Herman Beck', branch:'Mechanical', status:'Done', color:'primary', date:'30/03/2019'},
    {image:IMAGES.Avatpng5, name:'Emma Watson', prof:'Emma Watson', branch:'Computer', status:'Pending', color:'warning', date:'21/02/20180'},
    {image:IMAGES.Avatpng1, name:'Rowen Atkinson', prof:'Mary Adams', branch:'Electrical', status:'Done', color:'primary', date:'25/03/2020'},
    {image:IMAGES.Avatpng5, name:'Antony Hopkins', prof:'Caleb Richards ', branch:'Information Tech.', status:'Suspended', color:'danger', date:'15/04/2021'},
    {image:IMAGES.Avatpng1, name:'Jennifer Schramm', prof:'June Lane', branch:'Mechanical', status:'Pending', color:'warning', date:'30/03/2022'},
    {image:IMAGES.Avatpng5, name:'Raymond Mims', prof:'Herman Beck', branch:'Computer', status:'Suspended', color:'danger', date:'01/05/2023'},
    {image:IMAGES.Avatpng1, name:'Michael Jenkins', prof:'Jennifer Schramm', branch:'Electrical', status:'Done', color:'primary', date:'02/12/2021'},
];

const Dashboard3 = () => {
    return (
        <>
            <div className="row">
                <div className="col-sm-6 col-xl-3">
                    <div className="widget-stat card bg-primary overflow-hidden">
                        <div className="card-header border-opacity">
                            <h3 className="card-title text-white">Total Students</h3>
                            <h5 className="text-white mb-0"><i className="fa fa-caret-up"></i> 422</h5>
                        </div>
                        <div className="card-body text-center mt-3">
                            <div className="ico-sparkline">                                
                                <TotalStudentDougnut />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="widget-stat card bg-success overflow-hidden">
                        <div className="card-header border-opacity">
                            <h3 className="card-title text-white">New Students</h3>
                            <h5 className="text-white mb-0"><i className="fa fa-caret-up" /> 357</h5>
                        </div>
                        <div className="card-body text-center mt-4 p-0">
                            <div className="ico-sparkline">                                
                                <NewStudent />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="widget-stat card bg-secondary overflow-hidden">
                        <div className="card-header border-opacity pb-3">
                            <h3 className="card-title text-white">Total Course</h3>
                            <h5 className="text-white mb-0"><i className="fa fa-caret-up" /> 547</h5>
                        </div>
                        <div className="card-body p-0 mt-2">
                            <div className="px-4">                               
                                <TotalCourse />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="widget-stat card bg-danger overflow-hidden">
                        <div className="card-header border-opacity pb-3">
                            <h3 className="card-title text-white">Fees Collection</h3>
                            <h5 className="text-white mb-0"><i className="fa fa-caret-up" /> 3280$</h5>
                        </div>
                        <div className="card-body p-0 mt-1">                            
                            <Sparklines data={[7,6,8,7,3,8,3,3,6,5,9,2,8]} style={{height:"150px", width:"100%"}}>
                                <SparklinesLine color="#fff" style={{ strokeWidth: 1.5, fill: "#fff", fillOpacity: ".1" }} />
                            </Sparklines>
                        </div>
                    </div>
                </div>   
                <div className="col-xl-6 col-xxl-6 col-sm-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Income/Expense Report</h3>
                        </div>
                        <div className="card-body">
                            <div id="barChart_2">
                                <IncomeBarChart />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-xxl-6 col-sm-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Income/Expense Report</h3>
                        </div>
                        <div className="card-body">
                            <div id="areaChart_1">
                                <ExpenseAreaChart />
                             </div>
                        </div>
                    </div>
				</div>
                <div className="col-xl-8 col-xxl-8 col-lg-8 col-md-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Assign Task</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table header-border table-hover verticle-middle">
                                    <thead>
                                        <tr>
                                            <th scope="col">S.No.</th>
                                            <th scope="col">Task</th>
                                            <th scope="col">Assigned Professors</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignTable.map((item, ind)=>(
                                            <tr key={ind}>
                                                <th>{ind+1}</th>
                                                <td>{item.task}</td>
                                                <td>{item.prof}</td>
                                                <td><span className={`badge badge-rounded badge-${item.color}`}>{item.status}</span></td>
                                                <td>
                                                    <div className="progress">
                                                        <div className={`progress-bar bg-${item.color}`} style={{width: item.progres}} >
                                                            <span className="sr-only">{item.progres} Complete</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-xxl-4 col-lg-4 col-md-12 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Notifications</h4>
                        </div>
                        <div className="card-body"> 
                            <div className="widget-todo dz-scroll" style={{height:"320px"}}>
                                <ul className="timeline">
                                    {notifyData.map((item, i)=>(
                                        <li key={i}>
                                            <div className="timeline-badge primary"></div>
                                            <Link to={"#"} className="timeline-panel text-muted mb-3 d-flex align-items-center">
                                                <img className="rounded-circle" alt="" width="50" src={item.image} />
                                                <div className="col px-3">
                                                    <h5 className="mb-1">{item.title}</h5>
                                                    <small className="d-block">29 Jan 2024 - 10:26 AM</small>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>        
                        </div>        
                    </div>        
                </div>    
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">New Student List </h4>
                        </div>
                        <div className="card-body pt-2">
                            <div className="table-responsive">
                                <table className="table table-sm mb-0 table-striped text-nowrap">
                                    <thead>
                                        <tr>
                                            <th className="py-3">Student Name</th>
                                            <th className="py-3">Assigned Professor</th>
                                            <th className="py-3">Branch</th>
                                            <th className="py-3">Status</th>
                                            <th className="py-3">Date of Admit</th>
                                            <th className="py-3">Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody id="customers">
                                        {studentTable.map((data, i)=>(
                                            <tr className="btn-reveal-trigger" key={i}>
                                                <td className="p-3">
                                                    <Link to={"#"}>
                                                        <div className="media d-flex align-items-center">
                                                            <div className="avatar avatar-xl me-2">
                                                                <img className="rounded-circle img-fluid" src={data.image} width="30" alt="" />
                                                            </div>
                                                            <div className="media-body">
                                                                <h5 className="mb-0 fs--1">{data.name}</h5>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="py-2">{data.prof}</td>
                                                <td className="py-2">{data.branch}</td>
                                                <td><span className={`badge badge-rounded badge-${data.color}`}>{data.status}</span></td>
                                                <td className="py-2">{data.date}</td>
                                                <td>
                                                    <Link to={"/edit-student"} className="btn btn-xs sharp btn-primary me-1"><i className="fa fa-pencil"/></Link>
                                                    <Link to={"#"} className="btn btn-xs sharp btn-danger"><i className="fa fa-trash" /></Link>
                                                </td>
                                            </tr>    
                                        ))}
                                    </tbody>
                                </table>    
                            </div>
                        </div>
                    </div>                
                </div>                
            </div>    
        </>
    );
};

export default Dashboard3;