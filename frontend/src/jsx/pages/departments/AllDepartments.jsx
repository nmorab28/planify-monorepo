import React, {useState, useRef, useEffect} from 'react';
import { Row,Col, Dropdown } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';

const holidayTable = [
    { id:1,  sno:'01', hod:'Rhona Davidson',  department:'Accountant', mobile:'987 654 3210', email:'info@example.com', start:"2019" , cap:'21'},
    { id:10, sno:'02', hod:'Michael Silva',  department:'Junior Technical', mobile:'987 654 3210', email:'info@example.com', start:"2018" , cap:'20'},
    { id:3,  sno:'03', hod:'Ashton Cox', department:'Clerk', mobile:'123 456 7890', email:'info@example.com', start:"2017" , cap:'10'},
    { id:4,  sno:'04', hod:'Cedric Kelly',  department:'Developer', mobile:'123 456 7890', email:'info@example.com', start:"2018" , cap:'15'},
    { id:2,  sno:'05', hod:'Airi Satou',  department:'Specialist', mobile:'(123) 4567 890', email:'info@example.com', start:"2019" , cap:'14'},
    { id:9,  sno:'06', hod:'Brielle Williamson', department:'Executive Officer', mobile:'987 654 3210', email:'info@example.com', start:"2020" , cap:'12'},
    { id:7,  sno:'07', hod:'Herrod Chandler',  department:'Financial Officer', mobile:'987 654 3210', email:'info@example.com', start:"2019" , cap:'14'},
    { id:8,  sno:'08', hod:'Rhona Davidson',  department:'Junior Technical', mobile:'(123) 4567 890', email:'info@example.com', start:"2018" , cap:'11'},
    { id:6,  sno:'09', hod:'Colleen Hurst',  department:'Sales Assistant', mobile:'(123) 4567 890', email:'info@example.com', start:"2017" , cap:'10'},
    { id:5,  sno:'10', hod:'Sonya Frost', department:'Librarian', mobile:'(123) 4567 890', email:'info@example.com', start:"2016" , cap:'08'},
    { id:11,  sno:'11', hod:'Airi Satou',  department:'Specialist', mobile:'(123) 4567 890', email:'info@example.com', start:"2019" , cap:'14'},
    { id:15,  sno:'12', hod:'Brielle Williamson', department:'Executive Officer', mobile:'987 654 3210', email:'info@example.com', start:"2020" , cap:'12'},
    { id:13,  sno:'13', hod:'Herrod Chandler',  department:'Financial Officer', mobile:'987 654 3210', email:'info@example.com', start:"2019" , cap:'14'},
    { id:14,  sno:'14', hod:'Rhona Davidson',  department:'Junior Technical', mobile:'(123) 4567 890', email:'info@example.com', start:"2018" , cap:'11'},
    { id:12,  sno:'15', hod:'Colleen Hurst',  department:'Sales Assistant', mobile:'(123) 4567 890', email:'info@example.com', start:"2017" , cap:'10'},
    
];

const theadData = [
    {heading: 'S.No.', sortingVale:"sno"},
    {heading: 'Department', sortingVale:"department"},
    {heading: 'Head of Dept.', sortingVale:"hod"},
    {heading: 'Mobile', sortingVale:"mobile"},
    {heading: 'Email', sortingVale:"email"},
    {heading: 'Starting Year', sortingVale:"start"},
    {heading: 'Stu. Capacity', sortingVale:"cap"},
    {heading: 'Action', sortingVale:"action"}
];

const AllDepartments = () => {
    const [sort, setSortata] = useState(10);
    const [data, setData] = useState(
        document.querySelectorAll('#holidayList tbody tr')
    )
    
    const activePag = useRef(0)
    const [test, settest] = useState(0)    
    
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
          if (i >= frist && i < sec) {
            data[i].classList.remove('d-none')
          } else {
            data[i].classList.add('d-none')
          }
        }
    }
      
    useEffect(() => {
        setData(document.querySelectorAll('#holidayList tbody tr'))        
    }, [test])
    
      
    activePag.current === 0 && chageData(0, sort)

    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1)
    
      
    const onClick = (i) => {
        activePag.current = i
        chageData(activePag.current * sort, (activePag.current + 1) * sort)
        settest(i)
    }
      
    const [feeData, setFeeDate] = useState([...holidayTable]);
    const [iconData, setIconDate] = useState({ complete: false ,ind : Number});


    function SotingData(name){
        const sortedPeople = [...feeData]; 
        switch (name) {
            case "sno":
                sortedPeople.sort((a, b) => {
                return   a.sno < b.sno ? -1 : 1 });
            break;
            case "department":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.department.localeCompare(b.department) : b.department.localeCompare(a.department)                    
                });
            break;            
            case "hod":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.hod.localeCompare(b.hod) : b.hod.localeCompare(a.hod)                    
                });
            break;        
            case "mobile":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.mobile.localeCompare(b.mobile) : b.mobile.localeCompare(a.mobile)                    
                });
            break;        
            case "start":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.start.localeCompare(b.start) : b.start.localeCompare(a.start)                    
                });
            break;        
            case "cap":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.cap.localeCompare(b.cap) : b.cap.localeCompare(a.cap)                    
                });
            break;        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }    
    function DataSearch(e){  
        const updatesDate =  holidayTable.filter(item =>{            
            let selectdata = `${item.hod} ${item.start} ${item.department} ${item.mobile} ${item.cap}`.toLowerCase();                          
            return  selectdata.includes(e.target.value.toLowerCase())
        });        
        setFeeDate([...updatesDate])        
    }
    return (
        <>
            <PageTitle activeMenu={"All Departments"} motherMenu={"Departments"} />
            <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Department List</h4>
                            <Link to={"/add-staff"} className="btn btn-primary">+ Add New</Link>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <div id='holidayList' className='dataTables_wrapper no-footer'>
                                    <div className='justify-content-between d-sm-flex'>                                    
                                        <div className='dataTables_length'>
                                            <label className='d-flex align-items-center'>
                                                Show
                                                <Dropdown className='search-drop'>
                                                    <Dropdown.Toggle as="div" className="search-drop-btn">
                                                        {sort}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={()=>setSortata('10')}>10</Dropdown.Item>
                                                        <Dropdown.Item onClick={()=>setSortata('20')}>20</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                entries
                                            </label>
                                        </div>
                                        <div className="dataTables_filter">
                                            <label>Search : <input type="search" className="" placeholder="" 
                                                  onChange={DataSearch}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <table id="example4" className="display dataTable no-footer w-100" >
                                        <thead>
                                            <tr>                                                
                                                {theadData.map((item, ind)=>(
                                                    <th key={ind}
                                                        onClick={()=>{SotingData(item.sortingVale); setIconDate(prevState => ({complete:!prevState.complete, ind: ind }) )}}
                                                    >{item.heading}
                                                        <span>
                                                            {ind !== iconData.ind &&
                                                                <i className="fa fa-sort ms-2 fs-12" style={{opacity: '0.3'}} />                                                                
                                                            }
                                                            {ind === iconData.ind && (
                                                                iconData.complete ? 
                                                                    <i className="fa fa-arrow-down ms-2 fs-12"  style={{opacity: '0.7'}} />
                                                                    :
                                                                    <i className="fa fa-arrow-up ms-2 fs-12" style={{opacity: '0.7'}} />                                                                    
                                                                )                                                            
                                                            }
                                                        </span>
                                                    </th>
                                                ))}                                               
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feeData.map((data, ind)=>(
                                                <tr key={ind}>
                                                    <td>{data.sno} </td>
                                                    <td>{data.department}</td>                                                    
                                                    <td>{data.hod}</td>                                                  
                                                    <td><Link to={"#"}><strong>{data.mobile}</strong></Link></td>
                                                    <td><Link to={"#"}><strong>{data.email}</strong></Link></td>
                                                    <td>{data.start}</td>
                                                    <td>{data.cap}</td>                                                    
                                                    <td>
                                                        <Link to={"#"} className="btn btn-xs sharp btn-primary me-1"><i className="fa fa-pencil" /></Link>
                                                        <Link to={"#"} className="btn btn-xs sharp btn-danger"><i className="fa fa-trash" /></Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className='d-sm-flex text-center justify-content-between align-items-center mt-3'>
                                        <div className='dataTables_info'>
                                            Showing {activePag.current * sort + 1} to{' '}
                                            {data.length > (activePag.current + 1) * sort
                                                ? (activePag.current + 1) * sort
                                                : data.length}{' '}
                                            of {data.length} entries
                                        </div>
                                        <div
                                            className='dataTables_paginate paging_simple_numbers'
                                            id='example5_paginate'
                                        >
                                            <Link
                                                className='paginate_button previous disabled'
                                                to='#'
                                                onClick={() =>
                                                    activePag.current > 0 && onClick(activePag.current - 1)
                                                }
                                            >                                                
                                                Previous
                                            </Link>
                                            <span>
                                                {paggination.map((number, i) => (
                                                    <Link
                                                        key={i}
                                                        to='#'
                                                        className={`paginate_button  ${
                                                            activePag.current === i ? 'current' : ''
                                                        } `}
                                                        onClick={() => onClick(i)}
                                                    >
                                                        {number}
                                                    </Link>
                                                ))}
                                            </span>
                                            <Link
                                                className='paginate_button next'
                                                to='#'
                                                onClick={() =>
                                                    activePag.current + 1 < paggination.length &&
                                                    onClick(activePag.current + 1)
                                                }
                                            >                                                
                                                Next
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default AllDepartments;