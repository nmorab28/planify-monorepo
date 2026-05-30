import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import PageTitle from '../../layouts/PageTitle';
import { createTeacher, getTeachers } from '../../../services/teacherService';

const REQUIRED_COLUMNS = ['code', 'firstName', 'lastName', 'email'];
const TEMPLATE = `code,firstName,lastName,email,isActive
DOC-101,Laura,Gomez,laura.gomez@planify.edu,true
DOC-102,Carlos,Ruiz,carlos.ruiz@planify.edu,true`;

const splitCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

const parseCsv = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('El archivo debe incluir encabezados y al menos una fila.');
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.trim());
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));

  if (missing.length > 0) {
    throw new Error(`Faltan columnas requeridas: ${missing.join(', ')}`);
  }

  return lines.slice(1).map((line, index) => {
    const values = splitCsvLine(line);
    const record = headers.reduce(
      (acc, header, headerIndex) => ({
        ...acc,
        [header]: values[headerIndex]?.trim() || '',
      }),
      {}
    );

    return {
      rowNumber: index + 2,
      code: record.code.toUpperCase(),
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email.toLowerCase(),
      isActive: record.isActive ? record.isActive.toLowerCase() !== 'false' : true,
      errors: [],
      status: 'pending',
    };
  });
};

const validateRows = (rows, existingTeachers = []) => {
  const existingCodes = new Set(existingTeachers.map((teacher) => String(teacher.code).toUpperCase()));
  const existingEmails = new Set(existingTeachers.map((teacher) => String(teacher.email).toLowerCase()));
  const seenCodes = new Set();
  const seenEmails = new Set();

  return rows.map((row) => {
    const errors = [];

    if (!row.code) errors.push('Código requerido');
    if (!row.firstName) errors.push('Nombres requeridos');
    if (!row.lastName) errors.push('Apellidos requeridos');
    if (!row.email) errors.push('Correo requerido');
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push('Correo inválido');
    }
    if (seenCodes.has(row.code)) errors.push('Código duplicado en archivo');
    if (seenEmails.has(row.email)) errors.push('Correo duplicado en archivo');
    if (existingCodes.has(row.code)) errors.push('Código ya existe');
    if (existingEmails.has(row.email)) errors.push('Correo ya existe');

    seenCodes.add(row.code);
    seenEmails.add(row.email);

    return {
      ...row,
      errors,
      status: errors.length > 0 ? 'invalid' : 'ready',
    };
  });
};

const statusLabel = {
  pending: 'Pendiente',
  ready: 'Listo',
  invalid: 'Revisar',
  created: 'Creado',
  failed: 'Falló',
};

const statusClass = {
  pending: 'bg-secondary',
  ready: 'bg-primary',
  invalid: 'bg-warning',
  created: 'bg-success',
  failed: 'bg-danger',
};

const ImportProfessors = () => {
  const [csvText, setCsvText] = useState(TEMPLATE);
  const [rows, setRows] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState(null);

  const readyRows = useMemo(() => rows.filter((row) => row.status === 'ready'), [rows]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvText(await file.text());
    setRows([]);
    setSummary(null);
  };

  const handlePreview = async () => {
    try {
      setLoadingPreview(true);
      setSummary(null);
      const parsed = parseCsv(csvText);
      const teachers = await getTeachers();
      setRows(validateRows(parsed, teachers || []));
    } catch (error) {
      Swal.fire('No se pudo leer el archivo', error.message, 'error');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleImport = async () => {
    if (readyRows.length === 0 || importing) return;

    setImporting(true);
    let created = 0;
    let failed = 0;

    const importedRows = [];

    for (const row of rows) {
      if (row.status !== 'ready') {
        importedRows.push(row);
        continue;
      }

      try {
        await createTeacher({
          code: row.code,
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          isActive: row.isActive,
        });
        created += 1;
        importedRows.push({ ...row, status: 'created' });
      } catch (error) {
        failed += 1;
        importedRows.push({
          ...row,
          status: 'failed',
          errors: [error.message || 'No se pudo crear el docente'],
        });
      }
    }

    setRows(importedRows);
    setSummary({ created, failed, skipped: rows.length - readyRows.length });
    setImporting(false);

    Swal.fire(
      'Importación finalizada',
      `${created} docentes creados. ${failed} fallaron.`,
      failed > 0 ? 'warning' : 'success'
    );
  };

  return (
    <>
      <PageTitle activeMenu="Importar docentes" motherMenu="Docentes" />
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Importación masiva de docentes</h4>
              <Link to="/all-professors" className="btn btn-outline-primary">
                Ver docentes
              </Link>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-5">
                  <div className="form-group">
                    <label className="form-label">Archivo CSV</label>
                    <input type="file" accept=".csv,text/csv" className="form-control" onChange={handleFile} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contenido CSV</label>
                    <textarea
                      className="form-control"
                      rows={10}
                      value={csvText}
                      onChange={(event) => {
                        setCsvText(event.target.value);
                        setRows([]);
                        setSummary(null);
                      }}
                    />
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setCsvText(TEMPLATE)}
                    >
                      Cargar plantilla
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePreview}
                      disabled={loadingPreview}
                    >
                      {loadingPreview ? 'Validando...' : 'Validar CSV'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleImport}
                      disabled={readyRows.length === 0 || importing}
                    >
                      {importing ? 'Importando...' : `Importar ${readyRows.length}`}
                    </button>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="alert alert-info">
                    Columnas requeridas: <strong>code, firstName, lastName, email</strong>.
                    La columna <strong>isActive</strong> es opcional.
                  </div>

                  {summary && (
                    <div className="alert alert-success">
                      Creados: <strong>{summary.created}</strong>. Omitidos:{' '}
                      <strong>{summary.skipped}</strong>. Fallidos: <strong>{summary.failed}</strong>.
                    </div>
                  )}

                  <div className="table-responsive">
                    <table className="display dataTable no-footer w-100">
                      <thead>
                        <tr>
                          <th>Fila</th>
                          <th>Código</th>
                          <th>Nombre</th>
                          <th>Correo</th>
                          <th>Estado</th>
                          <th>Detalle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={`${row.rowNumber}-${row.code}-${row.email}`}>
                            <td>{row.rowNumber}</td>
                            <td>{row.code}</td>
                            <td>
                              {row.firstName} {row.lastName}
                            </td>
                            <td>{row.email}</td>
                            <td>
                              <span className={`badge ${statusClass[row.status]}`}>
                                {statusLabel[row.status]}
                              </span>
                            </td>
                            <td>{row.errors.length > 0 ? row.errors.join(', ') : 'Sin errores'}</td>
                          </tr>
                        ))}
                        {rows.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center text-muted">
                              Valida un CSV para ver la previsualización.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default ImportProfessors;
