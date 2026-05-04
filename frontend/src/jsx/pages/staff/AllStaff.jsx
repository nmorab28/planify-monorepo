import React, {useState, useRef, useEffect} from 'react';
import { Dropdown, Row, Nav, Tab } from 'react-bootstrap';
import {Link} from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { IMAGES } from '../../constant/theme';
import {gridDataBlog} from './GridData';

const holidayTable = [
    { id:1, name:'Jorge Restrepo', profile:IMAGES.smallpic1, designation:'Contador', mobile:'+57 300 654 3210', email:'jorge.restrepo@ejemplo.edu',address:'Calle 80 #12-45 ',  join:'2020/07/25' },
    { id:10, name:'Adriana Soto', profile:IMAGES.smallpic2, designation:'Contadora', mobile:'+57 301 654 3210', email:'adriana.soto@ejemplo.edu',address:'Carrera 11 #20-10 ',  join:'2021/11/28' },
    { id:3, name:'Tomas Nino', profile:IMAGES.smallpic3, designation:'Auxiliar administrativo', mobile:'+57 302 456 7890', email:'tomas.nino@ejemplo.edu',address:'Calle 90 #18-33 ',  join:'2019/04/25' },
    { id:4, name:'Cesar Quintero', profile:IMAGES.smallpic4, designation:'Desarrollador', mobile:'+57 303 456 7890', email:'cesar.quintero@ejemplo.edu',address:'Avenida 30 #12-01 ',  join:'2018/04/25' },
    { id:2, name:'Gustavo Joyce', profile:IMAGES.smallpic5, designation:'Desarrollador', mobile:'+57 304 456 7890', email:'gustavo.joyce@ejemplo.edu',address:'Calle 45 #8-81 ',  join:'2020/04/25' },
    { id:9, name:'Angelica Ramos', profile:IMAGES.smallpic6, designation:'Coordinadora ejecutiva', mobile:'+57 305 654 3210', email:'angelica.ramos@ejemplo.edu',address:'Carrera 41 #10-01 ',  join:'2015/08/25' },
    { id:7, name:'Pablo Bernal', profile:IMAGES.smallpic7, designation:'Oficial financiero', mobile:'+57 306 654 3210', email:'pablo.bernal@ejemplo.edu',address:'Calle 33 #10-01 ',  join:'2023/09/01' },
    { id:8, name:'Andres Cobo', profile:IMAGES.smallpic8, designation:'Tecnico junior', mobile:'+57 307 456 7890', email:'andres.cobo@ejemplo.edu',address:'Carrera 44 #10-01 ',  join:'2015/02/22' },
    { id:6, name:'Rosa Davidson', profile:IMAGES.smallpic9, designation:'Bibliotecaria', mobile:'+57 308 456 7890', email:'rosa.davidson@ejemplo.edu',address:'Calle 88 #10-01 ',  join:'2018/06/12' },
    { id:5, name:'Carolina Hurtado', profile:IMAGES.smallpic10, designation:'Bibliotecaria', mobile:'+57 309 456 7890', email:'carolina.hurtado@ejemplo.edu',address:'Carrera 99 #10-01 ',  join:'2021/11/19' },
    
];

const theadData = [
    {heading: 'Perfil', sortingVale:"profile"},
    {heading: 'Nombre', sortingVale:"name"},
    {heading: 'Cargo', sortingVale:"designation"},
    {heading: 'Celular', sortingVale:"mobile"},
    {heading: 'Email', sortingVale:"email"},
    {heading: 'Direccion', sortingVale:"address"},
    {heading: 'Fecha de ingreso', sortingVale:"join"},
    {heading: 'Accion', sortingVale:"action"}
];




const AllStaff = () => {
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
            case "designation":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.designation.localeCompare(b.designation) : b.designation.localeCompare(a.designation)                    
                });
            break;        
            case "mobile":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.mobile.localeCompare(b.mobile) : b.mobile.localeCompare(a.mobile)                    
                });
            break;        
            case "address":
                sortedPeople.sort((a, b) => {                    
                    return  iconData.complete ? a.address.localeCompare(b.address) : b.address.localeCompare(a.address)                    
                });
            break;        
            default:
                break;
        }            
        setFeeDate(sortedPeople);         
    }    
    function DataSearch(e){  
        const updatesDate =  holidayTable.filter(item =>{            
            let selectdata = `${item.name} ${item.address} ${item.designation} ${item.mobile}`.toLowerCase();                          
            return  selectdata.includes(e.target.value.toLowerCase())
        });        
        setFeeDate([...updatesDate])        
    }
    return (
        <>
            <PageTitle activeMenu={"Personal"} motherMenu={"Personal"}/>
            <Row>
                <Tab.Container defaultActiveKey={"List"}>
                    <div className="col-lg-12">
                        <Nav as="ul" className="nav nav-pills mb-3">
                            <Nav.Item as="li"><Nav.Link eventKey="List" className="me-1">Vista de lista</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link eventKey="Grid" >Vista de tarjetas</Nav.Link></Nav.Item>
                        </Nav>
                    </div>
                    <div className="col-lg-12">
                        <Tab.Content className="row tab-content">
							<Tab.Pane eventKey="List" className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Listado de personal</h4>
                                        <Link to={"/add-staff"} className="btn btn-primary">+ Agregar</Link>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <div id='holidayList' className='dataTables_wrapper no-footer'>
                                                <div className='justify-content-between d-sm-flex'>                                    
                                                    <div className='dataTables_length'>
                                                        <label className='d-flex align-items-center'>
                                                            Mostrar
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
                                                            registros
                                                        </label>
                                                    </div>
                                                    <div className="dataTables_filter">
                                                        <label>Buscar : <input type="search" className="" placeholder="" 
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
                                                                <td>{data.designation}</td>                                                  
                                                                <td><Link to={"#"}><strong>{data.mobile}</strong></Link></td>
                                                                <td><Link to={"#"}><strong>{data.email}</strong></Link></td>
                                                                <td>{data.address}</td>
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
                                                        Mostrando {activePag.current * sort + 1} a{' '}
                                                        {data.length > (activePag.current + 1) * sort
                                                            ? (activePag.current + 1) * sort
                                                            : data.length}{' '}
                                                        de {data.length} registros
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
                                                            Anterior
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
                                                            Siguiente
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
                                                                <Link to={"#"} className="dropdown-item">Editar</Link>
                                                                <Link to={"#"} className="dropdown-item text-danger">Eliminar</Link>
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
                                                        <Link to={"/professor-profile"} className="btn btn-outline-primary btn-rounded mt-3 px-4">Ver mas</Link>
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

export default AllStaff;
