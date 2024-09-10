import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { BASE_URL } from '../../components/constants';
import './sidecard.css';

const CountCard = ({ title, baseColor, box_id, handleUpdate, details, form_id }) => {
  const [expanded, setExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState(details);

  // Extract the week number from the details
  const week = details.find(detail => detail.label.toLowerCase() === 'week')?.value;

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };
  const token = localStorage.getItem('token');
  const onUpdate = (updatedDetails) => {
    const updatedPayload = {
      action: updatedDetails[2].value,
    };
    console.log(updatedPayload);
    axios.put(`${BASE_URL}/api/plans/${box_id}`, updatedPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Data updated successfully:', response.data);
        handleUpdate();
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  };

  const handleEditChange = (index, field, value) => {
    const newDetails = [...editDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setEditDetails(newDetails);
  };

  const handleEditSubmit = () => {
    console.log(editDetails);
    onUpdate(editDetails);
    setShowEditModal(false);
  };

  return (
    <>
      <Card className="count-card" style={{ borderColor: baseColor, color: 'white', background: 'rgb(255, 152, 0)' }}>
        <Card.Header className="card-header">
          <button className="expand-button" onClick={toggleExpand}>
            {expanded ? <FaMinus /> : <FaPlus />}
          </button>
          {/* Updated Card Title */}
          <span className="card-title">
            {`Week ${week} Plan`} - {title}
          </span>
          <Button variant="link" onClick={handleEditClick} style={{ color: 'white' }}>Add Action</Button>
        </Card.Header>
        <Card.Body style={{ display: expanded ? 'block' : 'none', textAlign: 'left' }}>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {details.map((detail, index) => (
              <li key={index}>
                <strong>{detail.label}:</strong> {detail.value}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={handleEditClose}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Plan & Action</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {editDetails.map((detail, index) => (
        <Form.Group controlId={`formDetail${index}`} key={index}>
          <Form.Label>{detail.label}</Form.Label>
          <Form.Control
            type="text"
            value={detail.value}
            onChange={(e) => handleEditChange(index, 'value', e.target.value)}
            readOnly={detail.label.toLowerCase() !== 'action'} // Make all fields except "Action" read-only
          />
        </Form.Group>
      ))}
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleEditClose}>
      Close
    </Button>
    <Button variant="primary" onClick={handleEditSubmit}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default CountCard;
