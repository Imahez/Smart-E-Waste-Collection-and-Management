import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageCircle,
    Mail,
    User,
    Send,
    XCircle,
    ArrowUpRight
} from 'lucide-react';
import api from '../../api/axios';

const ManageTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Open');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/support/admin/all');
            setTickets(res.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSubmitting(true);
        try {
            await api.put(`/api/support/admin/${selectedTicket.id}/reply`, {
                reply: replyText
            });
            alert('Reply sent and ticket resolved.');
            setIsModalOpen(false);
            setReplyText('');
            fetchTickets();
        } catch (error) {
            alert('Failed to send reply.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesFilter = filter === 'ALL' || ticket.status === filter;
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Support Tickets</h1>
                    <p className="text-gray-500">Manage user inquiries and technical support requests.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by user, subject..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="bg-gray-50 border-none px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="Open">Open</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-2xl ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            <MessageCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {ticket.user?.name || 'User'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600">
                                        "{ticket.description || ticket.message}"
                                    </div>
                                </div>

                                <div className="w-full lg:w-72 flex flex-col items-end gap-3 self-center lg:self-start">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${getStatusStyle(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    {ticket.status === 'Open' ? (
                                        <button
                                            onClick={() => { setSelectedTicket(ticket); setIsModalOpen(true); }}
                                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" /> Reply & Resolve
                                        </button>
                                    ) : (
                                        <div className="w-full p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs uppercase">
                                                <CheckCircle2 className="w-4 h-4" /> Resolved Response
                                            </div>
                                            <p className="text-xs text-emerald-800 line-clamp-2">{ticket.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No tickets found</h3>
                        <p className="text-gray-500">Try changing your filters or searching again.</p>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold text-gray-900">Send Response</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                                    <XCircle className="w-7 h-7" />
                                </button>
                            </div>

                            <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-600 uppercase mb-2">Issue Detail</p>
                                <p className="text-sm font-medium text-blue-900 italic">"{selectedTicket?.description || selectedTicket?.message}"</p>
                            </div>

                            <form onSubmit={handleReply} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Your Official Reply</label>
                                    <textarea
                                        required
                                        rows="6"
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all"
                                        placeholder="Provide a detailed response to the user..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !replyText.trim()}
                                        className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                                    >
                                        {submitting ? 'Sending...' : <><Send className="w-5 h-5 inline mr-2" /> Resolve Ticket</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTickets;
