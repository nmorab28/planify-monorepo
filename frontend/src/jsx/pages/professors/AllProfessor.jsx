import React, {useState, useRef, useEffect} from 'react';
import { Dropdown, Row, Nav, Tab } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { IMAGES } from '../../constant/theme';
import {gridDataBlog} from '../staff/GridData';

const holidayTable = [
    { id:1, name:'Garrett Winters', profile:IMAGES.smallpic1,department:'Accountant',  gender:'Female',  education:'B.A, B.C.A', mobile:'987 654 3210', email:'info@example.com',  join:'2020/07/25' },
    { id:10, name:'Airi Satou', profile:IMAGES.smallpic2,department:'Junior Technical',   gender:'Female', education:'B.A, B.C.A', mobile:'987 654 3210', email:'info@example.com',  join:'2021/11/28' },
    { id:3, name:'Tiger Nixon', profile:IMAGES.smallpic3, department:'Clerk', gender:'Female',  education:'B.Sc', mobile:'123 456 7890', email:'info@example.com',  join:'2019/04/25' },
    { id:4, name:'Cedric Kelly', profile:IMAGES.smallpic4, department:'Developer',  gender:'Female', education:'BTech', mobile:'123 456 7890', email:'info@example.com',  join:'2018/04/25' },
    { id:2, name:'Gavin Joyce', profile:IMAGES.smallpic5,department:'Specialist',   gender:'Female', education:'B.Com, M.Com', mobile:'(123) 4567 890', email:'info@example.com',  join:'2020/04/25' },
    { id:9, name:'Angelica Ramos', profile:IMAGES.smallpic6, department:'Executive Officer',  gender:'Male', education:'BTech, MTech', mobile:'987 654 3210', email:'info@example.com',  join:'2015/08/25' },
    { id:7, name:'Paul Byrd', profile:IMAGES.smallpic7, department:'Financial Officer', gender:'Female',  education:'B.Sc, M.Sc', mobile:'987 654 3210', email:'info@example.com',  join:'2023/09/01' },
    { id:8, name:'Ashton Cox', profile:IMAGES.smallpic8, department:'Junior Technical',  gender:'Female', education:'BTech', mobile:'(123) 4567 890', email:'info@example.com',  join:'2015/02/22' },
    { id:6, name:'Rhona Davidson', profile:IMAGES.smallpic9, department:'Sales Assistant',  gender:'Female', education:'B.Sc', mobile:'(123) 4567 890', email:'info@example.com',  join:'2018/06/12' },
    { id:5, name:'Colleen Hurst', profile:IMAGES.smallpic10, department:'Librarian', gender:'Female',  education:'B.Com, M.Com', mobile:'(123) 4567 890', email:'info@example.com',  join:'2021/11/19' },
    { id:11, name:'Tiger Nixon', profile:IMAGES.smallpic3,  department:'Specialist',  gender:'Female', education:'B.Sc', mobile:'123 456 7890', email:'info@example.com',  join:'2019/04/25' },
    { id:12, name:'Cedric Kelly', profile:IMAGES.smallpic4, department:'Executive Officer', gender:'Female',  education:'BTech', mobile:'123 456 7890', email:'info@example.com',  join:'2018/04/25' },
    { id:13, name:'Gavin Joyce', profile:IMAGES.smallpic5, department:'Financial Officer', gender:'Female',  education:'B.Com, M.Com', mobile:'(123) 4567 890', email:'info@example.com',  join:'2020/04/25' },
    { id:14, name:'Angelica Ramos', profile:IMAGES.smallpic6, department:'Junior Technical',  gender:'Female', education:'BTech, MTech', mobile:'987 654 3210', email:'info@example.com',  join:'2015/08/25' },
    { id:15, name:'Paul Byrd', profile:IMAGES.smallpic7, department:'Sales Assistant', gender:'Male',  education:'B.Sc, M.Sc', mobile:'987 654 3210', email:'info@example.com',  join:'2023/09/01' },
    { id:16, name:'Ashton Cox', profile:IMAGES.smallpic8, department:'Specialist', education:'BTech', gender:'Female', mobile:'(123) 4567 890', email:'info@example.com',  join:'2015/02/22' },
    { id:17, name:'Rhona Davidson', profile:IMAGES.smallpic9, department:'Executive Officer', education:'B.Sc', gender:'Female', mobile:'(123) 4567 890', email:'info@example.com',  join:'2018/06/12' },
    
];

const theadData = [
    {heading: 'Profile', sortingVale:"profile"},
    {heading: 'Name', sortingVale:"name"},    
    {heading: 'Department', sortingVale:"department"},
    {heading: 'Gender', sortingVale:"gender"},
    {heading: 'Education', sortingVale:"education"},
    {heading: 'Mobile', sortingVale:"mobile"},
    {heading: 'Email', sortingVale:"email"},
    {heading: 'Joining Date', sortingVale:"join"},
    {heading: 'Action', sortingVale:"action"}
];


