import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Search,
    Filter,
    Calendar,
    Package,
    ShieldCheck,
    History,
    ArrowRight,
    ExternalLink,
    Award,
    BarChart2
} from 'lucide-react';
import api from '../api/axios';

const Reports = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/user/my-requests');
            setRequests(res.data.filter(r => r.status === 'COMPLETED'));
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async (requestId) => {
        try {
            const response = await api.get(`/api/user/report/${requestId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Recycle_Report_${requestId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            alert('Failed to generate report.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Recycling Reports</h1>
                    <p className="text-gray-500">Access your historical records and environmental certifications.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                        <Download className="w-5 h-5" /> Export All History
                    </button>
                </div>
            </div>

            {/* Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-1 border-r border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Reports</p>
                        <h3 className="text-4xl font-black text-gray-900">{requests.length}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">Ready for download</p>
                    </div>
                    <div className="space-y-1 border-r border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Weight</p>
                        <h3 className="text-4xl font-black text-emerald-600">{(requests.length * 3.5).toFixed(1)} <span className="text-xl text-emerald-300">kg</span></h3>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">Diverted from Landfill</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rank</p>
                        <h3 className="text-4xl font-black text-blue-600">#452</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase mt-1">Top 10% Local Zone</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl">
                    <Award className="w-10 h-10 mb-4 opacity-50" />
                    <div>
                        <h4 className="text-lg font-bold mb-1">Impact Summary</h4>
                        <p className="text-xs text-blue-100 leading-relaxed font-medium">Verify your yearly environmental contribution summary.</p>
                    </div>
                    <button className="mt-4 text-xs font-bold text-white bg-white/10 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10 uppercase tracking-widest">
                        Generate Annual <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search reports by device type..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-emerald-500 rounded-2xl outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-gray-50 text-gray-500 rounded-2xl hover:bg-gray-100 border border-gray-100">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-full py-20 flex justify-center bg-white rounded-3xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : requests.length > 0 ? (
                        requests.map((report) => (
                            <div key={report.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{report.deviceType}</h4>
                                            <p className="text-sm text-gray-500 font-medium">Completed on {new Date(report.completedDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg uppercase tracking-tighter">Verified</span>
                                </div>
                                <div className="flex gap-3 pt-6 border-t border-gray-50">
                                    <button
                                        onClick={() => handleDownloadReport(report.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
                                    >
                                        <Download className="w-4 h-4" /> Download Report
                                    </button>
                                    <button className="p-4 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                                        <History className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                            <BarChart2 className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900">No completed reports yet</h3>
                            <p className="text-gray-500">Reports are generated automatically after a successful collection cycle.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
