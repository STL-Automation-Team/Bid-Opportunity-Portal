import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Opportunities.css';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [selectedFY, setSelectedFY] = useState('');
    const [accountData, setAccountData] = useState([]);
    const [columnValues, setColumnValues] = useState({
        q1: 'Vis', q2: 'Vis', h1: 'Vis', q3: 'Vis', q4: 'Vis', h2: 'Vis'
    });
    
    const [filters, setFilters] = useState({
        ob_fy: [],
        ob_qtr: [],
        priority: [],
        industry_segment: [],
        deal_status: [],
        primary_owner: [],
        search: ''
    });

    const columns = [
        'ob_fy', 'ob_qtr', 'ob_mmm', 'opportunity', 'industry_segment', 'primary_owner', 'tender_no'
    ];

    const columnNames = {
        ob_fy: 'OB FY',
        ob_qtr: 'OB Quarter',
        ob_mmm: 'OB MMM',
        opportunity: 'Opportunity',
        industry_segment: 'Industry Segment',
        primary_owner: 'Primary Owner',
        tender_no: 'Tender No',
        deal_status: 'Deal Status',
        priority: 'Priority'
    };

    const filterOptions = {
        ob_fy: ['FY23', 'FY24', 'FY25', 'FY26'],
        ob_qtr: ['Q1', 'Q2', 'Q3', 'Q4'],
        priority: ['Commit', 'TBD', 'Upside'],
        industry_segment: ['Public Sector', 'Bharatnet/CN', 'Defense', 'Telecom', 'Mining & Energy', 'GCC'],
        deal_status: ['Identified', 'Qualified', 'No-Go', 'Work in Progress', 'Bid Submitted', 'Won', 'Bid Dropped', 'Lost'],
        primary_owner: [
            "Mrityunjay Nautiyal", "Amit Kar", "Vaibhav Misra", "Srinivasulu AN",
            "Vivek Nigam", "Sumeet Banerjee", "Puneet Garg", "Ishwar Chandra",
            "Vijayanand Choudhury", "Ronak Soni"
        ]
    };

    const getCurrentQuarterAndFY = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const quarter = Math.floor((month - 1) / 3) + 1;
        const financialYearEnd = month >= 4 ? (year + 1) % 100 : year % 100;
        return { quarter, financialYearEnd };
    };

    useEffect(() => {
        const { financialYearEnd } = getCurrentQuarterAndFY();
        setSelectedFY(`FY${financialYearEnd}`);
    }, []);

    useEffect(() => {
        const dummyData = [
            { leader: 'Mrityunjay Nautiyal', account: 'Public Sector', q1: 100, q2: 150, q3: 200, q4: 250 },
            { leader: 'Amit Kar', account: 'Bharatnet/CN', q1: 120, q2: 170, q3: 220, q4: 270 },
            { leader: 'Vaibhav Misra', account: 'Defense', q1: 90, q2: 140, q3: 190, q4: 240 },
            { leader: 'Srinivasulu AN', account: 'Telecom', q1: 110, q2: 160, q3: 210, q4: 260 },
            { leader: 'Vivek Nigam', account: 'Mining & Energy', q1: 80, q2: 130, q3: 180, q4: 230 },
            { leader: 'Sumeet Banerjee', account: 'GCC', q1: 130, q2: 180, q3: 230, q4: 280 },
            { leader: 'Puneet Garg', account: 'Public Sector', q1: 95, q2: 145, q3: 195, q4: 245 },
            { leader: 'Ishwar Chandra', account: 'Bharatnet/CN', q1: 105, q2: 155, q3: 205, q4: 255 },
            { leader: 'Vijayanand Choudhury', account: 'Defense', q1: 115, q2: 165, q3: 215, q4: 265 },
            { leader: 'Ronak Soni', account: 'Telecom', q1: 85, q2: 135, q3: 185, q4: 235 },
        ];
        setAccountData(dummyData);
    }, [selectedFY]);

    useEffect(() => {
        fetch('http://localhost:8080/api/opportunities')
            .then(response => response.json())
            .then(data => {
                setOpportunities(data);
                setFilteredOpportunities(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        const filtered = opportunities.filter(op => {
            return Object.keys(filters).every(key => {
                if (key === 'search') {
                    return filters.search === '' || Object.values(op).some(value => 
                        value != null && value.toString().toLowerCase().includes(filters.search.toLowerCase())
                    );
                }
                return filters[key].length === 0 || filters[key].includes(op[key]);
            });
        });
        setFilteredOpportunities(filtered);
        setCurrentPage(1);
    }, [opportunities, filters]);

    const handleFilterChange = (selectedOptions, filterName) => {
        const value = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleFYChange = (e) => {
        setSelectedFY(e.target.value);
    };

    const handleColumnValueChange = (column, value) => {
        setColumnValues(prev => ({ ...prev, [column]: value }));
    };

    const totalOpportunities = opportunities.length;
    const qualifiedCount = opportunities.filter(op => op.deal_status === 'Qualified').length;
    const workInProgressCount = opportunities.filter(op => op.deal_status === 'Work in Progress').length;
    const bidSubmittedCount = opportunities.filter(op => op.deal_status === 'Bid Submitted').length;

    const handleCardClick = (status) => {
        setSelectedStatus(status);
        if (status === 'Total Opportunities') {
            setFilters({
        ob_fy: ['FY23', 'FY24', 'FY25', 'FY26'],
                ob_qtr: [],
                priority: [],
                industry_segment: [],
                deal_status: [],
                primary_owner: [],
                search: ''
            });
        } else {
            setFilters(prev => ({ ...prev, deal_status: [status] }));
        }
    };

    const getValueForPeriod = (row, period, type) => {
        const dummyData = {
            Vis: { q1: 100, q2: 150, q3: 200, q4: 250 },
            Act: { q1: 90, q2: 140, q3: 190, q4: 240 }
        };
        
        if (period === 'h1') {
            return dummyData[type].q1 + dummyData[type].q2;
        } else if (period === 'h2') {
            return dummyData[type].q3 + dummyData[type].q4;
        } else {
            return dummyData[type][period];
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const noFiltersApplied = Object.values(filters).every(filter => 
        Array.isArray(filter) ? filter.length === 0 : filter === ''
    );

    return (
        <div className="opportunities-container">
            <div className="expandable-area">
                <div className="expandable-header">
                    <h3>Account Segment Leaders Overview</h3>
                    <button onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? 'Minimize' : 'Maximize'}
                    </button>
                </div>
                {isExpanded && (
                    <div className="expandable-content">
                        <div className="fy-selector">
                            <select value={selectedFY} onChange={handleFYChange}>
                                {['FY23', 'FY24', 'FY25', 'FY26'].map(fy => (
                                    <option key={fy} value={fy}>{fy}</option>
                                ))}
                            </select>
                        </div>
                        <table className="account-table">
    <thead>
        <tr>
            <th rowSpan="2">Account Segment Leader</th>
            <th rowSpan="2">Account</th>
            <th colSpan="2">Q1{selectedFY}</th>
            <th colSpan="2">Q2{selectedFY}</th>
            <th colSpan="2">H1{selectedFY}</th>
            <th colSpan="2">Q3{selectedFY}</th>
            <th colSpan="2">Q4{selectedFY}</th>
            <th colSpan="2">H2{selectedFY}</th>
            <th colSpan="2">Total</th>
        </tr>
        <tr>
            <th>AGP</th>
            <th>
                <select value={columnValues.q1} onChange={(e) => handleColumnValueChange('q1', e.target.value)}>
                    <option value="Act">Act</option>
                    <option value="Vis">Vis</option>
                </select>
            </th>
            <th>AGP</th>
            <th>
                <select value={columnValues.q2} onChange={(e) => handleColumnValueChange('q2', e.target.value)}>
                    <option value="Act">Act</option>
                    <option value="Vis">Vis</option>
                </select>
            </th>
            <th>AGP</th>
            <th>
                <select value={columnValues.h1} onChange={(e) => handleColumnValueChange('h1', e.target.value)}>
                    <option value="Act">Act</option>
                    <option value="Vis">Vis</option>
                </select>
            </th>
            <th>AGP</th>
            <th>
                <select value={columnValues.q3} onChange={(e) => handleColumnValueChange('q3', e.target.value)}>
                    <option value="Act">Act</option>
                    <option value="Vis">Vis</option>
                </select>
            </th>
            <th>AGP</th>
            <th>
                <select value={columnValues.q4} onChange={(e) => handleColumnValueChange('q4', e.target.value)}>
                    <option value="Act">Act</option>
                    <option value="Vis">Vis</option>
                </select>
            </th>
            <th>AGP</th>
            <th>
                <select value={columnValues.h2} onChange={(e) => handleColumnValueChange('h2', e.target.value)}>
                    <option value="Act">Act</option>
                    <option value="Vis">Vis</option>
                </select>
            </th>
            <th>AGP Total</th>
            <th> Act/Vis Total</th>
        </tr>
    </thead>
    <tbody>
        {accountData.map((row, index) => (
            <tr key={index}>
                <td>{row.leader}</td>
                <td>{row.account}</td>
                <td>5</td>
                <td>{getValueForPeriod(row, 'q1', columnValues.q1)}</td>
                <td>5</td>
                <td>{getValueForPeriod(row, 'q2', columnValues.q2)}</td>
                <td>10</td>
                <td>{getValueForPeriod(row, 'h1', columnValues.h1)}</td>
                <td>5</td>
                <td>{getValueForPeriod(row, 'q3', columnValues.q3)}</td>
                <td>5</td>
                <td>{getValueForPeriod(row, 'q4', columnValues.q4)}</td>
                <td>10</td>
                <td>{getValueForPeriod(row, 'h2', columnValues.h2)}</td>
                <td>
                    {5 + 5 + 10 + 5 + 5 + 10}
                </td>
                <td>
                    {getValueForPeriod(row, 'q1', columnValues.q1) + 
                    getValueForPeriod(row, 'q2', columnValues.q2) + 
                    getValueForPeriod(row, 'q3', columnValues.q3) + 
                    getValueForPeriod(row, 'q4', columnValues.q4)}
                </td>
            </tr>
        ))}
        <tr className="total-row agp-total">
            <td colSpan="2">Total AGP</td>
            <td>{accountData.length * 5}</td>
            <td>-</td>
            <td>{accountData.length * 5}</td>
            <td>-</td>
            <td>{accountData.length * 10}</td>
            <td>-</td>
            <td>{accountData.length * 5}</td>
            <td>-</td>
            <td>{accountData.length * 5}</td>
            <td>-</td>
            <td>{accountData.length * 10}</td>
            <td>-</td>
            <td>{accountData.length * 40}</td>
            <td>-</td>
        </tr>
        <tr className="total-row vis-act-total">
            <td colSpan="2">Total {Object.values(columnValues)[0]}</td>
            <td>-</td>
            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row, 'q1', columnValues.q1), 0)}</td>
            <td>-</td>
            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row, 'q2', columnValues.q2), 0)}</td>
            <td>-</td>
            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row, 'h1', columnValues.h1), 0)}</td>
            <td>-</td>
            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row, 'q3', columnValues.q3), 0)}</td>
            <td>-</td>
            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row, 'q4', columnValues.q4), 0)}</td>
            <td>-</td>
            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row, 'h2', columnValues.h2), 0)}</td>
            <td>-</td>
            <td>
                {accountData.reduce((sum, row) => 
                    sum + 
                    getValueForPeriod(row, 'q1', columnValues.q1) + 
                    getValueForPeriod(row, 'q2', columnValues.q2) + 
                    getValueForPeriod(row, 'q3', columnValues.q3) + 
                    getValueForPeriod(row, 'q4', columnValues.q4), 
                0)}
            </td>
        </tr>
    </tbody>
