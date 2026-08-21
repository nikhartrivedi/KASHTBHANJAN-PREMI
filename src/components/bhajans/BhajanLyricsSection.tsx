import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bhajan } from '../../types';
import { DiyaIcon, OmSymbol } from '../common/DevotionalIcons';
import {
  Music,
  Search,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Share2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronRight,
  Flame,
  ExternalLink
} from 'lucide-react';

interface BhajanLyricsSectionProps {
  initialSelectedBhajan?: Bhajan;
}

export const BhajanLyricsSection: React.FC<BhajanLyricsSectionProps> = ({ initialSelectedBhajan }) => {
  const { bhajans, addBhajan, updateBhajan, deleteBhajan, isAdmin, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(() => {
    return initialSelectedBhajan || bhajans[0] || null;
  });

  // Reading settings (font size scaler for comfortable recitation!)
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2); // 0: Small (15px), 1: Normal (17px), 2: Large (20px), 3: Extra Large (24px)
  const [copied, setCopied] = useState(false);
  const [isFullScreenRecite, setIsFullScreenRecite] = useState(false);

  // Admin Add/Edit Modal
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBhajan, setEditingBhajan] = useState<Bhajan | null>(null);

  // Form State
  const [formData, setFormData] = useState({
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

  const categories = ['All', 'Hanumanji', 'Ramji', 'Sunderkand Stuti & Doha', 'Aarti', 'Thal', 'Dhoon'];

  const fontSizes = [
    'text-base leading-relaxed',
    'text-lg leading-loose',
    'text-xl leading-loose sm:text-2xl',
    'text-2xl leading-loose sm:text-3xl font-medium'
  ];

  const handleCopyLyrics = (bhajan: Bhajan) => {
    const fullText = `॥ ${bhajan.title} ॥\n${bhajan.gujaratiTitle ? bhajan.gujaratiTitle + '\n' : ''}\n${bhajan.lyrics}\n\n— Kashtabhanjan Premi Bhajan Sangrah`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    showToast('Bhajan lyrics copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareBhajan = (bhajan: Bhajan) => {
    const fullText = `🌸 *${bhajan.title}* 🌸\n\n${bhajan.lyrics.slice(0, 300)}...\n\nRead complete lyrics on Kashtabhanjan Premi Mandal App`;
    if (navigator.share) {
      navigator.share({ title: bhajan.title, text: fullText }).catch(() => {});
    } else {
      handleCopyLyrics(bhajan);
    }
  };

  const openAddModal = () => {
    setEditingBhajan(null);
    setFormData({
      title: '',
      gujaratiTitle: '',
      hindiTitle: '',
      category: 'Hanumanji',
      composer: '',
      ragaOrScale: '',
      description: '',
      lyrics: '',
      youtubeUrl: ''
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (bhajan: Bhajan) => {
    setEditingBhajan(bhajan);
    setFormData({
      title: bhajan.title,
      gujaratiTitle: bhajan.gujaratiTitle || '',
      hindiTitle: bhajan.hindiTitle || '',
      category: bhajan.category,
      composer: bhajan.composer || '',
      ragaOrScale: bhajan.ragaOrScale || '',
      description: bhajan.description || '',
      lyrics: bhajan.lyrics,
      youtubeUrl: bhajan.youtubeUrl || ''
    });
    setIsAddEditModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.lyrics) {
      showToast('Please enter both title and lyrics');
      return;
    }

    if (editingBhajan) {
      updateBhajan({
        ...editingBhajan,
        title: formData.title,
        gujaratiTitle: formData.gujaratiTitle || undefined,
        hindiTitle: formData.hindiTitle || undefined,
        category: formData.category,
        composer: formData.composer || undefined,
        ragaOrScale: formData.ragaOrScale || undefined,
        description: formData.description || undefined,
        lyrics: formData.lyrics,
        youtubeUrl: formData.youtubeUrl || undefined
      });
      if (selectedBhajan?.id === editingBhajan.id) {
        setSelectedBhajan({
          ...editingBhajan,
          ...formData
        });
      }
    } else {
      addBhajan({
        title: formData.title,
        gujaratiTitle: formData.gujaratiTitle || undefined,
        hindiTitle: formData.hindiTitle || undefined,
        category: formData.category,
        composer: formData.composer || undefined,
        ragaOrScale: formData.ragaOrScale || undefined,
        description: formData.description || undefined,
        lyrics: formData.lyrics,
        youtubeUrl: formData.youtubeUrl || undefined,
        isPopular: false
      });
    }
    setIsAddEditModalOpen(false);
  };

  const openBhajanInNewTab = (bhajan: Bhajan, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `/?page=bhajan-lyrics&id=${encodeURIComponent(bhajan.id)}&title=${encodeURIComponent(bhajan.title)}`;
    window.open(url, '_blank');
  };

  const filteredBhajans = bhajans.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.gujaratiTitle && b.gujaratiTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.hindiTitle && b.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.lyrics.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-devotional text-xl sm:text-2xl font-bold text-stone-900">
              भजन लिरिक्स संग्रह
            </h1>
            <p className="text-xs text-stone-500 font-devanagari mt-0.5">
              हनुमान जी, राम जी, सुंदरकांड स्तुति, आरती, थाल व गुजराती भजन
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              id="admin-add-bhajan-btn"
              onClick={openAddModal}
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ नया भजन जोड़ें</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-amber-50 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="flex items-center gap-1.5 w-full sm:w-80">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="भजन, पंक्ति या शब्द खोजें..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column View: Left List, Right Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bhajan List (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-2 max-h-[680px] overflow-y-auto pr-1">
          {filteredBhajans.map((bhajan) => {
            const isSelected = selectedBhajan?.id === bhajan.id;
            return (
              <div
                key={bhajan.id}
                onClick={() => setSelectedBhajan(bhajan)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-orange-50 border-orange-400 shadow-xs'
                    : 'bg-white border-stone-200/80 hover:border-amber-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={(e) => openBhajanInNewTab(bhajan, e)}
                      className="text-left font-bold leading-snug group/title flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer"
                      title="Click to open full lyrics in a new tab"
                    >
                      <span className={`text-sm ${isSelected ? 'text-orange-950' : 'text-stone-900'} group-hover/title:text-orange-700`}>
                        {bhajan.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-orange-500 opacity-60 group-hover/title:opacity-100 shrink-0" />
                    </button>
                    {bhajan.gujaratiTitle && (
                      <p className="text-xs text-amber-900 font-devanagari mt-0.5">
                        {bhajan.gujaratiTitle}
                      </p>
                    )}
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium shrink-0 ${
                    isSelected ? 'bg-orange-200 text-orange-900' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {bhajan.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2.5 pt-2 border-t border-stone-100">
                  <span>{bhajan.composer || 'Traditional'}</span>
                  <div className="flex items-center gap-2">
                    {bhajan.ragaOrScale && (
                      <span className="text-orange-700 font-medium">{bhajan.ragaOrScale}</span>
                    )}
                    <button
                      onClick={(e) => openBhajanInNewTab(bhajan, e)}
                      className="p-1 rounded hover:bg-orange-100 text-orange-700 flex items-center gap-0.5 text-[10px] font-semibold"
                      title="Open in new tab"
                    >
                      <span>New Tab</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBhajans.length === 0 && (
            <div className="p-6 text-center bg-white rounded-3xl border border-amber-200 text-stone-600 space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-orange-600">
                <Music className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-stone-800">
                  {searchTerm ? `"${searchTerm}" नहीं मिला` : 'कोई भजन नहीं मिला'}
                </p>
                <p className="text-xs text-stone-500 font-devanagari">
                  खोज शब्द बदलें या नया भजन जोड़ने के लिए एडमिन से संपर्क करें।
                </p>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया भजन जोड़ें</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Full Lyrics Reader with Comfort Controls (8 cols on lg) */}
        <div className="lg:col-span-8">
          {selectedBhajan ? (
            <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Reader Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-orange-700 mb-1">
                    <span className="bg-orange-100 px-2.5 py-0.5 rounded-full">{selectedBhajan.category}</span>
                    {selectedBhajan.ragaOrScale && <span>• {selectedBhajan.ragaOrScale}</span>}
                  </div>
                  <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-950">
                    {selectedBhajan.title}
                  </h2>
                  {selectedBhajan.gujaratiTitle && (
                    <p className="text-base text-amber-900 font-devanagari mt-1 font-medium">
                      {selectedBhajan.gujaratiTitle}
                    </p>
                  )}
                  {selectedBhajan.description && (
                    <p className="text-xs text-stone-500 mt-1 italic">
                      {selectedBhajan.description}
                    </p>
                  )}
                </div>

                {/* Reader Controls Toolbar */}
                <div className="flex items-center flex-wrap gap-2 self-start sm:self-center">
                  {/* Font Size Adjuster for comfortable recitation */}
                  <div className="flex items-center bg-amber-50 rounded-xl p-1 border border-amber-200 text-stone-700">
                    <button
                      onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                      disabled={fontSizeLevel === 0}
                      className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                      title="Decrease font size"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-2 text-xs font-bold text-orange-900">
                      {fontSizeLevel === 0 ? 'Small' : fontSizeLevel === 1 ? 'Medium' : fontSizeLevel === 2 ? 'Large' : 'XL'}
                    </span>
                    <button
                      onClick={() => setFontSizeLevel(Math.min(fontSizes.length - 1, fontSizeLevel + 1))}
                      disabled={fontSizeLevel === fontSizes.length - 1}
                      className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                      title="Increase font size for reading"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => openBhajanInNewTab(selectedBhajan)}
                    className="p-2 bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3"
                    title="Open this bhajan lyrics in a dedicated new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                    <span>Open in New Tab</span>
                  </button>

                  <button
                    onClick={() => handleCopyLyrics(selectedBhajan)}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
                    title="Copy lyrics"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleShareBhajan(selectedBhajan)}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors cursor-pointer"
                    title="Share lyrics"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsFullScreenRecite(true)}
                    className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3"
                    title="Open Full Screen Devotional Path Mode"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Path Mode</span>
                  </button>

                  {/* Admin Edit / Delete */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
                      <button
                        onClick={() => openEditModal(selectedBhajan)}
                        className="p-2 text-stone-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-colors"
                        title="Edit Bhajan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete bhajan "${selectedBhajan.title}"?`)) {
                            deleteBhajan(selectedBhajan.id);
                          }
                        }}
                        className="p-2 text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Bhajan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Lyrics Content Box (Formatted with large, comfortable typography) */}
              <div className="bg-amber-50/40 rounded-2xl p-6 sm:p-8 border border-amber-200/60">
                <pre
                  className={`font-devanagari whitespace-pre-wrap font-medium text-stone-900 ${fontSizes[fontSizeLevel]}`}
                >
                  {selectedBhajan.lyrics}
                </pre>
              </div>

              {/* Footer details */}
              <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 pt-4 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <DiyaIcon className="w-4 h-4 text-orange-500" />
                  <span>Kashtabhanjan Premi Devotional Sangeet Archive</span>
                </div>
                <span>Added on {selectedBhajan.dateAdded}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500">
              <BookOpen className="w-12 h-12 mx-auto text-stone-400 mb-2" />
              <p className="text-base font-semibold text-stone-800">Select a bhajan to read lyrics</p>
            </div>
          )}
        </div>
      </div>

      {/* FULL SCREEN RECITATION MODAL (Crucial for devotees singing during Sunderkand) */}
      {isFullScreenRecite && selectedBhajan && (
        <div className="fixed inset-0 z-50 bg-amber-50/95 overflow-y-auto p-4 sm:p-10 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-200">
              <div>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                  ॥ કષ્ટભંજન દેવાય નમઃ ॥
                </span>
                <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-950">
                  {selectedBhajan.title}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-xl p-1 border border-amber-200 shadow-xs">
                  <button
                    onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
                    className="p-2 hover:bg-amber-50 rounded-lg"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFontSizeLevel(Math.min(fontSizes.length - 1, fontSizeLevel + 1))}
                    className="p-2 hover:bg-amber-50 rounded-lg"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsFullScreenRecite(false)}
                  className="p-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lyrics View */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-amber-200/80">
              <pre className={`font-devanagari whitespace-pre-wrap font-medium text-stone-950 ${fontSizes[fontSizeLevel]}`}>
                {selectedBhajan.lyrics}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN ADD / EDIT BHAJAN MODAL (Only Title, Category, and Lyrics) */}
      {isAddEditModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-5 sm:p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-devotional text-lg sm:text-xl font-bold">
                  {editingBhajan ? 'भजन में बदलाव करें (Edit Bhajan)' : 'नया भजन जोड़ें (Add New Bhajan)'}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  शीर्षक, श्रेणी और भजन के बोल लिखकर सीधे संग्रह में जोड़ें
                </p>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4">
              {/* 1. Bhajan Title */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5 font-devanagari">
                  1. भजन का नाम / शीर्षक (Bhajan Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="उदा. श्री कष्टभंजन देव मारा संकट हरजो / हे दुख भंजन मारुती नंदन"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none font-devanagari"
                />
              </div>

              {/* 2. Bhajan Category */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5 font-devanagari">
                  2. भजन की श्रेणी (Category) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Bhajan['category'] })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none"
                >
                  <option value="Hanumanji">Hanumanji (हनुमान जी)</option>
                  <option value="Ramji">Ramji (श्री राम जी)</option>
                  <option value="Sunderkand Stuti & Doha">Sunderkand Stuti & Doha (सुंदरकांड दोहा/स्तुति)</option>
                  <option value="Aarti">Aarti (आरती)</option>
                  <option value="Thal">Thal (थाल)</option>
                  <option value="Dhoon">Dhoon (धून)</option>
                  <option value="Shivji">Shivji (शिव जी)</option>
                  <option value="Krishna">Krishna (श्री कृष्ण)</option>
                </select>
              </div>

              {/* 3. Complete Lyrics */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5 font-devanagari">
                  3. भजन के संपूर्ण बोल (Lyrics) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={10}
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  placeholder="भजन की स्थायी और अंतरे की पंक्तियाँ यहाँ लिखें या पेस्ट करें..."
                  className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none font-devanagari leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {editingBhajan ? 'बदलाव सुरक्षित करें' : 'भजन जोड़ें (Add Bhajan)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
