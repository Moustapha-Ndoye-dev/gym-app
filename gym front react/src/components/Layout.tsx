import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Dumbbell, Users, CreditCard, Ticket, QrCode, Settings, LogOut, LayoutDashboard, Bell, Search, Menu, X, ShoppingBag
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Tableau de bord', path: '/', icon: LayoutDashboard, roles: ['admin', 'cashier', 'controller', 'member'] },
    { name: 'Activités', path: '/activities', icon: Dumbbell, roles: ['admin', 'member'] },
    { name: 'Boutique', path: '/shop', icon: ShoppingBag, roles: ['admin', 'cashier', 'controller', 'member'] },
    { name: 'Abonnements', path: '/subscriptions', icon: CreditCard, roles: ['admin', 'cashier', 'member'] },
    { name: 'Adhérents', path: '/members', icon: Users, roles: ['admin', 'cashier', 'member'] },
    { name: 'Tickets', path: '/tickets', icon: Ticket, roles: ['admin', 'cashier', 'member'] },
    { name: 'Contrôle d\'accès', path: '/access', icon: QrCode, roles: ['admin', 'controller', 'member'] },
    { name: 'Caisse', path: '/cash-register', icon: CreditCard, roles: ['admin', 'cashier', 'member'] },
    { name: 'Utilisateurs', path: '/users', icon: Settings, roles: ['admin'] },
  ];

  const userRole = user ? String(user.role).toLowerCase().trim() : '';
  const filteredNavItems = userRole
    ? (() => {
        const filtered = navItems.filter((item) => item.roles.includes(userRole as any));
        return filtered.length ? filtered : navItems;
      })()
    : navItems;

  const SidebarContent = () => (
    <>
      <div className="h-14 flex items-center justify-between px-5 border-b border-slate-100/50 shrink-0">
        <div className="flex items-center">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200 mr-2.5">
            <Dumbbell className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">LGL <span className="text-indigo-600">GYM</span></span>
        </div>
        <button className="lg:hidden text-slate-400 hover:text-slate-600 p-1.5" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Menu Principal</div>
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2.5 lg:py-2 rounded-lg text-[12px] font-bold transition-all duration-200 group",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200/50" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <Icon className={cn("h-4 w-4 lg:h-3.5 lg:w-3.5 mr-2.5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden font-sans">
      
      {/* Mobile Slide-over Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[240px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-white border-r border-slate-200/60 z-40 shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-14 px-3 lg:px-6 flex items-center justify-between z-10 backdrop-blur-md bg-white/70 border-b border-slate-200/50 sticky top-0 shrink-0">
          <div className="flex items-center flex-1">
            <div className="flex items-center lg:hidden mr-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200">
                <Dumbbell className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="ml-2 text-sm font-black text-slate-900 tracking-tighter uppercase italic">LGL <span className="text-indigo-600">GYM</span></span>
            </div>
            <div className="hidden sm:flex items-center bg-slate-100/50 rounded-full px-3 py-1.5 border border-slate-200/60 w-56 focus-within:bg-white focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none text-[11px] w-full text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200/60 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all relative">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center bg-white rounded-full p-1 pr-1 sm:pr-2.5 shadow-sm border border-slate-200/60 cursor-pointer hover:shadow-md transition-all">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold uppercase shadow-sm shrink-0">
                {user?.username.charAt(0)}
              </div>
              <div className="ml-2 mr-2 hidden sm:block">
                <p className="text-[11px] font-bold text-slate-700 leading-tight">{user?.username}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-tight mt-0.5">
                  {user?.role === 'admin'
                    ? 'Administrateur'
                    : user?.role === 'cashier'
                      ? 'Caissier'
                      : user?.role === 'controller'
                        ? 'Contrôleur'
                        : 'Membre Staff'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 ml-1 sm:ml-0"
                title="Déconnexion"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 pb-20 lg:p-6 lg:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/60 flex justify-around items-center h-14 z-40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link to="/" className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", location.pathname === '/' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}>
            <LayoutDashboard className="h-4 w-4 mb-0.5" />
            <span className="text-[9px] font-bold">Accueil</span>
          </Link>
          <Link to="/members" className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", location.pathname === '/members' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}>
            <Users className="h-4 w-4 mb-0.5" />
            <span className="text-[9px] font-bold">Membres</span>
          </Link>
          <Link to="/access" className={cn("flex flex-col items-center justify-center w-full h-full transition-colors", location.pathname === '/access' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}>
            <QrCode className="h-4 w-4 mb-0.5" />
            <span className="text-[9px] font-bold">Scan</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-slate-600 transition-colors">
            <Menu className="h-4 w-4 mb-0.5" />
            <span className="text-[9px] font-bold">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
