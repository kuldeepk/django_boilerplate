import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row, 
  Col,
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
  FormControl
} from "react-bootstrap";

interface ConfirmDialogParams {
  show: boolean,
  onClose: (status: boolean) => void,
  title: string,
  confirmText: string
}

export const ConfirmDialog = (params: ConfirmDialogParams) => {

  return (
    <Modal show={params.show} onHide={() => {params.onClose(false);}}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {params.title && (
      <Modal.Header closeButton>
        <Modal.Title as="h5">{params.title}</Modal.Title>
      </Modal.Header>
      )}
      <Modal.Body>
        <p className="lead text-muted m-0 pl-2 pr-2">{params.confirmText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="button" onClick={() => {params.onClose(true);}}>
            Confirm
        </Button>
        <Button variant="secondary" type="button" onClick={() => {params.onClose(false);}}>
            Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

