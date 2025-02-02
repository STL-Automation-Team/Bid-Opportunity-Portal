import axios from 'axios';
import { default as React, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateOpportunity = () => {
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
          ob_fy: parseInt(formData.ob_fy, 10),
          amount_inr_cr_max: parseFloat(formData.amount_inr_cr_max),
          amount_inr_cr_min: parseFloat(formData.amount_inr_cr_min),
          est_capex_inr_cr: parseFloat(formData.est_capex_inr_cr),
          est_opex_inr_cr: parseFloat(formData.est_opex_inr_cr),
          gm_percentage: parseFloat(formData.gm_percentage),
          probability: parseFloat(formData.probability),
        };
        try {
            console.log(postData);
          const response = await axios.post('http://localhost:8080/api/opportunities', postData, {
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
    
    <><ToastContainer /><Card style={{ width: '100%', height: '100%', margin: '1rem', maxWidth: '98%' }}>
          <Card.Body>
              <Form onSubmit={handleSubmit}>
                  <fieldset>
                      <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Basic Info</legend>
                      <Row className="mb-2">
                          <Form.Group as={Col} controlId="ob_fy">
                              <Form.Label className="text-start">OB FY</Form.Label>
                              <Form.Control as="select" name="ob_fy" value={formData.ob_fy} onChange={handleChange} required>
                                  <option value="FY24">2024</option>
                                  <option value="FY25">2025</option>
                                  <option value="FY26">2026</option>
                              </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} controlId="ob_qtr">
                              <Form.Label className="text-start">OB Qtr</Form.Label>
                              <Form.Control as="select" name="ob_qtr" value={formData.ob_qtr} onChange={handleChange} required>
                                  <option value="Q1">Q1</option>
                                  <option value="Q2">Q2</option>
                                  <option value="Q3">Q3</option>
                                  <option value="Q4">Q4</option>
                              </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} controlId="ob_mmm">
                              <Form.Label className="text-start">OB MMM</Form.Label>
                              <Form.Control as="select" name="ob_mmm" value={formData.ob_mmm} onChange={handleChange} required>
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
                              </Form.Control>
                          </Form.Group>
                      </Row>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="priority">
                              <Form.Label className="text-start">Priority</Form.Label>
                              <Form.Control as="select" name="priority" value={formData.priority} onChange={handleChange} required>
                                  <option value="Commit">Commit</option>
                                  <option value="TBD">TBD</option>
                                  <option value="Upside">Upside</option>
                              </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} controlId="business_unit">
                              <Form.Label className="text-start">Business Unit</Form.Label>
                              <Form.Control as="select" name="business_unit" value={formData.business_unit} onChange={handleChange} required>
                                  <option value="GSB">GSB</option>
                                  <option value="Digital">Digital</option>
                              </Form.Control>
                          </Form.Group>
                          <Form.Group as={Col} controlId="industry_segment">
                              <Form.Label className="text-start">Industry Segment</Form.Label>
                              <Form.Control as="select" name="industry_segment" value={formData.industry_segment} onChange={handleChange} required>
                                  <option value="Public Sector">Public Sector</option>
                                  <option value="Bharatnet/CN">Bharatnet/CN</option>
                                  <option value="Defense">Defense</option>
                                  <option value="Telecom">Telecom</option>
                                  <option value="Mining & Energy">Mining & Energy</option>
                                  <option value="GCC">GCC</option>
                              </Form.Control>
                          </Form.Group>
                      </Row>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="opportunity">
                              <Form.Label className="text-start">Opportunity</Form.Label>
                              <Form.Control type="text" name="opportunity" value={formData.opportunity} onChange={handleChange} required />
                          </Form.Group>
                      </Row>
                  </fieldset>

                  <fieldset>
                      <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Financial Info</legend>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="amount_inr_cr_max">
                              <Form.Label className="text-start">Amount INR Cr Max</Form.Label>
                              <Form.Control type="number" name="amount_inr_cr_max" value={formData.amount_inr_cr_max} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="amount_inr_cr_min">
                              <Form.Label className="text-start">Amount INR Cr Min</Form.Label>
                              <Form.Control type="number" name="amount_inr_cr_min" value={formData.amount_inr_cr_min} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="est_capex_inr_cr">
                              <Form.Label className="text-start">Est. Capex INR Cr</Form.Label>
                              <Form.Control type="number" name="est_capex_inr_cr" value={formData.est_capex_inr_cr} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="est_opex_inr_cr">
                              <Form.Label className="text-start">Est. Opex INR Cr</Form.Label>
                              <Form.Control type="number" name="est_opex_inr_cr" value={formData.est_opex_inr_cr} onChange={handleChange} required />
                          </Form.Group>
                      </Row>
                  </fieldset>

                  <fieldset>
                      <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Status Info</legend>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="deal_status">
                              <Form.Label className="text-start">Deal Status</Form.Label>
                              <Form.Control as="select" name="deal_status" value={formData.deal_status} onChange={handleChange} required>
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
                          <Form.Group as={Col} controlId="go_no_go_status">
                              <Form.Label className="text-start">Go/No Go Status</Form.Label>
                              <Form.Control as="select" name="go_no_go_status" value={formData.go_no_go_status} onChange={handleChange} required>
                                  <option value="">Select Go/No Go Status</option>
                                  <option value="Done">Done</option>
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Pending">Pending</option>
                              </Form.Control>
                          </Form.Group>
                      </Row>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="go_no_go_date">
                              <Form.Label className="text-start">Go/No Go Date</Form.Label>
                              <Form.Control type="date" name="go_no_go_date" value={formData.go_no_go_date} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="gm_percentage">
                              <Form.Label className="text-start">GM Percentage</Form.Label>
                              <Form.Control type="number" step="0.01" name="gm_percentage" value={formData.gm_percentage} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="probability">
                              <Form.Label className="text-start">Probability</Form.Label>
                              <Form.Control type="number" step="0.01" name="probability" value={formData.probability} onChange={handleChange} required />
                          </Form.Group>
                      </Row>
                  </fieldset>

                  <fieldset>
                      <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Contact Info</legend>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="sales_role">
                              <Form.Label className="text-start">Sales Role</Form.Label>
                              <Form.Control type="text" name="sales_role" value={formData.sales_role} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="primary_owner">
                              <Form.Label className="text-start">Primary Owner</Form.Label>
                              <Form.Control type="text" name="primary_owner" value={formData.primary_owner} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="source">
                              <Form.Label className="text-start">Source</Form.Label>
                              <Form.Control type="text" name="source" value={formData.source} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="source_person">
                              <Form.Label className="text-start">Source Person</Form.Label>
                              <Form.Control type="text" name="source_person" value={formData.source_person} onChange={handleChange} required />
                          </Form.Group>
                      </Row>
                  </fieldset>

                  <fieldset>
                      <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Date Info</legend>
                      <Row className="mb-1">
                          <Form.Group as={Col} controlId="lead_received_date">
                              <Form.Label className="text-start">Lead Received Date</Form.Label>
                              <Form.Control type="date" name="lead_received_date" value={formData.lead_received_date} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="release_date">
                              <Form.Label className="text-start">Release Date</Form.Label>
                              <Form.Control type="date" name="release_date" value={formData.release_date} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="submission_date">
                              <Form.Label className="text-start">Submission Date</Form.Label>
                              <Form.Control type="date" name="submission_date" value={formData.submission_date} onChange={handleChange} required />
                          </Form.Group>
                          <Form.Group as={Col} controlId="decision_date">
                              <Form.Label className="text-start">Decision Date</Form.Label>
                              <Form.Control type="date" name="decision_date" value={formData.decision_date} onChange={handleChange} required />
                          </Form.Group>
                      </Row>
                  </fieldset>

                  <fieldset>
                      <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Remarks</legend>
                      <Row className="mb-3">
                          <Form.Group as={Col} controlId="additional_remarks">
                              <Form.Label className="text-start">Additional Remarks</Form.Label>
                              <Form.Control as="textarea" rows={3} name="additional_remarks" value={formData.additional_remarks} onChange={handleChange} required />
                          </Form.Group>
                      </Row>
                  </fieldset>

                  <Button variant="success" type="submit">
                      Submit
                  </Button>
              </Form>
          </Card.Body>
      </Card></>
  );
};

export default CreateOpportunity;
