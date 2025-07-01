// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../components/constants';
import img from '../../images/add.png';
import CountCard from '../MainDashboard/OppDetailsCard';
import CountCard1 from '../MainDashboard/sidecard';
import CountCard2 from '../MainDashboard/sidecard1';
import CountCard3 from '../MainDashboard/sidecard2';
import BidProgressTracker from './BidProgressTracker';
import DealStatusUpdateForm from './DealStatusUpdateForm';
import GoNoGoStatusForm from './GoNoGoStatusForm';
import './OpportunityDetails.css'; // Ensure this path is correct
import PlanActionsForm from './PlanActionsForm';
import './modal.css';

const OpportunityDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [submittedData1, setSubmittedData1] = useState([]);
  const [submittedData2, setSubmittedData2] = useState([]);
  const [goNoGoStatusflag, setGoNoGoStatusflag] = useState('none');

  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve permissions from localStorage when the component mounts
    const storedPermissions = localStorage.getItem('auth') || [];
    setPermissions(storedPermissions);
  }, []);
  const hasPermission = permissions.includes('ADMIN') || permissions.includes('EDIT');


  useEffect(() => {
      fetchOpportunityData(id);
      fetchSubmittedData(id);
      fetchSubmittedData_gonogo(id);
      fetchSubmittedData_deal_status(id);
      fetchSubmittedData_gonogoflag(id);
  }, [id]);
  const token = localStorage.getItem('token');
  const fetchOpportunityData = (id) => {
    fetch(`${BASE_URL}/api/leads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setOpportunity(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const [goNoGoStatus, setGoNoGoStatus] = useState(null);

  const fetchSubmittedData_gonogoflag = (id) => {
    axios.get(`${BASE_URL}/api/approval-requests/check-action/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Go/No-Go status fetched successfully:', response.data);
        setGoNoGoStatusflag(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error('Error fetching go/no-go status:', error.response.data);
          if (error.response.status === 404) {
            alert('No go/no-go status found for this opportunity.');
          } else if (error.response.status === 401) {
            alert('Session expired. Please log in again.');
          } else if (error.response.status === 403) {
            alert('You do not have permission to view this data.');
          } else {
            alert('Error fetching go/no-go status. Please try again later.');
          }
        } else {
          console.error('Network or server error:', error);
          alert('Network error. Please check your connection and try again.');
        }
      });
  };
  
  

  const fetchSubmittedData = (id) => {
    axios.get(`${BASE_URL}/api/plans?form_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setSubmittedData(response.data))
      .catch(error => console.error('Error fetching submitted data:', error));
  };

  const fetchSubmittedData_gonogo = (id, dateTime, Status_) => {
    fetchSubmittedData_gonogoflag(id);
    // Always fetch the latest go/no-go status
    axios.get(`${BASE_URL}/api/approval-requests/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Go/No-Go status fetched successfully:', response.data);
        setSubmittedData1(response.data);
      })
      .catch(error => {
        console.error('Error fetching go/no-go status:', error);
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
          
          if (error.response.status === 403) {
            console.error('Permission denied. You may not have the necessary rights to view this data.');
            // You might want to show a user-friendly message here
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        // You might want to show an error message to the user here
      });
  };

  const fetchSubmittedData_deal_status = (id, deal_status, additional_remarks_, amount_inr_cr_max) => {
    // Check for null or undefined id
    if (!id) {
      console.error('Error: Missing id for fetchSubmittedData_deal_status');
      return; // Exit the function early
    }
  
    // Initialize updateData and hasChanges flag
    let updateData = {};
    let hasChanges = false;
  
    // Check and add amount_inr_cr_max if it's changed
    if (amount_inr_cr_max !== undefined && amount_inr_cr_max !== null) {
      const parsedAmount = parseFloat(amount_inr_cr_max);
      if (!isNaN(parsedAmount) && parsedAmount !== opportunity.amount_inr_cr_max) {
        updateData.amount_inr_cr_max = parsedAmount;
        hasChanges = true;
      }
    }
  
    // Check and add deal_status if it's changed
    if (deal_status !== undefined && deal_status !== null && deal_status !== opportunity.deal_status) {
      updateData.deal_status = deal_status;
      hasChanges = true;
    }
  
    // Check and add additional_remarks if it's changed
    if (additional_remarks_ !== undefined && additional_remarks_ !== null && additional_remarks_ !== opportunity.additional_remarks) {
      updateData.additional_remarks = additional_remarks_;
      hasChanges = true;
    }
  
    // Only make the PUT call if there are changes
    if (hasChanges) {
      console.log("Updating with data:", updateData);
  
      axios.put(`${BASE_URL}/api/leads/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(updateResponse => {
          console.log('Opportunity updated successfully:', updateResponse.data);
          fetchOpportunityData(id);
        })
        .catch(updateError => {
          console.error('Error updating opportunity:', updateError);
          if (updateError.response) {
            console.error('Error status:', updateError.response.status);
            console.error('Error data:', updateError.response.data);
            
            if (updateError.response.status === 403) {
              console.error('Permission denied. You may not have the necessary rights to perform this action.');
              // You might want to show a user-friendly message here
            }
          } else if (updateError.request) {
            console.error('No response received:', updateError.request);
          } else {
            console.error('Error message:', updateError.message);
          }
          // You might want to show an error message to the user here
        });
    } else {
      console.log('No changes detected. Skipping update.');
    }
  
    // Always fetch the latest deal status data
    axios.get(`${BASE_URL}/api/deal-status?form_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Deal status fetched successfully:', response.data);
        setSubmittedData2(response.data);
      })
      .catch(error => {
        console.error('Error fetching deal status:', error);
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
          
          if (error.response.status === 403) {
            console.error('Permission denied. You may not have the necessary rights to view this data.');
            // You might want to show a user-friendly message here
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        // You might want to show an error message to the user here
      });
  };

  
  if (!opportunity) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A';
  
  const basicInfoDetails = [
    { label: 'Opportunity', value: opportunity.opportunityName },
    { label: 'Opportunity ID', value: opportunity.id },
    { label: 'Part FY', value: opportunity.partFy?.obFy },
    { label: 'Part Quarter', value: opportunity.partQuarter },
    { label: 'Part Month', value: opportunity.partMonth || 'N/A' },
    { label: 'OB FY', value: opportunity.obFy?.obFy },
    { label: 'OB Quarter', value: opportunity.obQtr },
    { label: 'OB MMM', value: opportunity.obMmm },
    { label: 'Priority', value: opportunity.priority?.priority },
    { label: 'Amount INR (Cr)', value: opportunity.amount },
    { label: 'Deal Status', value: opportunity.dealStatus?.dealStatus },
    { label: 'Industry Segment', value: opportunity.industrySegment?.name },
    { label: 'Public/Private', value: opportunity.publicPrivate || 'N/A' },
    { label: 'Primary Offering Segment', value: opportunity.primaryOfferingSegment || 'N/A' },
    { label: 'Secondary Offering Segment', value: opportunity.secondaryOfferingSegment || 'N/A' },
    { label: 'Project Tenure (Months)', value: opportunity.projectTenureMonths || 'N/A' },
    { label: 'Estimated CAPEX INR (Cr)', value: opportunity.estCapexInrCr || 'N/A' },
    { label: 'Estimated OPEX INR (Cr)', value: opportunity.estOpexInrCr || 'N/A' },
    { label: 'OPEX Tenure (Months)', value: opportunity.opexTenureMonths || 'N/A' },
    { label: 'Go/No Go Status', value: opportunity.goNoGoMaster?.goNogoStatus || 'N/A' },
    { label: 'Go/No Go Date', value: formatDate(opportunity.goNoGoDate) },
    { label: 'GM Percentage', value: opportunity.gmPercentage || 'N/A' },
    { label: 'Probability', value: opportunity.probability || 'N/A' },
    { label: 'Primary Owner', value: opportunity.primaryOwner },
    { label: 'Solution SPOC', value: opportunity.solutionSpoc || 'N/A' },
    { label: 'SCM SPOC', value: opportunity.scmSpoc || 'N/A' },
    { label: 'Remarks', value: opportunity.remarks || 'N/A' },
    { label: 'PQ/TQ remarks', value: opportunity.pqTq_remarks || 'N/A' },

    { label: 'RFP Release Date', value: formatDate(opportunity.rfpReleaseDate) },
    { label: 'Bid Submission Date', value: formatDate(opportunity.bidSubmissionDate) },
    {
      label: 'Created By',
      value: `${opportunity.createdBy?.firstName || ''} ${opportunity.createdBy?.lastName || ''}`.trim()
    },
    { label: 'Created Date', value: formatDate(opportunity.createdDate) }
  ];
  
  const handleOptionClick = (option) => {
    setActiveForm(option);
    setPopupVisible(false); // Hide the options popup
  };

  const handleFormSubmission = () => {
    fetchSubmittedData(opportunity.id); // Refresh submitted data after form submission
    setActiveForm(null); // Close the form modal
  };
  const handleFormSubmission1 = (dateTime, Status_) => {
    fetchSubmittedData_gonogo(opportunity.id); // Refresh submitted data after form submission
    setActiveForm(null);
  };
  const handleFormSubmission2 = (deal_status, additional_remarks_, amount_inr_cr_max) => {
    fetchSubmittedData_deal_status(opportunity.id, deal_status, additional_remarks_, amount_inr_cr_max); // Refresh submitted data after form submission
    setActiveForm(null);
  };
  const allSubmittedData = [
    ...submittedData,
    ...submittedData1,
    ...submittedData2,
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const handleEditClick = () => {
    navigate(`/updateOpportunity/${opportunity.id}`);
  };

  return (
    <>
     <div className='main2'>
        <BidProgressTracker leadId={id} />

    </div>
    <div className="main1">
      <div className="left1">
        <div className="button-container">
          <button className="edit-button" onClick={handleEditClick}>
            Edit Opportunity
          </button>
        </div>
        <CountCard
          title={opportunity.opportunityName}
          baseColor="#FFDE95"
          details={basicInfoDetails}
        />
      </div>
      <div className="right1">
        <div className="follow-ups-header">
          <h2>Follow Ups</h2>
        </div>
        <button
          className="add-button_1"
          disabled={!hasPermission}
          onClick={() => setPopupVisible(!isPopupVisible)}
        >
          <img src={img} alt="Add Info" />
        </button>
        {isPopupVisible && (
          <div className="popup">
            <div className="popup-option" onClick={() => handleOptionClick("PlanActions")}>
              Add plan & Actions
            </div>
            {/* <div
              className={`popup-option ${
                goNoGoStatusflag === "no" || goNoGoStatusflag === "yes" ? "disabled" : ""
              }`}
              onClick={() =>
                goNoGoStatusflag !== "yes" &&
                goNoGoStatusflag !== "no" &&
                handleOptionClick("GoNoGoStatus")
              }
            >
              {goNoGoStatusflag === "no"
                ? "Go-no-go status : update (Pending)"
                : goNoGoStatusflag === "yes"
                ? "Go-no-go status : Done"
                : "Go-no-go status : init"}
            </div>
            <div className="popup-option" onClick={() => handleOptionClick("DealStatusUpdate")}>
              Deal Status Update
            </div> */}
          </div>
        )}
  
        <PlanActionsForm
          show={activeForm === "PlanActions"}
          handleClose={handleFormSubmission}
          form_id={opportunity.id}
        />
        <GoNoGoStatusForm
          show={activeForm === "GoNoGoStatus"}
          handleClose={handleFormSubmission1}
          form_id={opportunity.id}
          primary_owner={opportunity.primary_owner}
        />
        <DealStatusUpdateForm
          show={activeForm === "DealStatusUpdate"}
          handleClose={handleFormSubmission2}
          form_id={opportunity.id}
          partMonth={opportunity.partMonth}
        />
  
        {allSubmittedData.length === 0 && (
          <div className="no-follow-ups">No follow-ups yet</div>
        )}
        {allSubmittedData.map((data, index) => {
          if (data && data.length !== 0) {
            if (data.dealStatus?.dealStatus !== undefined) {
              return (
                <div key={index} className="submitted-card">
                  <CountCard3
                    title={data.dealStatus.dealStatus}
                    baseColor="#FFDE95"
                    details={[
                      { label: "Deal Status", value: data.dealStatus.dealStatus },
                      { label: "Created At", value: data.created_at },
                    ]}
                  />
                </div>
              );
            } else if (data.notificationId !== undefined) {
              return (
                <div key={index} className="submitted-card">
                  <CountCard2
                    title={
                      data.userName +
                      (data.action === null
                        ? " : Pending"
                        : data.action === false
                        ? " : Rejected"
                        : " : Approved")
                    }
                    baseColor="#FFDE95"
                    details={[
                      { label: "Remarks", value: data.remarks },
                      {
                        label: "Action",
                        value:
                          data.action === null
                            ? "Pending"
                            : data.action === false
                            ? "Rejected"
                            : "Approved",
                      },
                      { label: "Pending by", value: data.userName },
                      { label: "Created At", value: data.createdAt },
                    ]}
                  />
                </div>
              );
            } else {
              return (
                <div key={index} className="submitted-card">
                  <CountCard1
  title={data.plan}
  baseColor="#FFDE95"
  box_id={data.id}
  handleUpdate={handleFormSubmission}
  details={[
    { label: "Week", value: data.week },
    { label: "Date", value: new Date(data.date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }) },
    { label: "Action", value: data.action },
    { label: "Plan", value: data.plan },
    { label: "Created At", value: new Date(data.created_at).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }) },
  ]}
/>

                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
   
    </>
  );
};

export default OpportunityDetails;