const AllProfessor = () => {
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
            case "rollno":
                sortedPeople.sort((a, b) => {
                return   a.rollno < b.rollno ? -1 : 1 });
            break;
            case "name":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)                    
                });
            break;            
            case "department":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.department.localeCompare(b.department) : b.department.localeCompare(a.department)                    
                });
            break;            
            case "gender":
                sortedPeople.sort((a, b) => {                    
                 return  iconData.complete ? a.gender.localeCompare(b.gender) : b.gender.localeCompare(a.gender)                    
                });
            break;            
            case "education":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.education.localeCompare(b.education) : b.education.localeCompare(a.education)                    
                });
            break;        
            case "mobile":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.mobile.localeCompare(b.mobile) : b.mobile.localeCompare(a.mobile)                    
                });
            break;        
            case "join":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.join.localeCompare(b.join) : b.join.localeCompare(a.join)                    
                });
            break;        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }    
    function DataSearch(e){  
        const updatesDate =  holidayTable.filter(item =>{            
            let selectdata = `${item.name} ${item.department} ${item.gender} ${item.join} ${item.education} ${item.mobile}`.toLowerCase();                          
            return  selectdata.includes(e.target.value.toLowerCase())
        });        
        setFeeDate([...updatesDate])        
    }
    return (
        <>
            <PageTitle activeMenu={"All Professors"} motherMenu={"Professors"}/>
            <Row>
                <Tab.Container defaultActiveKey={"List"}>
                    <div className="col-lg-12">
                        <Nav as="ul" className="nav nav-pills mb-3">
                            <Nav.Item as="li"><Nav.Link eventKey="List" className="me-1">List View</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link eventKey="Grid" >Grid View</Nav.Link></Nav.Item>
                        </Nav>
                    </div>
                    <div className="col-lg-12">
                        <Tab.Content className="row tab-content">
							<Tab.Pane eventKey="List" className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">All Professors </h4>
                                        <Link to={"/add-professor"} className="btn btn-primary">+ Add New</Link>
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
                                                                <td><img className="rounded-circle" width="35" src={data.profile} alt="" /> </td>                                                                                                                       
                                                                <td>{data.name}</td>                                                    
                                                                <td>{data.department}</td>                                                    
                                                                <td>{data.gender}</td>                                                    
                                                                <td>{data.education}</td>                                                  
                                                                <td><Link to={"#"}><strong>{data.mobile}</strong></Link></td>
                                                                <td><Link to={"#"}><strong>{data.email}</strong></Link></td>
                                                                <td>{data.join}</td>                                                    
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
                            </Tab.Pane>
                            <Tab.Pane eventKey="Grid"  className="col-lg-12">
								<div className="row">
                                    {gridDataBlog.map((item, ind)=>(
                                        <div className="col-lg-4 col-md-6 col-sm-6 col-12" key={ind}>
                                            <div className="card card-profile">
                                                <div className="card-header justify-content-end pb-0 border-0">
                                                    <Dropdown>
                                                        <Dropdown.Toggle as="button" className="btn btn-link i-false" type="button">
                                                            <span className="dropdown-dots fs--1"></span>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu align="end" className="dropdown-menu dropdown-menu-right border py-0">
                                                            <div className="py-2">
                                                                <Link to={"#"} className="dropdown-item">Edit</Link>
                                                                <Link to={"#"} className="dropdown-item text-danger">Delete</Link>
                                                            </div>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="card-body pt-2">
                                                    <div className="text-center">
                                                        <div className="profile-photo">
                                                            <img src={item.image} width="100" className="img-fluid rounded-circle" alt="" />
                                                        </div>
                                                        <h3 className="mt-4 mb-1">{item.name}</h3>
                                                        <p className="text-muted">{item.subject}</p>
                                                        <ul className="list-group mb-3 list-group-flush">
                                                            {item.content.map((data, ind)=>(
                                                                <li className="list-group-item px-0 d-flex justify-content-between" key={ind}>
                                                                    <span className="mb-0">{data.title} :</span><strong>{data.subtitle}</strong>
                                                                </li>
                                                            ))}                                                           
                                                        </ul>
                                                        <Link to={"/professor-profile"} className="btn btn-outline-primary btn-rounded mt-3 px-4">Read More</Link>
                                                    </div>
                                                </div>
                                            </div>
									    </div>
                                    ))}
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </div>
                </Tab.Container>
            </Row>
        </>
    );
};

export default AllProfessor;