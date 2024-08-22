import axios from 'axios';
import { default as React, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/constants';

const GoNoGoStatusForm = ({ show, handleClose, form_id }) => {
    const [dateTime, setDateTime] = useState('');
    const [status, setStatus] = useState('Pending');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
          form_id,
          date: dateTime,
          status,
          created_at: new Date().toISOString(),
          created_by: 'admin',
          updated_at: new Date().toISOString(),
          updated_by: 'admin'
        };
    
        try {
          const postData = {
            ...data
          }
          const response = await axios.post(`${BASE_URL}/api/gonogostatus`, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log('Data submitted successfully:', response);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            handleClose(dateTime, status);
          }, 2000); // Close the modal after 2 seconds
        } catch (error) {
          console.error('Error submitting data:', error);
          setError('Failed to submit data. Please try again.');
          setTimeout(() => {
            setError(null);
            handleClose();
          }, 2000); // Close the modal after 2 seconds
        }
      };


   return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Go/No-Go Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">Submitted successfully!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDate" className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formStatus" className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Done">Done</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
            </Form.Control>
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default GoNoGoStatusForm;
