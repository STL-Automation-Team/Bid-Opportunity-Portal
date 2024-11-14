import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import { default as React, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../components/constants';
import './CreateOpportunity.css';
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
        created_at: '',
        created_by: '',
        business_services: '',
        est_capex_phase: '',
        est_opex_phase: '',
        customer_name: '',
        logo: '',
        updated_by: '',
        Updated_at: ''
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const [showModal, setShowModal] = useState(false);
      const [users, setUsers] = useState([]);
      const [errors, setErrors] = useState({});

      const [showDuplicateModal, setShowDuplicateModal] = useState(false);
      const [potentialDuplicates, setPotentialDuplicates] = useState([]);

      const validateForm = () => {
        let newErrors = {};
    
        // Validate each field
        Object.keys(formData).forEach(field => {
          switch (field) {
            case 'gm_percentage':
            case 'probability':
              if (formData[field] !== '' && (formData[field] < 0 || formData[field] > 100)) {
                newErrors[field] = 'Value must be between 0 and 100';
              }
              break;
            case 'amount_inr_cr_min':
            case 'amount_inr_cr_max':
            case 'est_capex_inr_cr':
            case 'est_opex_inr_cr':
              if (formData[field] !== '' && formData[field] < 0) {
                newErrors[field] = 'Value cannot be negative';
              }
              break;
            // Add more cases for other fields that need validation
          }
        });
    
        setErrors(newErrors);
      };
    
      useEffect(() => {
        validateForm();
      }, [formData]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        updateRelatedFields(name, value);

        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
      const token = localStorage.getItem('token');

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if there are any errors
        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
            toast.error('Please correct the errors before submitting.');
            return;
        }
    
        // Check if all required fields are filled
        const requiredFields = [
            'ob_fy', 'ob_qtr', 'ob_mmm', 'priority', 'business_unit', 'industry_segment',
            'opportunity', 'amount_inr_cr_min', 'amount_inr_cr_max', 'deal_status',
            'sales_role', 'primary_owner', 'submission_date', 'additional_remarks'
        ];
    
        const missingFields = requiredFields.filter(field => !formData[field]);
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }
    
        // Prepare data for submission
        const postData = {
            ...formData,
            amount_inr_cr_max: parseFloat(formData.amount_inr_cr_max),
            amount_inr_cr_min: parseFloat(formData.amount_inr_cr_min),
            est_capex_inr_cr: parseFloat(formData.est_capex_inr_cr),
            est_opex_inr_cr: parseFloat(formData.est_opex_inr_cr),
            gm_percentage: parseFloat(formData.gm_percentage),
            probability: parseFloat(formData.probability),
            est_capex_phase: parseInt(formData.est_capex_phase),
            est_opex_phase: parseInt(formData.est_opex_phase)
        };
    
        setIsSubmitting(true);
    
        try {
            const response = await axios.post(`${BASE_URL}/api/opportunities`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 201 || response.status === 200) {
                toast.success('Entry created successfully.');
                handleClose();
            } else if (response.status === 409) {
                setPotentialDuplicates(response.data.potentialDuplicates);
                setShowDuplicateModal(true);
            } else {
                toast.error('Failed to create entry.');
            }
        } catch (err) {
            if (err.response) {
                const { status, data } = err.response;
                
                if (status === 409) {
                    // Handle duplicate entry
                    setPotentialDuplicates(data.potentialDuplicates);
                    setShowDuplicateModal(true);
                } else if (status === 400 && typeof data === 'object') {
                    // Loop through backend validation errors
                    Object.values(data).forEach(errorMessage => toast.error(errorMessage));
                } else {
                    toast.error('Failed to create entry.');
                    console.error(err);
                }
            } else {
                toast.error('Failed to create entry.');
                console.error(err);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    

      const handleAddAnyway = async () => {
        const token = localStorage.getItem('token');

        try {

          const response = await axios.post(`${BASE_URL}/api/opportunities?forcecreate=true`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            toast.success('Opportunity created successfully');
            setShowDuplicateModal(false);
            handleClose();
            // Reset form or redirect
          }
        } catch (error) {
          console.error('Error creating opportunity:', error);
        }
      };
    
      // ErrorMessage component
      const ErrorMessage = ({ error }) => {
        return error ? <div className="text-danger">{error}</div> : null;
      };

      const handleCloseModal = () => {
        setShowModal(false);
        // navigate("/userslist");
      };
     
      const handleShowModal = () => {
        setShowModal(true);
      };
    //   const handleChange = (e) => {
    //     setFormData({
    //       ...formData,
    //       [e.target.name]: e.target.value,
    //     });
    //   };
      
    const updateRelatedFields = (name, value) => {
      const updatedData = { ...formData, [name]: value };
  
      if (name === 'amount_inr_cr_max' || name === 'est_capex_inr_cr' || name === 'est_opex_inr_cr') {
        const maxAmount = parseFloat(updatedData.amount_inr_cr_max) || 0;
        const capexAmount = parseFloat(updatedData.est_capex_inr_cr) || 0;
        
        if (name === 'amount_inr_cr_max' || name === 'est_capex_inr_cr') {
          updatedData.est_opex_inr_cr = Math.max(0, maxAmount - capexAmount).toFixed(2);
        } else if (name === 'est_opex_inr_cr') {
          updatedData.est_capex_inr_cr = Math.max(0, maxAmount - parseFloat(value)).toFixed(2);
        }
      }
  
      if (name === 'project_tenure_months' || name === 'est_capex_phase' || name === 'est_opex_phase') {
        const totalTenure = parseInt(updatedData.project_tenure_months) || 0;
        const capexPhase = parseInt(updatedData.est_capex_phase) || 0;
        
        if (name === 'project_tenure_months' || name === 'est_capex_phase') {
          updatedData.est_opex_phase = Math.max(0, totalTenure - capexPhase);
        } else if (name === 'est_opex_phase') {
          updatedData.est_capex_phase = Math.max(0, totalTenure - parseInt(value));
        }
      }
  
      setFormData(updatedData);
    };
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Fetch user data from the API
        axios.get(`${BASE_URL}/api/allusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            setUsers(response.data);
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      }, []);
      const redStyle = {
        color: 'red',
        fontWeight: 'bold', // additional style example
        '!important': 'true' // Direct !important is not valid in inline styles
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
            created_at: '',
            created_by: '',
            business_services: '',
            est_capex_phase: '',
            est_opex_phase: ''
        });
        setError('');
        setSuccess('');
      };

      const handleReset = () => {
       handleClose();
       toast.info('Form has been reset');
    };
  return (
    
    <>
  <ToastContainer />
  <Card style={{ width: '100%', height: '100%', margin: '1rem', maxWidth: '98%' }}>
    <Card.Body>
      <Form onSubmit={handleSubmit}>
        <p className="text-muted1"  style={{
               color: '#ff0000',
                fontWeight: 'bold', // additional style example
             
        }}>* indicates mandatory fields</p>
        <fieldset>
          <Row className="mb-2">
            <Form.Group as={Col} controlId="ob_fy">
              <Form.Label className="text-start">OB FY *</Form.Label>
              <Form.Control as="select" name="ob_fy" value={formData.ob_fy} onChange={handleChange} required>
                <option value="">Select OB FY</option>
                <option value="FY24">FY24</option>
                <option value="FY25">FY25</option>
                <option value="FY26">FY26</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="ob_qtr">
              <Form.Label className="text-start">OB Qtr *</Form.Label>
              <Form.Control as="select" name="ob_qtr" value={formData.ob_qtr} onChange={handleChange} required>
                <option value="">Select OB Qtr</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="ob_mmm">
              <Form.Label className="text-start">OB MMM *</Form.Label>
              <Form.Control as="select" name="ob_mmm" value={formData.ob_mmm} onChange={handleChange} required>
                <option value="">Select OB MMM</option>
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
            <Form.Group as={Col} controlId="logo">
              <Form.Label className="text-start">Logo *</Form.Label>
              <Form.Control as="select" name="logo" value={formData.logo} onChange={handleChange} required>
                <option value="">Select Logo</option>
                <option value="New">New</option>
                <option value="Existing">Existing</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="customer_name">
              <Form.Label className="text-start">Customer Name *</Form.Label>
              <Form.Control 
                type="text" 
                name="customer_name" 
                value={formData.customer_name} 
                onChange={handleChange} 
                required 
                maxLength={50}
                placeholder="Enter Customer Name (max 50 char)"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="priority">
              <Form.Label className="text-start">Priority *</Form.Label>
              <Form.Control as="select" name="priority" value={formData.priority} onChange={handleChange} required>
                <option value="">Select Priority</option>
                <option value="Commit">Commit</option>
                <option value="TBD">TBD</option>
                <option value="Upside">Upside</option>
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="business_unit">
              <Form.Label className="text-start">Business Unit *</Form.Label>
              <Form.Control as="select" name="business_unit" value={formData.business_unit} onChange={handleChange} required>
                <option value="">Select Business Unit</option>
                <option value="GSB">GSB</option>
                <option value="Digital">Digital</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="business_services">
              <Form.Label className="text-start">Business Services *</Form.Label>
              <Form.Control as="select" name="business_services" value={formData.business_services} onChange={handleChange} required>
                <option value="">Select Business Services</option>
                <option value="System Integration">System Integration</option>
                <option value="Fibre Deployment">Fibre Deployment</option>
                <option value="Managed Sevices">Managed Sevices</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="industry_segment">
              <Form.Label className="text-start">Industry Segment *</Form.Label>
              <Form.Control as="select" name="industry_segment" value={formData.industry_segment} onChange={handleChange} required>
                <option value="">Select Industry Segment</option>
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
              <Form.Label className="text-start">Opportunity *</Form.Label>
              <Form.Control 
                type="text" 
                name="opportunity" 
                value={formData.opportunity} 
                onChange={handleChange} 
                required 
                maxLength={100}
                placeholder="Enter opportunity (max 100 characters)"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="amount_inr_cr_min">
              <Form.Label className="text-start">Amount INR Cr Min *</Form.Label>
              <Form.Control 
                type="number" 
                name="amount_inr_cr_min" 
                value={formData.amount_inr_cr_min} 
                onChange={handleChange} 
                required 
                min={0}
                step={0.01}
                max={200000}
                placeholder="Enter minimum amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="amount_inr_cr_max">
              <Form.Label className="text-start">Amount INR Cr Max *</Form.Label>
              <Form.Control 
                type="number" 
                name="amount_inr_cr_max" 
                value={formData.amount_inr_cr_max} 
                onChange={handleChange} 
                required 
                min={0}
                step={0.01}
                max={200000}
                placeholder="Enter maximum amount"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="est_capex_inr_cr">
              <Form.Label className="text-start">Est. Capex INR Cr</Form.Label>
              <Form.Control 
                type="number" 
                name="est_capex_inr_cr" 
                value={formData.est_capex_inr_cr} 
                onChange={handleChange} 
                min={0}
                step={0.01}
                max={200000}
                placeholder="Enter estimated CAPEX"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="est_opex_inr_cr">
              <Form.Label className="text-start">Est. Opex INR Cr</Form.Label>
              <Form.Control 
                type="number" 
                name="est_opex_inr_cr" 
                value={formData.est_opex_inr_cr} 
                onChange={handleChange} 
                min={0}
                step={0.01}
                max={200000}
                placeholder="Enter estimated OPEX"
              />
            </Form.Group>
            
          </Row>
          <Row className="mb-1">
          <Form.Group as={Col} controlId="project_tenure_months">
              <Form.Label className="text-start">Project Tenure (Months)*</Form.Label>
              <Form.Control 
                type="number" 
                name="project_tenure_months" 
                value={formData.project_tenure_months} 
                required
                onChange={handleChange} 
                min={0}
                step={1}
                max={120}
                placeholder="Enter Project Tenure"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="est_capex_phase">
              <Form.Label className="text-start">Est. Capex Phase (Months)</Form.Label>
              <Form.Control 
                type="number" 
                name="est_capex_phase" 
                value={formData.est_capex_phase} 
                onChange={handleChange} 
                min={0}
                step={1}
                max={120}
                placeholder="Enter CAPEX Phase"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="est_opex_phase">
              <Form.Label className="text-start">Est. Opex Phase (Months)</Form.Label>
              <Form.Control 
                type="number" 
                name="est_opex_phase" 
                value={formData.est_opex_phase} 
                onChange={handleChange} 
                min={0}
                step={1}
                max={120}
                placeholder="Enter OPEX Phase"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="deal_status">
              <Form.Label className="text-start">Deal Status *</Form.Label>
              <Form.Control as="select" name="deal_status" value={formData.deal_status} onChange={handleChange} required>
                <option value="">Select Deal Status</option>
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
              <Form.Control as="select" name="go_no_go_status" value={formData.go_no_go_status} onChange={handleChange}>
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
              <Form.Control type="date" name="go_no_go_date" 
              value={formData.go_no_go_date}
              min={today}
              onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} controlId="gm_percentage">
              <Form.Label className="text-start">GM Percentage</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01" 
                name="gm_percentage" 
                value={formData.gm_percentage} 
                onChange={handleChange} 
                min={0}
                max={100}
                placeholder="Enter GM % (0-100)"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="probability">
              <Form.Label className="text-start">Probability</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01" 
                name="probability" 
                value={formData.probability} 
                onChange={handleChange} 
                min={0}
                max={100}
                placeholder="Enter probability % (0-100)"
              />
            </Form.Group>
          </Row>
        </fieldset>

        <fieldset>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="sales_role">
              <Form.Label className="text-start">Sales Role *</Form.Label>
              <Form.Control 
                type="text" 
                name="sales_role" 
                value={formData.sales_role} 
                onChange={handleChange} 
                required 
                maxLength={50}
                placeholder="Enter sales role (max 50 characters)"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="primary_owner">
            <Form.Label className="text-start">Primary Owner *</Form.Label>
            <Form.Control 
                as="select"
                name="primary_owner"
                value={formData.primary_owner}
                onChange={handleChange}
                required
            >
                <option value="">Select Primary Owner</option>
                {users.map(user => (
                <option key={user.id} value={`${user.firstName} ${user.lastName}`}>
                    {user.firstName} {user.lastName}
                </option>
                ))}
            </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="source">
              <Form.Label className="text-start">Source</Form.Label>
              <Form.Control 
                type="text" 
                name="source" 
                value={formData.source} 
                onChange={handleChange} 
                maxLength={50}
                placeholder="Enter source (max 50 characters)"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="source_person">
              <Form.Label className="text-start">Source Person</Form.Label>
              <Form.Control 
                type="text" 
                name="source_person" 
                value={formData.source_person} 
                onChange={handleChange} 
                maxLength={50}
                placeholder="Enter source person (max 50 characters)"
              />
            </Form.Group>
          </Row>
          <Row className="mb-1">
            <Form.Group as={Col} controlId="lead_received_date">
              <Form.Label className="text-start">Lead Received Date</Form.Label>
              <Form.Control type="date" name="lead_received_date" value={formData.lead_received_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} controlId="release_date">
              <Form.Label className="text-start">Release Date</Form.Label>
              <Form.Control type="date" name="release_date" value={formData.release_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} controlId="submission_date">
              <Form.Label className="text-start">Submission Date *</Form.Label>
              <Form.Control type="date" name="submission_date" 
              value={formData.submission_date} 
              min={today}
              onChange={handleChange} 
              required />
            </Form.Group>
            <Form.Group as={Col} controlId="decision_date">
              <Form.Label className="text-start">Decision Date</Form.Label>
              <Form.Control type="date" 
              name="decision_date" 
              value={formData.decision_date}
              min={today}
              onChange={handleChange} />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="additional_remarks">
              <Form.Label className="text-start">Additional Remarks *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="additional_remarks" 
                value={formData.additional_remarks} 
                onChange={handleChange} 
                required 
                maxLength={500}
                placeholder="Enter additional remarks (max 500 characters)"
              />
            </Form.Group>
          </Row>
        </fieldset>
        <Button variant="success" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}       
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button type="button" onClick={handleReset} disabled={isSubmitting}>
                                Reset
                            </button>
      </Form>
    </Card.Body>
  </Card>
  <Modal 
  show={showDuplicateModal} 
  onHide={() => setShowDuplicateModal(false)} 
  id="duplicateModal"
>
  <Modal.Header closeButton id="modalHeader">
    <Modal.Title id="modalTitle">Potential Duplicates Found</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="d-flex align-items-center mb-3 text-warning p-2 rounded" id="warningMessage">
      <AlertCircle className="me-2" />
      <p className="mb-0">
        We found potential duplicates for this opportunity. Please review before proceeding.
      </p>
    </div>
    <Table striped bordered hover id="duplicateTable">
      <thead>
        <tr>
          <th>ID</th>
          <th>Opportunity Name</th>
          <th>Submission Date</th>
          <th>Business Segment</th>
          <th>Fiscal Year</th>
          <th>Quarter</th>
        </tr>
      </thead>
      <tbody>
        {potentialDuplicates.map(duplicate => (
          <tr key={duplicate.id}>
            <td>{duplicate.id}</td>
            <td>{duplicate.opportunityName}</td>
            <td>{duplicate.submissionDate}</td>
            <td>{duplicate.businessSegment}</td>
            <td>{duplicate.fiscalYear}</td>
            <td>{duplicate.quarter}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Modal.Body>
  <Modal.Footer id="modalFooter">
    <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>
      Don't Add
    </Button>
    <Button variant="primary" onClick={handleAddAnyway}>
      Add Anyway
    </Button>
  </Modal.Footer>
</Modal>

</>
  );
};

export default CreateOpportunity;