</table>
                    </div>
                )}
            </div>
            
            <div className="fixed-button">
                <Link to="/addopportunity" className="btn btn-primary">Add Opportunity</Link>
            </div>
        </div>
    );
};

export default Opportunities;











// import axios from 'axios';
// import { default as React, useEffect, useState } from 'react';
// import { Button, Card, Col, Form, Row } from 'react-bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { BASE_URL } from '../../components/constants';
// const CreateOpportunity = () => {
//     const [formData, setFormData] = useState({
//         priority_bid: '',
//         ob_fy: '',
//         ob_qtr: '',
//         ob_mmm: '',
//         priority: '',
//         opportunity: '',
//         opportunity_type: '',
//         amount_inr_cr_max: '',
//         amount_inr_cr_min: '',
//         rev_in_ob_qtr: '',
//         rev_in_ob_qtr_plus_1: '',
//         business_unit: '',
//         industry_segment: '',
//         primary_offering_segment: '',
//         secondary_offering_segment: '',
//         part_quarter: '',
//         part_month: '',
//         project_tenure_months: '',
//         est_capex_inr_cr: '',
//         est_opex_inr_cr: '',
//         opex_tenure_months: '',
//         deal_status: '',
//         go_no_go_status: '',
//         go_no_go_date: '',
//         solution_readiness: '',
//         customer_alignment: '',
//         stl_preparedness: '',
//         readiness_as_per_timeline: '',
//         gm_percentage: '',
//         probability: '',
//         sales_role: '',
//         primary_owner: '',
//         leader_for_aircover: '',
//         source: '',
//         source_person: '',
//         lead_received_date: '',
//         release_date: '',
//         submission_date: '',
//         decision_date: '',
//         additional_remarks: '',
//         tender_no: '',
//         scope_of_work: '',
//       });
    
