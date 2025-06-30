
import React, { useState } from 'react';
import { Home, DollarSign, Receipt, Users, CreditCard, FileText, BarChart3, Settings, LogOut, Menu, X, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useFinancial } from '@/context/FinancialContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'admin' | 'accountant' | 'employee';
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'accountant', 'employee'] },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, roles: ['admin', 'accountant'] },
  { id: 'expenses', label: 'Expenses', icon: Receipt, roles: ['admin', 'accountant'] },
  { id: 'employees', label: 'Employees', icon: Users, roles: ['admin', 'employee'] },
  { id: 'projects', label: 'Projects', icon: FolderOpen, roles: ['admin', 'accountant', 'employee'] },
  { id: 'receivables', label: 'Receivables', icon: CreditCard, roles: ['admin', 'accountant'] },
  { id: 'payables', label: 'Payables', icon: FileText, roles: ['admin', 'accountant'] },
  { id: 'summary', label: 'Summary', icon: BarChart3, roles: ['admin', 'accountant'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, onLogout }) => {
  const { user } = useAuth();
  const { settings } = useFinancial();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen fixed left-0 top-0 shadow-2xl z-40 transition-transform duration-300 flex flex-col",
        "w-64",
        "lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Office Expense
          </h1>
          <p className="text-slate-400 text-sm mt-1">Financial Dashboard</p>
          {user && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{settings.userName}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                  {user.role !== 'admin' && (
                    <p className="text-xs text-slate-500 mt-1">{settings.companyName}</p>
                  )}
                </div>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation - Hide scrollbar */}
        <nav className="mt-6 px-4 flex-1 overflow-y-auto scrollbar-hide" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <style>{`
            nav::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 hover:bg-slate-700/50",
                  activeTab === item.id 
                    ? "bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg" 
                    : "hover:translate-x-1"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0 mt-auto">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
