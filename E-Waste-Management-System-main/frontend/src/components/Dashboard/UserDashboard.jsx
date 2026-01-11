import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Recycle,
  TrendingUp,
  FileText,
  MapPin,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, requestsRes] = await Promise.all([
        api.get('/api/user/my-stats/requests-by-status'),
        api.get('/api/user/my-requests')
      ]);

      const formattedStats = Object.entries(statsRes.data).map(([status, count]) => ({
        status: status.replace('ROLE_', '').replace('_', ' '),
        count,
        color: getStatusColor(status)
      }));

      setStats(formattedStats);
      setRecentRequests(requestsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#F59E0B'; // Amber
      case 'APPROVED': return '#10B981'; // Emerald
      case 'SCHEDULED': return '#3B82F6'; // Blue
      case 'COMPLETED': return '#8B5CF6'; // Violet
      case 'REJECTED': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const totalRequests = stats.reduce((acc, curr) => acc + curr.count, 0);
  const completedRequests = stats.find(s => s.status === 'COMPLETED')?.count || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-emerald-50 text-lg max-w-xl">
              You've recycled {completedRequests} items so far. Every small action contributes to a greener planet.
            </p>
          </div>
          <Link
            to="/new-request"
            className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl font-semibold text-emerald-600 hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl group"
          >
            <PlusCircle className="w-5 h-5" />
            New Pickup Request
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -m-12 opacity-10">
          <Recycle className="w-64 h-64 rotate-12" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: totalRequests, icon: FileText, color: 'blue' },
          { label: 'Pending Approval', value: stats.find(s => s.status === 'PENDING')?.count || 0, icon: Clock, color: 'amber' },
          { label: 'Scheduled Pickups', value: stats.find(s => s.status === 'SCHEDULED')?.count || 0, icon: MapPin, color: 'emerald' },
          { label: 'Completed', value: completedRequests, icon: CheckCircle, color: 'violet' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className={`flex items-center gap-4 mb-4`}>
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <div className="flex items-center text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Impact</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Status Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Request Analytics</h2>
            <div className="text-sm text-gray-500">Distribution by status</div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link to="/requests" className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {recentRequests.length > 0 ? (
              recentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                      <Recycle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{req.deviceType}</h4>
                      <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusBadgeStyle(req.status)}`}>
                      {req.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                <p>No recent requests found</p>
                <Link to="/new-request" className="text-emerald-600 text-sm mt-2 hover:underline">Start recycling today</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'PENDING': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
    case 'APPROVED': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
    case 'SCHEDULED': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
    case 'COMPLETED': return 'bg-violet-50 text-violet-700 ring-violet-600/20';
    case 'REJECTED': return 'bg-red-50 text-red-700 ring-red-600/20';
    default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
  }
};

export default UserDashboard;