//       const [error, setError] = useState('');
//       const [success, setSuccess] = useState('');
//       const [showModal, setShowModal] = useState(false);
//       const [users, setUsers] = useState([]);

//       const handleCloseModal = () => {
//         setShowModal(false);
//         // navigate("/userslist");
//       };
     
//       const handleShowModal = () => {
//         setShowModal(true);
//       };
    
//       const handleChange = (e) => {
//         setFormData({
//           ...formData,
//           [e.target.name]: e.target.value,
//         });
//       };

//       useEffect(() => {
//         // Fetch user data from the API
//         axios.get(`${BASE_URL}/api/allusers`)
//           .then(response => {
//             setUsers(response.data);
//           })
//           .catch(error => {
//             console.error('Error fetching users:', error);
//           });
//       }, []);
    
//       const handleClose = () => {
//         setFormData({
//             priority_bid: '',
//             ob_fy: '',
//             ob_qtr: '',
//             ob_mmm: '',
//             priority: '',
//             opportunity: '',
//             opportunity_type: '',
//             amount_inr_cr_max: '',
//             amount_inr_cr_min: '',
//             rev_in_ob_qtr: '',
//             rev_in_ob_qtr_plus_1: '',
//             business_unit: '',
//             industry_segment: '',
//             primary_offering_segment: '',
//             secondary_offering_segment: '',
//             part_quarter: '',
//             part_month: '',
//             project_tenure_months: '',
//             est_capex_inr_cr: '',
//             est_opex_inr_cr: '',
//             opex_tenure_months: '',
//             deal_status: '',
//             go_no_go_status: '',
//             go_no_go_date: '',
//             solution_readiness: '',
//             customer_alignment: '',
//             stl_preparedness: '',
//             readiness_as_per_timeline: '',
//             gm_percentage: '',
//             probability: '',
//             sales_role: '',
//             primary_owner: '',
//             leader_for_aircover: '',
//             source: '',
//             source_person: '',
//             lead_received_date: '',
//             release_date: '',
//             submission_date: '',
//             decision_date: '',
//             additional_remarks: '',
//             tender_no: '',
//             scope_of_work: '',
//         });
//         setError('');
//         setSuccess('');
//       };
//       const handleSubmit = async (e) => {
//         e.preventDefault();
//         const postData = {
//           ...formData,
//           amount_inr_cr_max: parseFloat(formData.amount_inr_cr_max),
//           amount_inr_cr_min: parseFloat(formData.amount_inr_cr_min),
//           est_capex_inr_cr: parseFloat(formData.est_capex_inr_cr),
//           est_opex_inr_cr: parseFloat(formData.est_opex_inr_cr),
//           gm_percentage: parseFloat(formData.gm_percentage),
//           probability: parseFloat(formData.probability),
//         };
//         try {
//             console.log(postData);
//           const response = await axios.post(`${BASE_URL}/api/opportunities`, postData, {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           });
//           if (response.status === 201 || response.status === 200) {
//             toast.success('Entry created successfully.');
//             handleClose();
//           } else {
//             toast.error('Failed to create entry.');
//           }
//         } catch (err) {
//           toast.error('Failed to create entry.');
//           console.error(err);
//         }
//       };
        

