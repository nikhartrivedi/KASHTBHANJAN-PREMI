import React, { useEffect, useState } from 'react';
import { Bhajan } from '../../types';
import { INITIAL_BHAJANS } from '../../data/initialData';
import { SafeImage } from '../common/SafeImage';
import { DiyaIcon } from '../common/DevotionalIcons';
import { BookOpen, Copy, Check, Share2, ZoomIn, ZoomOut, ArrowLeft, Volume2, Sparkles, Music } from 'lucide-react';

export const BhajanLyricsPage: React.FC = () => {
  const [bhajan, setBhajan] = useState<Bhajan | null>(null);
  const [fontSize, setFontSize] = useState<number>(20);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read ?id= or ?title= from URL search params
    const params = new URLSearchParams(window.location.search);
    const bhajanId = params.get('id');
    const bhajanTitle = params.get('title');

    // Look up in localStorage first (for newly added bhajans)
    let allBhajans: Bhajan[] = INITIAL_BHAJANS;
    try {
      const saved = localStorage.getItem('kp_bhajans_v2');
      if (saved) {
        allBhajans = JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }

    if (bhajanId) {
      const found = allBhajans.find((b) => b.id === bhajanId);
      if (found) setBhajan(found);
    } else if (bhajanTitle) {
      const found = allBhajans.find(
        (b) => b.title.toLowerCase() === decodeURIComponent(bhajanTitle).toLowerCase()
      );
      if (found) setBhajan(found);
    }

    // Default to first if none found
    if (!bhajanId && !bhajanTitle && allBhajans.length > 0) {
      setBhajan(allBhajans[0]);
    }
  }, []);

  const handleCopy = () => {
    if (!bhajan) return;
    const textToCopy = `${bhajan.title}\n${bhajan.gujaratiTitle || ''}\n\n${bhajan.lyrics}\n\n— SHREE KASHTBHANJAN PREMI (Nougama, Banswara)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (!bhajan) return;
    const shareText = `*${bhajan.title}*\n${bhajan.gujaratiTitle || ''}\n\n${bhajan.lyrics}\n\n🌹 *SHREE KASHTBHANJAN PREMI Mandal, Nougama*\n🔗 ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: bhajan.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  if (!bhajan) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex flex-col items-center justify-center p-6 text-center">
        <DiyaIcon className="w-12 h-12 text-orange-500 mb-3 animate-pulse" />
        <h2 className="font-serif-devotional text-2xl font-bold text-stone-800">भजन लोड हो रहा है...</h2>
        <p className="text-sm text-stone-500 mt-2">Loading Bhajan lyrics reader...</p>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="mt-6 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold shadow-md cursor-pointer transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col selection:bg-orange-200">
      {/* Top Auspicious Reader Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-xs px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 truncate">
            <a
              href="/"
              className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Main Portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
            <div className="truncate">
              <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block font-devanagari">
                ॥ શ્રી કષ્ટભંજન દેવ ભજન સંગ્રહ ॥
              </span>
              <h1 className="text-base sm:text-lg font-bold text-stone-900 truncate">
                {bhajan.title}
              </h1>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <div className="flex items-center bg-stone-100 rounded-xl p-0.5 border border-stone-200">
              <button
                onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
                className="p-1.5 text-stone-700 hover:text-orange-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Decrease Font Size"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-2 text-stone-700">{fontSize}px</span>
              <button
                onClick={() => setFontSize((prev) => Math.min(34, prev + 2))}
                className="p-1.5 text-stone-700 hover:text-orange-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Increase Font Size"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
              title="Copy Bhajan Lyrics"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Lyrics Reading Paper Sheet */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <article className="bg-white rounded-3xl border-2 border-amber-200/90 p-6 sm:p-12 shadow-sm space-y-6">
          {/* Header Card Inside Reader */}
          <div className="border-b border-amber-200/80 pb-6 text-center space-y-3">
            <div className="inline-flex items-center justify-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200">
              <DiyaIcon className="w-3.5 h-3.5 text-orange-600" />
              <span>{bhajan.category} Bhajan</span>
            </div>

            <h1 className="font-serif-devotional text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {bhajan.title}
            </h1>

            {bhajan.gujaratiTitle && (
              <p className="text-lg sm:text-2xl font-bold text-amber-900 font-devanagari">
                ॥ {bhajan.gujaratiTitle} ॥
              </p>
            )}

            {bhajan.hindiTitle && bhajan.hindiTitle !== bhajan.title && (
              <p className="text-sm sm:text-base text-stone-600 font-devanagari">
                {bhajan.hindiTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-stone-500">
              {bhajan.composer && (
                <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                  रचयिता: {bhajan.composer}
                </span>
              )}
              {bhajan.ragaOrScale && (
                <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                  राग / तर्ज: {bhajan.ragaOrScale}
                </span>
              )}
            </div>

            {bhajan.description && (
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto italic pt-1">
                "{bhajan.description}"
              </p>
            )}
          </div>

          {/* Sacred Lyrics Display */}
          <div className="py-4">
            <pre
              style={{ fontSize: `${fontSize}px` }}
              className="font-devanagari whitespace-pre-wrap leading-relaxed text-stone-800 font-medium text-center sm:text-left bg-amber-50/20 p-4 sm:p-8 rounded-2xl border border-amber-100/80 select-text"
            >
              {bhajan.lyrics}
            </pre>
          </div>

          {/* Bottom Devotional Note */}
          <div className="pt-6 border-t border-amber-200 text-center space-y-2">
            <p className="text-xs text-stone-500 font-devanagari">
              ॥ બોલો શ્રી કષ્ટભંજન દેવ ની જય ॥ સાલંગપુર વાલા હનુમાનજી ની જય ॥
            </p>
            <p className="text-[11px] text-stone-400">
              SHREE KASHTBHANJAN PREMI • Nougama, Banswara (Rajasthan)
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};
