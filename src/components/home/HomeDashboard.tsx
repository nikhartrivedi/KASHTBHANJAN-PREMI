import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SunderkandCeremony, Bhajan, MandalEvent } from '../../types';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';
import {
  Calendar,
  Clock,
  MapPin,
  Flame,
  Music,
  Image as ImageIcon,
  Share2,
  Navigation,
  ChevronRight,
  Sparkles,
  Users,
  Bell,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Phone,
  ShieldCheck,
  CalendarCheck,
  Smartphone,
  Download
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectCeremony?: (ceremony: SunderkandCeremony) => void;
  onSelectBhajan?: (bhajan: Bhajan) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onSelectCeremony, onSelectBhajan }) => {
  const {
    nextSunderkand,
    ceremonies,
    bhajans,
    events,
    photoCollections,
    announcements,
    setActiveTab,
    isAdmin,
    showToast,
    setIsApkModalOpen
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  // Formatting date nicely
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleShareSunderkand = (c: SunderkandCeremony) => {
    const text = `🌸 *Jai Shree Kashtabhanjan Dev!* 🌸\n\n*Upcoming Sunderkand Path:*\n📜 ${c.title}\n📅 Date: ${formatDate(c.date)}\n⏰ Time: ${c.startTime} onwards\n📍 Venue: ${c.venue}\n🏠 Address: ${c.address}\n\n${c.notes ? '✨ ' + c.notes : ''}\n\nCordially invited: Kashtabhanjan Premi Mandal`;
    
    if (navigator.share) {
      navigator.share({
        title: c.title,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      showToast('Sunderkand invitation details copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const recentBhajans = bhajans.slice(0, 4);
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 2);
  const recentPhotos = photoCollections.slice(0, 3);
  const pinnedAnnouncements = announcements.filter((a) => a.isPinned || a.isUrgent);

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* 1. Devotional Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-orange-600 via-amber-600 to-orange-700 text-white shadow-xl shadow-orange-950/10 border border-orange-400/40 p-6 sm:p-10">
        {/* Background Subtle Devotional Motifs */}
        <div className="absolute -right-8 -bottom-8 opacity-10 text-white select-none pointer-events-none">
          <span className="text-[180px] font-devanagari leading-none">ॐ</span>
        </div>
        <div className="absolute top-4 right-6 hidden sm:flex items-center space-x-2 text-amber-200/80 text-xs">
          <DiyaIcon className="w-4 h-4" />
          <span>Sarangpur Dham Premi Mandal</span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/30 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-amber-100 mb-4 border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Devotional Community Portal</span>
          </div>

          <h1 className="font-serif-devotional text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-xs">
            Kashtabhanjan Premi
          </h1>
          
          <p className="mt-2 text-sm sm:text-base text-orange-100 leading-relaxed font-medium">
            Mandal portal for weekly Sunderkand path recitals, sacred Bhajan lyrics, Sarangpur padyatra, and community seva.
          </p>

          {/* Quick Action Pills */}
          <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveTab('sunderkand')}
              className="inline-flex items-center space-x-2 bg-white text-orange-800 hover:bg-amber-50 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Sunderkand Schedules</span>
            </button>

            <button
              onClick={() => setActiveTab('bhajans')}
              className="inline-flex items-center space-x-2 bg-orange-800/60 hover:bg-orange-800/80 text-white px-4 py-2 rounded-xl font-medium text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Bhajan Lyrics ({bhajans.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className="inline-flex items-center space-x-2 bg-orange-800/60 hover:bg-orange-800/80 text-white px-4 py-2 rounded-xl font-medium text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-amber-300" />
              <span>Photo Darshan</span>
            </button>

            <button
              onClick={() => setIsApkModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-orange-700" />
              <span>Install Android App / APK</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Announcements & Alerts Ticker (if any) */}
      {announcements.length > 0 && (
        <div className="bg-amber-100/70 border-l-4 border-orange-500 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center space-x-2 text-orange-900 font-bold text-sm mb-2">
            <Bell className="w-4 h-4 text-orange-600 animate-bounce" />
            <span>Latest Mandal Notices & Announcements</span>
          </div>
          <div className="space-y-2">
            {pinnedAnnouncements.map((ann) => (
              <div key={ann.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs sm:text-sm text-stone-800">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 text-orange-600 font-bold">•</span>
                  <div>
                    <span className="font-semibold text-stone-900 mr-2">{ann.title}:</span>
                    <span className="text-stone-700">{ann.content}</span>
                  </div>
                </div>
                <span className="text-[11px] text-stone-500 shrink-0 font-medium">{ann.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HIGHLIGHTED "NEXT SUNDERKAND CEREMONY" — High Visibility Primary Objective */}
      <section id="next-sunderkand-hero" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <DiyaIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-devotional text-xl sm:text-2xl font-bold text-stone-900">
                Next Sunderkand Ceremony
              </h2>
              <p className="text-xs text-stone-500">
                Weekly devotional recitation by Kashtabhanjan Premi Mandal
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('sunderkand')}
            className="text-xs sm:text-sm font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({ceremonies.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {nextSunderkand ? (
          <div className="bg-white rounded-3xl border-2 border-orange-400 shadow-xl saffron-glow overflow-hidden">
            {/* Header banner */}
            <div className="bg-linear-to-r from-orange-600 via-amber-500 to-orange-600 px-6 py-3.5 text-white flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-orange-700 uppercase tracking-wide">
                  Upcoming Next
                </span>
                <span className="text-xs text-orange-100 font-medium">
                  {formatDate(nextSunderkand.date)}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold">
                <Clock className="w-4 h-4" />
                <span>Starts at {nextSunderkand.startTime}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h3 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900 text-balance">
                    {nextSunderkand.title}
                  </h3>
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    {nextSunderkand.description}
                  </p>
                </div>

                {/* Venue & Time Callout Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
                    <div className="flex items-center space-x-2 text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span>Venue & Location</span>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{nextSunderkand.venue}</p>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{nextSunderkand.address}</p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
                    <div className="flex items-center space-x-2 text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <CalendarCheck className="w-4 h-4 text-orange-600" />
                      <span>Date & Timing</span>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{formatDate(nextSunderkand.date)}</p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {nextSunderkand.startTime} {nextSunderkand.endTime ? `to ${nextSunderkand.endTime}` : ''}
                    </p>
                  </div>
                </div>

                {/* Host & Prasad Notes */}
                {(nextSunderkand.hostName || nextSunderkand.notes) && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-stone-700">
                    {nextSunderkand.hostName && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">Host / Sanyojak:</span>
                        <span>{nextSunderkand.hostName}</span>
                        {nextSunderkand.hostContact && (
                          <span className="text-stone-500">({nextSunderkand.hostContact})</span>
                        )}
                      </div>
                    )}
                    {nextSunderkand.notes && (
                      <div className="text-amber-800 font-medium">
                        ✨ {nextSunderkand.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onSelectCeremony) onSelectCeremony(nextSunderkand);
                      else setActiveTab('sunderkand');
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl font-semibold text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Full Ceremony Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={nextSunderkand.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(nextSunderkand.venue + ' ' + nextSunderkand.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span>Get Directions</span>
                  </a>

                  <button
                    onClick={() => handleShareSunderkand(nextSunderkand)}
                    className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title="Share ceremony details on WhatsApp / Copy link"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-amber-200 relative group">
                  <img
                    src={nextSunderkand.photos[0] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'}
                    alt={nextSunderkand.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <div className="text-xs text-amber-200 font-semibold font-devanagari">
                        ॥ સાલંગપુર હનુમાનજી કી જય ॥
                      </div>
                      <div className="text-xs text-stone-200">
                        {nextSunderkand.venue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
            <DiyaIcon className="w-10 h-10 mx-auto text-amber-500 mb-2 opacity-50" />
            <p className="font-semibold text-stone-700">No upcoming Sunderkand scheduled yet.</p>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('sunderkand')}
                className="mt-3 px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg"
              >
                + Add New Sunderkand Ceremony
              </button>
            )}
          </div>
        )}
      </section>

      {/* 4. Two Column Section: Recent Bhajan Lyrics & Mandal Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Popular / Recent Bhajan Lyrics */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-devotional text-lg sm:text-xl font-bold text-stone-900">
                  Bhajan Lyrics Library
                </h3>
                <p className="text-xs text-stone-500">
                  Sing along with large readable verses
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('bhajans')}
              className="text-xs font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
            >
              <span>All ({bhajans.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentBhajans.map((bhajan) => (
              <div
                key={bhajan.id}
                onClick={() => {
                  if (onSelectBhajan) onSelectBhajan(bhajan);
                  else setActiveTab('bhajans');
                }}
                className="py-3 px-2 rounded-xl hover:bg-amber-50/60 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-orange-600 font-devanagari">
                      {bhajan.gujaratiTitle ? '॥' : '•'}
                    </span>
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-orange-700 transition-colors">
                      {bhajan.title}
                    </h4>
                  </div>
                  {bhajan.gujaratiTitle && (
                    <p className="text-xs text-amber-900 font-devanagari pl-4">
                      {bhajan.gujaratiTitle}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 pl-4 text-[11px] text-stone-400">
                    <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      {bhajan.category}
                    </span>
                    {bhajan.ragaOrScale && (
                      <span>• {bhajan.ragaOrScale}</span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 transition-colors" />
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('bhajans')}
            className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Complete Bhajan Sangrah</span>
          </button>
        </div>

        {/* Right: Latest Mandal Activities & Events */}
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-devotional text-lg sm:text-xl font-bold text-stone-900">
                  Mandal Events & Padyatra
                </h3>
                <p className="text-xs text-stone-500">
                  Community activities & celebrations
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={() => setActiveTab('events')}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-orange-300 bg-stone-50/50 hover:bg-orange-50/30 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    event.status === 'upcoming' ? 'bg-orange-100 text-orange-800' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {event.status === 'upcoming' ? 'Upcoming Event' : 'Past Activity'}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {event.date}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-900">
                  {event.title}
                </h4>

                <p className="text-xs text-stone-600 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <div className="flex items-center gap-1 truncate max-w-[220px]">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  {event.attendeesCount && (
                    <div className="flex items-center gap-1 text-orange-700 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.attendeesCount}+ Bhaktas</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('events')}
            className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Explore All Mandal Activities</span>
          </button>
        </div>
      </div>

      {/* 5. Photo Gallery Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-devotional text-xl font-bold text-stone-900">
                Recent Sunderkand & Darshan Photos
              </h3>
              <p className="text-xs text-stone-500">
                Glimpses of deepotsav, aarti, and devotional celebrations
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('gallery')}
            className="text-xs sm:text-sm font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View Gallery ({photoCollections.length} Albums)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentPhotos.map((album) => (
            <div
              key={album.id}
              onClick={() => setActiveTab('gallery')}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-amber-200/80 bg-white cursor-pointer transition-all"
            >
              <div className="aspect-16/10 overflow-hidden bg-stone-100 relative">
                <img
                  src={album.coverPhoto}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{album.photos.length} Photos</span>
                </div>
              </div>

              <div className="p-3.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>{album.date}</span>
                  <span className="text-orange-700 font-medium">{album.location}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-orange-700 transition-colors truncate">
                  {album.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
