import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { Card, Col, Row } from 'react-bootstrap';

import { getCourses } from '../../../services/courseService';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await getCourses();

      setCourses(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <PageTitle activeMenu={'All Courses'} motherMenu={'Courses'} />

      {loading && <p>Loading courses...</p>}

      {error && <p className="text-danger">{error}</p>}

      {!loading && courses.length === 0 && <p>No courses found.</p>}

      <Row>
        {courses.map((course) => (
          <Col xl={3} xxl={4} lg={4} md={6} sm={6} key={course.documentId}>
            <Card>
              <div className="card-body">
                <h4>{course.name}</h4>

                <ul className="list-group mb-3 list-group-flush">
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Code:</span>
                    <strong>{course.code}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Weekly Sessions:</span>
                    <strong>{course.weeklySessions}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Duration:</span>
                    <strong>{course.sessionDurationMinutes} min</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Non Consecutive:</span>
                    <strong>{course.needsNonConsecutiveDays ? 'Yes' : 'No'}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Status:</span>
                    <strong>{course.isActive ? 'Active' : 'Inactive'}</strong>
                  </li>
                </ul>

                <Link to={'#'} className="btn btn-primary">
                  View Course
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default AllCourses;
