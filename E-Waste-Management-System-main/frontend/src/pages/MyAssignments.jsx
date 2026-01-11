import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    MapPin,
    Phone,
    Calendar,
    CheckCircle2,
    Send,
    ShieldCheck,
    Clock,
    ArrowRight,
    Package,
    Search,
    AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { useLocation } from 'react-router-dom';

const MyAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('SCHEDULED');
    const [otpModal, setOtpModal] = useState({ isOpen: false, requestId: null, otp: '' });
    const [verifying, setVerifying] = useState(false);

    const location = useLocation();
    const highlightedId = new URLSearchParams(location.search).get('id');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/pickup/my-assigned-requests');
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (id) => {
        try {
            await api.post(`/api/pickup/request/${id}/initiate-verification`);
            setOtpModal({ isOpen: true, requestId: id, otp: '' });
            alert('OTP sent to customer email!');
        } catch (error) {
            alert('Failed to send OTP. Please check customer details.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifying(true);
        try {
            await api.post(`/api/pickup/request/${otpModal.requestId}/verify-complete`, null, {
                params: { otp: otpModal.otp }
            });
            setOtpModal({ isOpen: false, requestId: null, otp: '' });
            alert('Pickup completed successfully!');
            fetchAssignments();
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const filteredAssignments = assignments.filter(a => a.status === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Center</h1>
                    <p className="text-slate-500">Manage your active and completed e-waste collection tasks.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit">
                {[
                    { id: 'SCHEDULED', label: 'Active Jobs', icon: Clock },
                    { id: 'COMPLETED', label: 'Completed', icon: CheckCircle2 }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Assignments List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((job) => (
                        <div
                            key={job.id}
                            className={`group bg-white rounded-3xl p-8 border-2 transition-all hover:shadow-xl ${highlightedId === String(job.id) ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left: Device Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 shadow-inner">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl font-bold text-slate-900">{job.deviceType}</h2>
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase">ID: {job.id}</span>
                                                </div>
                                                <p className="text-slate-500 font-medium">{job.brand} • {job.model}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup Address</p>
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{job.pickupAddress}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-indigo-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Time</p>
                                                <p className="text-sm text-slate-700 font-medium">{job.scheduledDate ? new Date(job.scheduledDate).toLocaleString() : 'Not set'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Customer & Actions */}
                                <div className="w-full lg:w-72 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                            {job.userName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{job.userName}</p>
                                            <p className="text-xs text-slate-500 font-medium">{job.userPhone}</p>
                                        </div>
                                    </div>

                                    {activeTab === 'SCHEDULED' ? (
                                        <div className="space-y-3">
                                            <a
                                                href={`tel:${job.userPhone}`}
                                                className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                                            >
                                                <Phone className="w-5 h-5" /> Call Customer
                                            </a>
                                            <button
                                                onClick={() => handleSendOtp(job.id)}
                                                className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                            >
                                                <ShieldCheck className="w-5 h-5" /> Verify & Complete
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                                            <p className="text-sm font-bold text-emerald-700 tracking-tight">Job Completed</p>
                                            <p className="text-[10px] text-emerald-600 mt-1 uppercase font-bold">On {new Date(job.completedDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <ClipboardList className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
                        <p className="text-slate-500">Your assignment tray is currently empty.</p>
                    </div>
                )}
            </div>

            {/* OTP Modal */}
            {otpModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Security Verification</h3>
                            <p className="text-slate-500 text-sm mb-8">Please enter the 6-digit OTP sent to the customer's registered email address.</p>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="0 0 0 0 0 0"
                                    className="w-full text-center text-4xl font-bold tracking-[1rem] py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                                    value={otpModal.otp}
                                    onChange={(e) => setOtpModal({ ...otpModal, otp: e.target.value.replace(/\D/g, '') })}
                                />

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setOtpModal({ isOpen: false, requestId: null, otp: '' })}
                                        className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={otpModal.otp.length !== 6 || verifying}
                                        className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        {verifying ? 'Verifying...' : 'Complete Job'}
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

export default MyAssignments;
