import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Copy,
  Check,
  X,
  Share2,
  Terminal,
  Shield,
  HelpCircle,
  ArrowRight,
  Globe
} from 'lucide-react';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';

interface InstallApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallApkModal: React.FC<InstallApkModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'qrcode' | 'cli'>('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const appUrl = window.location.origin || 'https://ais-pre-6np3pz4r5xx7fcnxvu2f4x-873618302876.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('Android Phone me install karne ka tarika:\n1. Chrome browser me upar 3 dots (⋮) par tap karein\n2. "Install app" ya "Add to Home screen" (होम स्क्रीन में जोड़ें) par click karein\n3. "Install" karein. App aapke phone me Hanuman Ji ke icon ke sath install ho jayega!');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden my-8">
        {/* Header with saffron header */}
        <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/90 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs p-2 flex items-center justify-center border border-white/30 shadow-inner">
              <Smartphone className="w-7 h-7 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-amber-100">
                  Android Mobile App & APK
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-serif flex items-center gap-2">
                ऐप इंस्टॉल करें व APK डाउनलोड करें
              </h2>
            </div>
          </div>
          <p className="text-orange-100 text-sm">
            Kashtabhanjan Premi Sunderkand & Mandal App for Android — Direct Phone Install & APK Generator.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-amber-100 bg-amber-50/50 p-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white text-orange-700 shadow-xs border border-amber-200 font-semibold'
                : 'text-slate-600 hover:text-orange-700 hover:bg-amber-100/50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>1. डायरेक्ट फोन में इंस्टॉल (आसान)</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-white text-orange-700 shadow-xs border border-amber-200 font-semibold'
                : 'text-slate-600 hover:text-orange-700 hover:bg-amber-100/50'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>2. APK फ़ाइल डाउनलोड (PWABuilder)</span>
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'qrcode'
                ? 'bg-white text-orange-700 shadow-xs border border-amber-200 font-semibold'
                : 'text-slate-600 hover:text-orange-700 hover:bg-amber-100/50'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-600" />
            <span>QR कोड स्कैन</span>
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'cli'
                ? 'bg-white text-orange-700 shadow-xs border border-amber-200 font-semibold'
                : 'text-slate-600 hover:text-orange-700 hover:bg-amber-100/50'
            }`}
          >
            <Terminal className="w-4 h-4 text-slate-600" />
            <span>Developer / CLI</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {/* TAB 1: 1-Tap PWA Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/80 border border-orange-200/80">
                <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-base">Android Phone में सीधे असली ऐप की तरह चलाएं</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    यह ऐप Google Play Store के बिना सीधे आपके Android मोबाइल की होम-स्क्रीन पर हनुमान जी की गदा के आइकॉन के साथ इंस्टॉल हो जाता है। यह ऑफलाइन भी काम करता है।
                  </p>
                </div>
              </div>

              {isInstalled ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm">ऐप आपके फ़ोन में पहले से इंस्टॉल है!</div>
                    <div className="text-xs text-emerald-700">App is running as an installed standalone mobile app.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleInstallPwa}
                    className="w-full py-3.5 px-6 bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 text-base transition-transform active:scale-98 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    📲 Kashtabhanjan Premi ऐप इंस्टॉल करें (Install App)
                  </button>

                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                    <h4 className="font-bold text-orange-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-orange-600" />
                      मोबाइल Chrome में 3 आसान स्टेप्स:
                    </h4>
                    <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside pl-1">
                      <li>
                        अपने Android फ़ोन में <strong>Chrome</strong> ब्राउज़र में यह लिंक खोलें।
                      </li>
                      <li>
                        ऊपर दाईं तरफ <strong>3 डॉट्स ( ⋮ )</strong> मेनू पर क्लिक करें।
                      </li>
                      <li>
                        मेनू में <strong>"Install app"</strong> (या <strong>"Add to Home screen" / "होम स्क्रीन में जोड़ें"</strong>) पर टैप करें।
                      </li>
                      <li>
                        <strong>"Install"</strong> दबाते ही ऐप आपके मोबाइल की होम स्क्रीन पर आ जाएगा!
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-700 font-medium truncate mr-2">
                  App Web Link: <span className="text-orange-700 font-mono text-[11px]">{appUrl}</span>
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? 'Copied Link' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PWABuilder for APK */}
          {activeTab === 'apk' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    PWABuilder (Microsoft & Google Supported)
                  </span>
                  <span className="text-xs text-emerald-800 font-medium">100% Free APK Generator</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">स्टैंडअलोन .APK पैकेज डाउनलोड करने का तरीका</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  इस ऐप का <code className="bg-emerald-100 text-emerald-900 px-1 rounded">manifest.json</code> और देवोशनल आइकॉन्स पहले से पूरी तरह कॉन्फ़िगर हैं। PWABuilder इसे एक क्लिक में Android APK फ़ाइल में बदल देता है।
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  APK डाउनलोड करने के 3 आसान स्टेप:
                </div>
                <div className="space-y-2.5 text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <span>नीचे दिए गए हरे बटन <strong>"Open PWABuilder Generator"</strong> पर क्लिक करें।</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <span>पेज पर <strong>"Package for Stores"</strong> (या <strong>"Package"</strong>) पर क्लिक करके <strong>"Android"</strong> चुनें।</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <span><strong>"Generate APK / Package"</strong> बटन दबाकर अपनी <code>.apk</code> फ़ाइल डाउनलोड करें और फ़ोन में इनस्टॉल करें!</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-base transition-transform active:scale-98 cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5" />
                  PWABuilder खोलें और APK डाउनलोड करें (Generate APK)
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code */}
          {activeTab === 'qrcode' && (
            <div className="space-y-5 text-center animate-in fade-in duration-150">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <h3 className="font-bold text-slate-900 text-sm">मोबाइल के कैमरे या Google Lens से स्कैन करें</h3>
                <p className="text-xs text-slate-600 mt-1">
                  अपने Android फ़ोन के कैमरे से यह QR कोड स्कैन करें और तुरंत ऐप को अपने फ़ोन में इंस्टॉल कर लें।
                </p>
              </div>

              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-orange-500/30 shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}&color=ea580c`}
                  alt="QR Code for App URL"
                  className="w-48 h-48 mx-auto rounded-lg"
                />
                <div className="mt-2 text-xs font-semibold text-orange-700">
                  कष्टभंजन प्रेमी — Sunderkand & Mandal App
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Globe className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-mono">{appUrl}</span>
              </div>
            </div>
          )}

          {/* TAB 4: CLI / Bubblewrap */}
          {activeTab === 'cli' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-3">
                <div className="text-slate-400 font-sans text-xs flex items-center justify-between">
                  <span>Google Bubblewrap CLI से सीधे APK बिल्ड करें:</span>
                  <button
                    onClick={() => handleCopyCmd(`npx @bubblewrap/cli init --manifest=${appUrl}/manifest.json && npx @bubblewrap/cli build`)}
                    className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 font-sans cursor-pointer"
                  >
                    {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCmd ? 'Copied' : 'Copy Commands'}
                  </button>
                </div>
                <div className="bg-black/60 p-3 rounded-lg overflow-x-auto text-amber-300">
                  # 1. Android Trusted Web Activity (TWA) इनिशियलाइज़ करें<br/>
                  npx @bubblewrap/cli init --manifest={appUrl}/manifest.json<br/><br/>
                  # 2. Signed APK फ़ाइल तैयार करें<br/>
                  npx @bubblewrap/cli build
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-orange-900">Capacitor Native Android विकल्प:</div>
                <div className="font-mono bg-white p-2.5 rounded border border-amber-200 text-[11px] text-slate-800">
                  npm install @capacitor/core @capacitor/cli @capacitor/android<br/>
                  npx cap init "Kashtabhanjan Premi" "com.kashtabhanjan.app"<br/>
                  npm run build<br/>
                  npx cap add android<br/>
                  npx cap open android
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>सुरक्षित व ऑफलाइन समर्थित (Offline Supported PWA)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

