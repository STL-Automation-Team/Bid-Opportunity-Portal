import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import * as XLSX from 'xlsx';
import { BASE_URL } from '../../../components/constants';
import './BidProgressOverview.css';

const BidProgressOverview = () => {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [filters, setFilters] = useState({
    obFy: [],
    dateRange: [null, null],
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filterOptions = {
    obFy: ['2024', '2025', '2026', '2027'],
  };

  const columns = [
    'opportunityName',
    'partFy.obFy',
    'partQuarter',
    'partMonth',
    // 'obFy.obFy',
    // 'obQtr',
    // 'obMmm',
    'amount',
    'primaryOwner',
    'industrySegment.name',
    'solutionSpoc',
    'scmSpoc',
    'bidSubmissionDate',
    'dealStatus.dealStatus',
    'pdTq',
    'goNoGoMaster.goNogoStatus',
    'preBidMeeting',
    'querySubmission',
    'boqReadiness',
    'solutionReady',
    'pricingDone',
    'remarks'
    
  ];

  const columnNames = {
    opportunityName: 'Opportunity',
    'partFy.obFy': 'Part FY',
    partQuarter: 'Part Qtr',
    partMonth: 'Part Month',
    // 'obFy.obFy': 'OB FY',
    // obQtr: 'OB Quarter',
    // obMmm: 'OB MMM',
    amount: 'Amount (INR Cr)',
    primaryOwner: 'Primary Owner',
    'industrySegment.name': 'Industry Segment',
    solutionSpoc: 'Solution SPOC',
    scmSpoc: 'SCM SPOC',
    bidSubmissionDate: 'Bid Submission Date',
    'dealStatus.dealStatus': 'Deal Status',
    pdTq: "PQ/TQ",
    'goNoGoMaster.goNogoStatus': 'Go/No-Go Status',
    preBidMeeting: 'Pre-Bid Meeting',
    querySubmission: 'Query Submission',
    boqReadiness: 'BOQ Ready',
    solutionReady: 'Solution Ready',
    pricingDone: 'Pricing Done',
    remarks: "Remarks"
  };

  const keyMap = {
    'industrySegment.name': 'industrySegment.name',
    'goNoGoMaster.goNogoStatus': 'goNoGoMaster.goNogoStatus',
    'dealStatus.dealStatus': 'dealStatus.dealStatus',
    'partFy.obFy': 'partFy.obFy',
    'obFy.obFy': 'obFy.obFy',
  };

  const getCurrentQuarterAndFY = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = month >= 4 ? today.getFullYear() + 1 : today.getFullYear();
    const fyIdMap = { 2024: 1, 2025: 2, 2026: 3, 2027: 4 };
    return { financialYearEnd: year, fyId: fyIdMap[year] };
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), obj);
  };

  const fetchBidsData = useCallback(async (fyIds) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/leads/filter-by-ids`,
        { fyIds },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      const leads = response.data.content;
      const bidPromises = leads.map(async (lead) => {
        try {
          const bidResponse = await axios.get(`${BASE_URL}/api/bid-trackers/lead/${lead.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return { ...lead, bidData: bidResponse.data };
        } catch (error) {
          console.error(`Error fetching bid data for lead ${lead.id}:`, error);
          return { ...lead, bidData: null };
        }
      });

      const bidsWithData = await Promise.all(bidPromises);
      console.log(bidsWithData)
      setBids(bidsWithData.sort((a, b) => b.id - a.id));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setLoading(false);
    }
  }, [token]);

  const formatDate = (date) => {
    if (!date) return null;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const { financialYearEnd, fyId } = getCurrentQuarterAndFY();
    setFilters((prev) => ({
      ...prev,
      obFy: [`${financialYearEnd}`],
    }));
    fetchBidsData([fyId]);
  }, [fetchBidsData]);

  const filteredBids = useMemo(() => {
    if (loading) return [];

    const allowedDealStatuses = ['Identified', 'Market Scan', 'Solution Ready'];

    return bids
      .filter((bid) => {
        // Filter by Financial Year
        const matchesFY =
          filters.obFy.length === 0 ||
          filters.obFy.includes(bid.obFy?.obFy?.toString());

        // Filter by Date Range
        const [startDate, endDate] = filters.dateRange;
        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);
        const bidDateStr = bid?.bidSubmissionDate;
        let matchesDateRange = true;

        if (startStr || endStr) {
          if (!bidDateStr) {
            matchesDateRange = false;
          } else {
            if (startStr && endStr) {
              matchesDateRange = bidDateStr >= startStr && bidDateStr <= endStr;
            } else if (startStr && !endStr) {
              matchesDateRange = bidDateStr >= startStr;
            } else if (!startStr && endStr) {
              matchesDateRange = bidDateStr <= endStr;
            }
          }
        }

        // Filter by Deal Status
        const dealStatus = getNestedValue(bid, 'dealStatus.dealStatus');
        const matchesDealStatus = allowedDealStatuses.includes(dealStatus);

        return matchesFY && matchesDateRange && matchesDealStatus;
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const key = sortConfig.key;
        let aValue = key.includes('.') ? getNestedValue(a, key) : a.bidData?.[key] || a[key];
        let bValue = key.includes('.') ? getNestedValue(b, key) : b.bidData?.[key] || b[key];

        if (aValue == null) aValue = '';
        if (bValue == null) bValue = '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc'
          ? aValue < bValue
            ? -1
            : 1
          : bValue < aValue
            ? -1
            : 1;
      });
  }, [bids, filters, loading, sortConfig]);

  const handleFilterChange = (selectedOptions, filterName) => {
    const value = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFilters((prev) => {
      const newFilters = { ...prev, [filterName]: value };
      const fyIdMap = { 2024: 1, 2025: 2, 2026: 3, 2027: 4 };
      const fyIds = value.length > 0 ? value.map((fy) => fyIdMap[parseInt(fy)]) : [getCurrentQuarterAndFY().fyId];
      fetchBidsData(fyIds);
      return newFilters;
    });
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setFilters((prev) => ({
      ...prev,
      dateRange: [start, end],
    }));
  };

  const handleDateTagClick = (tag) => {
    const today = new Date();
    let startDate = new Date(today);
    let endDate = new Date(today);

    switch (tag) {
      case 'nextWeek':
        startDate.setDate(today.getDate() + 1);
        endDate.setDate(today.getDate() + 7);
        break;
      case 'nextTwoWeeks':
        endDate.setDate(today.getDate() + 14);
        break;
      case 'nextMonth':
        endDate.setMonth(today.getMonth() + 1);
        break;
      default:
        startDate = null;
        endDate = null;
    }

    setFilters((prev) => ({
      ...prev,
      dateRange: [startDate, endDate],
    }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDownloadExcel = () => {
    const data = filteredBids.map((bid) => {
      const row = {};
      columns.forEach((column) => {
        const value = column.includes('.') ? getNestedValue(bid, column) : bid.bidData?.[column] || bid[column];
        row[columnNames[column]] = value != null ? value : '-';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bids');
    XLSX.writeFile(workbook, 'BidProgressOverview.xlsx');
  };

  return (
    <div className="bid-progress-overview p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 id="header123" className="text-lg font-semibold mb-4 text-gray-800">Bid Progress Overview</h2>
      <div className="filter-container flex space-x-4 mb-4">
        <div className="filter-dropdown">
          <Select
            isMulti
            options={filterOptions.obFy.map((option) => ({ value: option, label: option }))}
            value={filters.obFy.map((value) => ({ value, label: value }))}
            onChange={(selectedOptions) => handleFilterChange(selectedOptions, 'obFy')}
            placeholder="Select FY"
            className="react-select-container"
            classNamePrefix="react-select"
            isDisabled={loading}
          />
        </div>
        <div className="date-range-picker">
          <DatePicker
            selectsRange
            startDate={filters.dateRange[0]}
            endDate={filters.dateRange[1]}
            onChange={handleDateRangeChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 text-sm border rounded"
            placeholderText="Select Date Range"
            isClearable
            showYearDropdown
            showMonthDropdown
            yearDropdownItemNumber={10}
            scrollableYearDropdown
            scrollableMonthYearDropdown
            withPortal
          />
        </div>
        <div className="date-tags flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              filters.dateRange[0] &&
              formatDate(filters.dateRange[0]) === formatDate(new Date(new Date().setDate(new Date().getDate() + 1))) &&
              formatDate(filters.dateRange[1]) === formatDate(new Date(new Date().setDate(new Date().getDate() + 7)))
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleDateTagClick('nextWeek')}
            disabled={loading}
          >
            Next Week
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filters.dateRange[0] &&
              formatDate(filters.dateRange[0]) === formatDate(new Date()) &&
              formatDate(filters.dateRange[1]) === formatDate(new Date(new Date().setDate(new Date().getDate() + 14)))
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleDateTagClick('nextTwoWeeks')}
            disabled={loading}
          >
            Next Two Weeks
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filters.dateRange[0] &&
              formatDate(filters.dateRange[0]) === formatDate(new Date()) &&
              formatDate(filters.dateRange[1]) === formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)))
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleDateTagClick('nextMonth')}
            disabled={loading}
          >
            Next Month
          </button>
        </div>
        <button
          onClick={handleDownloadExcel}
          className="btn btn-blue px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || filteredBids.length === 0}
        >
          Download Excel
        </button>
      </div>

      {loading && <div className="text-center py-4 text-gray-500">Loading...</div>}

      {!loading && filteredBids.length === 0 && (
        <div className="text-center py-4 text-gray-500">No bids found matching your filters.</div>
      )}

      {!loading && filteredBids.length > 0 && (
        <div className="table-container">
          <div id = "div123" className="total-count mb-2 text-sm text-gray-600">
            Total Bids: {filteredBids.length}
          </div>
          <table className="bid-progress-table w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="border p-2 bg-gray-100 text-left text-sm font-medium cursor-pointer"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      {columnNames[column]}
                      {sortConfig.key === column && (
                        <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBids.map((bid) => (
                <tr key={bid.id} className="border-b hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column} className="border p-2 text-sm">
                      {column.includes('.')
                        ? getNestedValue(bid, column) || '-'
                        : bid.bidData?.[column] != null
                        ? typeof bid.bidData[column] === 'boolean'
                          ? bid.bidData[column]
                            ? 'Done'
                            : 'Pending'
                          : bid.bidData[column]
                        : bid[column] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BidProgressOverview;