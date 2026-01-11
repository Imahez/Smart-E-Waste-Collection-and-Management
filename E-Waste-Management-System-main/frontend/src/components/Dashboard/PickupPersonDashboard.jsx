import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    Map as MapIcon,
    CheckCircle2,
    Clock,
    Navigation,
    Phone,
    User,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    QrCode
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const PickupPersonDashboard = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        scheduled: 0,
        completedToday: 0
    });

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/pickup/my-assigned-requests');
            const data = res.data;

            setAssignments(data);

            const today = new Date().toISOString().split('T')[0];
            setStats({
                total: data.length,
                pending: data.filter(r => r.status === 'APPROVED').length,
                scheduled: data.filter(r => r.status === 'SCHEDULED' || r.status === 'ON_THE_WAY').length,
                completedToday: data.filter(r => r.status === 'COMPLETED').length
            });
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const upcomingPickups = assignments.filter(r => r.status === 'SCHEDULED').slice(0, 3);

    return (
        <div className="p-6 space-y-8 bg-slate-50 min-h-screen animate-in fade-in duration-700">
            {/* Header Profile Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <User className="w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Hello, {user?.name}!</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            Verified Pickup Personnel
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Link to="/pickup-person/route" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                        <Navigation className="w-5 h-5" />
                        Start Route
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Tasks', value: stats.total, icon: ClipboardList, color: 'indigo' },
                    { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'amber' },
                    { label: 'Completed Today', value: stats.completedToday, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'rose' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Next Operations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Upcoming Pickups</h2>
                        <Link to="/pickup-person/assignments" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {upcomingPickups.length > 0 ? (
                            upcomingPickups.map((pickup) => (
                                <div key={pickup.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                <QrCode className="w-7 h-7 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">{pickup.deviceType}</h3>
                                                <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1 font-medium">
                                                    <User className="w-3.5 h-3.5" /> {pickup.userName}
                                                </p>
                                                <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1 font-medium">
                                                    <MapIcon className="w-3.5 h-3.5" /> {pickup.pickupAddress}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <a href={`tel:${pickup.userPhone}`} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                                                <Phone className="w-5 h-5" />
                                            </a>
                                            <Link
                                                to={`/pickup-person/assignments?id=${pickup.id}`}
                                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                                            >
                                                Details <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardList className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-slate-900 font-bold text-lg">No scheduled pickups</h3>
                                <p className="text-slate-500">Check your assignments for new tasks.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Work Day Summary Card */}
                <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-6">Today's Progress</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2 font-medium opacity-90">
                                    <span>Efficiency</span>
                                    <span>{stats.total > 0 ? Math.round((stats.completedToday / stats.total) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all duration-1000"
                                        style={{ width: `${stats.total > 0 ? (stats.completedToday / stats.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                                    <p className="text-xs text-indigo-100 mb-1 font-bold uppercase tracking-wider">Distance</p>
                                    <p className="text-2xl font-bold">12.4 <span className="text-xs opacity-60">km</span></p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 text-center">
                                    <p className="text-xs text-indigo-100 mb-1 font-bold uppercase tracking-wider">Earned</p>
                                    <p className="text-2xl font-bold">450 <span className="text-xs opacity-60">pts</span></p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-indigo-100 mb-4 font-bold uppercase tracking-wider">Quick Note</p>
                                <div className="bg-white/5 p-4 rounded-2xl italic text-sm text-indigo-50 border border-white/5">
                                    "Keep it up! Your efforts reduced 4.2kg of potential toxic waste today."
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 -m-12 opacity-10">
                        <Navigation className="w-64 h-64 rotate-45" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PickupPersonDashboard;
