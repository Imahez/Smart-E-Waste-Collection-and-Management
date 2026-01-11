import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    FileText,
    Download,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    Users,
    Package,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    Printer
} from 'lucide-react';
import api from '../../api/axios';

const ManageReports = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRequests: 0,
        completedRequests: 0,
        impactScore: 4.8
    });

    useEffect(() => {
        fetchGlobalStats();
    }, []);

    const fetchGlobalStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/admin/dashboard-summary');
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching global stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const monthlyTrend = [
        { month: 'Jan', collections: 45 },
        { month: 'Feb', collections: 52 },
        { month: 'Mar', collections: 48 },
        { month: 'Apr', collections: 70 },
        { month: 'May', collections: 61 },
        { month: 'Jun', collections: 85 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Reports</h1>
                    <p className="text-gray-500">Comprehensive overview of system-wide e-waste collection performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
                        <Printer className="w-5 h-5" /> Print
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <Download className="w-5 h-5" /> Export PDF
                    </button>
                </div>
            </div>

            {/* High Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Registrations', value: stats.totalUsers, icon: Users, color: 'blue' },
                    { label: 'Global Requests', value: stats.totalRequests, icon: Package, color: 'indigo' },
                    { label: 'Successful Cycles', value: stats.completedRequests, icon: ShieldCheck, color: 'emerald' },
                    { label: 'Avg System Health', value: '94%', icon: TrendingUp, color: 'rose' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <h3 className="text-3xl font-black text-gray-900">{item.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Analysis */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-bold text-gray-900">Monthly Growth Analysis</h2>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                                <div className="w-3 h-3 rounded-full bg-blue-600" /> COLLECTIONS
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyTrend}>
                                <defs>
                                    <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="collections" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorColl)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent System Activities */}
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-xl font-bold">Activity Logs</h2>
                        <div className="space-y-6">
                            {[
                                { title: 'New Node Deployment', time: '12m ago', desc: 'New recycling facility registered in Sector 4.' },
                                { title: 'Goal Achieved', time: '2h ago', desc: 'System reached 5,000kg collection milestone.' },
                                { title: 'Policy Update', time: '5h ago', desc: 'Updated e-waste handling protocols for wearables.' }
                            ].map((log, idx) => (
                                <div key={idx} className="flex gap-4 group cursor-pointer">
                                    <div className="w-1.5 h-12 bg-blue-500/20 group-hover:bg-blue-500 rounded-full transition-all" />
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-bold group-hover:text-blue-400 transition-colors">{log.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-500">{log.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">{log.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            View Full Audit Trail <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Global Distribution */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Regional Collection Summary</h2>
                    <button className="text-blue-600 font-bold text-sm hover:underline">View Detailed Map</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { region: 'North Zone', rate: 92, status: 'Optimal' },
                        { region: 'East Zone', rate: 78, status: 'Developing' },
                        { region: 'West Zone', rate: 85, status: 'Optimal' },
                        { region: 'South Zone', rate: 64, status: 'Increasing' },
                    ].map((zone, idx) => (
                        <div key={idx} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-blue-200 transition-all">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{zone.region}</p>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-2xl font-black text-gray-900">{zone.rate}%</span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase">Eff. Rate</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${zone.rate}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 italic">Target status: {zone.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageReports;
