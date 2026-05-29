import React, { useEffect, useMemo, useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import Swal from 'sweetalert2';

import PageTitle from '../../layouts/PageTitle';
import { createRule, getRules, updateRule } from '../../../services/ruleService';
import { getActiveScheduleConfig } from '../../../services/scheduleConfigService';

const emptyForm = {
  documentId: '',
  code: '',
  name: '',
  weight: 50,
  isEnabled: true,
  parameters: '{}',
  scheduleConfigDocumentId: '',
};

const ruleLabels = {
  hard: {
    title: 'Reglas obligatorias',
    description: 'Restricciones que deben cumplirse para aceptar un horario.',
    createTitle: 'Nueva regla obligatoria',
  },
  soft: {
    title: 'Reglas blandas',
    description: 'Preferencias ponderadas para optimizar el horario.',
    createTitle: 'Nueva regla blanda',
  },
};

const normalizeRuleToForm = (rule, fallbackScheduleConfigDocumentId) => ({
  documentId: rule.documentId,
  code: rule.code || '',
  name: rule.name || '',
  weight: rule.weight || 50,
  isEnabled: rule.isEnabled !== false,
  parameters: JSON.stringify(rule.parameters || {}, null, 2),
  scheduleConfigDocumentId: rule.scheduleConfig?.documentId || fallbackScheduleConfigDocumentId || '',
});

const Rules = () => {
  const [activeType, setActiveType] = useState('hard');
  const [scheduleConfig, setScheduleConfig] = useState(null);
  const [rules, setRules] = useState({ hard: [], soft: [] });
  const [forms, setForms] = useState({ hard: emptyForm, soft: emptyForm });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRules = async () => {
    try {
      setLoading(true);
      const [activeConfig, hardRules, softRules] = await Promise.all([
        getActiveScheduleConfig().catch(() => null),
        getRules('hard'),
        getRules('soft'),
      ]);

      setScheduleConfig(activeConfig);
      setRules({ hard: hardRules, soft: softRules });
      setForms({
        hard: { ...emptyForm, scheduleConfigDocumentId: activeConfig?.documentId || '' },
        soft: { ...emptyForm, scheduleConfigDocumentId: activeConfig?.documentId || '' },
      });
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudieron cargar las reglas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const currentForm = forms[activeType];

  const activeRules = useMemo(() => rules[activeType] || [], [activeType, rules]);

  const setCurrentForm = (next) => {
    setForms((prev) => ({
      ...prev,
      [activeType]: typeof next === 'function' ? next(prev[activeType]) : next,
    }));
  };

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setCurrentForm((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!currentForm.code.trim()) return 'El codigo es obligatorio.';
    if (!currentForm.name.trim()) return 'El nombre es obligatorio.';
    if (activeType === 'soft') {
      const weight = Number(currentForm.weight);
      if (!Number.isInteger(weight) || weight < 1 || weight > 100) {
        return 'El peso debe estar entre 1 y 100.';
      }
    }

    try {
      JSON.parse(currentForm.parameters || '{}');
    } catch {
      return 'Los parametros deben estar en formato JSON valido.';
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const error = validateForm();
    if (error) {
      Swal.fire('Datos invalidos', error, 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (currentForm.documentId) {
        await updateRule(activeType, currentForm.documentId, currentForm);
      } else {
        await createRule(activeType, currentForm);
      }

      await loadRules();
      Swal.fire({
        icon: 'success',
        title: 'Regla guardada',
        timer: 1300,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo guardar la regla', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const editRule = (rule) => {
    setCurrentForm(normalizeRuleToForm(rule, scheduleConfig?.documentId));
  };

  const newRule = () => {
    setCurrentForm({ ...emptyForm, scheduleConfigDocumentId: scheduleConfig?.documentId || '' });
  };

  const toggleRule = async (rule) => {
    const payload = normalizeRuleToForm(rule, scheduleConfig?.documentId);
    payload.isEnabled = !payload.isEnabled;

    try {
      await updateRule(activeType, rule.documentId, payload);
      await loadRules();
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo actualizar el estado de la regla', 'error');
    }
  };

  return (
    <>
      <PageTitle activeMenu="Reglas de horario" motherMenu="Planificacion" />

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <div>
                <h4 className="card-title">Configuracion y reglas</h4>
                <span className="text-muted">
                  {scheduleConfig
                    ? `${scheduleConfig.name} - ${scheduleConfig.academicPeriod}`
                    : 'Sin configuracion activa'}
                </span>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando reglas...</p>
              ) : (
                <Tab.Container activeKey={activeType} onSelect={(key) => setActiveType(key || 'hard')}>
                  <Nav as="ul" className="nav-tabs">
                    <Nav.Item as="li">
                      <Nav.Link eventKey="hard">Reglas obligatorias</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link eventKey="soft">Reglas blandas</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content className="pt-4">
                    {['hard', 'soft'].map((ruleType) => (
                      <Tab.Pane key={ruleType} eventKey={ruleType}>
                        <div className="row">
                          <div className="col-xl-7">
                            <h5>{ruleLabels[ruleType].title}</h5>
                            <p className="text-muted">{ruleLabels[ruleType].description}</p>
                            <div className="table-responsive">
                              <table className="display dataTable no-footer w-100">
                                <thead>
                                  <tr>
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    {ruleType === 'soft' && <th>Peso</th>}
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {activeRules.map((rule) => (
                                    <tr key={rule.documentId}>
                                      <td>
                                        <strong>{rule.code}</strong>
                                      </td>
                                      <td>{rule.name}</td>
                                      {ruleType === 'soft' && <td>{rule.weight}</td>}
                                      <td>
                                        <span
                                          className={`badge ${
                                            rule.isEnabled ? 'bg-success' : 'bg-secondary'
                                          } light`}
                                        >
                                          {rule.isEnabled ? 'Activa' : 'Inactiva'}
                                        </span>
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-primary me-1"
                                          onClick={() => editRule(rule)}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-outline-secondary"
                                          onClick={() => toggleRule(rule)}
                                        >
                                          {rule.isEnabled ? 'Desactivar' : 'Activar'}
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {activeRules.length === 0 && (
                                <p className="text-muted text-center mt-3">No hay reglas registradas.</p>
                              )}
                            </div>
                          </div>

                          <div className="col-xl-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h5 className="mb-0">
                                {currentForm.documentId
                                  ? 'Editar regla'
                                  : ruleLabels[ruleType].createTitle}
                              </h5>
                              <button type="button" className="btn btn-outline-primary" onClick={newRule}>
                                Nueva
                              </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <label className="form-label" htmlFor="code">
                                  Codigo
                                </label>
                                <input
                                  id="code"
                                  className="form-control"
                                  value={currentForm.code}
                                  onChange={(event) =>
                                    setCurrentForm((prev) => ({
                                      ...prev,
                                      code: event.target.value.toUpperCase(),
                                    }))
                                  }
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="name">
                                  Nombre
                                </label>
                                <input
                                  id="name"
                                  className="form-control"
                                  value={currentForm.name}
                                  onChange={handleChange}
                                />
                              </div>

                              {ruleType === 'soft' && (
                                <div className="form-group">
                                  <label className="form-label" htmlFor="weight">
                                    Peso
                                  </label>
                                  <input
                                    id="weight"
                                    type="number"
                                    min="1"
                                    max="100"
                                    className="form-control"
                                    value={currentForm.weight}
                                    onChange={handleChange}
                                  />
                                </div>
                              )}

                              <div className="form-group form-check">
                                <input
                                  id="isEnabled"
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={currentForm.isEnabled}
                                  onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="isEnabled">
                                  Regla activa
                                </label>
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="parameters">
                                  Parametros JSON
                                </label>
                                <textarea
                                  id="parameters"
                                  className="form-control"
                                  rows="6"
                                  value={currentForm.parameters}
                                  onChange={handleChange}
                                />
                              </div>

                              <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Guardando...' : 'Guardar regla'}
                              </button>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Tab.Container>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rules;
