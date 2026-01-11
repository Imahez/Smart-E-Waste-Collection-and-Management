import React, { useRef } from 'react';
import {
    Award,
    Download,
    ShieldCheck,
    MapPin,
    Calendar,
    CheckCircle2,
    Printer,
    Share2,
    Trash2,
    Leaf,
    Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Certificate = () => {
    const { user } = useAuth();
    const certificateRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Impact Credentials</h1>
                    <p className="text-gray-500">Official recognition for your commitment to environmental sustainability.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <Printer className="w-5 h-5" /> Print
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                        <Download className="w-5 h-5" /> Download PDF
                    </button>
                </div>
            </div>

            {/* Certificate Canvas */}
            <div
                ref={certificateRef}
                className="relative bg-white aspect-[1.414/1] rounded-[2.5rem] p-12 shadow-2xl border-[16px] border-emerald-50 overflow-hidden group print:shadow-none print:border-8 print:m-0"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="h-full border-4 border-emerald-100 rounded-3xl p-12 flex flex-col items-center justify-between relative z-10">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                                <Leaf className="w-12 h-12" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-[0.2em]">Certificate of Impact</h2>
                        <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full" />
                        <p className="text-sm font-bold text-emerald-600 tracking-widest uppercase mt-4">Recognition for Sustainable Stewardship</p>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-8 flex-1 flex flex-col justify-center">
                        <p className="text-gray-500 italic text-lg leading-relaxed max-w-lg mx-auto">
                            This document is hereby awarded to
                        </p>
                        <h3 className="text-5xl font-black text-gray-900 border-b-2 border-slate-200 inline-block px-12 py-2 italic font-serif">
                            {user?.name || 'Valued Contributor'}
                        </h3>
                        <p className="text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
                            For demonstrating exceptional commitment to the environment by safely recycling electronic waste through the <span className="text-emerald-600 font-bold">EcoWaste Management System</span>. Your contribution has directly prevented hazardous materials from impacting our local ecosystem.
                        </p>
                    </div>

                    {/* Footer Stats & Sig */}
                    <div className="w-full flex items-end justify-between pt-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 rounded-2xl">
                                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification ID</p>
                                    <p className="text-sm font-bold text-gray-900">EW-{(Math.random() * 1000000).toFixed(0)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-2xl">
                                    <Globe className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Contribution</p>
                                    <p className="text-sm font-bold text-gray-900">Level 4 Citizen</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="w-48 h-1 bg-gray-200 mx-auto rounded-full" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">System Administrator</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Authorization</p>
                            </div>
                            <img className="h-12 mx-auto grayscale opacity-50 block" src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch_Signature.png" alt="signature" />
                        </div>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
                    <div className="grid grid-cols-10 gap-10 p-10 rotate-12">
                        {[...Array(50)].map((_, i) => <Award key={i} className="w-12 h-12" />)}
                    </div>
                </div>
            </div>

            {/* Summary Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Certificate Benefits
                    </h4>
                    <ul className="space-y-4">
                        {[
                            'Verified documentation of eco-friendly disposal',
                            'Sharable digital credential for social profiles',
                            'Redeemable for eco-points at partner centers',
                            'Tax benefit eligibility proof (where applicable)'
                        ].map((b, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {b}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-center">
                    <h4 className="text-xl font-bold mb-4">Share Your Achievement</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Inspire others to join the green movement. Sharing your certificate increases regional awareness by up to 15%.
                    </p>
                    <div className="flex gap-4">
                        <button className="flex-1 py-4 bg-[#1877F2] rounded-2xl font-bold group hover:scale-105 transition-all flex items-center justify-center gap-2">
                            Facebook
                        </button>
                        <button className="flex-1 py-4 bg-[#1DA1F2] rounded-2xl font-bold group hover:scale-105 transition-all flex items-center justify-center gap-2">
                            Twitter
                        </button>
                        <button className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