//   return (
    
//     <><ToastContainer /><Card style={{ width: '100%', height: '100%', margin: '1rem', maxWidth: '98%' }}>
//           <Card.Body>
//               <Form onSubmit={handleSubmit}>
//                   <fieldset>
//                       {/* <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Basic Info</legend> */}
//                       <Row className="mb-2">
//                           <Form.Group as={Col} controlId="ob_fy">
//                               <Form.Label className="text-start">OB FY</Form.Label>
//                               <Form.Control as="select" name="ob_fy" value={formData.ob_fy} onChange={handleChange} required>
//                                   <option value="FY24">FY24</option>
//                                   <option value="FY25">FY25</option>
//                                   <option value="FY26">FY26</option>
//                               </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="ob_qtr">
//                               <Form.Label className="text-start">OB Qtr</Form.Label>
//                               <Form.Control as="select" name="ob_qtr" value={formData.ob_qtr} onChange={handleChange} required>
//                                   <option value="Q1">Q1</option>
//                                   <option value="Q2">Q2</option>
//                                   <option value="Q3">Q3</option>
//                                   <option value="Q4">Q4</option>
//                               </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="ob_mmm">
//                               <Form.Label className="text-start">OB MMM</Form.Label>
//                               <Form.Control as="select" name="ob_mmm" value={formData.ob_mmm} onChange={handleChange} required>
//                                   <option value="January">January</option>
//                                   <option value="February">February</option>
//                                   <option value="March">March</option>
//                                   <option value="April">April</option>
//                                   <option value="May">May</option>
//                                   <option value="June">June</option>
//                                   <option value="July">July</option>
//                                   <option value="August">August</option>
//                                   <option value="September">September</option>
//                                   <option value="October">October</option>
//                                   <option value="November">November</option>
//                                   <option value="December">December</option>
//                               </Form.Control>
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="priority">
//                               <Form.Label className="text-start">Priority</Form.Label>
//                               <Form.Control as="select" name="priority" value={formData.priority} onChange={handleChange} required>
//                                   <option value="Commit">Commit</option>
//                                   <option value="TBD">TBD</option>
//                                   <option value="Upside">Upside</option>
//                               </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="business_unit">
//                               <Form.Label className="text-start">Business Unit</Form.Label>
//                               <Form.Control as="select" name="business_unit" value={formData.business_unit} onChange={handleChange} required>
//                                   <option value="GSB">GSB</option>
//                                   <option value="Digital">Digital</option>
//                               </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="industry_segment">
//                               <Form.Label className="text-start">Industry Segment</Form.Label>
//                               <Form.Control as="select" name="industry_segment" value={formData.industry_segment} onChange={handleChange} required>
//                                   <option value="Public Sector">Public Sector</option>
//                                   <option value="Bharatnet/CN">Bharatnet/CN</option>
//                                   <option value="Defense">Defense</option>
//                                   <option value="Telecom">Telecom</option>
//                                   <option value="Mining & Energy">Mining & Energy</option>
//                                   <option value="GCC">GCC</option>
//                               </Form.Control>
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="opportunity">
//                               <Form.Label className="text-start">Opportunity</Form.Label>
//                               <Form.Control type="text" name="opportunity" value={formData.opportunity} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                       <Form.Group as={Col} controlId="amount_inr_cr_min">
//                               <Form.Label className="text-start">Amount INR Cr Min</Form.Label>
//                               <Form.Control type="number" name="amount_inr_cr_min" value={formData.amount_inr_cr_min} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="amount_inr_cr_max">
//                               <Form.Label className="text-start">Amount INR Cr Max</Form.Label>
//                               <Form.Control type="number" name="amount_inr_cr_max" value={formData.amount_inr_cr_max} onChange={handleChange} required />
//                           </Form.Group>
                         
