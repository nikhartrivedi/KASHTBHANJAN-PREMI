import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SunderkandCeremony } from '../../types';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';
import {
  Calendar,
  Clock,
  MapPin,
  Flame,
  Plus,
  Edit2,
  Trash2,
  Share2,
  Navigation,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Search,
  Users,
  ChevronDown,
  Info,
  CalendarPlus
} from 'lucide-react';

interface SunderkandSectionProps {
  selectedCeremonyId?: string;
}

export const SunderkandSection: React.FC<SunderkandSectionProps> = ({ selectedCeremonyId }) => {
  const { ceremonies, addCeremony, updateCeremony, deleteCeremony, isAdmin, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCeremony, setEditingCeremony] = useState<SunderkandCeremony | null>(null);
  const [detailModalCeremony, setDetailModalCeremony] = useState<SunderkandCeremony | null>(() => {
    if (selectedCeremonyId) {
      return ceremonies.find((c) => c.id === selectedCeremonyId) || null;
    }
    return null;
  });

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '08:30 PM',
    endTime: '11:30 PM',
    venue: '',
    address: '',
    googleMapsUrl: '',
    description: '',
    hostName: '',
    hostContact: '',
    notes: '',
    status: 'upcoming' as 'upcoming' | 'completed',
    photoUrlInput: '',
    photos: [] as string[]
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const openAddModal = () => {
    setEditingCeremony(null);
    setFormData({
      title: '',
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      startTime: '08:30 PM',
      endTime: '11:30 PM',
      venue: '',
      address: '',
      googleMapsUrl: '',
      description: 'Devotional Sunderkand recitation with traditional instruments and 108 Deepotsav Aarti.',
      hostName: '',
      hostContact: '',
      notes: 'Mahaprasad will be served following the Maha Aarti.',
      status: 'upcoming',
      photoUrlInput: '',
      photos: [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=800&q=80'
      ]
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (ceremony: SunderkandCeremony) => {
    setEditingCeremony(ceremony);
    setFormData({
      title: ceremony.title,
      date: ceremony.date,
      startTime: ceremony.startTime,
      endTime: ceremony.endTime || '',
      venue: ceremony.venue,
      address: ceremony.address,
      googleMapsUrl: ceremony.googleMapsUrl || '',
      description: ceremony.description,
      hostName: ceremony.hostName || '',
      hostContact: ceremony.hostContact || '',
      notes: ceremony.notes || '',
      status: ceremony.status === 'upcoming' ? 'upcoming' : 'completed',
      photoUrlInput: '',
      photos: [...ceremony.photos]
    });
    setIsAddEditModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue || !formData.address) {
      showToast('Please fill required fields: Title, Date, Venue & Address');
      return;
    }

    if (editingCeremony) {
      updateCeremony({
        ...editingCeremony,
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime || undefined,
        venue: formData.venue,
        address: formData.address,
        googleMapsUrl: formData.googleMapsUrl || undefined,
        description: formData.description,
        hostName: formData.hostName || undefined,
        hostContact: formData.hostContact || undefined,
        notes: formData.notes || undefined,
        status: formData.status,
        photos: formData.photos.length > 0 ? formData.photos : ['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80']
      });
    } else {
      addCeremony({
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime || undefined,
        venue: formData.venue,
        address: formData.address,
        googleMapsUrl: formData.googleMapsUrl || undefined,
        description: formData.description,
        hostName: formData.hostName || undefined,
        hostContact: formData.hostContact || undefined,
        notes: formData.notes || undefined,
        status: formData.status,
        photos: formData.photos.length > 0 ? formData.photos : ['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80']
      });
    }
    setIsAddEditModalOpen(false);
  };

  const handleAddPhoto = () => {
    if (formData.photoUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, prev.photoUrlInput.trim()],
        photoUrlInput: ''
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleShare = (c: SunderkandCeremony) => {
    const text = `🌸 *Jai Shree Kashtabhanjan Dev!* 🌸\n\n*Sunderkand Ceremony Invitation:*\n📜 ${c.title}\n📅 Date: ${formatDate(c.date)}\n⏰ Time: ${c.startTime} onwards\n📍 Venue: ${c.venue}\n🏠 Address: ${c.address}\n\n${c.notes ? '✨ ' + c.notes : ''}\n\nOrganized by: Kashtabhanjan Premi Mandal`;
    
    if (navigator.share) {
      navigator.share({ title: c.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('Sunderkand details copied to clipboard!');
    }
  };

  // Filter ceremonies
  const filteredCeremonies = ceremonies.filter((c) => {
    const matchesTab = activeSubTab === 'upcoming' ? c.status === 'upcoming' : c.status !== 'upcoming';
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.hostName && c.hostName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const upcomingCount = ceremonies.filter((c) => c.status === 'upcoming').length;
  const pastCount = ceremonies.filter((c) => c.status !== 'upcoming').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>Devotional Recitation Schedules</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900">
            Sunderkand Ceremonies
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Find upcoming ceremony dates, venues, directions, and view previous ceremony archives.
          </p>
        </div>

        {isAdmin && (
          <button
            id="admin-add-ceremony-btn"
            onClick={openAddModal}
            className="self-start sm:self-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Sunderkand</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Sub-tab pills */}
        <div className="flex bg-stone-200/70 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('upcoming')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'upcoming'
                ? 'bg-white text-orange-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Upcoming Ceremonies</span>
            <span className="text-xs px-1.5 py-0.2 bg-orange-100 text-orange-800 rounded-full font-bold">
              {upcomingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('past')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'past'
                ? 'bg-white text-orange-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>Previous Ceremonies</span>
            <span className="text-xs px-1.5 py-0.2 bg-stone-100 text-stone-700 rounded-full font-bold">
              {pastCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venue, date, host..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Ceremony Cards List */}
      {filteredCeremonies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCeremonies.map((ceremony) => (
            <div
              key={ceremony.id}
              className="bg-white rounded-3xl border border-amber-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Header & Photo */}
              <div>
                <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                  <img
                    src={ceremony.photos[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                    alt={ceremony.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      ceremony.status === 'upcoming'
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-800/80 text-stone-100 backdrop-blur-xs'
                    }`}>
                      {ceremony.status === 'upcoming' ? 'Upcoming Ceremony' : 'Completed Path'}
                    </span>
                  </div>

                  {ceremony.photos.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{ceremony.photos.length} Photos</span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-serif-devotional text-lg sm:text-xl font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                      {ceremony.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">
                      {ceremony.description}
                    </p>
                  </div>

                  {/* Key Metadata Badges */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start space-x-2 text-stone-700">
                      <Calendar className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">{formatDate(ceremony.date)}</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-orange-700 font-bold">{ceremony.startTime}</span>
                    </div>

                    <div className="flex items-start space-x-2 text-stone-700">
                      <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-900">{ceremony.venue}</span>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{ceremony.address}</p>
                      </div>
                    </div>

                    {ceremony.hostName && (
                      <div className="flex items-center space-x-2 text-stone-600 bg-amber-50/70 px-2.5 py-1.5 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="text-[11px]">
                          Host: <strong className="text-stone-800">{ceremony.hostName}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 sm:p-6 pt-0 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setDetailModalCeremony(ceremony)}
                    className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    View Details & Photos
                  </button>

                  <button
                    onClick={() => handleShare(ceremony)}
                    className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Share ceremony invitation on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <a
                    href={ceremony.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(ceremony.venue + ' ' + ceremony.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Get Google Maps directions"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>

                {/* Admin Management Controls */}
                {isAdmin && (
                  <div className="flex items-center space-x-1.5 bg-stone-50 p-1 rounded-lg border border-stone-200">
                    <button
                      onClick={() => openEditModal(ceremony)}
                      className="p-1.5 text-stone-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
                      title="Edit Ceremony details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${ceremony.title}"?`)) {
                          deleteCeremony(ceremony.id);
                        }
                      }}
                      className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Delete Ceremony"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 space-y-3">
          <DiyaIcon className="w-12 h-12 mx-auto text-amber-500/50" />
          <h3 className="text-base font-bold text-stone-800">No ceremonies found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchTerm
              ? `No ceremonies matched "${searchTerm}". Try a different search query.`
              : activeSubTab === 'upcoming'
              ? 'There are currently no upcoming Sunderkand ceremonies scheduled.'
              : 'No past ceremonies records in archive.'}
          </p>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="mt-2 px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-xl"
            >
              + Create Sunderkand Ceremony
            </button>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModalCeremony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className="relative">
              <img
                src={detailModalCeremony.photos[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'}
                alt={detailModalCeremony.title}
                className="w-full h-56 object-cover"
              />
              <button
                onClick={() => setDetailModalCeremony(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {detailModalCeremony.status === 'upcoming' ? 'Upcoming Sunderkand' : 'Completed Ceremony'}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif-devotional text-2xl font-bold text-stone-900">
                  {detailModalCeremony.title}
                </h2>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  {detailModalCeremony.description}
                </p>
              </div>

              {/* Ceremony Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-xs">
                <div>
                  <span className="font-semibold text-orange-900 uppercase tracking-wider block mb-1">
                    📅 Date & Time
                  </span>
                  <p className="font-bold text-stone-900 text-sm">{formatDate(detailModalCeremony.date)}</p>
                  <p className="text-stone-600 mt-0.5">
                    {detailModalCeremony.startTime} {detailModalCeremony.endTime ? `- ${detailModalCeremony.endTime}` : ''}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-orange-900 uppercase tracking-wider block mb-1">
                    📍 Venue & Landmark
                  </span>
                  <p className="font-bold text-stone-900 text-sm">{detailModalCeremony.venue}</p>
                  <p className="text-stone-600 mt-0.5">{detailModalCeremony.address}</p>
                </div>
              </div>

              {/* Host & Prasad notes */}
              {(detailModalCeremony.hostName || detailModalCeremony.notes) && (
                <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-700">
                  {detailModalCeremony.hostName && (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">Host Family / Sanyojak:</span>
                      <span>{detailModalCeremony.hostName}</span>
                      {detailModalCeremony.hostContact && (
                        <span className="text-stone-500">({detailModalCeremony.hostContact})</span>
                      )}
                    </div>
                  )}
                  {detailModalCeremony.notes && (
                    <div className="text-amber-800 font-medium pt-1 border-t border-stone-200">
                      ✨ {detailModalCeremony.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Photo Gallery of Ceremony */}
              {detailModalCeremony.photos.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span>Ceremony Photos ({detailModalCeremony.photos.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailModalCeremony.photos.map((pUrl, idx) => (
                      <div key={idx} className="aspect-4/3 rounded-xl overflow-hidden shadow-xs border border-stone-200">
                        <img src={pUrl} alt="Ceremony" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={detailModalCeremony.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(detailModalCeremony.venue + ' ' + detailModalCeremony.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Google Maps</span>
                </a>

                <button
                  onClick={() => handleShare(detailModalCeremony)}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp Invitation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ADD / EDIT CEREMONY MODAL */}
      {isAddEditModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-devotional text-xl font-bold">
                  {editingCeremony ? 'Edit Sunderkand Ceremony' : 'Schedule New Sunderkand'}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Enter date, venue, host details, and photos for the ceremony
                </p>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ceremony Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 53rd Maha Sunderkand Path & Aarti"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ceremony Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:30 PM"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="11:30 PM"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Venue / Hall Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Rameshwar Community Hall"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'upcoming' | 'completed' })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Address & Landmarks *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Landmark, Area, City, Pincode"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Host / Sponsor Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.hostName}
                    onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                    placeholder="e.g. Shree Rajeshbhai Patel Parivar"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Host Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.hostContact}
                    onChange={(e) => setFormData({ ...formData, hostContact: e.target.value })}
                    placeholder="+91 98250 12345"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ceremony Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details about dholak players, aarti, etc."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mahaprasad & Devotee Notes
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Mahaprasad will be served after Aarti"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              {/* Photos Management */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ceremony Photos (URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.photoUrlInput}
                    onChange={(e) => setFormData({ ...formData, photoUrlInput: e.target.value })}
                    placeholder="Paste image URL (e.g. Unsplash or photo link)"
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-orange-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900"
                  >
                    + Add Photo
                  </button>
                </div>

                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.photos.map((url, i) => (
                      <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-stone-300">
                        <img src={url} alt="Photo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  {editingCeremony ? 'Save Changes' : 'Publish Sunderkand Ceremony'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
