import React, { useState, useEffect } from 'react';
import {
    Package,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    ArrowLeft,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Truck,
    Calendar,
    FileText
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ViewProgress = () => {
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

    const getStatusStep = (status) => {
        switch (status) {
            case 'PENDING': return 1;
            case 'APPROVED': return 2;
            case 'SCHEDULED': return 3;
            case 'ON_THE_WAY': return 4;
            case 'COMPLETED': return 5;
            case 'REJECTED': return 0;
            default: return 1;
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Request Progress</h1>
                        <p className="text-gray-500">Track and manage your e-waste pickup submissions.</p>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by device or brand..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-xl outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="bg-gray-50 border-none px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Requests</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            {/* Timeline List */}
            <div className="space-y-6">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                        <div key={req.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
                                {/* Basic Info */}
                                <div className="w-full lg:w-72 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 truncate">{req.deviceType}</h3>
                                            <p className="text-sm text-gray-500 font-medium">{req.brand} {req.model}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 pt-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <Calendar className="w-3.5 h-3.5" /> SUBMITTED ON {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <MapPin className="w-3.5 h-3.5" /> {req.pickupAddress.slice(0, 30)}...
                                        </div>
                                    </div>
                                    <div className={`mt-2 inline-block px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border ${getStatusBadgeStyle(req.status)}`}>
                                        {req.status}
                                    </div>
                                </div>

                                {/* Progress Visualizer */}
                                <div className="flex-1 w-full space-y-8">
                                    <div className="flex items-center justify-between w-full px-2">
                                        {[
                                            { label: 'Submit', icon: FileText, step: 1 },
                                            { label: 'Approve', icon: CheckCircle2, step: 2 },
                                            { label: 'Schedule', icon: Calendar, step: 3 },
                                            { label: 'En-route', icon: Truck, step: 4 },
                                            { label: 'Finalize', icon: CheckCircle2, step: 5 },
                                        ].map((s, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-3 relative flex-1 last:flex-none">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${getStatusStep(req.status) >= s.step
                                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
                                                        : 'bg-gray-100 text-gray-300'
                                                    }`}>
                                                    <s.icon className="w-6 h-6" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${getStatusStep(req.status) >= s.step ? 'text-emerald-700' : 'text-gray-300'
                                                    }`}>
                                                    {s.label}
                                                </span>
                                                {/* Line connector */}
                                                {idx < 4 && (
                                                    <div className={`absolute left-1/2 top-6 w-full h-[2px] transition-colors duration-1000 -z-0 ${getStatusStep(req.status) > s.step ? 'bg-emerald-600' : 'bg-gray-100'
                                                        }`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm mb-1">Status Update</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                                {req.status === 'PENDING' ? 'Our agents are verifying your device details and history.' :
                                                    req.status === 'APPROVED' ? 'Your request is approved! We are finding the nearest pickup person.' :
                                                        req.status === 'SCHEDULED' ? `Scheduled for pickup on ${new Date(req.scheduledPickupDate).toLocaleString()}.` :
                                                            req.status === 'COMPLETED' ? 'Successfully recycled. Your impact certificate is now available.' :
                                                                req.status === 'REJECTED' ? `Request rejected: ${req.rejectionReason || 'Policy mismatch'}` :
                                                                    'Updating status...'}
                                            </p>
                                        </div>
                                        <button className="p-3 bg-white text-gray-400 hover:text-emerald-600 rounded-xl border border-gray-100 shadow-sm transition-all hover:scale-110">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative side accent based on status */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 ${req.status === 'COMPLETED' ? 'bg-emerald-500' :
                                    req.status === 'REJECTED' ? 'bg-rose-500' :
                                        'bg-blue-500'
                                }`} />
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                        <Clock className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No active progress</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">You don't have any requests currently moving through our system.</p>
                        <button
                            onClick={() => navigate('/new-request')}
                            className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
                        >
                            Submit New Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewProgress;
