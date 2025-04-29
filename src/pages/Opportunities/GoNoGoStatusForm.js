import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/constants';

const ApprovalRequestForm = ({ show, handleClose, form_id, primary_owner, isRequestInitiated }) => {
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRequestInitiated) {
      setError('An approval request has already been initiated for this form.');
      return;
    }

    if (!file) {
      setError('Please select a PPT file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('formId', form_id);
    formData.append('primaryOwner', primary_owner);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/approval-requests`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Approval request submitted successfully:', response);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleClose(true);  // Pass true to indicate a successful submission
      }, 2000); // Close the modal after 2 seconds
    } catch (error) {
      console.error('Error submitting approval request:', error);
      setError('Failed to submit approval request. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Initiate Approval Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">Approval request submitted successfully!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {isRequestInitiated ? (
          <Alert variant="info">An approval request has already been initiated for this form.</Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload PPT File</Form.Label>
              <Form.Control
                type="file"
                accept=".ppt,.pptx"
                onChange={handleFileChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isRequestInitiated}>
                Submit Request
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ApprovalRequestForm;