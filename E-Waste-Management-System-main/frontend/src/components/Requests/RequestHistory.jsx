import React, { useState, useEffect } from 'react';
import {
    History,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Calendar,
    MapPin,
    Package,
    MoreVertical,
    ArrowRight
} from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const RequestHistory = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/user/my-requests');
            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'ALL' || req.status === filter;
        const matchesSearch = req.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.brand.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'SCHEDULED': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-violet-50 text-violet-700 border-violet-200';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Request Records</h1>
                    <p className="text-gray-500">A complete timeline of your e-waste recycling journey.</p>
                </div>
                <button
                    onClick={() => navigate('/new-request')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                    <Package className="w-5 h-5" /> New Submission
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by device, brand, model..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-2xl outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="bg-gray-50 border-none px-4 py-3 rounded-2xl font-bold text-sm text-gray-600 outline-none transition-all"
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

            <div className="grid grid-cols-1 gap-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                        <div key={req.id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                                {/* Device Info */}
                                <div className="flex-1 flex items-center gap-6">
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-blue-600 font-bold text-2xl shadow-inner transition-colors ${req.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                            req.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                                'bg-blue-50'
                                        }`}>
                                        {req.deviceType.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{req.deviceType}</h3>
                                        <p className="text-sm text-gray-500 font-medium mb-2">{req.brand} • {req.model}</p>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(req.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5 truncate max-w-[200px]"><MapPin className="w-3.5 h-3.5" /> {req.pickupAddress}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Column */}
                                <div className="flex flex-col items-center lg:items-end gap-3 min-w-[150px]">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${getStatusBadgeStyle(req.status)}`}>
                                        {req.status}
                                    </span>
                                    <button
                                        onClick={() => navigate('/view-progress')}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                                    >
                                        View Timeline <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <button className="p-3 text-gray-300 hover:text-gray-900 transition-colors">
                                    <MoreVertical className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Subtle Progress Bar for Active Jobs */}
                            {(req.status === 'SCHEDULED' || req.status === 'APPROVED') && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-100/30">
                                    <div className="h-full bg-blue-500 animate-pulse w-2/3" />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                        <History className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">Your history is clear</h3>
                        <p className="text-gray-500">Start your first recycling request to build your impact history.</p>
                        <button
                            onClick={() => navigate('/new-request')}
                            className="mt-8 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
                        >
                            Submit First Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestHistory;
