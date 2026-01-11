import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    UserCheck,
    UserMinus,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Calendar,
    Settings,
    XCircle,
    Truck
} from 'lucide-react';
import api from '../../api/axios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await api.put(`/api/admin/users/${userId}/status`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name + user.email).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

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
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Directory</h1>
                    <p className="text-gray-500">Manage all registered accounts and system roles.</p>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="bg-gray-50 border-none px-4 py-3 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ROLE_USER">Users</option>
                        <option value="ROLE_ADMIN">Admins</option>
                        <option value="ROLE_PICKUP_PERSON">Personnel</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <div key={user.id} className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${user.role === 'ROLE_ADMIN' ? 'bg-rose-50 text-rose-600' :
                                        user.role === 'ROLE_PICKUP_PERSON' ? 'bg-amber-50 text-amber-600' :
                                            'bg-blue-50 text-blue-600'
                                    }`}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'ROLE_ADMIN' ? 'bg-rose-100 text-rose-700' :
                                                user.role === 'ROLE_PICKUP_PERSON' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role.replace('ROLE_', '')}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {user.status || 'ACTIVE'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{user.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Joined {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex gap-2">
                            <button
                                onClick={() => handleToggleStatus(user.id, user.status || 'ACTIVE')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all ${(user.status || 'ACTIVE') === 'ACTIVE'
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                    }`}
                            >
                                {(user.status || 'ACTIVE') === 'ACTIVE' ? (
                                    <><UserMinus className="w-4 h-4" /> Deactivate</>
                                ) : (
                                    <><UserCheck className="w-4 h-4" /> Activate</>
                                )}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-900 hover:text-white transition-all">
                                <Settings className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No users found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