//                           <Form.Group as={Col} controlId="est_capex_inr_cr">
//                               <Form.Label className="text-start">Est. Capex INR Cr</Form.Label>
//                               <Form.Control type="number" name="est_capex_inr_cr" value={formData.est_capex_inr_cr} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="est_opex_inr_cr">
//                               <Form.Label className="text-start">Est. Opex INR Cr</Form.Label>
//                               <Form.Control type="number" name="est_opex_inr_cr" value={formData.est_opex_inr_cr} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="deal_status">
//                               <Form.Label className="text-start">Deal Status</Form.Label>
//                               <Form.Control as="select" name="deal_status" value={formData.deal_status} onChange={handleChange} required>
//                                   <option value="Identified">Identified</option>
//                                   <option value="Qualified">Qualified</option>
//                                   <option value="No-Go">No-Go</option>
//                                   <option value="Work in Progress">Work in Progress</option>
//                                   <option value="Bid Submitted">Bid Submitted</option>
//                                   <option value="Won">Won</option>
//                                   <option value="Bid Dropped">Bid Dropped</option>
//                                   <option value="Lost">Lost</option>
//                               </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="go_no_go_status">
//                               <Form.Label className="text-start">Go/No Go Status</Form.Label>
//                               <Form.Control as="select" name="go_no_go_status" value={formData.go_no_go_status} onChange={handleChange} required>
//                                   <option value="">Select Go/No Go Status</option>
//                                   <option value="Done">Done</option>
//                                   <option value="Scheduled">Scheduled</option>
//                                   <option value="Pending">Pending</option>
//                               </Form.Control>
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="go_no_go_date">
//                               <Form.Label className="text-start">Go/No Go Date</Form.Label>
//                               <Form.Control type="date" name="go_no_go_date" value={formData.go_no_go_date} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="gm_percentage">
//                               <Form.Label className="text-start">GM Percentage</Form.Label>
//                               <Form.Control type="number" step="0.01" name="gm_percentage" value={formData.gm_percentage} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="probability">
//                               <Form.Label className="text-start">Probability</Form.Label>
//                               <Form.Control type="number" step="0.01" name="probability" value={formData.probability} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                   </fieldset>

