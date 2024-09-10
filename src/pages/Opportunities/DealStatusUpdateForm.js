import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/constants';
const DealStatusUpdateForm = ({ show, handleClose, form_id }) => {
  const [dealStatus, setDealStatus] = useState('');
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [amount_inr_cr_max, setAmountCrMax] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault(e);

    const updateData = {
        form_id: form_id,
        deal_status: dealStatus,
        created_at: new Date().toISOString(),
        created_by: 'admin',
        updated_at: new Date().toISOString(),
        status: status,
      
    };
   const token = localStorage.getItem('token');
    try {
        const postData = {
            ...updateData
        }
        console.log(postData);
        const response = await axios.post(`${BASE_URL}/api/deal-status`, postData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Data submitted successfully:', response);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          handleClose(dealStatus, status, amount_inr_cr_max);
        }, 2000); // Close the modal after 2 seconds
      } catch (error) {
        console.error('Error submitting data:', error);
        setError('Failed to submit data. Please try again.');
        setTimeout(() => {
          setError(null);
          handleClose(dealStatus, status);
        }, 2000); // Close the modal after 2 seconds
      }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Deal Status Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {success && <Alert variant="success">Submitted successfully!</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDealStatus">
            <Form.Label>Deal Status</Form.Label>
            <Form.Control 
              as="select" 
              value={dealStatus} 
              onChange={e => setDealStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Identified">Identified</option>
              <option value="Qualified">Qualified</option>
              <option value="No-Go">No-Go</option>
              <option value="Work in Progress">Work in Progress</option>
              <option value="Bid Submitted">Bid Submitted</option>
              <option value="Won">Won</option>
              <option value="Bid Dropped">Bid Dropped</option>
              <option value="Lost">Lost</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formAmount">
            <Form.Label>Amount INR</Form.Label>
            <Form.Control 
              type="number" 
              placeholder="Enter value in Cr" 
              value={amount_inr_cr_max} 
              onChange={e => setAmountCrMax(e.target.value)} 
            />
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label>Remarks</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter status" 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
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

export default DealStatusUpdateForm;
