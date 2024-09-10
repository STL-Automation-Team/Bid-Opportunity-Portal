import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { BASE_URL } from '../../components/constants';
import CountCard from '../MainDashboard/CountCard';
import ExpandableTable from './ExpandableTable';
import './Opportunities.css';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate();
    const [selectedFY, setSelectedFY] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
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
        const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token');
        console.log(token);
        fetch(`${BASE_URL}/api/opportunities`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
            ).then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => b.id - a.id);
                setOpportunities(sortedData);
                setFilteredOpportunities(sortedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (!noFiltersApplied) {
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
            const sortedFiltered = filtered.sort((a, b) => b.id - a.id);
            setFilteredOpportunities(sortedFiltered);
            setCurrentPage(1);
        } else {
            setFilteredOpportunities([]);
        }
    }, [opportunities, filters]);

    const handleFilterChange = (selectedOptions, filterName) => {
        const value = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFilters(prev => ({ ...prev, [filterName]: value }));
        setSearchPerformed(true);
    };

    const handleSearchChange = (e) => {
        if (!noFiltersApplied) {
            setFilters(prev => ({ ...prev, search: e.target.value }));
            setSearchPerformed(true);
        }
    };

    const noFiltersApplied = Object.values(filters).every(filter => 
        Array.isArray(filter) ? filter.length === 0 : filter === ''
    );
    const handleFYChange = (e) => {
        setSelectedFY(e.target.value);
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

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // const noFiltersApplied = Object.values(filters).every(filter => 
    //     Array.isArray(filter) ? filter.length === 0 : filter === ''
    // );

    return (
        <div className="opportunities-container">
            <div className="cards-container">
                <CountCard
                    title="Total Opportunities"
                    count={totalOpportunities}
                    baseColor="#4caf50"
                    onClick={() => handleCardClick('Total Opportunities')}
                />
                <CountCard
                    title="Qualified"
                    count={qualifiedCount}
                    baseColor="#2196f3"
                    onClick={() => handleCardClick('Qualified')}
                />
                <CountCard
                    title="Work in Progress"
                    count={workInProgressCount}
                    baseColor="#ff9800"
                    onClick={() => handleCardClick('Work in Progress')}
                />
                <CountCard
                    title="Bid Submitted"
                    count={bidSubmittedCount}
                    baseColor="#00b7b7"
                    onClick={() => handleCardClick('Bid Submitted')}
                />
            </div>
            <div className="filter-container">
                {Object.keys(filterOptions).map(filterName => (
                    <div key={filterName} className="filter-dropdown">
                        <Select
                            isMulti
                            options={filterOptions[filterName].map(option => ({ value: option, label: option }))}
                            value={filters[filterName].map(value => ({ value, label: value }))}
                            onChange={(selectedOptions) => handleFilterChange(selectedOptions, filterName)}
                            placeholder={`${columnNames[filterName] || filterName }`}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                ))}
                <input 
                    type="text" 
                    placeholder={noFiltersApplied ? "Select filters to enable search" : "Search Opportunity..."}
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="search-input"
                    disabled={noFiltersApplied}
                />
            </div>

            {noFiltersApplied && (
                <div className="no-filter-message">
                    Please select filters to view opportunities.
                </div>
            )}

            {!noFiltersApplied && filteredOpportunities.length === 0 && (
                <div className="no-filter-message">
                    No opportunities found matching your search.
                </div>
            )}

            {!noFiltersApplied && filteredOpportunities.length > 0 && (
                <>
                    <div className="table-container">
                        <table className="opportunities-table">
                            <thead>
                                <tr>
                                    {columns.map(column => (
                                        <th key={column}>{columnNames[column]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(opportunity => (
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
                    </div>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(filteredOpportunities.length / itemsPerPage) }, (_, i) => (
                            <button 
                                key={i} 
                                onClick={() => paginate(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <div className="expandable-area">
                <div className="expandable-header">
                    <h3>Account Segment Leaders Overview</h3>
                    <div>
                        <button 
                            onClick={() => navigate('/addopportunity')}
                            className="btn btn-blue"
                            style={{marginRight : "13px", backgroundColor:"blue"}}
                        >
                            Add Opportunity
                        </button>
                        <button onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? 'Minimize' : 'Maximize'}
                        </button>
                    </div>
                </div>
                {isExpanded && (
                    <div>
                        <div className="fy-selector">
                            <select value={selectedFY} onChange={handleFYChange}>
                                {['FY23', 'FY24', 'FY25', 'FY26'].map(fy => (
                                    <option key={fy} value={fy}>{fy}</option>
                                ))}
                            </select>
                        </div>
                        <ExpandableTable selectedFY={selectedFY} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Opportunities;


  // const toggleQuarterExpansion = (quarter) => {
    //     setExpandedQuarters(prev => ({
    //         ...prev,
    //         [quarter]: !prev[quarter]
    //     }));
    // };
    // const handleColumnValueChange = (column, value) => {
    //     setColumnValues(prev => ({ ...prev, [column]: value }));
    // };
    // const getValueForPeriod = (row, period, type) => {
    //     const dummyData = {
    //         Vis: { q1: 100, q2: 150, q3: 200, q4: 250 },
    //         Act: { q1: 90, q2: 140, q3: 190, q4: 240 }
    //     };
        
    //     if (period === 'h1') {
    //         return dummyData[type].q1 + dummyData[type].q2;
    //     } else if (period === 'h2') {
    //         return dummyData[type].q3 + dummyData[type].q4;
    //     } else {
    //         return dummyData[type][period];
    //     }
    // };
    // const getMonthLabel = (quarter, monthIndex) => {
    //     const months = {
    //         q1: ['Apr', 'May', 'Jun'],
    //         q2: ['Jul', 'Aug', 'Sep'],
    //         q3: ['Oct', 'Nov', 'Dec'],
    //         q4: ['Jan', 'Feb', 'Mar']
    //     };
    //     return months[quarter][monthIndex - 1];
    // };