// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import img from '../../images/add.png';
import CountCard from '../MainDashboard/OppDetailsCard';
import CountCard1 from '../MainDashboard/sidecard';
import CountCard2 from '../MainDashboard/sidecard1';
import CountCard3 from '../MainDashboard/sidecard2';

import { BASE_URL } from '../../components/constants';
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



  useEffect(() => {
      fetchOpportunityData(id);
      fetchSubmittedData(id);
      fetchSubmittedData_gonogo(id);
      fetchSubmittedData_deal_status(id);
  }, [id]);
  
  const fetchOpportunityData = (id) => {
    fetch(`${BASE_URL}/api/opportunities/${id}`)
      .then(response => response.json())
      .then(data => setOpportunity(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const fetchSubmittedData = (id) => {
    axios.get(`${BASE_URL}/api/plans?form_id=${id}`)
      .then(response => setSubmittedData(response.data))
      .catch(error => console.error('Error fetching submitted data:', error));
  };

  const fetchSubmittedData_gonogo = (id, dateTime, Status_) => {
    const updateData = {
        ...opportunity,
        go_no_go_date: dateTime,
        go_no_go_status: Status_
    }
    console.log(updateData);
    axios.put(`${BASE_URL}/api/opportunities/${id}`, updateData)
          .then(updateResponse => {
            console.log('Opportunity updated successfully:', updateResponse.data);
            fetchOpportunityData(id);
          })
          .catch(updateError => {
            console.error('Error updating opportunity:', updateError);
          });


    axios.get(`${BASE_URL}/api/gonogostatus?form_id=${id}`)
      .then(response => setSubmittedData1(response.data))
      .catch(error => console.error('Error fetching submitted data:', error));


  };

  const fetchSubmittedData_deal_status = (id, deal_status, additional_remarks_, amount_inr_cr_max) => {
    const updateData = {
      ...opportunity,
      amount_inr_cr_max: parseFloat(amount_inr_cr_max),
      deal_status: deal_status,
      additional_remarks: additional_remarks_,
  };
  
    console.log("---------")
    console.log(updateData)
    axios.put(`${BASE_URL}/api/opportunities/${id}`, updateData)
          .then(updateResponse => {
            console.log('Opportunity updated successfully:', updateResponse.data);
            fetchOpportunityData(id);
          })
          .catch(updateError => {
            console.error('Error updating opportunity:', updateError);
          });


    axios.get(`${BASE_URL}/api/deal-status?form_id=${id}`)
      .then(response => setSubmittedData2(response.data))
      .catch(error => console.error('Error fetching submitted data:', error));


  };

  
  if (!opportunity) {
    return <div>Loading...</div>;
  }

  const basicInfoDetails = [
    { label: 'Opportunity', value: opportunity.opportunity },

    { label: 'Opportunity ID', value: opportunity.id },
    { label: 'Priority Bid', value: opportunity.priority_bid },
    { label: 'OB FY', value: opportunity.ob_fy },
    { label: 'OB Quarter', value: opportunity.ob_qtr },
    { label: 'OB MMM', value: opportunity.ob_mmm },
    { label: 'Priority', value: opportunity.priority },
    { label: 'Opportunity Type', value: opportunity.opportunity_type },
    { label: 'Amount INR (Cr) Max', value: opportunity.amount_inr_cr_max },
    { label: 'Amount INR (Cr) Min', value: opportunity.amount_inr_cr_min },
    { label: 'Revenue in OB Quarter', value: opportunity.rev_in_ob_qtr },
    { label: 'Revenue in OB Quarter +1', value: opportunity.rev_in_ob_qtr_plus_1 },
    { label: 'Business Unit', value: opportunity.business_unit },
    { label: 'Industry Segment', value: opportunity.industry_segment },
    { label: 'Primary Offering Segment', value: opportunity.primary_offering_segment },
    { label: 'Secondary Offering Segment', value: opportunity.secondary_offering_segment },
    { label: 'Part Quarter', value: opportunity.part_quarter },
    { label: 'Part Month', value: opportunity.part_month },
    { label: 'Project Tenure (Months)', value: opportunity.project_tenure_months },
    { label: 'Estimated CAPEX INR (Cr)', value: opportunity.est_capex_inr_cr },
    { label: 'Estimated OPEX INR (Cr)', value: opportunity.est_opex_inr_cr },
    { label: 'OPEX Tenure (Months)', value: opportunity.opex_tenure_months },
    { label: 'Deal Status', value: opportunity.deal_status },
    { label: 'Go/No Go Status', value: opportunity.go_no_go_status },
    { label: 'Go/No Go Date', value: opportunity.go_no_go_date },
    { label: 'Solution Readiness', value: opportunity.solution_readiness },
    { label: 'Customer Alignment', value: opportunity.customer_alignment },
    { label: 'STL Preparedness', value: opportunity.stl_preparedness },
    { label: 'Readiness as per Timeline', value: opportunity.readiness_as_per_timeline },
    { label: 'GM Percentage', value: opportunity.gm_percentage },
    { label: 'Probability', value: opportunity.probability },
    { label: 'Sales Role', value: opportunity.sales_role },
    { label: 'Primary Owner', value: opportunity.primary_owner },
    { label: 'Leader for Aircover', value: opportunity.leader_for_aircover },
    { label: 'Source', value: opportunity.source },
    { label: 'Source Person', value: opportunity.source_person },
    { label: 'Lead Received Date', value: opportunity.lead_received_date },
    { label: 'Release Date', value: opportunity.release_date },
    { label: 'Submission Date', value: opportunity.submission_date },
    { label: 'Decision Date', value: opportunity.decision_date },
    { label: 'Additional Remarks', value: opportunity.additional_remarks },
    { label: 'Tender No', value: opportunity.tender_no },
    { label: 'Scope of Work', value: opportunity.scope_of_work },
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
    fetchSubmittedData_gonogo(opportunity.id, dateTime, Status_); // Refresh submitted data after form submission
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

  return (
    <div className='main1'>
      <div className='left1'>
        <CountCard 
          title={opportunity.opportunity}
          baseColor="#FFDE95"
          details={basicInfoDetails} />
      </div>
      <div className='right1'>
      <div className="follow-ups-header">
        <h2>Follow Ups</h2>
      </div>
        <button className='add-button_1' onClick={() => setPopupVisible(!isPopupVisible)}>
          <img src={img} alt="Add Info" />
        </button>
        {isPopupVisible && (
          <div className='popup'>
            <div className='popup-option' onClick={() => handleOptionClick('PlanActions')}>Add plan & Actions</div>
            <div className='popup-option' onClick={() => handleOptionClick('GoNoGoStatus')}>Go-no-go status update</div>
            <div className='popup-option' onClick={() => handleOptionClick('DealStatusUpdate')}>Deal Status Update</div>
          </div>
        )}

        <PlanActionsForm 
          show={activeForm === 'PlanActions'} 
          handleClose={handleFormSubmission} 
          form_id={opportunity.id} 
        />
        <GoNoGoStatusForm show={activeForm === 'GoNoGoStatus'} 
            handleClose={handleFormSubmission1}
            form_id={opportunity.id} />

        <DealStatusUpdateForm show={activeForm === 'DealStatusUpdate'}
            handleClose={handleFormSubmission2}
            form_id={opportunity.id}
         />
      {allSubmittedData.length === 0 && (
  <div className="no-follow-ups">No follow-ups yet</div>
)}
{allSubmittedData.map((data, index) => {
  if (data.status !== undefined && data.deal_status !== undefined) {
    // DealStatusUpdate data
    return (
      <div key={index} className="submitted-card">
      <CountCard3
        title={data.deal_status}
        baseColor="#FFDE95"
        details={[
          { label: 'Remarks', value: data.status },
          { label: 'Deal Status', value: data.deal_status },
          { label: 'Created By', value: data.created_by },
          { label: 'Created At', value: data.created_at },
        ]}
      />
    </div>
     
    );
  } else if (data.status !== undefined) {
    return (
      <div key={index} className="submitted-card">
        <CountCard2
          title={data.status}
          baseColor="#FFDE95"
          details={[
            { label: 'Status', value: data.status },
            { label: 'Date', value: data.date },
            { label: 'Created By', value: data.created_by },
            { label: 'Created At', value: data.created_at },
          ]}
        />
      </div>
    );
  } else {
    // PlanActions data
    return (
      <div key={index} className="submitted-card">
        <CountCard1
          title={data.plan}
          baseColor="#FFDE95"
          box_id={data.id}
          handleUpdate={handleFormSubmission}
          details={[
            { label: 'Week', value: data.week },
            { label: 'Date', value: data.date },
            { label: 'Action', value: data.action },
            { label: 'Plan', value: data.plan },
            { label: 'Created At', value: data.created_at },
          ]}
        />
      </div>
    );
  }
})}
      </div>
    </div>
  );
};

export default OpportunityDetails;
