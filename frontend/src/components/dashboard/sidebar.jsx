"use client"

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Share2,
  Shield,
  AlertCircle,
  User,
  Settings,
  LogOut,
  Calendar,
  UserPlus,
  PieChart,
  Home,
  ActivitySquare
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;

  // Check if current path is dashboard or root
  const isDashboard = path === '/' || path === '/dashboard';

  return (
    <div
      className={`bg-white border-r ${collapsed ? 'w-16' : 'w-64'
        } h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-10`}
    >
      <div className="p-4 flex items-center gap-3">
        {!collapsed && (
          <div className="font-bold text-xl text-gray-800">HealthChain</div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-full p-1 hover:bg-gray-100 text-gray-500 h-8 w-8 flex items-center justify-center"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <div className="mt-4 px-2 overflow-y-auto h-[calc(100vh-5rem)]">
        <div className={`text-xs uppercase font-semibold text-gray-500 ${collapsed ? 'text-center' : 'px-2'} mb-2`}>
          {!collapsed && 'Overview'}
        </div>
        <NavItem
          icon={<Home size={20} />}
          label="Dashboard"
          to="/dashboard"
          collapsed={collapsed}
          active={isDashboard}
          color="blue"
        />

        <div className={`text-xs uppercase font-semibold text-gray-500 ${collapsed ? 'text-center mt-4' : 'px-2 mt-6'} mb-2`}>
          {!collapsed && 'Health Records'}
        </div>
        <NavItem
          icon={<FileText size={20} />}
          label="Health Records"
          to="/health-records"
          collapsed={collapsed}
          active={path === '/health-records'}
          color="indigo"
        />
        <NavItem
          icon={<Share2 size={20} />}
          label="Sharing Controls"
          to="/sharing"
          collapsed={collapsed}
          active={path === '/sharing'}
          color="purple"
        />
        <NavItem
          icon={<Shield size={20} />}
          label="Security Settings"
          to="/security"
          collapsed={collapsed}
          active={path === '/security'}
          color="green"
        />
        <NavItem
          icon={<AlertCircle size={20} />}
          label="Emergency Access"
          to="/emergency"
          collapsed={collapsed}
          active={path === '/emergency'}
          color="amber"
        />

        <div className={`text-xs uppercase font-semibold text-gray-500 ${collapsed ? 'text-center mt-4' : 'px-2 mt-6'} mb-2`}>
          {!collapsed && 'Health Management'}
        </div>
        <NavItem
          icon={<UserPlus size={20} />}
          label="Providers"
          to="/providers"
          collapsed={collapsed}
          active={path === '/providers'}
          color="teal"
        />
        <NavItem
          icon={<Calendar size={20} />}
          label="Appointments"
          to="/appointments"
          collapsed={collapsed}
          active={path === '/appointments'}
          color="rose"
        />
        <NavItem
          icon={<PieChart size={20} />}
          label="Analytics"
          to="/analytics"
          collapsed={collapsed}
          active={path === '/analytics'}
          color="cyan"
        />

        <div className={`text-xs uppercase font-semibold text-gray-500 ${collapsed ? 'text-center mt-4' : 'px-2 mt-6'} mb-2`}>
          {!collapsed && 'Account'}
        </div>
        <NavItem
          icon={<User size={20} />}
          label="Profile"
          to="/profile"
          collapsed={collapsed}
          active={path === '/profile'}
          color="blue"
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/settings"
          collapsed={collapsed}
          active={path === '/settings'}
          color="gray"
        />
        <NavItem
          icon={<ActivitySquare size={20} />}
          label="Access Logs"
          to="/access-logs"
          collapsed={collapsed}
          active={path === '/access-logs'}
          color="violet"
        />
        <NavItem
          icon={<LogOut size={20} />}
          label="Logout"
          to="/logout"
          collapsed={collapsed}
          active={path === '/logout'}
          color="red"
        />
      </div>
    </div>
  );
};

const getColorStyles = (color, active) => {
  const colors = {
    blue: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    indigo: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    purple: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    violet: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    green: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    amber: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    teal: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    rose: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    cyan: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    gray: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    },
    red: {
      active: "bg-gray-100 text-gray-800",
      inactive: "text-gray-600 hover:bg-black/5 hover:text-gray-800"
    }
  };

  return active ? colors[color].active : colors[color].inactive;
};

const NavItem = ({ icon, label, to, collapsed, active = false, color = "blue" }) => {
  const colorClasses = getColorStyles(color, active);

  return (
    <Link
      to={to}
      className={`flex items-center py-2 px-3 mb-1 rounded-md transition-colors ${colorClasses
        } ${collapsed ? 'justify-center' : 'px-3'
        }`}
    >
      <div>{icon}</div>
      {!collapsed && <div className="ml-3 text-sm font-medium">{label}</div>}
    </Link>
  );
};

export default Sidebar;
