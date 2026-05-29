import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { ThemeContext } from '../../../context/ThemeContext';
import Logout from '../nav/Logout';

const ROLE_LABELS = {
  academic_coordinator: 'Coordinador académico',
  teacher: 'Docente',
  student: 'Estudiante',
};

const Header = () => {
  const { background, changeBackground } = useContext(ThemeContext);
  const auth = useSelector((state) => state.auth.auth);
  const roleLabel = ROLE_LABELS[auth.role] || auth.roleName || 'Rol no identificado';

  const handleThemeMode = () => {
    changeBackground(
      background.value === 'dark'
        ? { value: 'light', label: 'Claro' }
        : { value: 'dark', label: 'Oscuro' }
    );
  };

  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div className="d-none d-md-block">
                <strong>Planify</strong>
                <span className="text-muted ms-2">Gestión académica de horarios</span>
              </div>
            </div>
            <ul className="navbar-nav header-right">
              <li className="nav-item dropdown notification_dropdown">
                <button
                  type="button"
                  className={`nav-link bell dlab-theme-mode p-0 border-0 bg-transparent ${
                    background.value === 'dark' ? 'active' : ''
                  }`}
                  onClick={handleThemeMode}
                  title="Cambiar tema"
                >
                  <i id="icon-light" className="fas fa-sun"></i>
                  <i id="icon-dark" className="fas fa-moon"></i>
                </button>
              </li>
              <Dropdown as="li" className="nav-item header-profile">
                <Dropdown.Toggle to="#" className="nav-link i-false" as="div">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                      style={{ width: 36, height: 36 }}
                    >
                      {(auth.username || auth.email || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="d-none d-md-block text-start">
                      <div className="fw-semibold">{auth.username || auth.email || 'Usuario'}</div>
                      <small className="text-muted">{roleLabel}</small>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="mt-3 dropdown-menu dropdown-menu-right">
                  <div className="dropdown-item-text">
                    <strong>{auth.email}</strong>
                    <div className="text-muted">{roleLabel}</div>
                  </div>
                  <Dropdown.Divider />
                  <Logout />
                </Dropdown.Menu>
              </Dropdown>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
