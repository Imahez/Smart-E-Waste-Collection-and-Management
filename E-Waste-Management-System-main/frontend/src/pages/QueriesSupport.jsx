import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Send,
    History,
    CheckCircle2,
    Clock,
    AlertCircle,
    HelpCircle,
    ArrowRight,
    LifeBuoy,
    MessageCircle
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const QueriesSupport = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        category: 'GENERAL'
    });

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/support/my-tickets');
            setTickets(res.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/api/support/create', {
                subject: formData.subject,
                description: formData.message, // Backend model uses 'description' or 'message'? Let's check model.
                category: formData.category
            });
            alert('Your support ticket has been submitted!');
            setFormData({ subject: '', message: '', category: 'GENERAL' });
            setActiveTab('history');
            fetchMyTickets();
        } catch (error) {
            alert('Failed to submit ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Center</h1>
                    <p className="text-gray-500">How can we help you today? Our team is here to assist.</p>
                </div>
                <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        New Ticket
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        My History
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {activeTab === 'new' ? (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-left duration-500">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <MessageSquare className="w-6 h-6 text-blue-500" />
                                Submit New Query
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="category" className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                        <select
                                            id="category"
                                            name="category"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="GENERAL">General Inquiry</option>
                                            <option value="TECHNICAL">Technical Issue</option>
                                            <option value="PICKUP">Pickup Related</option>
                                            <option value="CERTIFICATE">Certificate Issues</option>
                                            <option value="FEEDBACK">Feedback</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Briefly describe the issue"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Tell us more about your inquiry..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Ticket</>}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right duration-500">
                            {loading ? (
                                <div className="bg-white rounded-3xl p-12 flex justify-center border border-gray-100">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <div key={ticket.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    <History className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(ticket.createdAt).toLocaleDateString()} • ID: #{ticket.id}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusStyle(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                                            <p className="text-sm text-gray-600 leading-relaxed italic">"{ticket.description || ticket.message}"</p>
                                        </div>
                                        {ticket.adminReply && (
                                            <div className="pl-6 border-l-4 border-emerald-400">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-700">Official Reply</span>
                                                </div>
                                                <p className="text-sm text-gray-700 font-medium">{ticket.adminReply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                                    <LifeBuoy className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900">No support history</h3>
                                    <p className="text-gray-500">You haven't submitted any queries yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Sidebar: FAQs & Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            Quick Support
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                <p className="text-xs font-bold text-blue-100 mb-1 uppercase">Response Time</p>
                                <p className="text-xl font-bold italic">Within 24 Hours</p>
                            </div>
                            <p className="text-sm text-blue-100 leading-relaxed">
                                Our support team is active Monday to Saturday, 9 AM to 6 PM. For urgent issues, please call the local collector.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-900 px-2 pb-2 border-b border-gray-50">Common Questions</h3>
                        <div className="space-y-1">
                            {[
                                "How to track my pickup?",
                                "What items are eligible?",
                                "Where is my certificate?",
                                "Can I reschedule?"
                            ].map((q, idx) => (
                                <button key={idx} className="w-full text-left p-3 rounded-xl hover:bg-gray-50 group flex items-center justify-between transition-all">
                                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{q}</span>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueriesSupport;
