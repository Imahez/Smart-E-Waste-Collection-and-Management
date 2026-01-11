import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    MapPin,
    Package,
    ArrowUpDown,
    ChevronDown,
    Eye,
    ExternalLink
} from 'lucide-react';
import api from '../../api/axios';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [pickupPersons, setPickupPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schedulingData, setSchedulingData] = useState({
        pickupDate: '',
        pickupPersonId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reqRes, pRes] = await Promise.all([
                api.get('/api/requests'),
                api.get('/api/admin/pickup-persons')
            ]);
            setRequests(reqRes.data);
            setPickupPersons(pRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/api/requests/${id}/status`, { status });
            fetchData(); // Refresh
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/requests/${selectedRequest.id}/schedule`, {
                pickupDate: new Date(schedulingData.pickupDate).toISOString(),
                pickupPersonId: schedulingData.pickupPersonId
            });
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Failed to schedule pickup');
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'ALL' || req.status === filter;
        const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Requests</h1>
                    <p className="text-gray-500">Review and coordinate e-waste collection pickups.</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by user or device..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="bg-gray-50 border-none px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Requested By</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                                {req.deviceType.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{req.deviceType}</div>
                                                <div className="text-xs text-gray-500">{req.brand} {req.model}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-sm font-medium text-gray-900">{req.userName}</div>
                                        <div className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 max-w-[200px] truncate">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                            {req.pickupAddress}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getStatusBadgeStyle(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center gap-2">
                                            {req.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                                        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'APPROVED' && (
                                                <button
                                                    onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md"
                                                >
                                                    <Calendar className="w-3.5 h-3.5" /> Schedule
                                                </button>
                                            )}
                                            {req.status === 'SCHEDULED' && (
                                                <div className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                                                    <User className="w-3 h-3" /> Assigned
                                                </div>
                                            )}
                                            <button className="p-2 text-gray-400 hover:text-gray-900">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredRequests.length === 0 && (
                    <div className="p-20 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        No requests match your filters.
                    </div>
                )}
            </div>

            {/* Scheduling Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Schedule Pickup</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSchedule} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pickup Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={schedulingData.pickupDate}
                                        onChange={(e) => setSchedulingData({ ...schedulingData, pickupDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Assign Personnel</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={schedulingData.pickupPersonId}
                                        onChange={(e) => setSchedulingData({ ...schedulingData, pickupPersonId: e.target.value })}
                                    >
                                        <option value="">Select Pickup Person</option>
                                        {pickupPersons.map(p => (
                                            <option key={p.id} value={p.id}>{p.user.name} ({p.vehicleNumber})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                                    >
                                        Confirm Schedule
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getStatusBadgeStyle = (status) => {
    switch (status) {
        case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'COMPLETED': return 'bg-violet-50 text-violet-700 border-violet-200';
        case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

export default AdminRequests;
