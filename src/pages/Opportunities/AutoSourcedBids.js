import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../components/constants';
import CountCard from '../MainDashboard/CountCard';
import EnhancedFilterControls from './EnhancedFilterControls';
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
    const [activePanel, setActivePanel] = useState('open'); // 'open' or 'closed'

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
    }, [opportunities, filters, activePanel]);

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
        const currentDate = new Date();
        const filtered = opportunities.filter(opp => {
            const amountInRange = (filters.amountMin === '' || opp.amount >= parseFloat(filters.amountMin)) &&
                                  (filters.amountMax === '' || opp.amount <= parseFloat(filters.amountMax));
            
            const publishedDateInRange = (!filters.publishedDateStart || new Date(opp.publishedDate) >= new Date(filters.publishedDateStart)) &&
                                         (!filters.publishedDateEnd || new Date(opp.publishedDate) <= new Date(filters.publishedDateEnd));
            
            const closingDateInRange = (!filters.closingDateStart || new Date(opp.closingDate) >= new Date(filters.closingDateStart)) &&
                                       (!filters.closingDateEnd || new Date(opp.closingDate) <= new Date(filters.closingDateEnd));
            
            const organizationMatch = filters.organization === '' || opp.organisation.toLowerCase().includes(filters.organization.toLowerCase());
            
            const keywordMatch = filters.keyword === '' || opp.title.toLowerCase().includes(filters.keyword.toLowerCase());

            const isOpen = new Date(opp.closingDate) >= currentDate;

            return amountInRange && publishedDateInRange && closingDateInRange && organizationMatch && keywordMatch &&
                   (activePanel === 'open' ? isOpen : !isOpen);
        });

        setFilteredOpportunities(filtered);
        setCurrentPage(1);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCardClick = (status) => {
        const currentDate = new Date();
        let newFilters = { ...filters };

        switch (status) {
            case 'New Today':
                newFilters.publishedDateStart = currentDate.toISOString().split('T')[0];
                newFilters.publishedDateEnd = currentDate.toISOString().split('T')[0];
                break;
            case 'New This Week':
                const weekStart = new Date(currentDate.setDate(currentDate.getDate() - 7));
                newFilters.publishedDateStart = weekStart.toISOString().split('T')[0];
                newFilters.publishedDateEnd = new Date().toISOString().split('T')[0];
                break;
            case 'Closing Soon':
                const closingSoonDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
                newFilters.closingDateStart = currentDate.toISOString().split('T')[0];
                newFilters.closingDateEnd = closingSoonDate.toISOString().split('T')[0];
                break;
            case 'Current Quarter':
                const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
                const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
                newFilters.publishedDateStart = quarterStart.toISOString().split('T')[0];
                newFilters.publishedDateEnd = quarterEnd.toISOString().split('T')[0];
                break;
            default:
                break;
        }

        setFilters(newFilters);
        setActivePanel('open');
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
                    title="New Bids Today"
                    count={summaryData.newToday}
                    baseColor="#4caf50"
                    onClick={() => handleCardClick('New Today')}
                />
                <CountCard
                    title="New Bids This Week"
                    count={summaryData.newThisWeek}
                    baseColor="#2196f3"
                    onClick={() => handleCardClick('New This Week')}
                />
                <CountCard
                    title="Bids Closing Soon"
                    count={summaryData.closingSoon}
                    baseColor="#ff9800"
                    onClick={() => handleCardClick('Closing Soon')}
                />
                <CountCard
                    title="Current Quarter Total Bids"
                    count={summaryData.currentQtrTotal}
                    baseColor="#00b7b7"
                    onClick={() => handleCardClick('Current Quarter')}
                />
            </div>
         
            <EnhancedFilterControls filters={filters} handleFilterChange={handleFilterChange} />
            <div className="panel-toggle-container1">
                <div className="panel-toggle1">
                    <input 
                        type="checkbox" 
                        id="panel-switch1" 
                        className="panel-switch1"
                        checked={activePanel === 'closed'}
                        onChange={() => setActivePanel(prev => prev === 'open' ? 'closed' : 'open')}
                    />
                    <label htmlFor="panel-switch1" className="panel-switch-label1">
                        <span className="panel-switch-inner1"></span>
                        <span className="panel-switch-switch1"></span>
                    </label>
                </div>
                <div className="panel-labels1">
                    <span 
                        className={activePanel === 'open' ? 'active1' : ''}
                        onClick={() => setActivePanel('open')}
                    >
                        Open Bids
                    </span>
                    <span 
                        className={activePanel === 'closed' ? 'active1' : ''}
                        onClick={() => setActivePanel('closed')}
                    >
                        Closed Bids
                    </span>
                </div>
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
                                                    {column === 'amount' ? `₹${opportunity[column].toLocaleString('en-IN')}` : opportunity[column]}
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