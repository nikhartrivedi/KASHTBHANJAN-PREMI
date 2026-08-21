import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SunderkandCeremony } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import { SafeImage } from '../common/SafeImage';
import {
  Clock,
  MapPin,
  Flame,
  Share2,
  Navigation,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  User
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectCeremony?: (ceremony: SunderkandCeremony) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onSelectCeremony }) => {
  const {
    nextSunderkand,
    ceremonies,
    setActiveTab,
    isAdmin,
    showToast
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  // Formatting date nicely
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('hi-IN', {
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
    const text = `🌸 *जय श्री कष्टभंजन देव!* 🌸\n\n*आगामी सुंदरकांड पाठ महोत्सव:*\n📜 ${c.title}\n📅 दिनांक: ${formatDate(c.date)}\n⏰ समय: ${c.startTime} बजे से\n📍 स्थान: ${c.venue}\n🏠 पता: ${c.address}\n\n${c.notes ? '✨ ' + c.notes : ''}\n\n🌹 *श्री कष्टभंजन प्रेमी मंडल, नौगामा (बांसवाड़ा)*`;
    
    if (navigator.share) {
      navigator.share({
        title: c.title,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      showToast('सुंदरकांड आमंत्रण विवरण कॉपी हो गया!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Dedicated Divine Image of Shree Kashtabhanjan Dev, Sarangpur
  const sarangpurHanumanjiImage =
    'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="space-y-8 sm:space-y-10 pb-12 max-w-5xl mx-auto">
      {/* 1. Divine Sarangpur Kashtabhanjan Hanumanji Sacred Darshan Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-orange-700 via-amber-700 to-stone-900 text-white shadow-2xl border-2 border-amber-400/60">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Left Title & Salutation */}
          <div className="md:col-span-6 p-6 sm:p-10 space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-200 border border-amber-300/40">
              <DiyaIcon className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>॥ શ્રી સાળંગપુર કષ્ટભંજન દેવ ॥</span>
            </div>

            <h1 className="font-serif-devotional text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
              श्री कष्टभंजन देव
            </h1>

            <p className="text-base sm:text-lg font-bold text-amber-300 font-devanagari">
              सारंगपुर धाम वाले कष्टभंजन हनुमान जी
            </p>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              सकल सुमंगल दायक, रघुनायक पद कंज।<br />
              कष्ट निवारक देव तुम, नमो नमो हनुमंत बलवीर॥
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-xl text-xs font-semibold text-white border border-white/20">
                🚩 नौगामा मंडल (बांसवाड़ा)
              </span>
              <span className="px-3 py-1 bg-amber-500/30 backdrop-blur-md rounded-xl text-xs font-semibold text-amber-200 border border-amber-300/30">
                ✨ नित्य सुमिरन व सुंदरकांड सेवा
              </span>
            </div>
          </div>

          {/* Right Sacred Photo Card */}
          <div className="md:col-span-6 relative p-4 sm:p-6 flex justify-center">
            <div className="relative w-full aspect-4/3 sm:aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300/80 bg-stone-900 group">
              <SafeImage
                src={sarangpurHanumanjiImage}
                alt="श्री कष्टभंजन देव सारंगपुर हनुमान जी"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-center w-full">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-devanagari">
                    ॥ બોલો શ્રી કષ્ટભંજન દેવ ની જય ॥
                  </span>
                  <p className="text-[11px] text-stone-200">
                    श्री सारंगपुर हनुमान जी महाराज दिव्य स्वरूप
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Sunderkand Ceremony Section */}
      <section id="upcoming-sunderkand-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600 shadow-xs">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900">
                आगामी सुंदरकांड पाठ (Upcoming Sunderkand Ceremony)
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                श्री कष्टभंजन प्रेमी मंडल द्वारा आयोजित आगामी भव्य संगीतमय सुंदरकांड पाठ
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('sunderkand')}
            className="text-xs sm:text-sm font-bold text-orange-700 hover:text-orange-900 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
          >
            सभी पाठ देखें ({ceremonies.length}) →
          </button>
        </div>

        {nextSunderkand ? (
          <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden">
            {/* Header Date Banner */}
            <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-600 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-800 uppercase tracking-wide shadow-xs">
                  आगामी आयोजन (Next Ceremony)
                </span>
                <span className="text-xs sm:text-sm text-amber-100 font-semibold">
                  {formatDate(nextSunderkand.date)}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold bg-black/20 px-3 py-1 rounded-xl">
                <Clock className="w-4 h-4 text-amber-200" />
                <span>प्रारंभ: {nextSunderkand.startTime} {nextSunderkand.endTime ? `से ${nextSunderkand.endTime}` : 'बजे'}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Ceremony Details */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h3 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                    {nextSunderkand.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    {nextSunderkand.description}
                  </p>
                </div>

                {/* Venue & Date Details Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      <span>स्थान व पता (Venue)</span>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{nextSunderkand.venue}</p>
                    <p className="text-xs text-stone-600 mt-0.5">{nextSunderkand.address}</p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <CalendarCheck className="w-4 h-4 text-orange-600" />
                      <span>दिनांक व समय</span>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{formatDate(nextSunderkand.date)}</p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      सायं {nextSunderkand.startTime} बजे से महाआरती तक
                    </p>
                  </div>
                </div>

                {/* Host & Special Notes */}
                {(nextSunderkand.hostName || nextSunderkand.notes) && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5 text-xs text-stone-700">
                    {nextSunderkand.hostName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-600" />
                        <span className="font-bold text-stone-900">यजमान / संयोजक:</span>
                        <span>{nextSunderkand.hostName}</span>
                        {nextSunderkand.hostContact && (
                          <span className="text-stone-500 font-medium">({nextSunderkand.hostContact})</span>
                        )}
                      </div>
                    )}
                    {nextSunderkand.notes && (
                      <div className="text-amber-900 font-medium pt-1">
                        ✨ {nextSunderkand.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onSelectCeremony) onSelectCeremony(nextSunderkand);
                      else setActiveTab('sunderkand');
                    }}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>पूरा विवरण देखें (Full Details)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={nextSunderkand.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(nextSunderkand.venue + ' ' + nextSunderkand.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-stone-200"
                  >
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span>मैप दिशा-निर्देश (Map)</span>
                  </a>

                  <button
                    onClick={() => handleShareSunderkand(nextSunderkand)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    title="Share ceremony details on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>WhatsApp आमंत्रण शेयर</span>
                  </button>
                </div>
              </div>

              {/* Right Ceremony Photo */}
              <div className="lg:col-span-5">
                <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 relative group">
                  <SafeImage
                    src={nextSunderkand.photos[0]}
                    alt={nextSunderkand.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <div className="text-xs font-bold text-amber-300 font-devanagari">
                        ॥ श्री कष्टभंजन प्रेमी मंडल नौगामा ॥
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
          <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-stone-500 space-y-2">
            <DiyaIcon className="w-10 h-10 mx-auto text-amber-500/60" />
            <p className="font-semibold text-stone-700">वर्तमान में कोई आगामी सुंदरकांड पाठ निर्धारित नहीं है।</p>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('sunderkand')}
                className="mt-2 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl"
              >
                + नया सुंदरकांड पाठ जोड़ें
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
