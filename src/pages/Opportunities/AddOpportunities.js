import axios from 'axios';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../components/constants';
import '../../styles/Opportunities.css'; // Import the CSS file for styling
const AddOpportunities = () => {
  const [formData, setFormData] = useState({
    priority_bid: '',
    ob_fy: '',
    ob_qtr: '',
    ob_mmm: '',
    priority: '',
    opportunity: '',
    opportunity_type: '',
    amount_inr_cr_max: '',
    amount_inr_cr_min: '',
    rev_in_ob_qtr: '',
    rev_in_ob_qtr_plus_1: '',
    business_unit: '',
    industry_segment: '',
    primary_offering_segment: '',
    secondary_offering_segment: '',
    part_quarter: '',
    part_month: '',
    project_tenure_months: '',
    est_capex_inr_cr: '',
    est_opex_inr_cr: '',
    opex_tenure_months: '',
    deal_status: '',
    go_no_go_status: '',
    go_no_go_date: '',
    solution_readiness: '',
    customer_alignment: '',
    stl_preparedness: '',
    readiness_as_per_timeline: '',
    gm_percentage: '',
    probability: '',
    sales_role: '',
    primary_owner: '',
    leader_for_aircover: '',
    source: '',
    source_person: '',
    lead_received_date: '',
    release_date: '',
    submission_date: '',
    decision_date: '',
    additional_remarks: '',
    tender_no: '',
    scope_of_work: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
    // navigate("/userslist");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setFormData({
        priority_bid: '',
        ob_fy: '',
        ob_qtr: '',
        ob_mmm: '',
        priority: '',
        opportunity: '',
        opportunity_type: '',
        amount_inr_cr_max: '',
        amount_inr_cr_min: '',
        rev_in_ob_qtr: '',
        rev_in_ob_qtr_plus_1: '',
        business_unit: '',
        industry_segment: '',
        primary_offering_segment: '',
        secondary_offering_segment: '',
        part_quarter: '',
        part_month: '',
        project_tenure_months: '',
        est_capex_inr_cr: '',
        est_opex_inr_cr: '',
        opex_tenure_months: '',
        deal_status: '',
        go_no_go_status: '',
        go_no_go_date: '',
        solution_readiness: '',
        customer_alignment: '',
        stl_preparedness: '',
        readiness_as_per_timeline: '',
        gm_percentage: '',
        probability: '',
        sales_role: '',
        primary_owner: '',
        leader_for_aircover: '',
        source: '',
        source_person: '',
        lead_received_date: '',
        release_date: '',
        submission_date: '',
        decision_date: '',
        additional_remarks: '',
        tender_no: '',
        scope_of_work: '',
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
      amount_inr_cr_max: parseFloat(formData.amount_inr_cr_max),
      amount_inr_cr_min: parseFloat(formData.amount_inr_cr_min),
      est_capex_inr_cr: parseFloat(formData.est_capex_inr_cr),
      est_opex_inr_cr: parseFloat(formData.est_opex_inr_cr),
      gm_percentage: parseFloat(formData.gm_percentage),
      probability: parseFloat(formData.probability),
    };
    try {
        console.log(postData);
      const response = await axios.post(`${BASE_URL}/api/opportunities`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201 || response.status === 200) {
        toast.success('Entry created successfully.');
        handleClose();
      } else {
        toast.error('Failed to create entry.');
      }
    } catch (err) {
      toast.error('Failed to create entry.');
      console.error(err);
    }
  };

  return (
    <>
    <ToastContainer/>
        <div className="form-top">
            <h2 className="text-left m-1" style={{ color: "black" }}>
                <b>Add Opportunity</b>
            </h2>
            {/* <Link className="btn btn-danger btn-back mx-2 " to="/opportunitieslist">
                Back
            </Link> */}
        </div>
        <div style={{ width: "100%", padding: "1rem 2rem" }}>
            <div
                className="col-md-9 border rounded shadow"
                style={{
                    backgroundColor: "gainsboro",
                    width: "100%",
                    padding: "1rem",
                }}
            >
                <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
                    <div className="row">
                        <fieldset className="col form-part">
                            <legend>Basic Info</legend>
                            <div className="form-group small">
                                <label htmlFor="ob_fy">OB FY</label>
                                <select
                                    id="ob_fy"
                                    name="ob_fy"
                                    value={formData.ob_fy}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="FY24">2024</option>
                                    <option value="FY25">2025</option>
                                    <option value="FY26">2026</option>
                                </select>
                            </div>
                            <div className="form-group small">
                                <label htmlFor="ob_qtr">OB Qtr</label>
                                <select
                                    id="ob_qtr"
                                    name="ob_qtr"
                                    value={formData.ob_qtr}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Q1">Q1</option>
                                    <option value="Q2">Q2</option>
                                    <option value="Q3">Q3</option>
                                    <option value="Q4">Q4</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ob_mmm">OB MMM</label>
                                <select
                                    id="ob_mmm"
                                    name="ob_mmm"
                                    value={formData.ob_mmm}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="priority">Priority</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Commit">Commit</option>
                                    <option value="TBD">TBD</option>
                                    <option value="Upside">Upside</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="priority">Opportunity</label>
                                <input
                                    type="text"
                                    id="opportunity"
                                    name="opportunity"
                                    value={formData.opportunity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group small">
                                <label htmlFor="business_unit">Business Unit</label>
                                <select
                                    id="business_unit"
                                    name="business_unit"
                                    value={formData.business_unit}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="GSB">GSB</option>
                                    <option value="Digital">Digital</option>
                                    
                                </select>
                            </div>
                            <div className="form-group small">
                                <label htmlFor="industry_segment">Industry Segment</label>
                                <select
                                    id="industry_segment"
                                    name="industry_segment"
                                    value={formData.industry_segment}
                                    onChange={handleChange}
                                    required
                                >
                                   <option value="Public Sector">Public Sector</option>
              <option value="Bharatnet/CN">Bharatnet/CN</option>
              <option value="Defense">Defense</option>
              <option value="Telecom">Telecom</option>
              <option value="Mining & Energy">Mining & Energy</option>
              <option value="GCC">GCC</option>
                                </select>
                            </div>
                        </fieldset>
                    </div>

                    <div className="row">
                        <fieldset className="col form-part">
                            <legend>Financial Info</legend>
                            <div className="form-group">
                                <label htmlFor="amount_inr_cr_max">Amount INR Cr Max</label>
                                <input
                                    type="number"
                                    id="amount_inr_cr_max"
                                    name="amount_inr_cr_max"
                                    value={formData.amount_inr_cr_max}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount_inr_cr_min">Amount INR Cr Min</label>
                                <input
                                    type="number"
                                    id="amount_inr_cr_min"
                                    name="amount_inr_cr_min"
                                    value={formData.amount_inr_cr_min}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="est_capex_inr_cr">Est. Capex INR Cr</label>
                                <input
                                    type="number"
                                    id="est_capex_inr_cr"
                                    name="est_capex_inr_cr"
                                    value={formData.est_capex_inr_cr}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="est_opex_inr_cr">Est. Opex INR Cr</label>
                                <input
                                    type="number"
                                    id="est_opex_inr_cr"
                                    name="est_opex_inr_cr"
                                    value={formData.est_opex_inr_cr}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className="row">
                        <fieldset className="col form-part">
                            <legend>Status Info</legend>
                            <div className="form-group">
                                <label htmlFor="gm_percentage">Deal Status</label>
                                <select
                                    type="text"
                                    id="deal_status"
                                    name="deal_status"
                                    value={formData.deal_status}
                                    onChange={handleChange}
                                    required
                                >
                                 <option value="Identified">Identified</option>
                                <option value="Qualified">Qualified</option>
                                <option value="No-Go">No-Go</option>
                                <option value="Work in Progress">Work in Progress</option>
                                <option value="Bid Submitted">Bid Submitted</option>
                                <option value="Won">Won</option>
                                <option value="Bid Dropped">Bid Dropped</option>
                                <option value="Lost">Lost</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="go_no_go_status">Go/No Go Status</label>
                                <select
                                    id="go_no_go_status"
                                    name="go_no_go_status"
                                    value={formData.go_no_go_status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Go/No Go Status</option>
                                    <option value="Done">Done</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="go_no_go_date">Go/No Go Date</label>
                                <input
                                    type="date"
                                    id="go_no_go_date"
                                    name="go_no_go_date"
                                    value={formData.go_no_go_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gm_percentage">GM Percentage</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="gm_percentage"
                                    name="gm_percentage"
                                    value={formData.gm_percentage}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="probability">Probability</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="probability"
                                    name="probability"
                                    value={formData.probability}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className="row">
                        <fieldset className="col form-part">
                            <legend>Contact Info</legend>
                            <div className="form-group">
                                <label htmlFor="sales_role">Sales Role</label>
                                <input
                                    type="text"
                                    id="sales_role"
                                    name="sales_role"
                                    value={formData.sales_role}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="primary_owner">Primary Owner</label>
                                <input
                                    type="text"
                                    id="primary_owner"
                                    name="primary_owner"
                                    value={formData.primary_owner}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="source">Source</label>
                                <input
                                    type="text"
                                    id="source"
                                    name="source"
                                    value={formData.source}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="source_person">Source Person</label>
                                <input
                                    type="text"
                                    id="source_person"
                                    name="source_person"
                                    value={formData.source_person}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className="row">
                        <fieldset className="col form-part">
                            <legend>Date Info</legend>
                            <div className="form-group">
                                <label htmlFor="lead_received_date">Lead Received Date</label>
                                <input
                                    type="date"
                                    id="lead_received_date"
                                    name="lead_received_date"
                                    value={formData.lead_received_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="release_date">Release Date</label>
                                <input
                                    type="date"
                                    id="release_date"
                                    name="release_date"
                                    value={formData.release_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="submission_date">Submission Date</label>
                                <input
                                    type="date"
                                    id="submission_date"
                                    name="submission_date"
                                    value={formData.submission_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="decision_date">Decision Date</label>
                                <input
                                    type="date"
                                    id="decision_date"
                                    name="decision_date"
                                    value={formData.decision_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className="row">
                        <fieldset className="col form-part">
                            <legend>Remarks</legend>
                            <div className="form-group full-width">
                                <label htmlFor="additional_remarks">Additional Remarks</label>
                                <textarea
                                    id="additional_remarks"
                                    name="additional_remarks"
                                    value={formData.additional_remarks}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </fieldset>
                    </div>

                    <div className="row">
                        <div className="col">
                            <button type="submit" className="btn btn-success submit-btn">
                                <b>Submit</b>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="modal-style">
                    <Modal.Title>Submission Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-style">
                    <p>Your opportunity has been successfully added.</p>
                </Modal.Body>
                <Modal.Footer className="modal-style">
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </>
);
};

export default AddOpportunities;