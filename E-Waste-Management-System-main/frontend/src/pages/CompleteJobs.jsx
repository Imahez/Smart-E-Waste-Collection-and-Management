import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Search,
    Filter,
    Calendar,
    MapPin,
    Clock,
    ArrowLeft,
    Package,
    Trophy,
    ArrowUpRight,
    MoreVertical,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CompleteJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCompletedJobs();
    }, []);

    const fetchCompletedJobs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/pickup/my-assigned-requests');
            setJobs(res.data.filter(j => j.status === 'COMPLETED'));
        } catch (error) {
            console.error('Error fetching completed jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(j =>
        (j.deviceType + j.userName).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Success Archive</h1>
                    <p className="text-slate-500">Every completed job contributes to a cleaner planet. Excellent work!</p>
                </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-2">Carrier Milestone</p>
                        <h3 className="text-4xl font-black mb-1">{jobs.length}</h3>
                        <p className="text-sm font-bold text-emerald-100 italic">Total Successful Pickups</p>
                    </div>
                    <Trophy className="absolute -bottom-6 -right-6 w-38 h-38 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume Processed</p>
                    <h3 className="text-4xl font-black text-slate-900">{(jobs.length * 4.2).toFixed(1)} <span className="text-xl text-slate-300">kg</span></h3>
                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1 uppercase">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +12% from last wk
                    </p>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Rating</p>
                    <h3 className="text-4xl font-black text-indigo-600">4.9 <span className="text-xl text-indigo-200">/ 5</span></h3>
                    <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-1 rounded-full bg-indigo-500" />)}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by customer name or item..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-6 transition-transform">
                                            <Package className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{job.deviceType}</h4>
                                            <p className="text-sm text-slate-500 font-medium">Completed on {new Date(job.completedDate || job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </span>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">BY</div>
                                        <span className="font-bold">{job.userName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate">{job.pickupAddress}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-slate-100">
                                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                                        View Full Receipt
                                    </button>
                                    <button className="p-4 bg-slate-50 text-slate-300 hover:text-slate-900 rounded-2xl transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                            <CheckCircle2 className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Archive is currently empty</h3>
                            <p className="text-slate-500">Completed jobs will appear here as per your service record.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompleteJobs;
