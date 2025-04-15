import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { BASE_URL } from '../../components/constants';
import CountCard from '../MainDashboard/CountCard';
import ExpandableTable from './ExpandableTable';
import './Opportunities.css';

const Opportunities = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    
    // Data states
    const [opportunities, setOpportunities] = useState([]);
    const [totalLeadscnt, setTotalLeadscnt] = useState(0);
    const [leadsSubmitted, setLeadsSubmitted] = useState(0);
    const [wonleads, setWonLeads] = useState(0);
    const [lostleads, setLostLeads] = useState(0);
    const [resAw, setResAwa] = useState(0);

    const [totalLeadscnt_tl, setTotalLeadscnt_tl] = useState(0);
    const [leadsSubmitted_ls, setLeadsSubmitted_ls] = useState(0);
    const [wonleads_wn, setWonLeads_wn] = useState(0);
    const [lostleads_lt, setLostLeads_lt] = useState(0);
    const [resAw_ra, setResAwa_ra] = useState(0);
    
    // UI states
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [permissions, setPermissions] = useState([]);
    
    // Filter states
    const [filters, setFilters] = useState({
        obFy: [],
        obQtr: [],
        priority: [],
        industrySegment: [],
        dealStatus: [],
        primaryOwner: [],
        search: '',
        selectedFlorence: ''
    });

    const columns = [
        'obFy', 'obQtr', 'obMmm', 'opportunityName', 'industrySegment', 'primaryOwner', 'amount', 'dealStatus'
    ];
    
    const columnNames = {
        obFy: 'OB FY',
        obQtr: 'OB Quarter',
        obMmm: 'OB MMM',
        opportunityName: 'Opportunity',
        industrySegment: 'Industry Segment',
        primaryOwner: 'Primary Owner',
        dealStatus: 'Deal Status',
        priority: 'Priority',
        amount: 'Amount (INR Cr)'
    };
    
    const filterOptions = {
        obFy: ['2024', '2025', '2026', '2027'],
        obQtr: ['Q1', 'Q2', 'Q3', 'Q4'],
        priority: ['Commit', 'TBD', 'Upside'],
        industrySegment: ['Public Sector', 'Bharatnet/CN', 'Defence', 'Telecom', 'Mining & Energy', 'GCC'],
        dealStatus: ['Identified', 'Qualified', 'No-Go', 'Work in Progress', 'Bid Submitted', 'Won', 'Bid Dropped', 'Lost'],
        primaryOwner: [
            "Mrityunjay Nautiyal", "Amit Kar", "Vaibhav Misra", "Srinivasulu AN",
            "Vivek Nigam", "Sumeet Banerjee", "Puneet Garg", "Ishwar Chandra",
            "Vijayanand Choudhury", "Ronak Soni", "Tarun Soni", "Anupma Gupta", "Ajay Aggarwal", "Aditya Verma"
        ]
    };

    const keyMap = {
        obFy: 'obFy.obFy',
        industrySegment: 'industrySegment.name',
        dealStatus: 'dealStatus.dealStatus',
        priority: 'priority.priority',
        amount: 'amount'
    };

    // Helper functions
    const getCurrentQuarterAndFY = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const quarter = Math.floor((month - 1) / 3) + 1;
        const financialYearEnd = month >= 4 ? year + 1 : year;
        const fyIdMap = { 2024: 1, 2025: 2, 2026: 3, 2027: 4 };
        const fyId = fyIdMap[financialYearEnd];
        return { quarter, financialYearEnd, fyId };
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
    };

    // Data fetching
    const fetchCardData = useCallback(async (fyIds) => {
        setLoading(true);
        try {
            const [totalLeads1, leadsSubmitted1, won1, lost1, resulAwa] = await Promise.all([
                axios.post(`${BASE_URL}/api/leads/filter-by-ids`, { fyIds }, { 
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
                }),
                axios.post(`${BASE_URL}/api/leads/filter-by-ids`, { fyIds, dealStatusIds: [4] }, { 
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
                }),
                axios.post(`${BASE_URL}/api/leads/filter-by-ids`, { fyIds, dealStatusIds: [11] }, { 
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
                }),
                axios.post(`${BASE_URL}/api/leads/filter-by-ids`, { fyIds, dealStatusIds: [5] }, { 
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
                }),
                axios.post(`${BASE_URL}/api/leads/filter-by-ids`, { fyIds, dealStatusIds: [4, 8] }, { 
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
                })
            ]);
            
            const sortedData = totalLeads1.data.content.sort((a, b) => b.id - a.id);
            
            setTotalLeadscnt(totalLeads1.data.totalElements);
            const totalAmount_tl = totalLeads1.data.content.reduce((sum, item) => sum + (item.amount || 0), 0);
            setTotalLeadscnt_tl(totalAmount_tl);

            setLeadsSubmitted(leadsSubmitted1.data.totalElements);
            const totalAmount_ls = leadsSubmitted1.data.content.reduce((sum, item) => sum + (item.amount || 0), 0);
            setLeadsSubmitted_ls(totalAmount_ls);

            setWonLeads(won1.data.totalElements);
            const totalAmount_wn = won1.data.content.reduce((sum, item) => sum + (item.amount || 0), 0);
            setWonLeads_wn(totalAmount_wn);

            setLostLeads(lost1.data.totalElements);
            const totalAmount_lt = lost1.data.content.reduce((sum, item) => sum + (item.amount || 0), 0);
            setLostLeads_lt(totalAmount_lt);

            setResAwa(resulAwa.data.totalElements);
            const totalAmount_ra = resulAwa.data.content.reduce((sum, item) => sum + (item.amount || 0), 0);
            setResAwa_ra(totalAmount_ra);

            setOpportunities(sortedData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    }, [token]);

    // Initial load
    useEffect(() => {
        const { financialYearEnd, fyId } = getCurrentQuarterAndFY();
        setFilters(prev => ({
            ...prev,
            obFy: [`${financialYearEnd}`], // Default to current FY
            selectedFY: `FY${financialYearEnd % 100}`
        }));
        fetchCardData([fyId]);
        
        setPermissions(localStorage.getItem('auth') || []);
    }, [fetchCardData]);

    // Filtered data with memoization
    const filteredOpportunities = useMemo(() => {
        if (loading) return [];
        
        return opportunities.filter(op => {
            return Object.keys(filters).every(filterKey => {
                if (filterKey === 'selectedFY') return true;
                
                if (filterKey === 'search') {
                    if (filters.search === '') return true;
                    const searchTerm = filters.search.toLowerCase();
                    const fieldsToSearch = ['opportunityName', 'obFy.obFy', 'obQtr', 'obMmm', 'industrySegment.name', 'primaryOwner', 'dealStatus.dealStatus', 'priority.priority', 'amount'];
                    return fieldsToSearch.some(field => {
                        const value = getNestedValue(op, field);
                        return value != null && value.toString().toLowerCase().includes(searchTerm);
                    });
                } else {
                    const filterValues = filters[filterKey];
                    if (filterValues.length === 0) return true; // Allow empty filter (deselected)
                    const valuePath = keyMap[filterKey] || filterKey;
                    let value = getNestedValue(op, valuePath);
                    if (filterKey === 'obFy') value = value?.toString();
                    return filterValues.includes(value);
                }
            });
        });
    }, [filters, opportunities, loading]);

    // Calculate total amount
    const totalAmount = useMemo(() => {
        return filteredOpportunities.reduce((sum, op) => sum + (op.amount || 0), 0);
    }, [filteredOpportunities]);

    // Pagination
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredOpportunities, currentPage, itemsPerPage]);

    // Check if no filters are applied
    const noFiltersApplied = useMemo(() => {
        return Object.entries(filters).every(([key, value]) => {
            if (key === 'selectedFY') return true;
            return Array.isArray(value) ? value.length === 0 : value === '';
        });
    }, [filters]);

    // Event handlers
    const handleFilterChange = (selectedOptions, filterName) => {
        const value = selectedOptions ? selectedOptions.map(option => option.value) : [];
        
        setFilters(prev => {
            const newFilters = { ...prev, [filterName]: value };
            
            if (filterName === 'obFy') {
                if (value.length > 0) {
                    newFilters.selectedFY = `FY${parseInt(value[0]) % 100}`;
                } else {
                    newFilters.selectedFY = ''; // Clear selectedFY when deselected
                }
                
                // Update data when FY changes
                const fyIdMap = { 2024: 1, 2025: 2, 2026: 3, 2027: 4 };
                const fyIds = value.length > 0 ? value.map(fy => fyIdMap[parseInt(fy)]) : [];
                fetchCardData(fyIds.length > 0 ? fyIds : [getCurrentQuarterAndFY().fyId]); // Default to current FY if empty
            }
            
            return newFilters;
        });
        
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        if (loading) return;
        
        setFilters(prev => ({ ...prev, search: e.target.value }));
        setCurrentPage(1);
    };

    const handleFYChange = (e) => {
        const newFY = e.target.value;
        const year = newFY.replace('FY', '20');
        
        setFilters(prev => ({ ...prev, obFy: [year], selectedFY: newFY }));
        
        const fyIdMap = { 2023: 0, 2024: 1, 2025: 2, 2026: 3, 2027: 4 };
        const fyId = fyIdMap[parseInt(year)];
        if (fyId !== undefined) {
            fetchCardData([fyId]);
        }
    };

    const handleCardClick = (status) => {
        setSelectedStatus(status);
        const { financialYearEnd } = getCurrentQuarterAndFY();
        
        setFilters(prev => {
            const newFilters = { ...prev };
            
            if (status === 'Total Opportunities') {
                newFilters.obFy = [`${financialYearEnd}`];
                newFilters.obQtr = [];
                newFilters.priority = [];
                newFilters.industrySegment = [];
                newFilters.dealStatus = [];
                newFilters.primaryOwner = [];
                newFilters.search = '';
                newFilters.selectedFY = `FY${financialYearEnd % 100}`;
                
                const fyIdMap = { 2024: 1, 2025: 2, 2026: 3, 2027: 4 };
                fetchCardData([fyIdMap[financialYearEnd]]);
            } else if(status === 'Result Awaited'){
                newFilters.dealStatus = ['Bid Submitted', 'Proposal Submitted'];
                newFilters.obFy = prev.obFy.length > 0 ? prev.obFy : [`${financialYearEnd}`];
                if (prev.obFy.length === 0) {
                    newFilters.selectedFY = `FY${financialYearEnd % 100}`;
                }
                
            }else{
                newFilters.dealStatus = [status];
                newFilters.obFy = prev.obFy.length > 0 ? prev.obFy : [`${financialYearEnd}`];
                if (prev.obFy.length === 0) {
                    newFilters.selectedFY = `FY${financialYearEnd % 100}`;
                }
            }
            
            return newFilters;
        });
        
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const hasPermission = permissions.includes('Admin') || permissions.includes('Edit');

    return (
        <div className="opportunities-container">
            <div className="cards-container">
                <CountCard 
                    title="Total Opportunities" 
                    count={totalLeadscnt}
                    totalVal = {totalLeadscnt_tl}
                    baseColor="#0275d8" 
                    onClick={() => handleCardClick('Total Opportunities')} 
                />
                <CountCard 
                    title="Bid Submitted" 
                    count={leadsSubmitted} 
                    totalVal = {leadsSubmitted_ls}
                    baseColor="#ffc107" 
                    onClick={() => handleCardClick('Bid Submitted')} 
                />
                <CountCard 
                    title="Won" 
                    count={wonleads} 
                    totalVal = {wonleads_wn}
                    baseColor="#28a745" 
                    onClick={() => handleCardClick('Won')} 
                />
                <CountCard 
                    title="Lost" 
                    count={lostleads} 
                    totalVal={lostleads_lt}
                    baseColor="#d9534f" 
                    onClick={() => handleCardClick('Lost')} 
                />
                <CountCard 
                    title="Result Awaited" 
                    count={resAw} 
                    totalVal={resAw_ra}
                    baseColor="#B6C468" 
                    onClick={() => handleCardClick('Result Awaited')} 
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
                            placeholder={`${columnNames[filterName] || filterName}`}
                            className="react-select-container"
                            classNamePrefix="react-select"
                            isDisabled={loading}
                        />
                    </div>
                ))}
                <input 
                    type="text" 
                    placeholder="Search Opportunity..." 
                    value={filters.search} 
                    onChange={handleSearchChange} 
                    className="search-input" 
                    disabled={loading}
                />
            </div>

            {loading && <div className="loading-indicator">Loading data...</div>}
            
            {!loading && noFiltersApplied && 
                <div className="no-filter-message">Please select filters to view opportunities.</div>
            }
            
            {!loading && !noFiltersApplied && filteredOpportunities.length === 0 && 
                <div className="no-filter-message">No opportunities found matching your search.</div>
            }
            
            {!loading && !noFiltersApplied && filteredOpportunities.length > 0 && (
                <>
                    <div className="table-container">
                        <table className="opportunities-table">
                            <thead>
                                <tr>
                                    {columns.map(column => 
                                        <th key={column}>{columnNames[column]}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map(opportunity => (
                                    <tr key={opportunity.id}>
                                        {columns.map(column => (
                                            <td key={column}>
                                                <a 
                                                    href={`/opportunity/${opportunity.id}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    {getNestedValue(opportunity, keyMap[column] || column) || '-'}
                                                </a>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="total-amount-container">
                        <span className="total-amount-label">Total Amount:</span>
                        <span className="total-amount-value">{totalAmount.toFixed(2)} Cr</span>
                        <span className="total-amount-currency">INR</span>
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
                            disabled={!hasPermission} 
                            onClick={() => navigate('/addopportunity')} 
                            className="btn btn-blue" 
                            style={{ marginRight: "13px", backgroundColor: "blue" }}
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
                            <select 
                                value={filters.selectedFY} 
                                onChange={handleFYChange}
                                disabled={loading}
                            >
                                {['FY23', 'FY24', 'FY25', 'FY26'].map(fy => 
                                    <option key={fy} value={fy}>{fy}</option>
                                )}
                            </select>
                        </div>
                        <ExpandableTable 
                            key={filters.selectedFY} 
                            selectedFY={filters.selectedFY} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Opportunities;