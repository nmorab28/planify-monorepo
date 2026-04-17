import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, Row, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { IMAGES } from '../../constant/theme';
import { gridDataBlog } from '../staff/GridData';

import { getTeachers, deleteTeacher } from "../../../services/teacherService";

const theadData = [
    { heading: 'Profile', sortingVale: "profile" },
    { heading: 'Code', sortingVale: "code" },
    { heading: 'Name', sortingVale: "name" },
    { heading: 'Department', sortingVale: "department" },
    { heading: 'Gender', sortingVale: "gender" },
    { heading: 'Mobile', sortingVale: "mobile" },
    { heading: 'Email', sortingVale: "email" },
    { heading: 'Status', sortingVale: "isActive" },
    { heading: 'Join Date', sortingVale: "join" }
];

const AllProfessor = () => {

    const [sort, setSortata] = useState(10);
    const [feeData, setFeeDate] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);

    const activePag = useRef(0);
    const [test, settest] = useState(0);

    const [iconData, setIconDate] = useState({ complete: false, ind: Number });

    // FETCH DESDE STRAPI
    const fetchTeachers = async () => {
        try {
            const res = await getTeachers();

            const formatted = res.map((t) => ({
                id: t.id,
                documentId: t.documentId,
                code: t.code,
                name: `${t.firstName} ${t.lastName}`,
                email: t.email,
                department: "Technology",
                gender: "Male",
                mobile: "+57 312 3456789",
                join: new Date(t.createdAt).toLocaleDateString(),
                isActive: t.isActive ? "Active" : "Inactive",
                profile: IMAGES.smallpic1
            }));

            setFeeDate(formatted);
            setOriginalData(formatted);

        } catch (err) {
            console.error("Error fetching teachers", err);
        }
    };


    useEffect(() => {
        fetchTeachers();
    }, []);

    // PAGINACIÓN
    const chageData = (frist, sec) => {
        const table = document.querySelectorAll('#holidayList tbody tr');
        for (let i = 0; i < table.length; ++i) {
            if (i >= frist && i < sec) {
                table[i].classList.remove('d-none');
            } else {
                table[i].classList.add('d-none');
            }
        }
    };

    useEffect(() => {
        setData(document.querySelectorAll('#holidayList tbody tr'));
    }, [test, feeData]);

    activePag.current === 0 && chageData(0, sort);

    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);

    const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
    };

    // SORT
    function SotingData(name) {
        const sorted = [...feeData];

        if (name === "name") {
            sorted.sort((a, b) =>
                iconData.complete
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );
        }

        setFeeDate(sorted);
    }

    // SEARCH
    function DataSearch(e) {
        const filtered = originalData.filter(item =>
            `${item.name} ${item.email}`.toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        setFeeDate(filtered);

    }

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar docente?")) return;

        try {
            await deleteTeacher(id);
            fetchTeachers();
        } catch (err) {
            console.error(err);
            alert("Error eliminando");
        }
    };

    return (
        <>
            <PageTitle activeMenu={"All Professors"} motherMenu={"Professors"} />
            <Row>
                <Tab.Container defaultActiveKey={"List"}>
                    <div className="col-lg-12">
                        <Nav as="ul" className="nav nav-pills mb-3">
                            <Nav.Item as="li"><Nav.Link eventKey="List" className="me-1">List View</Nav.Link></Nav.Item>
                            <Nav.Item as="li"><Nav.Link eventKey="Grid">Grid View</Nav.Link></Nav.Item>
                        </Nav>
                    </div>

                    <div className="col-lg-12">
                        <Tab.Content className="row">

                            {/* ================= LIST VIEW ================= */}
                            <Tab.Pane eventKey="List" className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">All Professors</h4>
                                        <Link to={"/add-professor"} className="btn btn-primary">+ Add New</Link>
                                    </div>

                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <div id='holidayList' className='dataTables_wrapper no-footer'>

                                                {/* SEARCH + LENGTH */}
                                                <div className='justify-content-between d-sm-flex'>
                                                    <div className='dataTables_length'>
                                                        <label className='d-flex align-items-center'>
                                                            Show
                                                            <Dropdown className='search-drop'>
                                                                <Dropdown.Toggle as="div">
                                                                    {sort}
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => setSortata(10)}>10</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setSortata(20)}>20</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => setSortata(30)}>30</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                            entries
                                                        </label>
                                                    </div>

                                                    <div className="dataTables_filter">
                                                        <label>
                                                            Search:
                                                            <input type="search" onChange={DataSearch} />
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* TABLE */}
                                                <table className="display dataTable no-footer w-100">
                                                    <thead>
                                                        <tr>
                                                            {theadData.map((item, ind)=>(
                                                                <th key={ind}
                                                                    onClick={()=>{
                                                                        SotingData(item.sortingVale);
                                                                        setIconDate(prev => ({complete:!prev.complete, ind}))
                                                                    }}
                                                                >
                                                                    {item.heading}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {feeData.map((data, ind)=>(
                                                            <tr key={ind}>
                                                                <td><img className="rounded-circle" width="35" src={data.profile} alt="" /></td>
                                                                <td>{data.code}</td>
                                                                <td>{data.name}</td>
                                                                <td>{data.department}</td>
                                                                <td>{data.gender}</td>
                                                                <td>{data.mobile}</td>
                                                                <td>{data.email}</td>
                                                                <td>{data.isActive}</td>
                                                                <td>{data.join}</td>
                                                                <td>
                                                                    <Link to={`/edit-professor/${data.documentId}`} className="btn btn-xs sharp btn-primary me-1">
                                                                        <i className="fa fa-pencil" />
                                                                    </Link>
                                                                    <button
                                                                        className="btn btn-xs sharp btn-danger"
                                                                        onClick={()=>handleDelete(data.documentId)}
                                                                    >
                                                                        <i className="fa fa-trash" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                {/* PAGINACIÓN */}
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
                                                                    className={`paginate_button ${activePag.current === i ? 'current' : ''}`}
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

                            {/* ================= GRID VIEW ================= */}
                            <Tab.Pane eventKey="Grid" className="col-lg-12">
                                <div className="row">
                                    {feeData.map((data, ind)=>(
                                        <div className="col-lg-4 col-md-6 col-sm-6 col-12" key={ind}>
                                            <div className="card card-profile">

                                                <div className="card-header justify-content-end pb-0 border-0">
                                                    <Dropdown>
                                                        <Dropdown.Toggle as="button" className="btn btn-link i-false">
                                                            <span className="dropdown-dots fs--1"></span>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu align="end">
                                                            <Link to={`/edit-professor/${data.documentId}`} className="dropdown-item">Edit</Link>
                                                            <Link to="#" onClick={()=>handleDelete(data.documentId)}
                                                                className="dropdown-item text-danger">
                                                                Delete
                                                            </Link>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>

                                                <div className="card-body text-center">
                                                    <img src={data.profile} width="100" className="rounded-circle" alt="" />
                                                    <h3 className="mt-3">{data.name}</h3>
                                                    <p>{data.email}</p>
                                                    <span className="badge bg-primary">{data.isActive}</span>
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