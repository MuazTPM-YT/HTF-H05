import React from 'react'
import { 
  LayoutGrid, 
  FileText, 
  Share, 
  ShieldAlert, 
  Shield, 
  UserRound, 
  Calendar, 
  BarChart3, 
  Settings,
  Bell,
  Sun,
  HelpCircle
} from 'lucide-react'

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-[210px] border-r bg-white flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b">
          <div className="rounded-md p-1">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg">HealthChain</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <nav className="space-y-6 px-2">
            <div className="space-y-1">
              <NavItem icon={LayoutGrid} label="Dashboard" active />
              <NavItem icon={FileText} label="Health Records" />
              <NavItem icon={Share} label="Sharing" />
              <NavItem icon={ShieldAlert} label="Emergency" />
              <NavItem icon={Shield} label="Security" />
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium px-3 mb-1">Health Management</h3>
              <div className="space-y-1">
                <NavItem icon={UserRound} label="Providers" />
                <NavItem icon={Calendar} label="Appointments" />
                <NavItem icon={BarChart3} label="Analytics" />
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium px-3 mb-1">Account</h3>
              <div className="space-y-1">
                <NavItem icon={Settings} label="Settings" />
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <div></div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Sun className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

const NavItem = ({ icon: Icon, label, active, href = "#" }) => {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active 
          ? "bg-primary/10 text-primary" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-gray-500"}`} />
      {label}
    </a>
  )
}

export default DashboardLayout
