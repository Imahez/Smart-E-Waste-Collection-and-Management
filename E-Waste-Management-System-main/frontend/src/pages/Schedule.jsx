import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    ArrowLeft,
    Truck,
    CheckCircle2,
    AlertCircle,
    Briefcase,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Schedule = () => {
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/pickup/my-assigned-requests');
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));

    const getJobsForDay = (day) => {
        return assignments.filter(a => {
            const d = new Date(a.scheduledPickupDate || a.createdAt);
            return d.getDate() === day && d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Deployment Schedule</h1>
                    <p className="text-slate-500">View and manage your upcoming collection shifts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-slate-400 py-4 tracking-widest">{day}</div>
                        ))}
                        {[...Array(firstDayOfMonth(currentMonth))].map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {[...Array(daysInMonth(currentMonth))].map((_, i) => {
                            const day = i + 1;
                            const jobs = getJobsForDay(day);
                            const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();

                            return (
                                <div key={day} className={`aspect-square p-2 border border-slate-50 relative group cursor-pointer hover:bg-indigo-50/50 transition-colors ${isToday ? 'bg-indigo-50/30' : ''}`}>
                                    <span className={`text-xs font-bold ${isToday ? 'text-indigo-600' : 'text-slate-600'}`}>{day}</span>
                                    {jobs.length > 0 && (
                                        <div className="mt-1 space-y-0.5">
                                            {jobs.slice(0, 2).map((j, idx) => (
                                                <div key={idx} className={`h-1.5 w-full rounded-full ${j.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-indigo-500'}`} />
                                            ))}
                                            {jobs.length > 2 && <div className="text-[8px] font-bold text-slate-400">+{jobs.length - 2} more</div>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Day Details */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Briefcase className="w-6 h-6 text-indigo-400" />
                            Next Assignment
                        </h3>
                        {assignments.filter(a => a.status !== 'COMPLETED').slice(0, 1).map(job => (
                            <div key={job.id} className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Incoming Task</p>
                                    <h4 className="text-2xl font-bold text-white">{job.deviceType}</h4>
                                    <p className="text-sm text-slate-400">{job.brand} {job.model}</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-indigo-400" />
                                        <span className="text-slate-300 truncate">{job.pickupAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-indigo-400" />
                                        <span className="text-slate-300">Set for: {new Date(job.scheduledPickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="w-4 h-4 text-indigo-400" />
                                        <span className="text-slate-300">Contact: {job.userName}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/pickup-person/route')}
                                    className="w-full py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-5 h-5" /> Start Trip
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h4 className="font-bold text-emerald-900">Shift Status</h4>
                        </div>
                        <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                            Your availability is currently set to <span className="font-bold">ON DUTY</span>. You will receive real-time notifications for approved requests.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
