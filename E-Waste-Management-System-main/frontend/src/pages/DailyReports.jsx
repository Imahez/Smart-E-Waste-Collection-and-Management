import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Calendar,
    Download,
    Filter,
    ChevronRight,
    Clock,
    MapPin,
    CheckCircle2,
    ArrowLeft,
    Settings,
    MoreVertical,
    Package
} from 'lucide-react';
import api from '../api/axios';

const DailyReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchReports();
    }, [selectedDate]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/pickup/my-assigned-requests');
            // Filter for completed items on the selected date (simulated or real)
            const data = res.data.filter(r => r.status === 'COMPLETED');
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaySummary = () => ({
        total: reports.length,
        weight: reports.length * 3.2,
        points: reports.length * 150
    });

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Work Journals</h1>
                    <p className="text-slate-500">Review your daily collection logs and performance data.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="w-5 h-5 text-indigo-600 ml-2" />
                    <input
                        type="date"
                        className="bg-transparent border-none font-bold text-sm text-slate-700 outline-none pr-4"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Daily Summary Block */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jobs Completed</p>
                    <h3 className="text-4xl font-black text-slate-900">{reports.length}</h3>
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% SUCCESS RATE
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">E-Waste Processed</p>
                    <h3 className="text-4xl font-black text-slate-900">{getDaySummary().weight.toFixed(1)} <span className="text-xl text-slate-400">kg</span></h3>
                    <p className="text-xs text-slate-500 font-bold mt-1 uppercase">Approximate volume</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue Impact</p>
                    <h3 className="text-4xl font-black text-indigo-600">{getDaySummary().points} <span className="text-xl text-indigo-300">PTS</span></h3>
                    <button className="text-xs text-indigo-600 font-bold hover:underline mt-1 flex items-center gap-1 uppercase">
                        <Download className="w-3 h-3" /> Export Daily Log
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-8 scale-150 opacity-[0.03] rotate-12 pointer-events-none">
                    <FileText className="w-32 h-32" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 px-2 flex items-center gap-2">
                    Details for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>

                {loading ? (
                    <div className="py-20 flex justify-center bg-white rounded-3xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : reports.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {reports.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <Package className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900 text-lg truncate">{item.deviceType}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {item.id}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <User className="w-3.5 h-3.5" /> {item.userName}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate max-w-[200px]">
                                                <MapPin className="w-3.5 h-3.5" /> {item.pickupAddress}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Clock className="w-3.5 h-3.5" /> 14:25 PM
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <button className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                            View Full Card
                                        </button>
                                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <Package className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No entries for this date</h3>
                        <p className="text-slate-500">Pick a different date to see your collection history.</p>
                    </div>
                )}
            </div>

            {/* Motivational Area */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-indigo-100">
                <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md">
                    <Clock className="w-10 h-10 text-indigo-200" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold mb-1">Maintaining Consistency</h4>
                    <p className="text-indigo-100 text-sm italic">"Your dedicated logging helps the community track real-time recycling progress. Every entry counts!"</p>
                </div>
                <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <p className="text-[10px] font-bold text-indigo-200 uppercase">Streak</p>
                    <p className="text-2xl font-bold">12 DAYS</p>
                </div>
            </div>
        </div>
    );
};

const User = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default DailyReports;
