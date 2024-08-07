import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import assetIcon from '../../images/cardLogo/asseticon.png';
import operationIcon from '../../images/cardLogo/operationicon.png';
import serviceIcon from '../../images/cardLogo/serviceicon.png';
import CountCard from '../MainDashboard/CountCard';
import './Opportunities.css';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);

    const [selectedFY, setSelectedFY] = useState('');
    const [accountData, setAccountData] = useState([]);
    const [columnValues, setColumnValues] = useState({
        q1: 'Vis', q2: 'Vis', h1: 'Vis', q3: 'Vis', q4: 'Vis', h2: 'Vis'
    });
    

    const [filters, setFilters] = useState({
        ob_fy: '',
        ob_qtr: '',
        priority: '',
        industry_segment: '',
        deal_status: '',
        primary_owner: '',
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
        tender_no: 'Tender No'
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
    const accounts = ['Public Sector', 'Bharatnet/CN', 'Defense', 'Telecom', 'Mining & Energy', 'GCC'];

    useEffect(() => {
        // This is where you would fetch the account data based on the selected FY
        // For now, we'll use dummy data
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

    const handleFYChange = (e) => {
        setSelectedFY(e.target.value);
    };

    

    const handleColumnValueChange = (column, value) => {
        setColumnValues(prev => ({ ...prev, [column]: value }));
    };

    const calculateHalf = (row, half) => {
        if (half === 'h1') {
            return row.q1 + row.q2;
        } else {
            return row.q3 + row.q4;
        }
    };

    const calculateTotal = (row) => {
        return row.q1 + row.q2 + row.q3 + row.q4;
    };

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
        const isAnyFilterActive = Object.values(filters).some(filter => filter !== '');

        if (!isAnyFilterActive) {
            setFilteredOpportunities([]);
            return;
        }
        const filtered = opportunities.filter(op => {
            const searchMatch = filters.search === '' || Object.values(op).some(value => 
                value != null && value.toString().toLowerCase().includes(filters.search.toLowerCase())
            );
    
            return (
                (filters.ob_fy === '' || (op.ob_fy != null && op.ob_fy === filters.ob_fy)) &&
                (filters.ob_qtr === '' || (op.ob_qtr != null && op.ob_qtr === filters.ob_qtr)) &&
                (filters.priority === '' || (op.priority != null && op.priority === filters.priority)) &&
                (filters.industry_segment === '' || (op.industry_segment != null && op.industry_segment === filters.industry_segment)) &&
                (filters.deal_status === '' || (op.deal_status != null && op.deal_status === filters.deal_status)) &&
                (filters.primary_owner === '' || (op.primary_owner != null && op.primary_owner === filters.primary_owner)) &&
                searchMatch
            );
        });
        setFilteredOpportunities(filtered);
    }, [opportunities, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const totalOpportunities = opportunities.length;
    const qualifiedCount = opportunities.filter(op => op.deal_status === 'Qualified').length;
    const workInProgressCount = opportunities.filter(op => op.deal_status === 'Work in Progress').length;
    const bidSubmittedCount = opportunities.filter(op => op.deal_status === 'Bid Submitted').length;

    const handleCardClick = (status) => {
        setSelectedStatus(status);
        if (status === 'Total Opportunities') {
            setFilters(prev => ({
                ...prev,
                deal_status: '',
                ob_fy: '',
                ob_qtr: '',
                priority: '',
                industry_segment: '',
                primary_owner: '',
                search: ''
            }));
        } else {
            setFilters(prev => ({ ...prev, deal_status: status }));
        }
    };

    const isAnyFilterActive = Object.values(filters).some(filter => filter !== '');

    const getValueForPeriod = (row, period, type) => {
        // This function would ideally fetch data based on the period, FY, owner, and segment
        // For now, we'll use dummy data
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

    return (
        <div className="opportunities-container">
            <div className="cards-container">
                <CountCard
                    title="Total Opportunities"
                    count={totalOpportunities}
                    baseColor="#4caf50"
                    cardLogo={operationIcon}
                    onClick={() => handleCardClick('Total Opportunities')}
                />
                <CountCard
                    title="Qualified"
                    count={qualifiedCount}
                    baseColor="#2196f3"
                    cardLogo={serviceIcon}
                    onClick={() => handleCardClick('Qualified')}
                />
                <CountCard
                    title="Work in Progress"
                    count={workInProgressCount}
                    baseColor="#ff9800"
                    cardLogo={assetIcon}
                    onClick={() => handleCardClick('Work in Progress')}
                />
                <CountCard
                    title="Bid Submitted"
                    count={bidSubmittedCount}
                    baseColor="#00b7b7"
                    cardLogo={assetIcon}
                    onClick={() => handleCardClick('Bid Submitted')}
                />
            </div>
            <div className="filter-container">
                <select name="ob_fy" onChange={handleFilterChange} value={filters.ob_fy}>
                    <option value="">Select FY</option>
                    {['FY23', 'FY24', 'FY25', 'FY26'].map(fy => (
                        <option key={fy} value={fy}>{fy}</option>
                    ))}
                </select>
                <select name="ob_qtr" onChange={handleFilterChange} value={filters.ob_qtr}>
                    <option value="">Select Quarter</option>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                        <option key={q} value={q}>{q}</option>
                    ))}
                </select>
                <select name="priority" onChange={handleFilterChange} value={filters.priority}>
                    <option value="">Select Priority</option>
                    {['Commit', 'TBD', 'Upside'].map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <select name="industry_segment" onChange={handleFilterChange} value={filters.industry_segment}>
                    <option value="">Select Industry Segment</option>
                    {['Public Sector', 'Bharatnet/CN', 'Defense', 'Telecom', 'Mining & Energy', 'GCC'].map(seg => (
                        <option key={seg} value={seg}>{seg}</option>
                    ))}
                </select>
                <select name="deal_status" onChange={handleFilterChange} value={filters.deal_status}>
                    <option value="">Select Deal Status</option>
                    {['Identified', 'Qualified', 'No-Go', 'Work in Progress', 'Bid Submitted', 'Won', 'Bid Dropped', 'Lost'].map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <select name="primary_owner" onChange={handleFilterChange} value={filters.primary_owner}>
                    <option value="">Select Primary Owner</option>
                    {[
                        "Mrityunjay Nautiyal",
                        "Amit Kar",
                        "Vaibhav Misra",
                        "Srinivasulu AN",
                        "Vivek Nigam",
                        "Sumeet Banerjee",
                        "Puneet Garg",
                        "Ishwar Chandra",
                        "Vijayanand Choudhury",
                        "Ronak Soni"
                        ].map(owner => (
                        <option key={owner} value={owner}>{owner}</option>
                    ))}
                </select>
                <input 

                    type="text" 
                    placeholder="Search..." 
                    name="search" 
                    onChange={handleFilterChange} 
                    value={filters.search}
                />
            </div>
            <div className="table-container">
                {isAnyFilterActive ? (
                    filteredOpportunities.length > 0 ? (
                        <table className="opportunities-table">
                            <thead>
                                <tr>
                                    {columns.map(column => (
                                        <th key={column}>{columnNames[column]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOpportunities.map(opportunity => (
                                    <tr key={opportunity.id}>
                                        {columns.map(column => (
                                            <td key={column}>
                                                <Link to={`/opportunity/${opportunity.id}`}>
                                                    {opportunity[column]}
                                                </Link>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-results-message">
                            No opportunities match the selected filters.
                        </div>
                    )
                ) : (
                    <div className="no-filter-message">
                        Please select at least one filter to view opportunities.
                    </div>
                )}
            </div>
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