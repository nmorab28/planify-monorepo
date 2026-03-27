import React, {useState, useRef, useEffect} from 'react';
import { Dropdown } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';

const holidayTable = [
    { id:1,sno:'01', name:'Festival', type:'National Holiday', startdate:'31 July 1998', enddate:'31 July 1998', details:'Lorem Ipsum is simply dummy' },
    { id:7,sno:'02', name:'Republic Day', type:'Office Holiday', startdate:'10 August 2021', enddate:'12 August 2021', details:'When an unknown printer took' },
    { id:4,sno:'03', name:'Memorial Day', type:'Office Holiday', startdate:'25 May 2019', enddate:'25 May 2019', details:'Aldus Page Maker including versions' },
    { id:3,sno:'04', name:'Independence Day', type:'Office Holiday', startdate:'28 May 2021', enddate:'28 May 2021', details:'Lorem Ipsum is simply dummy' },
    { id:2,sno:'05', name:'Diwali', type:'National Holiday', startdate:'22 October 1998', enddate:'25 October 1998', details:'When an unknown printer took' },
    { id:5,sno:'06', name:'Holi', type:'National Holiday', startdate:'15 March 2001', enddate:'15 March 2001', details:'Aldus Page Maker including versions' },
    { id:14,sno:'07', name:'Republic Day', type:'Office Holiday', startdate:'10 August 2021', enddate:'12 August 2021', details:'When an unknown printer took' },
    { id:6,sno:'08', name:'Memorial Day', type:'Office Holiday', startdate:'25 May 2019', enddate:'25 May 2019', details:'Aldus Page Maker including versions' },
    { id:9,sno:'09', name:'Independence Day', type:'Office Holiday', startdate:'28 May 2021', enddate:'28 May 2021', details:'Lorem Ipsum is simply dummy' },
    { id:10,sno:'10', name:'Diwali', type:'National Holiday', startdate:'22 October 1998', enddate:'25 October 1998', details:'When an unknown printer took' },
    { id:8,sno:'11', name:'Holi', type:'National Holiday', startdate:'15 March 2001', enddate:'15 March 2001', details:'Aldus Page Maker including versions' },
    { id:11,sno:'12', name:'Republic Day', type:'Office Holiday', startdate:'10 August 2021', enddate:'12 August 2021', details:'When an unknown printer took' },
    { id:13,sno:'13', name:'Memorial Day', type:'Office Holiday', startdate:'25 May 2019', enddate:'25 May 2019', details:'Aldus Page Maker including versions' },
    { id:12,sno:'14', name:'Independence Day', type:'Office Holiday', startdate:'28 May 2021', enddate:'28 May 2021', details:'Lorem Ipsum is simply dummy' },
    { id:16,sno:'15', name:'Diwali', type:'National Holiday', startdate:'22 October 1998', enddate:'25 October 1998', details:'When an unknown printer took' },
    { id:15,sno:'16', name:'Holi', type:'National Holiday', startdate:'15 March 2001', enddate:'15 March 2001', details:'Aldus Page Maker including versions' }    
    
];

const theadData = [
    {heading: 'S.No.', sortingVale:"sno"},
    {heading: 'Title', sortingVale:"name"},
    {heading: 'Type', sortingVale:"type"},
    {heading: 'Start Date', sortingVale:"startdate"},
    {heading: 'End Date', sortingVale:"endate"},
    {heading: 'Details', sortingVale:"details"},
    {heading: 'Action', sortingVale:"action"}
];

const AllHoliday = () => {
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
            case "name":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)                    
                });
            break;            
            case "type":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)                    
                });
            break;        
            case "details":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.details.localeCompare(b.details) : b.details.localeCompare(a.details)                    
                });
            break;        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }    
    function DataSearch(e){  
        const updatesDate =  holidayTable.filter(item =>{
            // let selectdata = item.name   
            let selectdata = `${item.name} ${item.startdate} ${item.type}`.toLowerCase();              
            // console.log(selectdata);
            return  selectdata.includes(e.target.value.toLowerCase())
        });        
        setFeeDate([...updatesDate])        
    }
    return (
        <>
            <PageTitle activeMenu="All Holiday" motherMenu={"Holiday"} />
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Holiday List</h4>
                            <Link to={"/add-holiday"} className="btn btn-primary">+ Add New</Link>
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
                                                        <Dropdown.Item onClick={()=>setSortata('30')}>30</Dropdown.Item>
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
                                                    <td>{data.sno}</td>
                                                    <td>{data.name}</td>                                                    
                                                    <td>{data.type}</td>
                                                    <td>{data.startdate}</td>                                                    
                                                    <td>{data.enddate}</td>
                                                    <td>{data.details}</td>
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
                </div>
            </div>  
        </>
    );
};

export default AllHoliday;