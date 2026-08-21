import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import {
  ShieldCheck,
  Flame,
  Music,
  Bell,
  Plus,
  Edit2,
  Trash2,
  Pin,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  Download,
  Upload,
  Database,
  RefreshCw,
  MessageSquareHeart,
  Wallet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    ceremonies,
    bhajans,
    announcements,
    posts,
    transactions,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    setActiveTab,
    setIsAuthModalOpen,
    showToast,
    exportAllData,
    importAllData,
    resetToDefaults
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

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
            Complete control over Sunderkand path schedules, bhajan lyrics sangrah, and notices.
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
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
          <span className="text-[10px] text-stone-500">Lyrics Library</span>
        </div>

        {/* Posts Stat */}
        <div
          onClick={() => setActiveTab('posts')}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">सुविचार/Posts</span>
            <MessageSquareHeart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-stone-900">{posts.length}</p>
          <span className="text-[10px] text-stone-500">Community Posts</span>
        </div>

        {/* Accounting Stat */}
        <div
          onClick={() => setActiveTab('accounting')}
          className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">लेखा-जोखा</span>
            <Wallet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-emerald-800">{transactions.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">आय-व्यय बहीखाता</span>
        </div>

        {/* Notices Stat */}
        <div
          onClick={openAddAnnModal}
          className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs hover:border-orange-400 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Notices</span>
            <Bell className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xl font-bold text-stone-900">{announcements.length}</p>
          <span className="text-[10px] text-stone-500">Active Notices</span>
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
                Broadcast ceremony timings and Mandal notices
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

      {/* Quick Launchpad */}
      <div className="bg-white p-6 rounded-3xl border border-amber-200/90 shadow-xs space-y-4">
        <h3 className="font-serif-devotional text-lg font-bold text-stone-900">
          Management Launchpad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('sunderkand')}
            className="p-4 rounded-2xl bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200/80 text-left transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-800">Manage Sunderkand</h4>
              <p className="text-xs text-stone-500 mt-0.5">Schedule path, edit venue, update timings</p>
            </div>
            <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
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

      {/* Data Backup, Permanent Storage & Restore Section */}
      <div className="bg-linear-to-br from-amber-500/10 via-orange-500/10 to-amber-600/10 p-6 sm:p-7 rounded-3xl border-2 border-amber-300/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-600 text-white rounded-2xl shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>डेटा सुरक्षा व बैकअप (Data Persistence & Backup)</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  ✓ Auto-Saved
                </span>
              </h3>
              <p className="text-xs text-stone-600">
                साइट पर किया गया हर बदलाव (सुंदरकांड, भजन, नोटिस) तुरंत ब्राउज़र में सुरक्षित (Auto-Save) रहता है। आप कभी भी पूरा डेटा JSON बैकअप में डाउनलोड या रीस्टोर कर सकते हैं।
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Download Backup */}
          <button
            onClick={exportAllData}
            className="p-4 rounded-2xl bg-white hover:bg-orange-50 border border-orange-200 text-left transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="p-2 bg-orange-100 text-orange-700 rounded-xl group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Export JSON</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">डाउनलोड बैकअप (Export)</h4>
              <p className="text-xs text-stone-500 mt-0.5">सभी रिकॉर्ड्स को एक सुरक्षित .json फ़ाइल में सहेजें</p>
            </div>
          </button>

          {/* Import Backup */}
          <div className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Import JSON</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">रीस्टोर बैकअप (Import)</h4>
              <p className="text-xs text-stone-500 mt-0.5">किसी भी डिवाइस से पहले का बैकअप लोड करें</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result as string;
                    if (content) {
                      importAllData(content);
                    }
                  };
                  reader.readAsText(file);
                  // Reset input
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer text-center"
            >
              Select Backup File (.json)
            </button>
          </div>

          {/* Reset to Default */}
          <div className="p-4 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-rose-100 text-rose-700 rounded-xl group-hover:scale-110 transition-transform">
                <RefreshCw className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Reset</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">डिफ़ॉल्ट रीसेट (Reset)</h4>
              <p className="text-xs text-stone-500 mt-0.5">डेटा को मूल डिफ़ॉल्ट स्थिति में रीसेट करें</p>
            </div>
            <button
              onClick={resetToDefaults}
              className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer text-center"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Announcement Create/Edit Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif-devotional text-lg font-bold text-stone-900">
                {editingAnn ? 'Edit Notice' : 'Post New Notice'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAnnSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Title / शीर्षक *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. आगामी शनिवार सुंदरकांड पाठ समय परिवर्तन सूचना"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category *
                </label>
                <select
                  value={annForm.category}
                  onChange={(e) => setAnnForm({ ...annForm, category: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Sunderkand">Sunderkand</option>
                  <option value="Bhajan">Bhajan</option>
                  <option value="Mandal Notice">Mandal Notice</option>
                  <option value="Important">Important</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Announcement Details / संदेश *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter notice details for bhaktas..."
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={annForm.date}
                    onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Issued By
                  </label>
                  <input
                    type="text"
                    value={annForm.author}
                    onChange={(e) => setAnnForm({ ...annForm, author: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annForm.isPinned}
                    onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Pin to Top</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={annForm.isUrgent}
                    onChange={(e) => setAnnForm({ ...annForm, isUrgent: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-red-700 font-semibold">Mark Urgent</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md cursor-pointer"
                >
                  {editingAnn ? 'Save Changes' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

