import React, { useState, useEffect } from 'react';
import {
    Navigation,
    MapPin,
    Phone,
    Clock,
    ChevronRight,
    MoreVertical,
    Flag,
    ArrowLeft,
    Search,
    CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const RouteMap = () => {
    const navigate = useNavigate();
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStop, setSelectedStop] = useState(null);

    useEffect(() => {
        fetchRouteData();
    }, []);

    const fetchRouteData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/pickup/route-data');
            setRouteData(res.data);
            if (res.data.stops.length > 0) {
                setSelectedStop(res.data.stops[0]);
            }
        } catch (error) {
            console.error('Error fetching route data:', error);
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

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] -m-6 overflow-hidden bg-slate-50">
            {/* Left Sidebar: Stop List */}
            <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
                <div className="p-6 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-900">Today's Route</h1>
                        <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <MoreVertical className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search stops..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {routeData?.stops.length > 0 ? (
                        routeData.stops.map((stop, idx) => (
                            <button
                                key={stop.id}
                                onClick={() => setSelectedStop(stop)}
                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative ${selectedStop?.id === stop.id
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                        : 'border-transparent bg-white hover:bg-slate-50 hover:border-slate-100'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${selectedStop?.id === stop.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{stop.device}</h3>
                                        <p className="text-xs text-slate-500 font-medium truncate mb-2">{stop.address}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                <Clock className="w-3 h-3" /> {new Date(stop.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                                                <Navigation className="w-3 h-3" /> 2.4km
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 self-center transition-colors ${selectedStop?.id === stop.id ? 'text-indigo-600' : 'text-slate-200'}`} />
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
                            <p className="text-slate-500 font-medium">All stops completed!</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-900 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm opacity-60 font-medium">Progress</div>
                        <div className="text-sm font-bold">2 / {routeData?.totalStops || 0} COMPLETED</div>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-[33%]" />
                    </div>
                </div>
            </div>

            {/* Right: Map Area */}
            <div className="flex-1 relative bg-slate-200">
                {/* Placeholder for Interactive Map */}
                <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Navigation className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Interactive Route Map Service</p>
                    </div>

                    {/* Simulated Map Pins */}
                    {routeData?.stops.map((stop, idx) => (
                        <div
                            key={stop.id}
                            className="absolute transition-all duration-700"
                            style={{
                                top: `${20 + (idx * 15)}%`,
                                left: `${30 + (idx * 10)}%`
                            }}
                        >
                            <div className={`relative group cursor-pointer ${selectedStop?.id === stop.id ? 'z-30' : 'z-20'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-transform hover:scale-110 ${selectedStop?.id === stop.id ? 'bg-indigo-600 scale-125 ring-4 ring-indigo-200' : 'bg-slate-700 opacity-60'
                                    }`}>
                                    {idx + 1}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-3 rounded-xl shadow-xl border border-slate-100 w-48 text-center pointer-events-none">
                                    <p className="font-bold text-slate-900 text-sm">{stop.customer}</p>
                                    <p className="text-slate-500 text-[10px]">{stop.address}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Simulated Route Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                        <path
                            d="M 35% 25% L 45% 40% L 55% 55% L 65% 70%"
                            stroke="#6366f1"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="10 10"
                        />
                    </svg>
                </div>

                {/* Selected Stop Card Override */}
                {selectedStop && (
                    <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:w-96 animate-in slide-in-from-bottom duration-500">
                        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedStop.customer}</h2>
                                    <p className="text-slate-500 font-medium">{selectedStop.device}</p>
                                </div>
                                <div className="bg-indigo-50 px-3 py-1 rounded-lg text-indigo-600 text-xs font-bold uppercase tracking-wider">
                                    {selectedStop.status}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin className="w-5 h-5 text-indigo-500" />
                                    <span className="text-sm font-medium">{selectedStop.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    <span className="text-sm font-medium">Schedule: {new Date(selectedStop.scheduledTime).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={`tel:0000000000`}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    <Phone className="w-5 h-5" /> Call
                                </a>
                                <button
                                    onClick={() => navigate(`/pickup-person/assignments?id=${selectedStop.id}`)}
                                    className="flex-[2] flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    <Flag className="w-5 h-5" /> Arrival Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteMap;
