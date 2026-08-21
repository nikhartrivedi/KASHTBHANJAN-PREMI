import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import {
  ShieldCheck,
  Flame,
  Music,
  Calendar,
  Image as ImageIcon,
  DollarSign,
  Bell,
  Plus,
  Edit2,
  Trash2,
  Pin,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingUp,
  Wallet,
  Settings
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    ceremonies,
    bhajans,
    events,
    photoCollections,
    announcements,
    transactions,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    setActiveTab,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  // Announcement modal
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isUrgent: false,
    isPinned: true,
    category: 'Sunderkand' as Announcement['category'],
    author: 'Mandal Samiti'
  });

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
        <ShieldCheck className="w-16 h-16 text-red-600 mx-auto" />
        <h2 className="font-serif-devotional text-2xl font-bold text-stone-900">
          Admin Dashboard Restricted
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          You are currently in Devotee Guest view. Please login with Mandal Administrator credentials to access this control hub.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-xs shadow-md cursor-pointer transition-all"
        >
          Admin Login
        </button>
      </div>
    );
  }

  // Stats calculation
  const upcomingCeremoniesCount = ceremonies.filter((c) => c.status === 'upcoming').length;
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  const openAddAnnModal = () => {
    setEditingAnn(null);
    setAnnForm({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      isUrgent: false,
      isPinned: true,
      category: 'Sunderkand',
      author: 'President, Kashtabhanjan Premi Mandal'
    });
    setIsAnnModalOpen(true);
  };

  const openEditAnnModal = (ann: Announcement) => {
    setEditingAnn(ann);
    setAnnForm({
      title: ann.title,
      content: ann.content,
      date: ann.date,
      isUrgent: !!ann.isUrgent,
      isPinned: !!ann.isPinned,
      category: ann.category,
      author: ann.author
    });
    setIsAnnModalOpen(true);
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) {
      showToast('Please fill title and announcement message');
      return;
    }

    if (editingAnn) {
      updateAnnouncement({
        ...editingAnn,
        ...annForm
      });
    } else {
      addAnnouncement({
        ...annForm
      });
    }
    setIsAnnModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Mandal Administration Hub</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold">
            Kashtabhanjan Premi Admin
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            Complete control over Sunderkand path schedules, bhajan sangrah, events, photo gallery, notices, and financial ledgers.
          </p>
        </div>

        <button
          onClick={openAddAnnModal}
          className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-amber-50 text-orange-800 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Bell className="w-4 h-4 text-orange-600" />
          <span>+ Post Announcement</span>
        </button>
      </div>

      {/* Quick Statistics Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Sunderkand Stat */}
        <div
          onClick={() => setActiveTab('sunderkand')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Sunderkand</span>
            <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-stone-900">{ceremonies.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">{upcomingCeremoniesCount} Upcoming</span>
        </div>

        {/* Bhajans Stat */}
        <div
          onClick={() => setActiveTab('bhajans')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Bhajans</span>
            <Music className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-stone-900">{bhajans.length}</p>
          <span className="text-[10px] text-stone-500">Lyrics in Sangrah</span>
        </div>

        {/* Events Stat */}
        <div
          onClick={() => setActiveTab('events')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Events</span>
            <Calendar className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-stone-900">{events.length}</p>
          <span className="text-[10px] text-stone-500">Mandal Activities</span>
        </div>

        {/* Photo Albums Stat */}
        <div
          onClick={() => setActiveTab('gallery')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Gallery</span>
            <ImageIcon className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-stone-900">{photoCollections.length}</p>
          <span className="text-[10px] text-stone-500">Albums Published</span>
        </div>

        {/* Total Income */}
        <div
          onClick={() => setActiveTab('accounting')}
          className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-base sm:text-lg font-bold text-stone-900 truncate">₹{(totalIncome / 1000).toFixed(1)}k</p>
          <span className="text-[10px] text-emerald-600 font-medium">Seva / Donations</span>
        </div>

        {/* Net Balance */}
        <div
          onClick={() => setActiveTab('accounting')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Balance</span>
            <Wallet className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-base sm:text-lg font-bold text-orange-800 truncate">₹{(balance / 1000).toFixed(1)}k</p>
          <span className="text-[10px] text-stone-500">Available Funds</span>
        </div>
      </div>

      {/* Announcements / Notices Management */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-lg font-bold text-stone-900">
                Announcements & Notices ({announcements.length})
              </h3>
              <p className="text-xs text-stone-500">
                Broadcast ceremony timings, padyatra alerts, and Mandal notices
              </p>
            </div>
          </div>

          <button
            onClick={openAddAnnModal}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Notice</span>
          </button>
        </div>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                ann.isUrgent
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-amber-50/40 border-amber-200/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {ann.isPinned && (
                    <span className="p-1 bg-amber-200 text-amber-900 rounded text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-2.5 h-2.5" /> PINNED
                    </span>
                  )}
                  {ann.isUrgent && (
                    <span className="p-1 bg-rose-200 text-rose-900 rounded text-[10px] font-bold flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> URGENT
                    </span>
                  )}
                  <span className="text-xs font-bold text-stone-800">{ann.title}</span>
                </div>
                <p className="text-xs text-stone-600">{ann.content}</p>
                <div className="flex items-center space-x-3 text-[11px] text-stone-400 pt-1">
                  <span>{ann.date}</span>
                  <span>•</span>
                  <span>Category: {ann.category}</span>
                  <span>•</span>
                  <span>By: {ann.author}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => openEditAnnModal(ann)}
                  className="p-1.5 text-stone-600 hover:text-orange-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Edit Notice"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete announcement "${ann.title}"?`)) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <p className="text-xs text-center py-6 text-stone-400">No active announcements</p>
          )}
        </div>
      </div>

      {/* Quick Launchpad to all Mandal Sections */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
        <h3 className="font-serif-devotional text-lg font-bold text-stone-900">
          Management Launchpad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('sunderkand')}
            className="p-4 rounded-2xl bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200/80 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-800">Manage Sunderkand</h4>
              <p className="text-xs text-stone-500 mt-0.5">Schedule path, edit venue, upload photos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('accounting')}
            className="p-4 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/80 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800">Mandal Accounting</h4>
              <p className="text-xs text-stone-500 mt-0.5">Record income, expenses, export ledger</p>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('bhajans')}
            className="p-4 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800">Bhajan Lyrics Sangrah</h4>
              <p className="text-xs text-stone-500 mt-0.5">Add new verses, dhoons & aartis</p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENT MODAL */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-devotional text-xl font-bold">
                  {editingAnn ? 'Edit Announcement' : 'Post Mandal Notice'}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Visible prominently on the home page for all devotees
                </p>
              </div>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAnnSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="e.g. Next Sunderkand Timing Update"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Type the notice message..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as Announcement['category'] })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  >
                    <option value="Sunderkand">Sunderkand</option>
                    <option value="Bhajan">Bhajan</option>
                    <option value="Mandal Notice">Mandal Notice</option>
                    <option value="Important">Important</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={annForm.date}
                    onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annForm.isPinned}
                    onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Pin to Top of Home</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annForm.isUrgent}
                    onChange={(e) => setAnnForm({ ...annForm, isUrgent: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-rose-700 font-semibold">Mark as Urgent Alert</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  {editingAnn ? 'Save Changes' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
