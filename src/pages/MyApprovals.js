import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../components/constants';
import './MyApprovals.css';

const MyApprovals = () => {
    const [approvals, setApprovals] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [activePanel, setActivePanel] = useState('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [remarks, setRemarks] = useState({});

    useEffect(() => {
        fetchApprovals();
        fetchFormInfo();
    }, []);

    const fetchApprovals = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`${BASE_URL}/api/approvals?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch approvals');
            }
            const data = await response.json();
            setApprovals(data);
        } catch (error) {
            console.error('Error fetching approvals:', error);
            setError('Failed to load approvals. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchFormInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/approval-requests/all-form-info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch form info');
            }
            const data = await response.json();
            const formInfoMap = data.reduce((acc, item) => {
                acc[item.approvalRequestId] = item.formName;
                return acc;
            }, {});
            setFormInfo(formInfoMap);
        } catch (error) {
            console.error('Error fetching form info:', error);
        }
    };

    const handleAction = async (id, action) => {
        if (!remarks[id] || remarks[id].trim() === '') {
            alert('Please enter remarks before submitting.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/approvals/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action, remarks: remarks[id], isActionTaken: true }),
            });
            if (!response.ok) {
                throw new Error('Failed to update approval');
            }
            fetchApprovals(); // Refresh the data
            setRemarks(prev => ({ ...prev, [id]: '' })); // Clear remarks for this approval
        } catch (error) {
            console.error('Error updating approval:', error);
            alert('Failed to update approval. Please try again.');
        }
    };

    const handleRemarksChange = (id, value) => {
        setRemarks(prev => ({ ...prev, [id]: value }));
    };

    const filteredApprovals = approvals.filter(approval => 
        (activePanel === 'pending' && !approval.read) ||
        (activePanel === 'past' && approval.read)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApprovals.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openPPT = (pptContent) => {
        const byteCharacters = atob(pptContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="approvals-container">
            <div className="panel-toggle-container1">
                <div className="panel-toggle1">
                    <input 
                        type="checkbox" 
                        id="panel-switch1" 
                        className="panel-switch1"
                        checked={activePanel === 'past'}
                        onChange={() => setActivePanel(prev => prev === 'pending' ? 'past' : 'pending')}
                    />
                    <label htmlFor="panel-switch1" className="panel-switch-label1">
                        <span className="panel-switch-inner1"></span>
                        <span className="panel-switch-switch1"></span>
                    </label>
                </div>
                <div className="panel-labels1">
                    <span 
                        className={activePanel === 'pending' ? 'active1' : ''}
                        onClick={() => setActivePanel('pending')}
                    >
                        Pending Approvals
                    </span>
                    <span 
                        className={activePanel === 'past' ? 'active1' : ''}
                        onClick={() => setActivePanel('past')}
                    >
                        Past Approvals
                    </span>
                </div>
            </div>
            {filteredApprovals.length === 0 ? (
                <div className="no-data-message">No {activePanel} approvals found.</div>
            ) : (
                <div className="table-container">
                    <table className="approvals-table">
                        <thead>
                            <tr>
                                <th>Notification Id</th>
                                <th>Opportunity Name</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>PPT</th>
                                {activePanel === 'pending' && (
                                    <>
                                        <th>Action</th>
                                        <th>Remarks</th>
                                    </>
                                )}
                                {activePanel === 'past' && <th>Remarks</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(approval => (
                                <tr key={approval.notificationId}>
                                    <td>{approval.notificationId}</td>
                                    <td>{formInfo[approval.approvalRequestId] || 'Unknown'}</td>
                                    <td>{new Date(approval.createdAt).toLocaleDateString()}</td>
                                    <td>{approval.read ? (approval.action ? 'Approved' : 'Rejected') : 'Pending'}</td>
                                    <td>
                                        {approval.pptFileContent ? (
                                            <button onClick={() => openPPT(approval.pptFileContent)}>View PPT</button>
                                        ) : (
                                            'No PPT'
                                        )}
                                    </td>
                                    {activePanel === 'pending' && (
                                        <>
                                            <td>
                                                <button onClick={() => handleAction(approval.notificationId, true)} disabled={!remarks[approval.notificationId]}>Approve</button>
                                                <button onClick={() => handleAction(approval.notificationId, false)} disabled={!remarks[approval.notificationId]}>Reject</button>
                                            </td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    maxLength="50" 
                                                    placeholder="Enter remarks"
                                                    value={remarks[approval.notificationId] || ''}
                                                    onChange={(e) => handleRemarksChange(approval.notificationId, e.target.value)}
                                                />
                                            </td>
                                        </>
                                    )}
                                    {activePanel === 'past' && <td>{approval.remarks}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {filteredApprovals.length > itemsPerPage && (
                <div className="pagination">
                    {Array.from({ length: Math.ceil(filteredApprovals.length / itemsPerPage) }, (_, i) => (
                        <button 
                            key={i} 
                            onClick={() => paginate(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApprovals;