import React, {useState, useRef, useEffect} from 'react';
import { Row,Col, Dropdown } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';


const holidayTable = [
    { id:1,  sno:'01', title:'Technical Author', subject:'Designing', department:'Architecture', year:'3', type:'Book', status:'In Stock'},
    { id:10, sno:'02', title:'Team Leader', subject:'Computer', department:'Office', year:'2', type:'Comics', status:'Out of Stock'},
    { id:3,  sno:'03', title:'Software Engineer',subject:'Computer', department:'Data Entry', year:'1', type:'Book', status:'In Stock'},
    { id:4,  sno:'04', title:'Integration Specialist',subject:'Manager', department:'Management', year:'2', type:'Newspaper', status:'In Stock'},
    { id:2,  sno:'05', title:'Office Manager', subject:'Head', department:'Architecture', year:'1', type:'Book', status:'Out of Stock'},
    { id:9,  sno:'06', title:'Brielle Williamson',subject:'Gaurd', department:'Security Department', year:'3', type:'Newspaper', status:'Out of Stock'},
    { id:7,  sno:'07', title:'Regional Marketing', subject:'Hardware', department:'Office', year:'2', type:'Comics', status:'In Stock'},
    { id:8,  sno:'08', title:'Technical Author', subject:'Operator', department:'Data Entry', year:'4', type:'Newspaper', status:'Out of Stock'},
    { id:6,  sno:'09', title:'Networking', subject:'Manager', department:'Management', year:'1', type:'Book', status:'In Stock'},
    { id:5,  sno:'10', title:'Systems Administrator',subject:'Head', department:'Architecture', year:'2', type:'Newspaper', status:'In Stock'},
    { id:11,  sno:'11', title:'Office Manager', subject:'Computer', department:'Data Entry', year:'3', type:'Book', status:'Out of Stock'},
    { id:15,  sno:'12', title:'Brielle Williamson',subject:'Designing', department:'Management', year:'4', type:'Comics', status:'In Stock'},
    { id:13,  sno:'13', title:'Javascript Developer', subject:'Employe', department:'Office', year:'2', type:'Comics', status:'Out of Stock'},
    { id:14,  sno:'14', title:'Technical Author', subject:'Head', department:'Architecture', year:'3', type:'Book', status:'In Stock'},
    { id:12,  sno:'15', title:'Networking', subject:'Computer', department:'Data Entry', year:'1', type:'Newspaper', status:'Out of Stock'},   
];

const theadData = [
    {heading: 'S.No.', sortingVale:"sno"},
    {heading: 'Title', sortingVale:"title"},
    {heading: 'Subject', sortingVale:"subject"},
    {heading: 'Department', sortingVale:"department"},
    {heading: 'Year', sortingVale:"year"},
    {heading: 'Type', sortingVale:"type"},
    {heading: 'Status', sortingVale:"status"},
    {heading: 'Action', sortingVale:"action"}
];

const AllLibrary = () => {
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
            case "title":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)                    
                });
            break;            
            case "subject":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.subject.localeCompare(b.subject) : b.subject.localeCompare(a.subject)                    
                });
            break;        
            case "department":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.department.localeCompare(b.department) : b.department.localeCompare(a.department)                    
                });
            break;        
            case "type":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)                    
                });
            break;        
            case "cap":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.cap.localeCompare(b.cap) : b.cap.localeCompare(a.cap)                    
                });
            break;        
            case "status":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)                    
                });
            break;        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }    
    function DataSearch(e){  
        const updatesDate =  holidayTable.filter(item =>{            
            let selectdata = `${item.hod} ${item.type} ${item.department} ${item.subject} ${item.cap} ${item.status}`.toLowerCase();                          
            return  selectdata.includes(e.target.value.toLowerCase())
        });        
        setFeeDate([...updatesDate])        
    }
    return (
        <>
            <PageTitle activeMenu={"All Library"} motherMenu={"Library"} />
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
                                                    <td><strong>{data.sno}</strong> </td>
                                                    <td>{data.title}</td>                                                    
                                                    <td>{data.subject}</td>
                                                    <td>{data.department}</td>                                                    
                                                    <td>{data.year} Year</td>
                                                    <td>{data.type}</td>
                                                    <td>{data.status}</td>                                                    
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
                                                to={'#'}
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
                                                        to={'#'}
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
                                                to={'#'}
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

export default AllLibrary;