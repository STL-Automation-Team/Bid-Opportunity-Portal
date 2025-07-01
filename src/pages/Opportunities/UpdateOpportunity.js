import axios from 'axios';
import { format, parse } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../components/constants';
import './CreateOpportunity.css';
const EditLead = () => {
  const [formData, setFormData] = useState({
    opportunityName: '',
    partFyId: '',
    partQuarter: '',
    partMonth: '',
    obFyId: '',
    obQtr: '',
    obMmm: '',
    priorityId: '',
    amount: '',
    dealStatusId: '',
    actualBookedOb: '',
    actualBookedCapex: '',
    actualBookedOpex: '',
    revInObQtr: '',
    revInObQtrPlus1: '',
    industrySegmentId: '',
    publicPrivate: '',
    primaryOfferingSegment: '',
    secondaryOfferingSegment: '',
    projectTenureMonths: '',
    estCapexInrCr: '',
    estOpexInrCr: '',
    opexTenureMonths: '',
    goNoGoStatusId: '',
    goNoGoDate: null,
    gmPercentage: '',
    probability: '',
    primaryOwner: '',
    solutionSpoc: '',
    scmSpoc: '',
    remarks: '',
    pqTq_remarks: '',
    rfpReleaseDate: null,
    bidSubmissionDate: null
  });

  const [originalData, setOriginalData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    fy: [],
    businessSegments: [],
    goNoGoStatuses: [],
    dealStatuses: [],
    priorities: []
  });

  const token = localStorage.getItem('token');
  const today = new Date().toISOString().split('T')[0];
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing lead data and dropdown options
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const leadData = response.data;
        // Flatten the nested data into formData
        const flattenedData = {
          opportunityName: leadData.opportunityName || '',
          partFyId: leadData.partFy?.id || '',
          partQuarter: leadData.partQuarter || '',
          partMonth: leadData.partMonth || '',
          obFyId: leadData.obFy?.id || '',
          obQtr: leadData.obQtr || '',
          obMmm: leadData.obMmm || '',
          priorityId: leadData.priority?.id || '',
          amount: leadData.amount || '',
          dealStatusId: leadData.dealStatus?.id || '',
          actualBookedOb: leadData.actualBookedOb || '',
          actualBookedCapex: leadData.actualBookedCapex || '',
          actualBookedOpex: leadData.actualBookedOpex || '',
          revInObQtr: leadData.revInObQtr || '',
          revInObQtrPlus1: leadData.revInObQtrPlus1 || '',
          industrySegmentId: leadData.industrySegment?.id || '',
          publicPrivate: leadData.publicPrivate || '',
          primaryOfferingSegment: leadData.primaryOfferingSegment || '',
          secondaryOfferingSegment: leadData.secondaryOfferingSegment || '',
          projectTenureMonths: leadData.projectTenureMonths || '',
          estCapexInrCr: leadData.estCapexInrCr || '',
          estOpexInrCr: leadData.estOpexInrCr || '',
          opexTenureMonths: leadData.opexTenureMonths || '',
          goNoGoStatusId: leadData.goNoGoMaster?.id || '',
          goNoGoDate: leadData.goNoGoDate || null,
          gmPercentage: leadData.gmPercentage || '',
          probability: leadData.probability || '',
          primaryOwner: leadData.primaryOwner || '',
          solutionSpoc: leadData.solutionSpoc || '',
          scmSpoc: leadData.scmSpoc || '',
          remarks: leadData.remarks || '',
          pqTq_remarks: leadData.pqTq_remarks || '',
          rfpReleaseDate: leadData.rfpReleaseDate || null,
          bidSubmissionDate: leadData.bidSubmissionDate || null
        };
        setFormData(flattenedData);
        setOriginalData(flattenedData);
      } catch (error) {
        console.error('Error fetching lead data:', error);
        toast.error('Failed to fetch lead data');
      }
    };

    const fetchDropdownData = async () => {
      try {
        const endpoints = [
          { key: 'fy', url: '/api/fy' },
          { key: 'businessSegments', url: '/api/business-segments' },
          { key: 'goNoGoStatuses', url: '/api/go-no-go' },
          { key: 'dealStatuses', url: '/api/deals' },
          { key: 'priorities', url: '/api/priority' }
        ];

        const results = await Promise.all(
          endpoints.map(async ({ key, url }) => {
            const response = await axios.get(`${BASE_URL}${url}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return { key, data: response.data };
          })
        );

        const newData = results.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});

        setDropdownData(newData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchLeadData();
    fetchDropdownData();
  }, [id, token]);

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    // const requiredFields = [
    //   'opportunityName', 'obFyId', 'obQtr', 'obMmm', 'priorityId',
    //   'amount', 'dealStatusId', 'industrySegmentId', 'bidSubmissionDate'
    // ];
    const requiredFields = []

    requiredFields.forEach(field => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    const numericFields = {
      gmPercentage: { min: 0, max: 100 },
      probability: { min: 0, max: 100 },
      amount: { min: 0 },
      actualBookedOb: { min: 0 },
      actualBookedCapex: { min: 0 },
      actualBookedOpex: { min: 0 },
      projectTenureMonths: { min: 0 },
      estCapexInrCr: { min: 0 },
      estOpexInrCr: { min: 0 },
      opexTenureMonths: { min: 0 }
    };

    Object.entries(numericFields).forEach(([field, { min, max }]) => {
      const value = parseFloat(formData[field]);
      if (formData[field] && (isNaN(value) || value < min || (max && value > max))) {
        newErrors[field] = max ? `Must be between ${min}-${max}` : `Must be ≥ ${min}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleDatePickerChange = (date, name) => {
    // Format date to YYYY-MM-DD in local timezone (IST)
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    
    // Debugging: Log the selected and formatted date
    console.log('Selected Date:', date);
    console.log('Formatted Date (YYYY-MM-DD):', formattedDate);

    const event = {
      target: { name, value: formattedDate },
    };
    handleChange(event);
  };
  
  // Handle form submission (update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the form errors', { toastId: 'leadformerror' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Reconstruct nested structure for API submission
      const postData = {
        opportunityName: formData.opportunityName,
        partFy: formData.partFyId ? { id: parseInt(formData.partFyId) } : null,
        partQuarter: formData.partQuarter || null,
        partMonth: formData.partMonth || null,
        obFy: formData.obFyId ? { id: parseInt(formData.obFyId) } : null,
        obQtr: formData.obQtr || null,
        obMmm: formData.obMmm || null,
        priority: formData.priorityId ? { id: parseInt(formData.priorityId) } : null,
        amount: parseFloat(formData.amount),
        dealStatus: formData.dealStatusId ? { id: parseInt(formData.dealStatusId) } : null,
        actualBookedOb: formData.actualBookedOb ? parseFloat(formData.actualBookedOb) : null,
        actualBookedCapex: formData.actualBookedCapex ? parseFloat(formData.actualBookedCapex) : null,
        actualBookedOpex: formData.actualBookedOpex ? parseFloat(formData.actualBookedOpex) : null,
        revInObQtr: formData.revInObQtr ? parseFloat(formData.revInObQtr) : null,
        revInObQtrPlus1: formData.revInObQtrPlus1 ? parseFloat(formData.revInObQtrPlus1) : null,
        industrySegment: formData.industrySegmentId ? { id: parseInt(formData.industrySegmentId) } : null,
        publicPrivate: formData.publicPrivate || null,
        primaryOfferingSegment: formData.primaryOfferingSegment || null,
        secondaryOfferingSegment: formData.secondaryOfferingSegment || null,
        projectTenureMonths: formData.projectTenureMonths ? parseInt(formData.projectTenureMonths) : null,
        estCapexInrCr: formData.estCapexInrCr ? parseFloat(formData.estCapexInrCr) : null,
        estOpexInrCr: formData.estOpexInrCr ? parseFloat(formData.estOpexInrCr) : null,
        opexTenureMonths: formData.opexTenureMonths ? parseInt(formData.opexTenureMonths) : null,
        goNoGoMaster: formData.goNoGoStatusId ? { id: parseInt(formData.goNoGoStatusId) } : null,
        goNoGoDate: formData.goNoGoDate || null,
        gmPercentage: formData.gmPercentage ? parseFloat(formData.gmPercentage) : null,
        probability: formData.probability ? parseInt(formData.probability) : null,
        primaryOwner: formData.primaryOwner || null,
        solutionSpoc: formData.solutionSpoc || null,
        scmSpoc: formData.scmSpoc || null,
        remarks: formData.remarks || null,
        pqTq_remarks: formData.pqTq_remarks || null,
        rfpReleaseDate: formData.rfpReleaseDate || null,
        bidSubmissionDate: formData.bidSubmissionDate || null
      };

      const response = await axios.put(`${BASE_URL}/api/leads/${id}`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        // toast.success('Lead updated successfully', { 
        //   autoClose: 2000,
        //   toastId: 'updateSuccess_normal'
        // });
        // navigate(`/opportunity/${id}`);
        const confirmed = window.confirm('Lead updated successfully. Click OK to view the opportunity.');
        if (confirmed) {
          navigate(`/operationslist`);
        }
      }
      
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiError = (error) => {
    if (error.response?.status === 409) {
      setPotentialDuplicates(error.response.data.potentialDuplicates);
      setShowDuplicateModal(true);
    } else {
      toast.error(error.response?.data?.message || 'Failed to update lead', {
        toastId: 'updateErrorlead'
      });
    }
  };

  const handleAddAnyway = async () => {
    try {
      const postData = {
        opportunityName: formData.opportunityName,
        partFy: formData.partFyId ? { id: parseInt(formData.partFyId) } : null,
        partQuarter: formData.partQuarter || null,
        partMonth: formData.partMonth || null,
        obFy: formData.obFyId ? { id: parseInt(formData.obFyId) } : null,
        obQtr: formData.obQtr || null,
        obMmm: formData.obMmm || null,
        priority: formData.priorityId ? { id: parseInt(formData.priorityId) } : null,
        amount: parseFloat(formData.amount),
        dealStatus: formData.dealStatusId ? { id: parseInt(formData.dealStatusId) } : null,
        actualBookedOb: formData.actualBookedOb ? parseFloat(formData.actualBookedOb) : null,
        actualBookedCapex: formData.actualBookedCapex ? parseFloat(formData.actualBookedCapex) : null,
        actualBookedOpex: formData.actualBookedOpex ? parseFloat(formData.actualBookedOpex) : null,
        revInObQtr: formData.revInObQtr ? parseFloat(formData.revInObQtr) : null,
        revInObQtrPlus1: formData.revInObQtrPlus1 ? parseFloat(formData.revInObQtrPlus1) : null,
        industrySegment: formData.industrySegmentId ? { id: parseInt(formData.industrySegmentId) } : null,
        publicPrivate: formData.publicPrivate || null,
        primaryOfferingSegment: formData.primaryOfferingSegment || null,
        secondaryOfferingSegment: formData.secondaryOfferingSegment || null,
        projectTenureMonths: formData.projectTenureMonths ? parseInt(formData.projectTenureMonths) : null,
        estCapexInrCr: formData.estCapexInrCr ? parseFloat(formData.estCapexInrCr) : null,
        estOpexInrCr: formData.estOpexInrCr ? parseFloat(formData.estOpexInrCr) : null,
        opexTenureMonths: formData.opexTenureMonths ? parseInt(formData.opexTenureMonths) : null,
        goNoGoMaster: formData.goNoGoStatusId ? { id: parseInt(formData.goNoGoStatusId) } : null,
        goNoGoDate: formData.goNoGoDate || null,
        gmPercentage: formData.gmPercentage ? parseFloat(formData.gmPercentage) : null,
        probability: formData.probability ? parseInt(formData.probability) : null,
        primaryOwner: formData.primaryOwner || null,
        solutionSpoc: formData.solutionSpoc || null,
        scmSpoc: formData.scmSpoc || null,
        remarks: formData.remarks || null,
        pqTq_remarks: formData.pqTq_remarks || null,
        rfpReleaseDate: formData.rfpReleaseDate || null,
        bidSubmissionDate: formData.bidSubmissionDate || null
      };

      await axios.put(`${BASE_URL}/api/leads/${id}?force=true`, postData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // toast.success('Lead updated successfully', { 
      //   autoClose: 2000,
      //   toastId: 'addAnyway'
      // });
      setShowDuplicateModal(false);
      const confirmed = window.confirm('Lead updated successfully. Click OK to view the opportunity.');
      if (confirmed) {
        navigate(`/operationslist`);
      }
      // setTimeout(() => navigate(`/opportunity/${id}`), 10);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData(originalData);
      setErrors({});
      toast.info('Form reset to original data');
    }
  };

  const handleCancel = () => {
    navigate(`/opportunity/${id}`);
  };

  return (
    <>
      <Card className="create-opportunity-card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <p className="text-muted1" style={{ color: 'red', fontWeight: 'bold' }}>
              * indicates mandatory fields
            </p>

            {/* Part FY Section */}
            <fieldset>
              <Row className="mb-1">
                <Form.Group as={Col} controlId="opportunityName">
                  <Form.Label>Opportunity Name *</Form.Label>
                  <Form.Control
                    name="opportunityName"
                    value={formData.opportunityName}
                    onChange={handleChange}
                    isInvalid={!!errors.opportunityName}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.opportunityName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="partFyId">
                  <Form.Label>Part FY</Form.Label>
                  <Form.Control
                    as="select"
                    name="partFyId"
                    value={formData.partFyId}
                    onChange={handleChange}
                  >
                    <option value="">Select FY</option>
                    {dropdownData.fy.map(fy => (
                      <option key={fy.id} value={fy.id}>{fy.obFy}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="partQuarter">
                  <Form.Label>Part Quarter</Form.Label>
                  <Form.Control
                    as="select"
                    name="partQuarter"
                    value={formData.partQuarter}
                    onChange={handleChange}
                  >
                    <option value="">Select Quarter</option>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(qtr => (
                      <option key={qtr} value={qtr}>{qtr}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="partMonth">
                  <Form.Label>Part Month</Form.Label>
                  <Form.Control
                    as="select"
                    name="partMonth"
                    value={formData.partMonth}
                    onChange={handleChange}
                  >
                    <option value="">Select Month</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                      .map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Row>
            </fieldset>

            {/* OB FY Section */}
            <fieldset>
              <Row className="mb-1">
                <Form.Group as={Col} controlId="obFyId">
                  <Form.Label>OB FY *</Form.Label>
                  <Form.Control
                    as="select"
                    name="obFyId"
                    value={formData.obFyId}
                    onChange={handleChange}
                    // required
                    isInvalid={!!errors.obFyId}
                  >
                    <option value="">Select FY</option>
                    {dropdownData.fy.map(fy => (
                      <option key={fy.id} value={fy.id}>{fy.obFy}</option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.obFyId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="obQtr">
                  <Form.Label>OB Quarter *</Form.Label>
                  <Form.Control
                    as="select"
                    name="obQtr"
                    value={formData.obQtr}
                    onChange={handleChange}
                    // required
                    isInvalid={!!errors.obQtr}
                  >
                    <option value="">Select Quarter</option>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(qtr => (
                      <option key={qtr} value={qtr}>{qtr}</option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.obQtr}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="obMmm">
                  <Form.Label>OB Month *</Form.Label>
                  <Form.Control
                    as="select"
                    name="obMmm"
                    value={formData.obMmm}
                    onChange={handleChange}
                    // required
                    isInvalid={!!errors.obMmm}
                  >
                    <option value="">Select Month</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                      .map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.obMmm}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </fieldset>

            {/* Financial Details Section */}
            <fieldset>
              <Row className="mb-1">
                <Form.Group as={Col} controlId="amount">
                  <Form.Label>Amount (INR Cr) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="actualBookedOb">
                  <Form.Label>Actual Booked OB</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="actualBookedOb"
                    value={formData.actualBookedOb}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="actualBookedCapex">
                  <Form.Label>Actual Booked Capex</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="actualBookedCapex"
                    value={formData.actualBookedCapex}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="actualBookedOpex">
                  <Form.Label>Actual Booked Opex</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="actualBookedOpex"
                    value={formData.actualBookedOpex}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Col} controlId="revInObQtr">
                  <Form.Label>Revenue in OB Qtr</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="revInObQtr"
                    value={formData.revInObQtr}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="revInObQtrPlus1">
                  <Form.Label>Revenue in OB Qtr+1</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="revInObQtrPlus1"
                    value={formData.revInObQtrPlus1}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
            </fieldset>

            {/* Project Details Section */}
            <fieldset>
              <Row className="mb-1">
                <Form.Group as={Col} controlId="industrySegmentId">
                  <Form.Label>Industry Segment *</Form.Label>
                  <Form.Control
                    as="select"
                    name="industrySegmentId"
                    value={formData.industrySegmentId}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.industrySegmentId}
                  >
                    <option value="">Select Segment</option>
                    {dropdownData.businessSegments.map(segment => (
                      <option key={segment.id} value={segment.id}>{segment.name}</option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.industrySegmentId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="publicPrivate">
                  <Form.Label>Public/Private</Form.Label>
                  <Form.Control
                    as="select"
                    name="publicPrivate"
                    value={formData.publicPrivate}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="primaryOfferingSegment">
                  <Form.Label>Primary Offering</Form.Label>
                  <Form.Control
                    type="text"
                    name="primaryOfferingSegment"
                    value={formData.primaryOfferingSegment}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="secondaryOfferingSegment">
                  <Form.Label>Secondary Offering</Form.Label>
                  <Form.Control
                    type="text"
                    name="secondaryOfferingSegment"
                    value={formData.secondaryOfferingSegment}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-1">
                <Form.Group as={Col} controlId="projectTenureMonths">
                  <Form.Label>Project Tenure (Months)</Form.Label>
                  <Form.Control
                    type="number"
                    name="projectTenureMonths"
                    value={formData.projectTenureMonths}
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="estCapexInrCr">
                  <Form.Label>Estimated Capex (INR Cr)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="estCapexInrCr"
                    value={formData.estCapexInrCr}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="estOpexInrCr">
                  <Form.Label>Estimated Opex (INR Cr)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="estOpexInrCr"
                    value={formData.estOpexInrCr}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="opexTenureMonths">
                  <Form.Label>Opex Tenure (Months)</Form.Label>
                  <Form.Control
                    type="number"
                    name="opexTenureMonths"
                    value={formData.opexTenureMonths}
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>
              </Row>
            </fieldset>

            {/* Deal Status Section */}
            <fieldset>
              <Row className="mb-1">
                <Form.Group as={Col} controlId="priorityId">
                  <Form.Label>Priority </Form.Label>
                  <Form.Control
                    as="select"
                    name="priorityId"
                    value={formData.priorityId}
                    onChange={handleChange}
                    isInvalid={!!errors.priorityId}
                  >
                    <option value="">Select Priority</option>
                    {dropdownData.priorities.map(priority => (
                      <option key={priority.id} value={priority.id}>
                        {priority.priority}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.priorityId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="dealStatusId">
                  <Form.Label>Deal Status *</Form.Label>
                  <Form.Control
                    as="select"
                    name="dealStatusId"
                    value={formData.dealStatusId}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.dealStatusId}
                  >
                    <option value="">Select Status</option>
                    {dropdownData.dealStatuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.dealStatus}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.dealStatusId}
                  </Form.Control.Feedback>
                </Form.Group>

               

                <Form.Group as={Col} controlId="goNoGoStatusId">
                    <Form.Label>Go/No-Go Status *</Form.Label>
                    <Form.Control
                      as="select"
                      name="goNoGoStatusId"
                      value={formData.goNoGoStatusId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      {dropdownData.goNoGoStatuses.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.dealStatus}
                        </option>
                      ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="goNoGoDate">
      <Form.Label>Go/No-Go Date</Form.Label>
      <DatePicker
        selected={
          formData.goNoGoDate
            ? parse(formData.goNoGoDate, 'yyyy-MM-dd', new Date())
            : null
        }
        onChange={(date) => handleDatePickerChange(date, 'goNoGoDate')}
        dateFormat="yyyy-MM-dd"
        className="form-control"
        name="goNoGoDate"
        autoComplete="off"
        showYearDropdown
        showMonthDropdown
        yearDropdownItemNumber={10}
        scrollableYearDropdown
        scrollableMonthDropdown
        placeholderText='YYYY-MM-DD'
      />
    </Form.Group>

                

              </Row>
            </fieldset>

            {/* Additional Details Section */}
            <fieldset>
              <Row className="mb-1">
                <Form.Group as={Col} controlId="gmPercentage">
                  <Form.Label>GM Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="gmPercentage"
                    value={formData.gmPercentage}
                    onChange={handleChange}
                    min={0}
                    max={100}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="probability">
                  <Form.Label>Probability (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="probability"
                    value={formData.probability}
                    onChange={handleChange}
                    min={0}
                    max={100}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="primaryOwner">
                  <Form.Label>Primary Owner</Form.Label>
                  <Form.Control
                    type="text"
                    name="primaryOwner"
                    value={formData.primaryOwner}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="solutionSpoc">
                  <Form.Label>Solution SPOC</Form.Label>
                  <Form.Control
                    type="text"
                    name="solutionSpoc"
                    value={formData.solutionSpoc}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="scmSpoc">
                  <Form.Label>SCM SPOC</Form.Label>
                  <Form.Control
                    type="text"
                    name="scmSpoc"
                    value={formData.scmSpoc}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-1">
              <Form.Group as={Col} controlId="rfpReleaseDate">
        <Form.Label>RFP Release Date</Form.Label>
        <DatePicker
          selected={
            formData.rfpReleaseDate
              ? parse(formData.rfpReleaseDate, 'yyyy-MM-dd', new Date())
              : null
          }
          onChange={(date) => handleDatePickerChange(date, 'rfpReleaseDate')}
          dateFormat="yyyy-MM-dd"
          className="form-control"
          name="rfpReleaseDate"
          // maxDate={new Date()} // Uncomment if needed
          autoComplete="off"
          showYearDropdown
          showMonthDropdown
          yearDropdownItemNumber={10}
          scrollableYearDropdown
          scrollableMonthDropdown
          placeholderText='YYYY-MM-DD'
        />
      </Form.Group>

      <Form.Group as={Col} controlId="bidSubmissionDate">
        <Form.Label className="text-start">Bid Submission Date </Form.Label>
        <DatePicker
          selected={
            formData.bidSubmissionDate
              ? parse(formData.bidSubmissionDate, 'yyyy-MM-dd', new Date())
              : null
          }
          onChange={(date) => handleDatePickerChange(date, 'bidSubmissionDate')}
          dateFormat="yyyy-MM-dd"
          className={`form-control ${errors.bidSubmissionDate ? 'is-invalid' : ''}`}
          name="bidSubmissionDate"
          // minDate={new Date()} // Uncomment if needed
          autoComplete="off"
          showYearDropdown
          showMonthDropdown
          yearDropdownItemNumber={10}
          scrollableYearDropdown
          scrollableMonthDropdown
          placeholderText='YYYY-MM-DD'
        />
        {errors.bidSubmissionDate && (
          <div className="invalid-feedback">{errors.bidSubmissionDate}</div>
        )}
      </Form.Group>
      <Form.Group as={Col} controlId="remarks">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="pqTq_remarks">
                  <Form.Label>PQ/TQ remarks</Form.Label>
                  <Form.Control
                    type="text"
                    name="pqTq_remarks"
                    value={formData.pqTq_remarks}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
            </fieldset>

            <Button variant="success" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Wait! Updating...' : 'Update'}
            </Button>
            <Button variant="secondary" onClick={handleReset} className="ms-2" disabled={isSubmitting}>
              Reset
            </Button>
            <Button variant="danger" onClick={handleCancel} className="ms-2" disabled={isSubmitting}>
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showDuplicateModal} onHide={() => setShowDuplicateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potential Duplicates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Opportunity Name</th>
                <th>Submission Date</th>
                <th>Business Segment</th>
              </tr>
            </thead>
            <tbody>
              {potentialDuplicates.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.id}</td>
                  <td>{lead.opportunityName}</td>
                  <td>{lead.bidSubmissionDate}</td>
                  <td>{lead.industrySegment?.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAnyway}>
            Update Anyway
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditLead;