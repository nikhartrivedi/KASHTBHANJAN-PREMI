import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';
import {
  Home,
  BookOpen,
  Music,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Search,
  Flame,
  Bell,
  Smartphone,
  Download,
  MessageSquareHeart,
  Wallet
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isAdmin,
    user,
    setIsAuthModalOpen,
    isApkModalOpen,
    setIsApkModalOpen,
    logout,
    nextSunderkand,
    announcements
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'sunderkand', label: 'Sunderkand', icon: <Flame className="w-4 h-4 text-orange-500" /> },
    { id: 'bhajans', label: 'Bhajan Lyrics', icon: <Music className="w-4 h-4" /> },
    { id: 'posts', label: 'सुविचार व फोटो (Posts)', icon: <MessageSquareHeart className="w-4 h-4 text-rose-500" /> },
    { id: 'accounting', label: 'लेखा-जोखा (Accounting)', icon: <Wallet className="w-4 h-4 text-emerald-600" />, adminOnly: true },
    { id: 'admin-hub', label: 'Admin Hub', icon: <ShieldCheck className="w-4 h-4 text-orange-600" />, adminOnly: true }
  ];

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Auspicious Banner */}
      <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-amber-200 text-sm">॥ શ્રી કષ્ટભંજન દેવાય નમઃ ॥</span>
            <span className="hidden sm:inline text-orange-100/90 text-xs">| Sarangpur Hanumanji Devotee Mandal</span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {nextSunderkand && (
              <button
                onClick={() => handleTabClick('sunderkand')}
                className="hidden md:flex items-center space-x-1.5 bg-amber-500/30 hover:bg-amber-500/50 px-2.5 py-0.5 rounded-full text-amber-100 transition-colors cursor-pointer"
                title="Click to view next Sunderkand details"
              >
                <DiyaIcon className="w-3.5 h-3.5" />
                <span className="font-medium truncate max-w-[200px]">
                  Next Path: {nextSunderkand.date} ({nextSunderkand.startTime})
                </span>
              </button>
            )}
            
            <div className="flex items-center space-x-1 font-medium">
              {isAdmin ? (
                <span className="bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin Mode
                </span>
              ) : (
                <span className="bg-orange-800/40 text-orange-100 px-2 py-0.5 rounded-md">
                  Guest View
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo and Brand */}
          <div
            id="brand-logo"
            onClick={() => handleTabClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl font-bold font-devanagari">ॐ</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-devotional text-lg sm:text-xl font-bold text-orange-950 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
                  Kashtabhanjan Premi
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-800 font-medium tracking-wide">
                Sunderkand & Mandal Parivar
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-100 text-orange-800 shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-orange-700 hover:bg-orange-50/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions (Auth & Search) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="install-apk-btn"
              onClick={() => setIsApkModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Install App on Android / Generate APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="hidden sm:inline">Install App / APK</span>
              <span className="sm:hidden">App</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <button
                  id="admin-logout-btn"
                  onClick={logout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Switch to guest / Logout"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span className="hidden sm:inline">Admin Logout</span>
                </button>
              </div>
            ) : (
              <button
                id="admin-login-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-xs shadow-orange-600/20 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-200 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-orange-100 text-orange-900 font-semibold'
                    : 'text-slate-700 hover:bg-orange-50'
                }`}
              >
                <span className="p-1 rounded-md bg-amber-50 text-orange-600">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-amber-100 space-y-1.5">
            <button
              onClick={() => {
                setIsApkModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl font-bold shadow-xs cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install App on Android / Download APK</span>
            </button>

            {isAdmin ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Admin Mode</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm bg-orange-600 text-white rounded-lg font-medium shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Mandal Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
