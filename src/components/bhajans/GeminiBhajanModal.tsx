import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Bhajan } from '../../types';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Loader2,
  CheckCircle2,
  BookOpen,
  Edit3,
  Copy,
  Check,
  RefreshCw,
  X,
  Volume2,
  Flame,
  Music,
  ArrowRight
} from 'lucide-react';

interface GeminiBhajanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBhajanAdded?: (newBhajan: Bhajan) => void;
}

export const GeminiBhajanModal: React.FC<GeminiBhajanModalProps> = ({
  isOpen,
  onClose,
  onBhajanAdded
}) => {
  const { addBhajan, setActiveTab, showToast } = useApp();

  // Input states
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<Bhajan['category']>('Hanumanji');
  const [languageHint, setLanguageHint] = useState<'Hindi' | 'Gujarati' | 'Mixed'>('Hindi');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Generation States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedBhajan, setGeneratedBhajan] = useState<{
    hindiTitle: string;
    gujaratiTitle?: string;
    category: Bhajan['category'];
    composer?: string;
    ragaOrScale?: string;
    description?: string;
    lyrics: string;
  } | null>(null);

  // Edit Mode after generation
  const [isEditing, setIsEditing] = useState(false);
  const [editableForm, setEditableForm] = useState({
    title: '',
    gujaratiTitle: '',
    hindiTitle: '',
    category: 'Hanumanji' as Bhajan['category'],
    composer: '',
    ragaOrScale: '',
    description: '',
    lyrics: '',
    youtubeUrl: ''
  });

  // Success state
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = languageHint === 'Gujarati' ? 'gu-IN' : 'hi-IN';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setPrompt((prev) => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : '';
            return prev + separator + currentTranscript.trim();
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [languageHint]);

  const toggleListening = () => {
    if (!speechSupported) {
      showToast('आपके ब्राउज़र में वॉइस स्पीच रिकग्निशन समर्थित नहीं है। कृपया टाइप करें।');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = languageHint === 'Gujarati' ? 'gu-IN' : 'hi-IN';
          recognitionRef.current.start();
          setIsListening(true);
          showToast('🎤 माइक चालू है... भजन का नाम या बोल बोलें!');
        }
      } catch (err) {
        console.error('Speech start error:', err);
        setIsListening(false);
      }
    }
  };

  // Preset inspiration prompts
  const samplePrompts = [
    { title: 'सारंगपुर कष्टभंजन वंदना', prompt: 'श्री कष्टभंजन देव सारंगपुर हनुमान जी महाराज की स्तुति वंदना' },
    { title: 'हे दुख भंजन मारुती नंदन', prompt: 'हे दुख भंजन मारुती नंदन सुन लो मेरी पुकार' },
    { title: 'दुनिया चले ना श्री राम के बिना', prompt: 'दुनिया चले ना श्री राम के बिना राम जी चले ना हनुमान के बिना' },
    { title: 'राम ना बाण वाग्या (गुजराती)', prompt: 'રામ ના બાણ વાગ્યા રે જેને રામ ના બાણ વાગ્યા' },
    { title: 'सुंदरकांड 108 दीप महाआरती', prompt: 'संगीतमय सुंदरकांड पाठ समापन महाआरती व मंगल गान' },
    { title: 'संकटमोचन हनुमानाष्टक भावार्थ', prompt: 'बाल समय रबि भक्षि लियो तब तीनहुं लोक भयो अंधियारो' }
  ];

  // Call server-side Gemini API
  const handleGenerate = async (customPrompt?: string) => {
    const textToSubmit = (customPrompt || prompt).trim();
    if (!textToSubmit) {
      showToast('कृपया भजन का नाम, बोल या कोई पंक्ति लिखें या बोलें।');
      return;
    }

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    setIsLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/gemini/generate-bhajan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: textToSubmit,
          category,
          languageHint
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.bhajan) {
        throw new Error(data.error || 'भजन निर्माण में त्रुटि हुई।');
      }

      const generated = data.bhajan;
      setGeneratedBhajan(generated);

      // Populate editable form
      setEditableForm({
        title: generated.hindiTitle || textToSubmit,
        hindiTitle: generated.hindiTitle || textToSubmit,
        gujaratiTitle: generated.gujaratiTitle || '',
        category: (generated.category as Bhajan['category']) || category,
        composer: generated.composer || 'परंपरागत मंडल',
        ragaOrScale: generated.ragaOrScale || 'राग भैरवी / Bilawal',
        description: generated.description || '',
        lyrics: generated.lyrics || '',
        youtubeUrl: ''
      });

      showToast('✨ Gemini AI द्वारा भजन लिरिक्स तैयार कर दी गई है!');
    } catch (err: any) {
      console.error('Gemini Bhajan generation error:', err);
      setError(err.message || 'भजन तैयार करने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct save to Bhajan collection
  const handleSaveToBhajans = async () => {
    if (!generatedBhajan && !editableForm.lyrics) return;

    const finalTitle = isEditing ? editableForm.title : generatedBhajan?.hindiTitle || editableForm.title;
    const finalLyrics = isEditing ? editableForm.lyrics : generatedBhajan?.lyrics || editableForm.lyrics;

    if (!finalTitle || !finalLyrics) {
      showToast('कृपया शीर्षक और बोल भरें।');
      return;
    }

    const bhajanPayload: Omit<Bhajan, 'id' | 'dateAdded'> = {
      title: finalTitle,
      hindiTitle: isEditing ? editableForm.hindiTitle : generatedBhajan?.hindiTitle,
      gujaratiTitle: isEditing ? editableForm.gujaratiTitle : generatedBhajan?.gujaratiTitle,
      category: isEditing ? editableForm.category : (generatedBhajan?.category as Bhajan['category']) || 'Hanumanji',
      composer: isEditing ? editableForm.composer : generatedBhajan?.composer,
      ragaOrScale: isEditing ? editableForm.ragaOrScale : generatedBhajan?.ragaOrScale,
      description: isEditing ? editableForm.description : generatedBhajan?.description,
      lyrics: finalLyrics,
      youtubeUrl: editableForm.youtubeUrl || undefined,
      isPopular: true
    };

    try {
      await addBhajan(bhajanPayload);
      setIsSaved(true);
      showToast('✅ भजन सीधे "भजन व आरती संग्रह" में सफलतापूर्वक जुड़ गया है!');
      if (onBhajanAdded) {
        onBhajanAdded({
          ...bhajanPayload,
          id: 'bhajan-' + Date.now(),
          dateAdded: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error saving bhajan:', err);
      showToast('भजन जोड़ने में समस्या आई।');
    }
  };

  const handleCopy = () => {
    const lyricsToCopy = isEditing ? editableForm.lyrics : generatedBhajan?.lyrics;
    if (lyricsToCopy) {
      navigator.clipboard.writeText(lyricsToCopy);
      setCopied(true);
      showToast('लिरिक्स क्लिपबोर्ड में कॉपी हो गई!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-devotional text-lg sm:text-xl font-bold">
                  Gemini AI भजन सर्च एवं लिरिक्स संकलन
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider">
                  AI Search & Add
                </span>
              </div>
              <p className="text-xs text-amber-100">
                भजन का नाम बोलें 🎤 या लिखें — Gemini AI प्रामाणिक लिरिक्स खोजकर तुरंत भजन संग्रह में जोड़ देगा
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
          {/* 1. Voice & Text Input Section */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-orange-600" />
                <span>भजन का नाम, बोल या भाव (बोलें या लिखें):</span>
              </label>

              {/* Language selection */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-stone-500 text-[11px]">भाषा:</span>
                <select
                  value={languageHint}
                  onChange={(e) => setLanguageHint(e.target.value as any)}
                  className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 focus:outline-none"
                >
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                  <option value="Mixed">पारंपरिक मिश्रित</option>
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg text-xs font-semibold text-amber-900 focus:outline-none"
                >
                  <option value="Hanumanji">Hanumanji (हनुमान जी)</option>
                  <option value="Ramji">Ramji (श्री राम)</option>
                  <option value="Sunderkand Stuti & Doha">Sunderkand Stuti & Doha</option>
                  <option value="Aarti">Aarti (आरती)</option>
                  <option value="Thal">Thal (थाल)</option>
                  <option value="Dhoon">Dhoon (धून व संकीर्तन)</option>
                  <option value="Shivji">Shivji (शिवजी)</option>
                  <option value="Krishna">Krishna (श्री कृष्ण)</option>
                </select>
              </div>
            </div>

            {/* Input Box with Microphone trigger */}
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="जैसे: 'हे दुख भंजन मारुती नंदन सुन लो मेरी पुकार' या 'सारंगपुर ना कष्टभंजन देव'..."
                className={`w-full p-3.5 pr-14 text-sm sm:text-base border-2 rounded-2xl focus:outline-none transition-all ${
                  isListening
                    ? 'border-orange-500 bg-orange-50/40 ring-4 ring-orange-200'
                    : 'border-stone-200 focus:border-amber-500 bg-white'
                }`}
              />

              {/* Mic Action Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 top-3 p-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-red-300 ring-4 ring-red-200'
                    : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-95'
                }`}
                title={isListening ? 'बोलना बंद करें' : 'बोलकर लिखें (माइक चालू करें)'}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 animate-bounce" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <div className="flex items-center justify-between p-2.5 bg-orange-100 text-orange-900 rounded-xl text-xs font-semibold animate-pulse border border-orange-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                  <span>🎤 माइक सुन रहा है... आप भजन का नाम या पंक्तियां बोलिए</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="px-2 py-0.5 bg-orange-700 text-white rounded text-[11px]"
                >
                  पूर्ण (Done)
                </button>
              </div>
            )}

            {/* Inspiration Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                सुझाव व लोकप्रिय भजन:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(sp.prompt);
                      handleGenerate(sp.prompt);
                    }}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-stone-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    ✨ {sp.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800"
                >
                  साफ करें (Clear)
                </button>
              )}

              <button
                type="button"
                disabled={isLoading || !prompt.trim()}
                onClick={() => handleGenerate()}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                  isLoading || !prompt.trim()
                    ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-200'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini भजन खोजकर लिरिक्स तैयार कर रहा है...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>भजन खोजें व लिरिक्स निकालें (Search Bhajan)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => handleGenerate()}
                className="px-3 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                पुनः प्रयास
              </button>
            </div>
          )}

          {/* 2. Generated Result Preview & Actions */}
          {generatedBhajan && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-lg space-y-5">
              {/* Header result row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs font-bold border border-orange-300">
                      {isEditing ? editableForm.category : generatedBhajan.category}
                    </span>
                    {(isEditing ? editableForm.ragaOrScale : generatedBhajan.ragaOrScale) && (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-xs font-medium">
                        {isEditing ? editableForm.ragaOrScale : generatedBhajan.ragaOrScale}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif-devotional text-xl sm:text-2xl font-bold text-stone-900">
                    {isEditing ? editableForm.title : generatedBhajan.hindiTitle}
                  </h4>
                  {(isEditing ? editableForm.gujaratiTitle : generatedBhajan.gujaratiTitle) && (
                    <p className="text-sm font-semibold text-amber-800">
                      ॥ {isEditing ? editableForm.gujaratiTitle : generatedBhajan.gujaratiTitle} ॥
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'पूर्वावलोकन देखें' : 'बदलाव करें (Edit)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl cursor-pointer"
                    title="Copy lyrics"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Description / Mahatmya */}
              {(isEditing ? editableForm.description : generatedBhajan.description) && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 italic font-devanagari">
                  <strong>भावार्थ:</strong> {isEditing ? editableForm.description : generatedBhajan.description}
                </div>
              )}

              {/* Lyrics Content / Edit Form */}
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        हिंदी शीर्षक (Hindi Title)
                      </label>
                      <input
                        type="text"
                        value={editableForm.title}
                        onChange={(e) => setEditableForm({ ...editableForm, title: e.target.value, hindiTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ગુજરાતી શીર્ષક (Gujarati Title)
                      </label>
                      <input
                        type="text"
                        value={editableForm.gujaratiTitle}
                        onChange={(e) => setEditableForm({ ...editableForm, gujaratiTitle: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      भजन के बोल (Lyrics Lines)
                    </label>
                    <textarea
                      rows={10}
                      value={editableForm.lyrics}
                      onChange={(e) => setEditableForm({ ...editableForm, lyrics: e.target.value })}
                      className="w-full p-3.5 text-xs sm:text-sm font-devanagari leading-relaxed border border-stone-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 bg-amber-50/40 rounded-2xl border border-amber-200/80 font-devanagari text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line shadow-inner max-h-[350px] overflow-y-auto">
                  {generatedBhajan.lyrics}
                </div>
              )}

              {/* Direct Save Action Bar */}
              <div className="p-4 bg-gradient-to-r from-amber-100/70 via-orange-100/70 to-amber-100/70 rounded-2xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-stone-700">
                  {isSaved ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      यह भजन आपके 'भजन व आरती संग्रह' में सफलतापूर्वक सुरक्षित हो गया है!
                    </span>
                  ) : (
                    <span>यह भजन सीधे आपके क्लाउड डेटाबेस व भजन टैब में तुरंत सहेजने के लिए तैयार है।</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {isSaved ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveTab('bhajans');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>भजन टैब में देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSaveToBhajans}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all shadow-emerald-200"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>भजन लिरिक्स में जोड़ें (Add to Bhajan Lyrics)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="flex items-center space-x-1.5">
            <DiyaIcon className="w-3.5 h-3.5 text-orange-500" />
            <span>श्री कष्टभंजन प्रेमी मंडल • Gemini 3.7 Flash AI</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl font-semibold cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
