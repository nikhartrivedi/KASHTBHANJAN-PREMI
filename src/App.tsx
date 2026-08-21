import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { InstallApkModal } from './components/apk/InstallApkModal';
import { HomeDashboard } from './components/home/HomeDashboard';
import { SunderkandSection } from './components/sunderkand/SunderkandSection';
import { BhajanLyricsSection } from './components/bhajans/BhajanLyricsSection';
import { BhajanLyricsPage } from './components/bhajans/BhajanLyricsPage';
import { CommunityPostsPage } from './components/posts/CommunityPostsPage';
import { AccountingPage } from './components/accounting/AccountingPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SunderkandCeremony, Bhajan, ActiveTab } from './types';
import {
  Home,
  Flame,
  Music,
  ShieldCheck,
  CheckCircle2,
  MessageSquareHeart,
  Wallet
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin, toastMessage, isApkModalOpen, setIsApkModalOpen } = useApp();

  const [selectedCeremony, setSelectedCeremony] = useState<SunderkandCeremony | undefined>(undefined);
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | undefined>(undefined);
  const [isStandaloneLyricsPage, setIsStandaloneLyricsPage] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'bhajan-lyrics') {
      setIsStandaloneLyricsPage(true);
    }
  }, []);

  if (isStandaloneLyricsPage) {
    return <BhajanLyricsPage />;
  }

  const handleSelectCeremonyFromHome = (c: SunderkandCeremony) => {
    setSelectedCeremony(c);
    setActiveTab('sunderkand');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBhajanFromHome = (b: Bhajan) => {
    setSelectedBhajan(b);
    setActiveTab('bhajans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-stone-800">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 lg:pb-12">
        {activeTab === 'home' && (
          <HomeDashboard
            onSelectCeremony={handleSelectCeremonyFromHome}
          />
        )}

        {activeTab === 'sunderkand' && (
          <SunderkandSection selectedCeremonyId={selectedCeremony?.id} />
        )}

        {activeTab === 'bhajans' && (
          <BhajanLyricsSection initialSelectedBhajan={selectedBhajan} />
        )}

        {activeTab === 'posts' && <CommunityPostsPage />}

        {activeTab === 'accounting' && <AccountingPage />}

        {activeTab === 'admin-hub' && <AdminDashboard />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/90 shadow-lg px-2 py-1.5 flex justify-around items-center">
        <button
          onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-orange-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => { setActiveTab('sunderkand'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'sunderkand' ? 'text-orange-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span>Sunderkand</span>
        </button>

        <button
          onClick={() => { setActiveTab('bhajans'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'bhajans' ? 'text-orange-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Music className="w-5 h-5 mb-0.5" />
          <span>Bhajans</span>
        </button>

        <button
          onClick={() => { setActiveTab('posts'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center justify-center p-1 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'posts' ? 'text-orange-700 font-bold' : 'text-stone-500'
          }`}
        >
          <MessageSquareHeart className="w-5 h-5 mb-0.5" />
          <span>सुविचार</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => { setActiveTab('accounting'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center p-1 text-[10px] font-medium transition-colors cursor-pointer ${
              activeTab === 'accounting' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Wallet className="w-5 h-5 mb-0.5" />
            <span>खाता</span>
          </button>
        )}
      </nav>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 lg:bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal />

      {/* APK & App Installation Modal */}
      <InstallApkModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
