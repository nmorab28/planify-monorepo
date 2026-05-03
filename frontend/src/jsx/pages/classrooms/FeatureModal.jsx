import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

import { createClassroomFeature } from "../../../services/classroomFeatureService";
import { validateFeature } from "./classroomValidation";

const FeatureModal = ({ show, onHide, onCreated }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCode("");
    setName("");
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const errors = validateFeature({ code, name });
    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Característica inválida",
        text: errors[0],
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await createClassroomFeature({
        code: code.trim().toUpperCase(),
        name: name.trim(),
      });

      const created = res?.data || null;

      await Swal.fire({
        icon: "success",
        title: "Característica creada",
        timer: 1200,
        showConfirmButton: false,
      });

      reset();
      onCreated?.(created);
      onHide();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo crear la característica",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nueva característica</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: PROYECTOR"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={20}
              required
            />
            <Form.Text className="text-muted">
              Mayúsculas, números o guiones. Entre 2 y 20 caracteres.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Proyector HDMI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger light" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Crear"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FeatureModal;
