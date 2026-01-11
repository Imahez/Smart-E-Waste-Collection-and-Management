import React, { useState, useEffect } from 'react';
import {
    Truck,
    Search,
    Filter,
    Plus,
    MoreVertical,
    CheckCircle2,
    ShieldCheck,
    User,
    Mail,
    Phone,
    MapPin,
    XCircle,
    TrendingUp,
    Settings,
    ChevronRight
} from 'lucide-react';
import api from '../../api/axios';

const PickupPersonManagement = () => {
    const [pickupPersons, setPickupPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPickupPersons();
    }, []);

    const fetchPickupPersons = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/admin/pickup-persons');
            setPickupPersons(res.data);
        } catch (error) {
            console.error('Error fetching pickup persons:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPersons = pickupPersons.filter(p =>
        (p.user?.name + p.vehicleNumber).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Logistics Personnel</h1>
                    <p className="text-gray-500">Manage your collection fleet and track performance metrics.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-100 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Onboard Personnel
                </button>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or vehicle number..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-amber-500 rounded-2xl outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> 12 Fleet Active
                    </div>
                </div>
            </div>

            {/* Personnel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPersons.map((person) => (
                    <div key={person.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-amber-100 transition-all overflow-hidden relative">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-amber-100 group-hover:rotate-3 transition-transform">
                                    {person.user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{person.user?.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-widest">{person.vehicleNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                <MoreVertical className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Progress Metrics */}
                        <div className="space-y-6 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Efficiency</p>
                                    <p className="text-lg font-black text-gray-900">98.4%</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Jobs Done</p>
                                    <p className="text-lg font-black text-gray-900">142</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">{person.user?.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{person.user?.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="truncate">Covering {person.vehicleType || 'Zone A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex gap-3 pt-8 border-t border-gray-50">
                            <button className="flex-1 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-amber-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Detailed Analytics
                            </button>
                            <button className="p-4 bg-gray-50 text-gray-400 hover:text-amber-600 rounded-[1.5rem] hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all active:scale-95">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                            <div className="absolute top-4 right-[-32px] w-32 h-8 bg-emerald-500 rotate-45 flex items-center justify-center shadow-sm">
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] ml-4">Active</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Onboarding Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-3xl font-bold text-gray-900">Personnel Onboarding</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <XCircle className="w-8 h-8 text-gray-300 hover:text-gray-900" />
                                </button>
                            </div>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Full Identity</label>
                                        <input className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-3xl outline-none transition-all" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                                        <input className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-3xl outline-none transition-all" placeholder="john@ecowaste.com" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Vehicle Plate No.</label>
                                        <input className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-3xl outline-none transition-all" placeholder="ABC-1234" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Operational Zone</label>
                                        <select className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-amber-500 rounded-3xl outline-none transition-all appearance-none cursor-pointer">
                                            <option>Northern Urban</option>
                                            <option>Southern Industrial</option>
                                            <option>Eastern Central</option>
                                            <option>Western Coast</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-amber-600 text-white rounded-[2rem] font-bold hover:bg-amber-700 transition-all shadow-xl shadow-amber-100 flex items-center justify-center gap-3 text-lg">
                                    <CheckCircle2 className="w-6 h-6" /> Confirm Registration
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickupPersonManagement;
