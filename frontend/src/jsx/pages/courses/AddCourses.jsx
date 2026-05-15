import React, { useState } from 'react';

import PageTitle from '../../layouts/PageTitle';

import { createCourse } from '../../../services/courseService';

const AddCourses = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    weeklySessions: 1,
    sessionDurationMinutes: 60,
    needsNonConsecutiveDays: false,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setMessage('');

      await createCourse({
        ...formData,
        weeklySessions: Number(formData.weeklySessions),
        sessionDurationMinutes: Number(formData.sessionDurationMinutes),
      });

      setMessage('Course created successfully');

      setFormData({
        code: '',
        name: '',
        weeklySessions: 1,
        sessionDurationMinutes: 60,
        needsNonConsecutiveDays: false,
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error creating course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle activeMenu={'Add Course'} motherMenu={'Courses'} />

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Courses Details</h4>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Course Name</label>

                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Course Code</label>

                      <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Weekly Sessions</label>

                      <input
                        type="number"
                        className="form-control"
                        name="weeklySessions"
                        value={formData.weeklySessions}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label className="form-label">Session Duration Minutes</label>

                      <input
                        type="number"
                        className="form-control"
                        name="sessionDurationMinutes"
                        value={formData.sessionDurationMinutes}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-check mt-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="needsNonConsecutiveDays"
                        checked={formData.needsNonConsecutiveDays}
                        onChange={handleChange}
                      />

                      <label className="form-check-label">Needs Non Consecutive Days</label>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-check mt-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />

                      <label className="form-check-label">Active</label>
                    </div>
                  </div>

                  {message && (
                    <div className="col-12">
                      <div className="alert alert-success">{message}</div>
                    </div>
                  )}

                  {error && (
                    <div className="col-12">
                      <div className="alert alert-danger">{error}</div>
                    </div>
                  )}

                  <div className="col-lg-12">
                    <button type="submit" className="btn btn-primary me-1" disabled={loading}>
                      {loading ? 'Saving...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourses;
