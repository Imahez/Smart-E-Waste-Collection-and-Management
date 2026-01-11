import React, { useState, useEffect } from 'react';
import {
    Users,
    Truck,
    FileText,
    Activity,
    ArrowUpRight,
    TrendingUp,
    UserPlus,
    Clock,
    ShieldCheck,
    Package,
    ChevronRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Sector
} from 'recharts';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePieIndex, setActivePieIndex] = useState(0);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [summaryRes, requestsRes, usersRes] = await Promise.all([
                api.get('/api/admin/dashboard-summary'),
                api.get('/api/requests'),
                api.get('/api/admin/users')
            ]);

            setData({
                ...summaryRes.data,
                recentRequests: requestsRes.data.slice(0, 5),
                recentUsers: usersRes.data.slice(-5).reverse()
            });
        } catch (error) {
            console.error('Error fetching admin dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#F59E0B';
            case 'APPROVED': return '#10B981';
            case 'SCHEDULED': return '#3B82F6';
            case 'COMPLETED': return '#8B5CF6';
            case 'REJECTED': return '#EF4444';
            default: return '#6B7280';
        }
    };

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];

    return (
        <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                    <p className="text-gray-500">Real-time monitoring of e-waste collection operations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAdminData}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Activity className="w-4 h-4 text-blue-500" />
                        Refresh Data
                    </button>
                    <Link
                        to="/admin/pickup-persons"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Staff
                    </Link>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'blue', trend: '+12.5%' },
                    { label: 'Active Personnel', value: data.totalPickupPersons, icon: Truck, color: 'emerald', trend: 'Stable' },
                    { label: 'Total Requests', value: data.totalRequests, icon: FileText, color: 'violet', trend: '+8.2%' },
                    { label: 'System Health', value: '100%', icon: ShieldCheck, color: 'rose', trend: 'Optimal' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className={`p-3 rounded-xl bg-gray-50 text-gray-600 mb-4 inline-block group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-gray-500 font-medium text-sm mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                                <div className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {stat.trend}
                                </div>
                            </div>
                        </div>
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-all`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Request Status Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Request Distribution</h2>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                            Real-time update
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.statusStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="status"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    formatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {data.statusStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Type Pie Chart */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-8">Device Categories</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activePieIndex}
                                    data={data.deviceStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="device"
                                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                                >
                                    {data.deviceStats.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {data.deviceStats.slice(0, 4).map((stat, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-gray-600 truncate max-w-[120px]">{stat.device}</span>
                                </div>
                                <span className="font-bold text-gray-900">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Requests */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
                        <Link to="/admin/requests" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                            Manage All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {data.recentRequests.map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                        <Package className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{req.deviceType}</h4>
                                        <p className="text-xs text-gray-500">From: {req.userName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border ${getStatusBadgeStyle(req.status)}`}>
                                        {req.status}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900">New Users</h2>
                        <Link to="/admin/users" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                            User Directory <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {data.recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1">
                                        <Clock className="w-3 h-3" />
                                        {user.role.replace('ROLE_', '')}
                                    </div>
                                    <p className="text-[10px] text-gray-400 capitalize">{user.status || 'Active'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
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

export default AdminDashboard;
