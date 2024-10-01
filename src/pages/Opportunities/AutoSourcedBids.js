import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../components/constants';
import CountCard from '../MainDashboard/CountCard';
import './Opportunities.css';

const OpportunitiesDashboard = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [summaryData, setSummaryData] = useState({
        newToday: 0,
        newThisWeek: 0,
        closingSoon: 0,
        currentQtrTotal: 0
    });
    const [filters, setFilters] = useState({
        amountMin: '',
        amountMax: '',
        publishedDateStart: '',
        publishedDateEnd: '',
        closingDateStart: '',
        closingDateEnd: '',
        organization: '',
        keyword: ''
    });

    const columns = [
        'tenderId', 'organisation', 'amount', 'publishedDate', 'closingDate', 'title'
    ];

    const columnNames = {
        tenderId: 'Tender ID',
        organisation: 'Organization',
        amount: 'Amount',
        publishedDate: 'Published Date',
        closingDate: 'Closing Date',
        title: 'Title'
    };

    useEffect(() => {
        fetchOpportunities();
        fetchSummaryData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [opportunities, filters]);

    const fetchOpportunities = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/scrape/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
            setOpportunities(sortedData);
            setFilteredOpportunities(sortedData);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        }
    };

    const fetchSummaryData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/scrape/summary`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setSummaryData(data);
        } catch (error) {
            console.error('Error fetching summary data:', error);
        }
    };

    const applyFilters = () => {
        const filtered = opportunities.filter(opp => {
            const amountInRange = (filters.amountMin === '' || opp.amount >= parseFloat(filters.amountMin)) &&
                                  (filters.amountMax === '' || opp.amount <= parseFloat(filters.amountMax));
            
            const publishedDateInRange = (!filters.publishedDateStart || new Date(opp.publishedDate) >= new Date(filters.publishedDateStart)) &&
                                         (!filters.publishedDateEnd || new Date(opp.publishedDate) <= new Date(filters.publishedDateEnd));
            
            const closingDateInRange = (!filters.closingDateStart || new Date(opp.closingDate) >= new Date(filters.closingDateStart)) &&
                                       (!filters.closingDateEnd || new Date(opp.closingDate) <= new Date(filters.closingDateEnd));
            
            const organizationMatch = filters.organization === '' || opp.organisation.toLowerCase().includes(filters.organization.toLowerCase());
            
            const keywordMatch = filters.keyword === '' || opp.title.toLowerCase().includes(filters.keyword.toLowerCase());

            return amountInRange && publishedDateInRange && closingDateInRange && organizationMatch && keywordMatch;
        });

        setFilteredOpportunities(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCardClick = (status) => {
        // Implement card click functionality if needed
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="opportunities-container">
            <div className="cards-container">
                <CountCard
                    title="New Opportunities Today"
                    count={summaryData.newToday}
                    baseColor="#4caf50"
                    onClick={() => handleCardClick('New Today')}
                />
                <CountCard
                    title="New Opportunities This Week"
                    count={summaryData.newThisWeek}
                    baseColor="#2196f3"
                    onClick={() => handleCardClick('New This Week')}
                />
                <CountCard
                    title="Opportunities Closing Soon"
                    count={summaryData.closingSoon}
                    baseColor="#ff9800"
                    onClick={() => handleCardClick('Closing Soon')}
                />
                <CountCard
                    title="Current Quarter Total Opportunities"
                    count={summaryData.currentQtrTotal}
                    baseColor="#00b7b7"
                    onClick={() => handleCardClick('Current Quarter')}
                />
            </div>
            <div className="filter-container">
                <input
                    type="number"
                    placeholder="Min Amount"
                    value={filters.amountMin}
                    onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                    className="filter-input"
                />
                <input
                    type="number"
                    placeholder="Max Amount"
                    value={filters.amountMax}
                    onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                    className="filter-input"
                />
               <input 
                type="date" 
                placeholder="Start Published Date" 
                onChange={(e) => handleFilterChange('publishedDateStart', e.target.value)} 
                className="filter-input1" 
                />

                <input 
                type="date" 
                placeholder="End Published Date" 
                onChange={(e) => handleFilterChange('publishedDateEnd', e.target.value)} 
                className="filter-input1" 
                />

                <input 
                type="date" 
                placeholder="Start Closing Date" 
                onChange={(e) => handleFilterChange('closingDateStart', e.target.value)} 
                className="filter-input1" 
                />

                <input 
                type="date" 
                placeholder="End Closing Date" 
                onChange={(e) => handleFilterChange('closingDateEnd', e.target.value)} 
                className="filter-input1" 
                />

                <input
                    type="text"
                    placeholder="Organization"
                    value={filters.organization}
                    onChange={(e) => handleFilterChange('organization', e.target.value)}
                    className="filter-input"
                />
                <input
                    type="text"
                    placeholder="Keyword"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    className="filter-input"
                />
            </div>

            {filteredOpportunities.length === 0 ? (
                <div className="no-filter-message">
                    No opportunities found matching your search.
                </div>
            ) : (
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
        </div>
    );
};

export default OpportunitiesDashboard;