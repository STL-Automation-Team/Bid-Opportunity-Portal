import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';

const PlanActionsForm = ({ show, handleClose, form_id }) => {
  const [week, setWeek] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [plan, setPlan] = useState('');
  const [action, setAction] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      form_id,
      date: dateTime,
      week: 1,
      plan,
      action,
      created_at: new Date().toISOString(),
      created_by: 'admin',
      updated_at: new Date().toISOString(),
      updated_by: 'admin'
    };
    const postData = {
        ...data
    }
    try {
        console.log(data)
        const response = await axios.post('http://localhost:8080/api/plans', postData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });        console.log('Data updated successfully:', response.data);

      console.log('Data submitted successfully:');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleClose();
      }, 2000); // Close the modal after 2 seconds
    } catch (error) {
      console.error('Error submitting data:', error);
      setError('Failed to submit data. Please try again.'); // Display error message
      setTimeout(() => {
        setError(null);
        handleClose();
      }, 100); // Close the m
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Plan & Actions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">Submitted successfully!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* <Form.Group controlId="formWeek" className="mb-3">
            <Form.Label>Week</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter week number"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
            />
          </Form.Group> */}
          <Form.Group controlId="formDate" className="mb-3">
            <Form.Label>Date and Time</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder="Enter date and time"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPlan" className="mb-3">
            <Form.Label>Plan</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAction" className="mb-3">
            <Form.Label>Action</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            />
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

export default PlanActionsForm;