//                   {/* <fieldset>
//                       <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Financial Info</legend>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="amount_inr_cr_max">
//                               <Form.Label className="text-start">Amount INR Cr Max</Form.Label>
//                               <Form.Control type="number" name="amount_inr_cr_max" value={formData.amount_inr_cr_max} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="amount_inr_cr_min">
//                               <Form.Label className="text-start">Amount INR Cr Min</Form.Label>
//                               <Form.Control type="number" name="amount_inr_cr_min" value={formData.amount_inr_cr_min} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="est_capex_inr_cr">
//                               <Form.Label className="text-start">Est. Capex INR Cr</Form.Label>
//                               <Form.Control type="number" name="est_capex_inr_cr" value={formData.est_capex_inr_cr} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="est_opex_inr_cr">
//                               <Form.Label className="text-start">Est. Opex INR Cr</Form.Label>
//                               <Form.Control type="number" name="est_opex_inr_cr" value={formData.est_opex_inr_cr} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                   </fieldset> */}

//                   {/* <fieldset>
//                       <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Status Info</legend>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="deal_status">
//                               <Form.Label className="text-start">Deal Status</Form.Label>
//                               <Form.Control as="select" name="deal_status" value={formData.deal_status} onChange={handleChange} required>
//                                   <option value="Identified">Identified</option>
//                                   <option value="Qualified">Qualified</option>
//                                   <option value="No-Go">No-Go</option>
//                                   <option value="Work in Progress">Work in Progress</option>
//                                   <option value="Bid Submitted">Bid Submitted</option>
//                                   <option value="Won">Won</option>
//                                   <option value="Bid Dropped">Bid Dropped</option>
//                                   <option value="Lost">Lost</option>
//                               </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="go_no_go_status">
//                               <Form.Label className="text-start">Go/No Go Status</Form.Label>
//                               <Form.Control as="select" name="go_no_go_status" value={formData.go_no_go_status} onChange={handleChange} required>
//                                   <option value="">Select Go/No Go Status</option>
//                                   <option value="Done">Done</option>
//                                   <option value="Scheduled">Scheduled</option>
//                                   <option value="Pending">Pending</option>
//                               </Form.Control>
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="go_no_go_date">
//                               <Form.Label className="text-start">Go/No Go Date</Form.Label>
//                               <Form.Control type="date" name="go_no_go_date" value={formData.go_no_go_date} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="gm_percentage">
//                               <Form.Label className="text-start">GM Percentage</Form.Label>
//                               <Form.Control type="number" step="0.01" name="gm_percentage" value={formData.gm_percentage} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="probability">
//                               <Form.Label className="text-start">Probability</Form.Label>
//                               <Form.Control type="number" step="0.01" name="probability" value={formData.probability} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                   </fieldset> */}

