import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, Row, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';

import {
    getAcademicGroups,
    deleteAcademicGroup
} from "../../../services/academicGroupService";

const theadData = [
    { heading: 'Code', sortingVale: "code" },
    { heading: 'Course', sortingVale: "course" },
    { heading: 'Teacher', sortingVale: "teacher" },
    { heading: 'Capacity', sortingVale: "capacityTarget" },
    { heading: 'Min', sortingVale: "minStudents" },
    { heading: 'Max', sortingVale: "maxStudents" },
    { heading: 'Status', sortingVale: "status" },
    { heading: 'Actions', sortingVale: "actions" }
];

const AllAcademicGroups = () => {

    const [sort, setSortata] = useState(10);
    const [feeData, setFeeDate] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [data, setData] = useState([]);

    const activePag = useRef(0);
    const [test, settest] = useState(0);

    const [iconData, setIconDate] = useState({ complete: false, ind: Number });

    const fetchGroups = async () => {
        try {
            const res = await getAcademicGroups();

            const formatted = res.map((g) => ({
                id: g.id,
                documentId: g.documentId,
                code: g.code,
                courseName: g.course
                    ? `${g.course.code || ""} ${g.course.name || ""}`.trim()
                    : "-",
                teacherName: g.teacher
                    ? `${g.teacher.firstName || ""} ${g.teacher.lastName || ""}`.trim()
                    : "-",
                capacityTarget: g.capacityTarget ?? "-",
                minStudents: g.minStudents ?? "-",
                maxStudents: g.maxStudents ?? "-",
                status: g.status || "-"
            }));

            setFeeDate(formatted);
            setOriginalData(formatted);

        } catch (err) {
            console.error("Error fetching academic groups", err);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

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

    function SotingData(name) {
        const sorted = [...feeData];

        if (name === "code") {
            sorted.sort((a, b) =>
                iconData.complete
                    ? a.code.localeCompare(b.code)
                    : b.code.localeCompare(a.code)
            );
        }

        setFeeDate(sorted);
    }

    function DataSearch(e) {
        const filtered = originalData.filter(item =>
            `${item.code} ${item.courseName} ${item.teacherName}`.toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        setFeeDate(filtered);
    }

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar grupo académico?")) return;

        try {
            await deleteAcademicGroup(id);
            fetchGroups();
        } catch (err) {
            console.error(err);
            alert("Error eliminando grupo");
        }
    };

    return (
        <>
            <PageTitle activeMenu={"All Academic Groups"} motherMenu={"Academic Groups"} />
            <Row>
                <Tab.Container defaultActiveKey={"List"}>
                    <div className="col-lg-12">
                        <Nav as="ul" className="nav nav-pills mb-3">
                            <Nav.Item as="li"><Nav.Link eventKey="List" className="me-1">List View</Nav.Link></Nav.Item>
                        </Nav>
                    </div>

                    <div className="col-lg-12">
                        <Tab.Content className="row">

                            <Tab.Pane eventKey="List" className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">All Academic Groups</h4>
                                        <Link to={"/add-academic-group"} className="btn btn-primary">+ Add New</Link>
                                    </div>

                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <div id='holidayList' className='dataTables_wrapper no-footer'>

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

                                                <table className="display dataTable no-footer w-100">
                                                    <thead>
                                                        <tr>
                                                            {theadData.map((item, ind) => (
                                                                <th key={ind}
                                                                    onClick={() => {
                                                                        SotingData(item.sortingVale);
                                                                        setIconDate(prev => ({ complete: !prev.complete, ind }))
                                                                    }}
                                                                >
                                                                    {item.heading}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {feeData.map((row, ind) => (
                                                            <tr key={ind}>
                                                                <td>{row.code}</td>
                                                                <td>{row.courseName}</td>
                                                                <td>{row.teacherName}</td>
                                                                <td>{row.capacityTarget}</td>
                                                                <td>{row.minStudents}</td>
                                                                <td>{row.maxStudents}</td>
                                                                <td>
                                                                    <span className="badge bg-primary">{row.status}</span>
                                                                </td>
                                                                <td>
                                                                    <Link to={`/edit-academic-group/${row.documentId}`} className="btn btn-xs sharp btn-primary me-1">
                                                                        <i className="fa fa-pencil" />
                                                                    </Link>
                                                                    <button
                                                                        className="btn btn-xs sharp btn-danger"
                                                                        onClick={() => handleDelete(row.documentId)}
                                                                    >
                                                                        <i className="fa fa-trash" />
                                                                    </button>
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

                        </Tab.Content>
                    </div>
                </Tab.Container>
            </Row>
        </>
    );
};

export default AllAcademicGroups;
