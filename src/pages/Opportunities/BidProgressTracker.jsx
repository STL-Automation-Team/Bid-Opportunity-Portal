import axios from 'axios';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  const handleDatePickerChange = (date, name) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setEditValues({ ...editValues, [name]: formattedDate });
  };

  const handleSave = async () => {
    if (!token) {
      console.error('No authentication token found');
      alert('Please log in again');
      return;
    }

    try {
      const payload = {
        id: bidData.id,
        leadId: bidData.leadId,
        opportunityIdentification: bidData.opportunityIdentification,
        rfpReleaseDate: bidData.rfpReleaseDate,
        preBidMeeting: editValues.preBidMeeting || null,
        goNoGoId: bidData.goNoGoId,
        goNoGoName: bidData.goNoGoName,
        querySubmission: editValues.querySubmission || false,
        solutionReady: editValues.solutionReady || false,
        solutionReadyDate: editValues.solutionReadyDate || null,
        mouReady: editValues.mouReady || false,
        pricingDone: editValues.pricingDone || false,
        pricingDoneDate: editValues.pricingDoneDate || null,
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

      setBidData(response.data);
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

  if (loading) return <div className="text-center py-4 text-gray-500">Loading...</div>;
  if (!bidData) return <div className="text-center py-4 text-gray-500">No bid data available</div>;

  const progressSteps = [
    { key: 'opportunityIdentification', label: 'Opportunity', value: bidData.opportunityIdentification },
    { key: 'rfpReleaseDate', label: 'RFP Release', value: bidData.rfpReleaseDate },
    { key: 'goNoGoName', label: 'Go/No-Go', value: bidData.goNoGoName },
    { key: 'preBidMeeting', label: 'Pre-Bid', value: bidData.preBidMeeting, editable: true, isDate: true },
    { key: 'querySubmission', label: 'Queries', value: bidData.querySubmission, editable: true },
    { key: 'solutionReady', label: 'Solution', value: bidData.solutionReady, dateKey: 'solutionReadyDate', editable: true },
    { key: 'mouReady', label: 'MOU', value: bidData.mouReady, editable: true },
    { key: 'pricingDone', label: 'Pricing', value: bidData.pricingDone, dateKey: 'pricingDoneDate', editable: true },
    { key: 'tenderSubmissionDate', label: 'Submission', value: bidData.tenderSubmissionDate },
    { key: 'bidOpening', label: 'Bid-Opening', value: bidData.bidOpening },
    { key: 'dealStatusName', label: 'Deal Status', value: bidData.dealStatusName },
  ];

  return (
    <div className="bid-tracker p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Bid Progress</h2>
      <div className="timeline-container">
        <div className="flex space-x-4">
          {progressSteps.map((step, index) => {
            const isCompleted = step.value !== null && step.value !== false;
            const isEditing = editingStep === step.key;

            return (
              <div key={step.key} className={`timeline-step ${isCompleted ? 'completed' : ''}`}>
                <div
                  className={`timeline-circle ${
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-700">{step.label}</div>
                  {isEditing && step.editable ? (
                    <div className="edit-controls mt-2">
                      {step.isDate ? (
                        <DatePicker
                          selected={editValues[step.key] ? new Date(editValues[step.key]) : null}
                          onChange={(date) => handleDatePickerChange(date, step.key)}
                          dateFormat="yyyy-MM-dd"
                          className="w-full p-2 text-sm border rounded"
                          popperPlacement="auto"
                          popperClassName="date-picker-popper"
                          name={step.key}
                          autoComplete="off"
                          showYearDropdown
                          showMonthDropdown
                          yearDropdownItemNumber={10}
                          scrollableYearDropdown
                          scrollableMonthDropdown
                          withPortal={true}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={editValues[step.key] || false}
                          onChange={(e) => setEditValues({ ...editValues, [step.key]: e.target.checked })}
                          className="h-4 w-4 text-green-500 rounded"
                        />
                      )}
                      {step.dateKey && (
                        <DatePicker
                          selected={editValues[step.dateKey] ? new Date(editValues[step.dateKey]) : null}
                          onChange={(date) => handleDatePickerChange(date, step.dateKey)}
                          dateFormat="yyyy-MM-dd"
                          className="w-full p-2 text-sm border rounded mt-2"
                          popperPlacement="auto"
                          popperClassName="date-picker-popper"
                          name={step.dateKey}
                          autoComplete="off"
                          showYearDropdown
                          showMonthDropdown
                          yearDropdownItemNumber={10}
                          scrollableYearDropdown
                          scrollableMonthDropdown
                          withPortal={true}
                        />
                      )}
                      <div className="flex space-x-2 mt-2">
                        <button onClick={handleSave} className="text-green-500 hover:text-green-700">
                          ✓
                        </button>
                        <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600 mt-1 flex items-center justify-center space-x-2">
                      <span>
                        {step.dateKey && bidData[step.dateKey]
                          ? bidData[step.dateKey]
                          : step.value !== null && step.value !== false
                          ? typeof step.value === 'boolean'
                            ? 'Done'
                            : step.value
                          : 'Pending'}
                      </span>
                      {step.editable && (
                        <button
                          onClick={() => handleEditClick(step.key)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✎
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BidProgressTracker;