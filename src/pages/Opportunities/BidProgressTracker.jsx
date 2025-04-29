import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../components/constants';
import './BidProgressTracker.css';

const BidProgressTracker = ({ leadId }) => {
  const [bidData, setBidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingStep, setEditingStep] = useState(null);
  const [editValues, setEditValues] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBidTrackerData();
  }, [leadId]);

  const fetchBidTrackerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/bid-trackers/lead/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBidData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bid tracker:', error);
      setLoading(false);
    }
  };

  const handleEditClick = (step) => {
    setEditingStep(step);
    setEditValues({
      preBidMeeting: bidData.preBidMeeting || '',
      querySubmission: bidData.querySubmission || false,
      solutionReady: bidData.solutionReady || false,
      solutionReadyDate: bidData.solutionReadyDate || '',
      mouReady: bidData.mouReady || false,
      pricingDone: bidData.pricingDone || false,
      pricingDoneDate: bidData.pricingDoneDate || '',
    });
  };

  const handleSave = async () => {
    if (!token) {
      console.error('No authentication token found');
      alert('Please log in again');
      return;
    }

    try {
      // Construct payload matching BidTrackerDTO
      const payload = {
        id: bidData.id,
        leadId: bidData.leadId,
        opportunityIdentification: bidData.opportunityIdentification,
        rfpReleaseDate: bidData.rfpReleaseDate,
        preBidMeeting: editValues.preBidMeeting || null, // LocalDate, string "YYYY-MM-DD" or null
        goNoGoId: bidData.goNoGoId,
        goNoGoName: bidData.goNoGoName,
        querySubmission: editValues.querySubmission || false, // Boolean
        solutionReady: editValues.solutionReady || false, // Boolean
        solutionReadyDate: editValues.solutionReadyDate || null, // LocalDate, string "YYYY-MM-DD" or null
        mouReady: editValues.mouReady || false, // Boolean
        pricingDone: editValues.pricingDone || false, // Boolean
        pricingDoneDate: editValues.pricingDoneDate || null, // LocalDate, string "YYYY-MM-DD" or null
        tenderSubmissionDate: bidData.tenderSubmissionDate,
        bidOpening: bidData.bidOpening,
        dealStatusId: bidData.dealStatusId,
        dealStatusName: bidData.dealStatusName,
        createdDate: bidData.createdDate,
        createdBy: bidData.createdBy,
        createdByName: bidData.createdByName,
        lastModifiedDate: bidData.lastModifiedDate,
        lastModifiedBy: bidData.lastModifiedBy,
        lastModifiedByName: bidData.lastModifiedByName,
      };

      const response = await axios.put(`${BASE_URL}/api/bid-trackers/${bidData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBidData(response.data); // Update with server response to ensure sync
      setEditingStep(null);
    } catch (error) {
      console.error('Error updating bid tracker:', error);
      alert(
        error.response?.status === 401
          ? 'Session expired. Please log in again.'
          : error.response?.status === 403
          ? 'You do not have permission to update this resource.'
          : error.response?.status === 400
          ? 'Invalid data format. Please check your inputs.'
          : 'An error occurred while updating the bid tracker.'
      );
    }
  };

  const handleCancel = () => setEditingStep(null);

  if (loading) return <div className="loading">Loading...</div>;
  if (!bidData) return <div className="no-data">No bid data available</div>;

  const progressSteps = [
    { key: 'opportunityIdentification', label: 'Opportunity', value: bidData.opportunityIdentification },
    { key: 'rfpReleaseDate', label: 'RFP Release', value: bidData.rfpReleaseDate },
    { key: 'preBidMeeting', label: 'Pre-Bid', value: bidData.preBidMeeting, editable: true, isDate: true },
    { key: 'goNoGoName', label: 'Go/No-Go', value: bidData.goNoGoName },
    { key: 'querySubmission', label: 'Queries', value: bidData.querySubmission, editable: true },
    { key: 'solutionReady', label: 'Solution', value: bidData.solutionReady, dateKey: 'solutionReadyDate', editable: true },
    { key: 'mouReady', label: 'MOU', value: bidData.mouReady, editable: true },
    { key: 'pricingDone', label: 'Pricing', value: bidData.pricingDone, dateKey: 'pricingDoneDate', editable: true },
    { key: 'tenderSubmissionDate', label: 'Submission', value: bidData.tenderSubmissionDate },
    { key: 'bidOpening', label: 'Opening', value: bidData.bidOpening },
    { key: 'dealStatusName', label: 'Status', value: bidData.dealStatusName },
  ];

  return (
    <div className="bid-tracker">
      <h2>Bid Progress</h2>
      <div className="tracker-grid">
        {progressSteps.map((step) => {
          const isCompleted = step.value !== null && step.value !== false;
          const isEditing = editingStep === step.key;

          return (
            <div key={step.key} className={`tracker-item ${isCompleted ? 'completed' : ''}`}>
              <div className="status-indicator">{isCompleted ? '✓' : '○'}</div>
              <div className="item-content">
                <span className="item-label">{step.label}</span>
                {isEditing && step.editable ? (
                  <div className="edit-controls">
                    {step.isDate ? (
                      <input
                        type="date"
                        value={editValues[step.key] || ''}
                        onChange={(e) => setEditValues({ ...editValues, [step.key]: e.target.value })}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={editValues[step.key] || false}
                        onChange={(e) => setEditValues({ ...editValues, [step.key]: e.target.checked })}
                      />
                    )}
                    {step.dateKey && (
                      <input
                        type="date"
                        value={editValues[step.dateKey] || ''}
                        onChange={(e) => setEditValues({ ...editValues, [step.dateKey]: e.target.value })}
                      />
                    )}
                    <button className="save-btn" onClick={handleSave}>✓</button>
                    <button className="cancel-btn" onClick={handleCancel}>×</button>
                  </div>
                ) : (
                  <span className="item-value">
                    {step.dateKey && bidData[step.dateKey]
                      ? bidData[step.dateKey]
                      : step.value !== null && step.value !== false
                      ? typeof step.value === 'boolean'
                        ? 'Done'
                        : step.value
                      : 'Pending'}
                    {step.editable && (
                      <button className="edit-btn" onClick={() => handleEditClick(step.key)}>✎</button>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BidProgressTracker;