//                   <fieldset>
//                       {/* <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Other Info</legend> */}
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="sales_role">
//                               <Form.Label className="text-start">Sales Role</Form.Label>
//                               <Form.Control type="text" name="sales_role" value={formData.sales_role} onChange={handleChange} required />
//                           </Form.Group>
//                           {/* <Form.Group as={Col} controlId="primary_owner">
//                               <Form.Label className="text-start">Primary Owner</Form.Label>
//                               <Form.Control type="text" name="primary_owner" value={formData.primary_owner} onChange={handleChange} required />
//                           </Form.Group> */}
//                           <Form.Group as={Col} controlId="primary_owner">
//                             <Form.Label className="text-start">Primary Owner</Form.Label>
//                             <Form.Control 
//                                 as="select"
//                                 name="primary_owner"
//                                 value={formData.primary_owner}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="">Select Primary Owner</option>
//                                 {users.map(user => (
//                                 <option key={user.id} value={user.id}>
//                                     {user.firstName} {user.lastName}
//                                 </option>
//                                 ))}
//                             </Form.Control>
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="source">
//                               <Form.Label className="text-start">Source</Form.Label>
//                               <Form.Control type="text" name="source" value={formData.source} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="source_person">
//                               <Form.Label className="text-start">Source Person</Form.Label>
//                               <Form.Control type="text" name="source_person" value={formData.source_person} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-1">
//                           <Form.Group as={Col} controlId="lead_received_date">
//                               <Form.Label className="text-start">Lead Received Date</Form.Label>
//                               <Form.Control type="date" name="lead_received_date" value={formData.lead_received_date} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="release_date">
//                               <Form.Label className="text-start">Release Date</Form.Label>
//                               <Form.Control type="date" name="release_date" value={formData.release_date} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="submission_date">
//                               <Form.Label className="text-start">Submission Date</Form.Label>
//                               <Form.Control type="date" name="submission_date" value={formData.submission_date} onChange={handleChange} required />
//                           </Form.Group>
//                           <Form.Group as={Col} controlId="decision_date">
//                               <Form.Label className="text-start">Decision Date</Form.Label>
//                               <Form.Control type="date" name="decision_date" value={formData.decision_date} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                       <Row className="mb-3">
//                           <Form.Group as={Col} controlId="additional_remarks">
//                               <Form.Label className="text-start">Additional Remarks</Form.Label>
//                               <Form.Control as="textarea" rows={3} name="additional_remarks" value={formData.additional_remarks} onChange={handleChange} required />
//                           </Form.Group>
//                       </Row>
//                   </fieldset>

//                   {/* <fieldset>
                     
//                   </fieldset> */}

//                   {/* <fieldset>
//                       <legend style={{borderRadius: '0px', border: 'none', background:'grey'}}>Remarks</legend>
                      
//                   </fieldset> */}

//                   <Button variant="success" type="submit">
//                       Submit
//                   </Button>
//               </Form>
//           </Card.Body>
//       </Card></>
//   );
// };

// export default CreateOpportunity;
