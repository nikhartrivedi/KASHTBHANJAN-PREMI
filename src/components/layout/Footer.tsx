import React from 'react';
import { useApp } from '../../context/AppContext';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';
import { Phone, Mail, MapPin, Heart, RotateCcw, Share2, Smartphone, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, resetToDefaults, isAdmin, setIsApkModalOpen } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t-4 border-orange-500">
      {/* Devotional Sloka Banner */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-orange-950/60 rounded-full border border-orange-500/30 mb-3 text-orange-400">
          <DiyaIcon className="w-4 h-4 mr-1.5" />
          <span className="text-xs font-semibold tracking-wider uppercase font-devanagari">
            ॥ શ્રી હનુમત્ સ્તુતિ ॥
          </span>
          <DiyaIcon className="w-4 h-4 ml-1.5" />
        </div>
        <p className="font-devanagari text-base sm:text-lg text-amber-200/90 leading-relaxed max-w-2xl mx-auto font-medium">
          मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।<br />
          वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥
        </p>
        <p className="text-xs text-stone-400 mt-2 font-serif-devotional italic">
          "I take refuge in Lord Hanuman, the messenger of Lord Ram, swift as thought, master of the senses."
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
          {/* Col 1: About Mandal */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                ॐ
              </div>
              <span className="font-serif-devotional text-lg font-bold text-white tracking-wide">
                Kashtabhanjan Premi
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Devotional community Mandal dedicated to weekly Sunderkand path recitation, bhajan sandhya, Sarangpur padyatra, and annakshetra seva.
            </p>
            <div className="text-xs text-amber-400/90 font-medium">
              Sarangpur Kashtabhanjan Dada Seva Parivar
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Quick Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => { setActiveTab('sunderkand'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Sunderkand Ceremonies
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('bhajans'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Bhajan Lyrics Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('events'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Mandal Events & Padyatra
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Photo Gallery & Darshan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsApkModalOpen(true)}
                  className="text-amber-400 font-semibold hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                  <span>Install App / Download APK</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ceremony Timings & Seva */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Path Schedule
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex justify-between border-b border-stone-800 pb-1">
                <span>Every Saturday</span>
                <span className="text-amber-400 font-medium">08:30 PM - 11:30 PM</span>
              </li>
              <li className="flex justify-between border-b border-stone-800 pb-1">
                <span>Every Tuesday (Hanuman Chalisa)</span>
                <span className="text-amber-400 font-medium">07:30 PM - 09:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Maha Aarti & Prasad</span>
                <span className="text-amber-400 font-medium">Post Ceremony</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Mandal Contact */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Mandal Office
            </h4>
            <div className="flex items-start space-x-2 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Kashtabhanjan Seva Bhavan, Satellite, Ahmedabad, Gujarat - 380015</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-stone-400">
              <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>+91 98250 12345 / +91 98980 67890</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-stone-400">
              <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>kashtabhanjanpremi@mandal.org</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Demo Reset */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Kashtabhanjan Premi Mandal. All rights reserved. Jay Shree Kashtabhanjan Dev.</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-1 text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
              title="Reset data to initial authentic sample records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Records</span>
            </button>
            <span>•</span>
            <span className="text-amber-500/80 font-medium">Mobile-Friendly Devotional Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
