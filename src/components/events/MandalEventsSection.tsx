import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MandalEvent } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Users,
  X,
  Share2,
  Search,
  Sparkles,
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';

export const MandalEventsSection: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, isAdmin, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MandalEvent | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '06:00 AM - 10:00 PM',
    venue: '',
    address: '',
    description: '',
    category: 'Festival' as MandalEvent['category'],
    bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming' as 'upcoming' | 'completed',
    attendeesCount: 500
  });

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      time: '06:00 AM - 10:00 PM',
      venue: 'Kashtabhanjan Seva Dham Complex',
      address: 'S.G. Highway, Ahmedabad',
      description: 'Devotional festival and community gathering with prasad distribution.',
      category: 'Festival',
      bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      attendeesCount: 500
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (event: MandalEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      address: event.address,
      description: event.description,
      category: event.category,
      bannerUrl: event.bannerUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      status: event.status,
      attendeesCount: event.attendeesCount || 0
    });
    setIsAddEditModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.venue) {
      showToast('Please fill all required event fields');
      return;
    }

    if (editingEvent) {
      updateEvent({
        ...editingEvent,
        ...formData
      });
    } else {
      addEvent({
        ...formData
      });
    }
    setIsAddEditModalOpen(false);
  };

  const filteredEvents = events.filter((e) => {
    const matchesStatus = activeFilter === 'all' || e.status === activeFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Mandal Activities & Celebrations</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900">
            Mandal Events & Padyatra
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Hanuman Jayanti Mahotsav, Sarangpur Padyatra, Annakshetra Bhandara, and Sangeet Sandhya.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="self-start sm:self-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mandal Event</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-stone-200/70 p-1 rounded-xl w-full sm:w-auto">
          {(['all', 'upcoming', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-orange-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {filter === 'all' ? 'All Activities' : filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search event name, venue..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-amber-200/90 shadow-xs overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {event.bannerUrl && (
                <div className="aspect-16/9 overflow-hidden bg-stone-100 relative">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
                      event.status === 'upcoming'
                        ? 'bg-orange-600 text-white'
                        : 'bg-stone-800/80 text-stone-100'
                    }`}>
                      {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                    </span>
                    <span className="bg-white/90 backdrop-blur-xs text-stone-800 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs">
                      {event.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif-devotional text-xl font-bold text-stone-900 group-hover:text-orange-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-xs bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60">
                  <div className="flex items-center space-x-2 text-stone-800">
                    <CalendarCheck className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-bold">{formatDate(event.date)}</span>
                    <span className="text-stone-400">•</span>
                    <span className="text-orange-700 font-semibold">{event.time}</span>
                  </div>

                  <div className="flex items-start space-x-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">{event.venue}</span>
                      <p className="text-[11px] text-stone-500">{event.address}</p>
                    </div>
                  </div>

                  {event.attendeesCount && (
                    <div className="flex items-center space-x-2 text-stone-600 pt-1 border-t border-amber-200/60">
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      <span>Expected / Attended: <strong className="text-stone-900">{event.attendeesCount}+ Bhaktas</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-6 pt-0 flex items-center justify-between border-t border-stone-100">
              <span className="text-xs text-stone-400">
                Kashtabhanjan Premi Mandal
              </span>

              {isAdmin && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(event)}
                    className="p-1.5 text-stone-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete event "${event.title}"?`)) {
                        deleteEvent(event.id);
                      }
                    }}
                    className="p-1.5 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADMIN ADD / EDIT EVENT MODAL */}
      {isAddEditModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-devotional text-xl font-bold">
                  {editingEvent ? 'Edit Mandal Event' : 'Create New Mandal Event'}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Publish festival, padyatra or seva announcement
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
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Hanuman Jayanti Maha Mahotsav 2026"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Event Date *
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
                    Time / Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="06:00 AM - 10:00 PM"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MandalEvent['category'] })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  >
                    <option value="Festival">Festival</option>
                    <option value="Padyatra">Padyatra</option>
                    <option value="Seva & Bhandara">Seva & Bhandara</option>
                    <option value="Sangeet Samaroh">Sangeet Samaroh</option>
                    <option value="Mandal Meeting">Mandal Meeting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Kashtabhanjan Seva Complex"
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
                  Full Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Address details"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceremony schedule, special artists, annakshetra details"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Banner Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.bannerUrl}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Expected Devotees Count
                  </label>
                  <input
                    type="number"
                    value={formData.attendeesCount}
                    onChange={(e) => setFormData({ ...formData, attendeesCount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

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
                  {editingEvent ? 'Save Changes' : 'Publish Mandal Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
