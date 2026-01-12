import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GeminiChatBot from '../components/GeminiChatBot';
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  BarChart3,
  Download,
  HelpCircle,
  FileText,
  History,
  LogOut,
  Trash2,
  User as UserIcon,
  Settings
} from 'lucide-react';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/new-request', icon: PlusCircle, label: 'New Request' },
    { path: '/requests', icon: History, label: 'Request History' },
    { path: '/track-impact', icon: TrendingUp, label: 'Track Your Impact' },
    { path: '/view-progress', icon: BarChart3, label: 'View Progress' },
    { path: '/certificate', icon: Download, label: 'Download Certificate' },
    { path: '/queries', icon: HelpCircle, label: 'Queries & Support' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/profile/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Trash2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">EcoWaste</span>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-500">Member</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4 px-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        <GeminiChatBot />
      </div>
    </div>
  );
};

export default UserLayout;