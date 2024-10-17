// ExpandableTable.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../components/constants';

const ExpandableTable = ({ selectedFY }) => {
    const [expandedQuarters, setExpandedQuarters] = useState({
        Q1: false, Q2: false, Q3: false, Q4: false
    });
    const [columnValues, setColumnValues] = useState({
        Q1: 'Act', Q2: 'Act', Q3: 'Act', Q4: 'Act', H1: 'Act', H2: 'Act'
    });
    const [agpData, setAgpData] = useState([]);
    const [visData, setVisData] = useState([]);
    const [actData, setActData] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        fetchData();
    }, [selectedFY]);

    const fetchData = async () => {
        try {
        const token = localStorage.getItem('token'); // Or sessionStorage.getItem('token');
            const [agpResponse, opportunitiesResponse, allUsersResponse] = await Promise.all([
                axios.get(`${BASE_URL}/api/agp1`,{
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }),
                axios.get(`${BASE_URL}/api/opportunities`,{
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }),
                axios.get(`${BASE_URL}/api/allusers`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
            ]);
            
            const agpData = agpResponse.data.filter(item => item.obFY === selectedFY);
            setAgpData(agpData);
    
            const opportunities = opportunitiesResponse.data.filter(item => item.ob_fy === selectedFY);
            setVisData(opportunities);
            setActData(opportunities.filter(item => item.deal_status === 'Won'));
            
            // console.log('Filtered AGP Data:', agpData);
            // console.log('Filtered Opportunities:', opportunities);
            // console.log('Filtered Act Data:', actData);

            const allUsers = allUsersResponse.data;
            const uniqueEmployeeIDs = [...new Set(agpData.map(item => item.employeeID))];
            
            const userMap = {};
            uniqueEmployeeIDs.forEach(employeeID => {
                const user = allUsers.find(user => user.employeeId === employeeID);
                if (user) {
                    userMap[employeeID] = `${user.firstName} ${user.lastName}`;
                }
            });
            setUsers(userMap);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const toggleQuarterExpansion = (quarter) => {
        setExpandedQuarters(prev => ({ ...prev, [quarter]: !prev[quarter] }));
    };

    const handleColumnValueChange = (period, value) => {
        setColumnValues(prev => ({ ...prev, [period]: value }));
    };

    const getMonthLabel = (quarter, monthIndex) => {
        const months = {
            Q1: ['Apr', 'May', 'Jun'],
            Q2: ['Jul', 'Aug', 'Sep'],
            Q3: ['Oct', 'Nov', 'Dec'],
            Q4: ['Jan', 'Feb', 'Mar']
        };
        return months[quarter][monthIndex - 1];
    };

    const getValueForPeriod = (accountName,owner, period, type) => {
        const data = type === 'Act' ? actData : visData;
        const filteredData = data.filter(item => {
            if (item.industry_segment !== accountName) return false;
            if (item.primary_owner !== owner) return false;
            if (period === 'H1') return ['Q1', 'Q2'].includes(item.ob_qtr);
            if (period === 'H2') return ['Q3', 'Q4'].includes(item.ob_qtr);
            if (period.includes('_')) {
                const [qtr, month] = period.split('_');
                return item.ob_qtr === qtr && item.ob_mmm === getMonthLabel(qtr, parseInt(month));
            }
            return item.ob_qtr === period;
        });
        console.log("getValue: ", filteredData);

        return filteredData.reduce((sum, item) => sum + item.amount_inr_cr_max, 0);
    };

    const getAgpValueForPeriod = (accountName, period) => {
        const filteredData = agpData.filter(item => 
            item.accountName === accountName && 
            (period === 'H1' ? ['Q1', 'Q2'].includes(item.obQT) :
             period === 'H2' ? ['Q3', 'Q4'].includes(item.obQT) :
             item.obQT === period)
        );
        return filteredData.reduce((sum, item) => sum + item.agpValue, 0);
    };

    const accountData = Array.from(new Set(agpData.map(item => item.accountName))).map(accountName => ({
        leader: users[agpData.find(item => item.accountName === accountName)?.employeeID] || 'Unknown',
        account: accountName
    }));

    if (accountData.length === 0) {
        return (
            <div className="expandable-content">
                <div className="no-data-message">
                    No data available for the selected financial year.
                </div>
            </div>
        );
    }

    return (
        <div className="expandable-content">
            <div className="table-scroll-container">
                <table className="account-table">
                    <thead>
                        <tr>
                            <th rowSpan="2">Account Segment Leader</th>
                            <th rowSpan="2">Account</th>
                            {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                                <th key={quarter} colSpan={expandedQuarters[quarter] ? 5 : 2}>
                                    {quarter.toUpperCase()}{selectedFY}
                                    <button onClick={() => toggleQuarterExpansion(quarter)} className="expand-button">
                                        {expandedQuarters[quarter] ? '▼' : '►'}
                                    </button>
                                </th>
                            ))}
                            <th colSpan="2">H1{selectedFY}</th>
                            <th colSpan="2">H2{selectedFY}</th>
                            <th colSpan="2">Total</th>
                        </tr>
                        <tr>
                            {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                                <React.Fragment key={quarter}>
                                    <th>AGP</th>
                                    <th>
                                        <select value={columnValues[quarter]} onChange={(e) => handleColumnValueChange(quarter, e.target.value)}>
                                            <option value="Act">Act</option>
                                            <option value="Vis">Vis</option>
                                        </select>
                                    </th>
                                    {expandedQuarters[quarter] && (
                                        <>
                                            <th>{getMonthLabel(quarter, 1)}</th>
                                            <th>{getMonthLabel(quarter, 2)}</th>
                                            <th>{getMonthLabel(quarter, 3)}</th>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                            <th>AGP</th>
                            <th>
                                <select value={columnValues.H1} onChange={(e) => handleColumnValueChange('H1', e.target.value)}>
                                    <option value="Act">Act</option>
                                    <option value="Vis">Vis</option>
                                </select>
                            </th>
                            <th>AGP</th>
                            <th>
                                <select value={columnValues.H2} onChange={(e) => handleColumnValueChange('H2', e.target.value)}>
                                    <option value="Act">Act</option>
                                    <option value="Vis">Vis</option>
                                </select>
                            </th>
                            <th>AGP Total</th>
                            <th>Act/Vis Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.leader}</td>
                                <td>{row.account}</td>
                                {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                                    <React.Fragment key={quarter}>
                                        <td>{getAgpValueForPeriod(row.account, quarter)}</td>
                                        <td>{getValueForPeriod(row.account,row.leader, quarter, columnValues[quarter])}</td>
                                        {expandedQuarters[quarter] && (
                                            <>
                                                <td>{getValueForPeriod(row.account,row.leader, `${quarter}_1`, columnValues[quarter])}</td>
                                                <td>{getValueForPeriod(row.account,row.leader, `${quarter}_2`, columnValues[quarter])}</td>
                                                <td>{getValueForPeriod(row.account,row.leader, `${quarter}_3`, columnValues[quarter])}</td>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))}
                                <td>{getAgpValueForPeriod(row.account, 'H1')}</td>
                                <td>{getValueForPeriod(row.account,row.leader, 'H1', columnValues.H1)}</td>
                                <td>{getAgpValueForPeriod(row.account, 'H2')}</td>
                                <td>{getValueForPeriod(row.account,row.leader, 'H2', columnValues.H2)}</td>
                                <td>
                                    {getAgpValueForPeriod(row.account, 'Q1') + 
                                     getAgpValueForPeriod(row.account, 'Q2') + 
                                     getAgpValueForPeriod(row.account, 'Q3') + 
                                     getAgpValueForPeriod(row.account, 'Q4')}
                                </td>
                                <td>
                                    {getValueForPeriod(row.account,row.leader, 'Q1', columnValues.Q1) + 
                                     getValueForPeriod(row.account,row.leader, 'Q2', columnValues.Q2) + 
                                     getValueForPeriod(row.account,row.leader, 'Q3', columnValues.Q3) + 
                                     getValueForPeriod(row.account,row.leader, 'Q4', columnValues.Q4)}
                                </td>
                            </tr>
                        ))}
                        <tr className="total-row agp-total">
                            <td colSpan="2">Total AGP</td>
                            {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                                <React.Fragment key={quarter}>
                                    <td>{accountData.reduce((sum, row) => sum + getAgpValueForPeriod(row.account, quarter), 0)}</td>
                                    <td>-</td>
                                    {expandedQuarters[quarter] && (
                                        <>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                            <td>{accountData.reduce((sum, row) => sum + getAgpValueForPeriod(row.account, 'H1'), 0)}</td>
                            <td>-</td>
                            <td>{accountData.reduce((sum, row) => sum + getAgpValueForPeriod(row.account, 'H2'), 0)}</td>
                            <td>-</td>
                            <td>{accountData.reduce((sum, row) => 
                                sum + 
                                getAgpValueForPeriod(row.account, 'Q1') + 
                                getAgpValueForPeriod(row.account, 'Q2') + 
                                getAgpValueForPeriod(row.account, 'Q3') + 
                                getAgpValueForPeriod(row.account, 'Q4'), 
                            0)}</td>
                            <td>-</td>
                        </tr>
                        <tr className="total-row vis-act-total">
                            <td colSpan="2">Total {Object.values(columnValues)[0]}</td>
                            {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                                <React.Fragment key={quarter}>
                                    <td>-</td>
                                    <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row.account,row.leader, quarter, columnValues[quarter]), 0)}</td>
                                    {expandedQuarters[quarter] && (
                                        <>
                                            <td>{Math.round(accountData.reduce((sum, row) => sum + getValueForPeriod(row.account,row.leader, `${quarter}_1`, columnValues[quarter]), 0))}</td>
                                            <td>{Math.round(accountData.reduce((sum, row) => sum + getValueForPeriod(row.account,row.leader, `${quarter}_2`, columnValues[quarter]), 0))}</td>
                                            <td>{Math.round(accountData.reduce((sum, row) => sum + getValueForPeriod(row.account,row.leader, `${quarter}_3`, columnValues[quarter]), 0))}</td>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                            <td>-</td>
                            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row.account,row.leader, 'H1', columnValues.H1), 0)}</td>
                            <td>-</td>
                            <td>{accountData.reduce((sum, row) => sum + getValueForPeriod(row.account,row.leader, 'H2', columnValues.H2), 0)}</td>
                            <td>-</td>
                            <td>
                                {accountData.reduce((sum, row) => 
                                    sum + 
                                    getValueForPeriod(row.account,row.leader, 'Q1', columnValues.Q1) + 
                                    getValueForPeriod(row.account,row.leader, 'Q2', columnValues.Q2) + 
                                    getValueForPeriod(row.account,row.leader, 'Q3', columnValues.Q3) + 
                                    getValueForPeriod(row.account,row.leader, 'Q4', columnValues.Q4), 
                                0)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpandableTable;