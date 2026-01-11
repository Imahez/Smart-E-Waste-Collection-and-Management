import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    ShieldCheck,
    Save,
    ChevronRight,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

const ProfileSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/api/user/profile', {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            alert('Profile updated successfully!');
            // Update local storage user data
            const updatedUser = { ...user, name: formData.name, phoneNumber: formData.phoneNumber, address: formData.address };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload(); // Refresh to sync
        } catch (error) {
            alert(error.response?.data || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="text-gray-500">Manage your profile information and security preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Quick Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-blue-100">
                            {user?.name?.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500 font-medium text-sm mb-6">{user?.email}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            {user?.role?.replace('ROLE_', '')}
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                        <div className="flex gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                                <AlertCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-900 text-sm mb-1">Impact Verified</h4>
                                <p className="text-xs text-emerald-700 leading-relaxed">Your account is in good standing. You've contributed to the removal of e-waste from 2 collection zones.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Detailed Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                        {/* Basic Info */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            name="name"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            name="phoneNumber"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Default Pickup Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
                                    <textarea
                                        name="address"
                                        required
                                        rows="3"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Security */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-rose-500" />
                                Security & Password
                            </h3>
                            <p className="text-sm text-gray-500 italic px-4 py-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                To update your password or profile, please confirm your current password for security.
                            </p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            required
                                            className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Min. 8 characters"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (formData.newPassword && formData.newPassword !== formData.confirmPassword)}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
