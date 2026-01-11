import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    Trophy,
    Target,
    TrendingUp,
    Star,
    Clock,
    Zap,
    Award,
    CheckCircle2,
    AlertCircle,
    Truck,
    ArrowUpRight,
    ShieldCheck
} from 'lucide-react';
import api from '../api/axios';

const Performance = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPickups: 154,
        rating: 4.8,
        ontimeRate: 98.2,
        completedToday: 12,
    });

    useEffect(() => {
        // Simulated fetch
        setTimeout(() => setLoading(false), 800);
    }, []);

    const weeklyData = [
        { day: 'Mon', completed: 12 },
        { day: 'Tue', completed: 15 },
        { day: 'Wed', completed: 8 },
        { day: 'Thu', completed: 18 },
        { day: 'Fri', completed: 20 },
        { day: 'Sat', completed: 14 },
        { day: 'Sun', completed: 5 },
    ];

    const categoryData = [
        { name: 'Laptops', value: 45, color: '#6366f1' },
        { name: 'Phones', value: 30, color: '#10b981' },
        { name: 'Home App', value: 15, color: '#f59e0b' },
        { name: 'Other', value: 10, color: '#9ca3af' },
    ];

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
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Analytics</h1>
                    <p className="text-slate-500">Track your efficiency and collection milestones.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-700">Elite Tier Personnel</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Rating', value: stats.rating, unit: '/ 5.0', icon: Star, color: 'amber' },
                    { label: 'On-Time Rate', value: stats.ontimeRate, unit: '%', icon: Clock, color: 'emerald' },
                    { label: 'Energy Saved', value: '425', unit: 'kWh', icon: Zap, color: 'indigo' },
                    { label: 'Certificates', value: '12', unit: 'Earned', icon: Award, color: 'rose' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
                        <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900">{item.value}</span>
                            <span className="text-sm font-bold text-slate-400">{item.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Completion Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900">Job Completion Trends</h2>
                        <select className="bg-slate-50 border-none px-4 py-2 rounded-xl text-xs font-bold outline-none text-slate-500">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 8 }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Collection Categories */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-8">Collection Mix</h2>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="h-64 w-64 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            {categoryData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges and Rewards Area */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-6 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold tracking-widest uppercase">
                                <Trophy className="w-4 h-4" /> Season Hall of Fame
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tight">Level Up Your Collection Game</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Complete 15 more pickups this week to unlock the <span className="text-white font-bold">"Master Recycler"</span> badge and earn a performance bonus.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <CheckCircle2 className="w-7 h-7 text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Season Tasks</p>
                                        <p className="text-xl font-bold">142 / 200</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <Target className="w-7 h-7 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</p>
                                        <p className="text-xl font-bold">99.4%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                <Award className="w-48 h-48 text-indigo-400 opacity-80 animate-bounce duration-[3000ms]" />
                            </div>
                        </div>
                    </div>
                </div>

                <TrendingUp className="absolute -bottom-10 -right-10 w-80 h-80 text-white/5 -rotate-12" />
            </div>
        </div>
    );
};

export default Performance;
