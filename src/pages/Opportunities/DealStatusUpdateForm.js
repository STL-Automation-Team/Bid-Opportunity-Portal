import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/constants';

const DealStatusUpdateForm = ({ show, handleClose, form_id, partMonth }) => {
  const [dealStatuses, setDealStatuses] = useState([]);
  const [selectedDealStatus, setSelectedDealStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch deal statuses when component mounts
  useEffect(() => {
    const fetchDealStatuses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/deals`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDealStatuses(response.data);
      } catch (error) {
        console.error('Error fetching deal statuses:', error);
        setError('Failed to load deal statuses');
      }
    };

    if (show) {
      fetchDealStatuses();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      form_id: form_id,
      dealStatus: {
        id: selectedDealStatus
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const token = localStorage.getItem('token');
    try {
      // Update the lead with new deal status
      const leadUpdateResponse = await axios.put(`${BASE_URL}/api/leads/${form_id}`, {

        partMonth : partMonth,
        dealStatusId : selectedDealStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Post deal status update
      const dealStatusResponse = await axios.post(`${BASE_URL}/api/deal-status`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Lead updated successfully:', leadUpdateResponse.data);
      console.log('Deal status submitted successfully:', dealStatusResponse.data);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        handleClose(
          selectedDealStatus, 
          remarks
        );
      }, 2000);
    } catch (error) {
      console.error('Error submitting data:', error);
      setError('Failed to submit data. Please try again.');
      setTimeout(() => {
        setError(null);
      }, 2000);
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
              value={selectedDealStatus} 
              onChange={e => setSelectedDealStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              {dealStatuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.dealStatus}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {/* <Form.Group controlId="formRemarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter remarks" 
              value={remarks} 
              onChange={e => setRemarks(e.target.value)} 
            />
          </Form.Group> */}
          <div className="d-flex justify-content-between mt-3">
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