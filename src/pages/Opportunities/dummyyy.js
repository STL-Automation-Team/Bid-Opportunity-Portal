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