import React, { useState, useEffect } from 'react';
import {
    Leaf,
    Award,
    Zap,
    Droplet,
    Wind,
    Globe,
    Trophy,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    History,
    Download
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import api from '../api/axios';

const TrackYourImpact = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImpactData();
    }, []);

    const fetchImpactData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/user/my-stats/requests-by-status');
            // Simulated impact calculation based on request counts
            const totalItems = Object.values(res.data).reduce((a, b) => a + b, 0);
            setStats({
                totalItems,
                completed: res.data.COMPLETED || 0,
                co2Saved: (res.data.COMPLETED || 0) * 1.5, // 1.5kg CO2 per item
                waterSaved: (res.data.COMPLETED || 0) * 12, // 12L water per item
                toxicPrevented: (res.data.COMPLETED || 0) * 0.4 // 400g toxic waste per item
            });
        } catch (error) {
            console.error('Error fetching impact data:', error);
        } finally {
            setLoading(false);
        }
    };

    const data = [
        { name: 'Week 1', impact: 400 },
        { name: 'Week 2', impact: 300 },
        { name: 'Week 3', impact: 600 },
        { name: 'Week 4', impact: 800 },
        { name: 'Week 5', impact: 500 },
        { name: 'Week 6', impact: 900 },
    ];

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Environmental Impact</h1>
                    <p className="text-gray-500">Visualizing your contribution to a sustainable future.</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold border border-emerald-100 shadow-sm">
                    <Award className="w-5 h-5" />
                    Level 4 Environmental Guardian
                </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'CO2 Emission Prevented', value: stats.co2Saved.toFixed(1), unit: 'kg', icon: Wind, color: 'blue' },
                    { label: 'Toxic Waste diverted', value: stats.toxicPrevented.toFixed(1), unit: 'kg', icon: Zap, color: 'emerald' },
                    { label: 'Water Saved', value: stats.waterSaved, unit: 'Liters', icon: Droplet, color: 'cyan' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl hover:border-emerald-100 transition-all">
                        <div className={`p-4 rounded-3xl bg-${item.color}-50 text-${item.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-10 h-10" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{item.label}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900">{item.value}</span>
                            <span className="text-lg font-bold text-gray-400">{item.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Your Impact Journey</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> CO2 Offset</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#10b981', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="impact" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorImpact)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Global Impact Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-2xl font-bold">Community Reach</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Your contribution has helped us move closer to our global goal of 100% sustainable e-waste management. You are among the top 5% of contributors this month!
                        </p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-2 text-emerald-400">
                                    <span>GLOBAL PROGRESS</span>
                                    <span>84.2%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-[84%]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Tree Equivalent</p>
                                    <p className="text-2xl font-bold text-white">4.2 <span className="text-xs font-normal opacity-50">Trees</span></p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Points Earned</p>
                                    <p className="text-2xl font-bold text-white">1,250 <span className="text-xs font-normal opacity-50">PTS</span></p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                            Learn More <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <Globe className="absolute -bottom-16 -right-16 w-64 h-64 text-emerald-500/10 group-hover:rotate-12 transition-transform duration-1000" />
                </div>
            </div>

            {/* Rewards Section */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        Certification & Badges
                    </h2>
                    <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'Eco Starter', criteria: 'First Pickup', earned: true },
                        { name: 'Nature Hero', criteria: '5 Successful Pickups', earned: stats.completed >= 5 },
                        { name: 'CO2 Warrior', criteria: '10kg Offset', earned: stats.co2Saved >= 10 },
                        { name: 'Waste Buster', criteria: '10 Items Recycled', earned: stats.totalItems >= 10 }
                    ].map((badge, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border-2 transition-all ${badge.earned ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent opacity-50 grayscale'
                            }`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${badge.earned ? 'bg-white text-emerald-600 shadow-sm' : 'bg-gray-200 text-gray-400'
                                }`}>
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-gray-900">{badge.name}</h4>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">{badge.criteria}</p>
                            {badge.earned && (
                                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                                    <Download className="w-3.5 h-3.5" /> DOWNLOAD CERTIFICATE
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrackYourImpact;
