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
      setError(err.message || 'No se pudieron cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <PageTitle activeMenu={'Cursos'} motherMenu={'Gestion academica'} />

      {loading && <p>Cargando cursos...</p>}

      {error && <p className="text-danger">{error}</p>}

      {!loading && courses.length === 0 && <p>No hay cursos registrados.</p>}

      <Row>
        {courses.map((course) => (
          <Col xl={3} xxl={4} lg={4} md={6} sm={6} key={course.documentId}>
            <Card>
              <div className="card-body">
                <h4>{course.name}</h4>

                <ul className="list-group mb-3 list-group-flush">
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Codigo:</span>
                    <strong>{course.code}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Sesiones semanales:</span>
                    <strong>{course.weeklySessions}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Duracion:</span>
                    <strong>{course.sessionDurationMinutes} min</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Dias no consecutivos:</span>
                    <strong>{course.needsNonConsecutiveDays ? 'Si' : 'No'}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Estado:</span>
                    <strong>{course.isActive ? 'Activo' : 'Inactivo'}</strong>
                  </li>
                </ul>

                <Link to={'#'} className="btn btn-primary">
                  Ver curso
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
