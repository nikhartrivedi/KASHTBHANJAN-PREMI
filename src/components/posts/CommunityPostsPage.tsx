import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityPost } from '../../types';
import { SafeImage } from '../common/SafeImage';
import { DiyaIcon } from '../common/DevotionalIcons';
import { processImageInput } from '../../lib/imageUtils';
import {
  Sparkles,
  Heart,
  Image as ImageIcon,
  Share2,
  Plus,
  Trash2,
  Edit2,
  X,
  MessageSquare,
  Upload,
  Send,
  User,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const CommunityPostsPage: React.FC = () => {
  const { posts, addPost, updatePost, deletePost, likePost, isAdmin, user, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    thought: '',
    imageUrl: '',
    authorName: '',
    authorRole: '',
    tags: ''
  });

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      thought: '',
      imageUrl: '',
      authorName: user.name === 'Devotee Guest' ? '' : user.name,
      authorRole: isAdmin ? 'मंडल एडमिन (Admin)' : 'भक्त परिवार',
      tags: 'सुविचार, भक्ति'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: CommunityPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      thought: post.thought,
      imageUrl: post.imageUrl || '',
      authorName: post.authorName,
      authorRole: post.authorRole || '',
      tags: post.tags?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await processImageInput(file);
        setFormData((prev) => ({ ...prev, imageUrl: compressed }));
        showToast('फोटो सफलतापूर्वक लोड हो गई!');
      } catch (err) {
        showToast('फोटो प्रोसेस करने में त्रुटि हुई');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.thought.trim()) {
      showToast('कृपया अपने विचार (Good thoughts / Vichar) दर्ज करें');
      return;
    }

    const processedTags = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['सुविचार', 'भक्ति'];

    if (editingPost) {
      await updatePost({
        ...editingPost,
        title: formData.title.trim() || undefined,
        thought: formData.thought.trim(),
        imageUrl: formData.imageUrl.trim() || undefined,
        authorName: formData.authorName.trim() || 'भक्त',
        authorRole: formData.authorRole.trim() || undefined,
        tags: processedTags
      });
    } else {
      await addPost({
        title: formData.title.trim() || undefined,
        thought: formData.thought.trim(),
        imageUrl: formData.imageUrl.trim() || undefined,
        authorName: formData.authorName.trim() || 'भक्त (Devotee)',
        authorRole: formData.authorRole.trim() || (isAdmin ? 'मंडल एडमिन' : 'भक्त'),
        date: new Date().toISOString().split('T')[0],
        likesCount: 0,
        tags: processedTags
      });
    }

    setIsModalOpen(false);
  };

  const handleSharePost = (post: CommunityPost) => {
    const shareText = `*${post.title ? post.title + '\n\n' : ''}*“${post.thought}”\n\n— ${post.authorName} (${post.authorRole || 'भक्त'})\n\n🌹 *श्री कष्टभंजन प्रेमी मंडल, नौगामा*\nhttps://kastbhanjan-premi.web.app`;
    if (navigator.share) {
      navigator.share({ title: post.title || 'शुभ विचार', text: shareText }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>शुभ विचार एवं दैनिक दर्शन (Daily Thoughts & Photos)</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold">
            भक्त विचार व फोटो पोस्ट (Community Feed)
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
            यहाँ आप प्रभु श्री राम और श्री कष्टभंजन देव के दिव्य सुविचार, सत्संग प्रसंग, महाआरती के सुंदर विचार और फोटो साझा कर सकते हैं।
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="self-start sm:self-auto px-5 py-2.5 bg-white hover:bg-amber-50 active:bg-amber-100 text-orange-900 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-orange-600" />
          <span>+ नया विचार / फोटो पोस्ट करें</span>
        </button>
      </div>

      {/* Posts Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl border border-amber-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              {/* Optional Photo Attachment */}
              {post.imageUrl && (
                <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                  <SafeImage
                    src={post.imageUrl}
                    alt={post.title || 'Post photo'}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold">
                      📸 दर्शन
                    </span>
                  </div>
                </div>
              )}

              {/* Content Box */}
              <div className="p-6 space-y-3.5">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                      {post.authorName.charAt(0) || 'ॐ'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 leading-tight">
                        {post.authorName}
                      </h4>
                      <p className="text-[10px] text-stone-400">
                        {post.authorRole || 'भक्त'} • {post.date}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-1.5 text-stone-400 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit post"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('क्या आप इस पोस्ट को हटाना चाहते हैं?')) {
                            deletePost(post.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title */}
                {post.title && (
                  <h3 className="font-serif-devotional text-lg font-bold text-stone-900 leading-snug">
                    {post.title}
                  </h3>
                )}

                {/* Thought / Vichar Body */}
                <p className="text-xs sm:text-sm text-stone-700 font-devanagari leading-relaxed whitespace-pre-wrap">
                  {post.thought}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 text-[10px] font-medium text-amber-900"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions (Like & WhatsApp Share) */}
            <div className="px-6 py-3.5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                onClick={() => likePost(post.id)}
                className="flex items-center space-x-1.5 text-stone-600 hover:text-rose-600 active:scale-95 transition-all cursor-pointer font-medium"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 hover:fill-rose-500" />
                <span>{post.likesCount || 0} Jai Shree Ram</span>
              </button>

              <button
                onClick={() => handleSharePost(post)}
                className="flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-800 font-medium px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Share on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp Share</span>
              </button>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 space-y-3">
            <DiyaIcon className="w-12 h-12 mx-auto text-amber-500/60 animate-pulse" />
            <h3 className="font-serif-devotional text-lg font-bold text-stone-800">
              अभी कोई विचार पोस्ट नहीं है
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              पहला दिव्य विचार या दर्शन फोटो साझा करने के लिए ऊपर "+ नया विचार / फोटो पोस्ट करें" बटन पर क्लिक करें।
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-devotional text-lg font-bold text-stone-900">
                    {editingPost ? 'पोस्ट संपादित करें (Edit Post)' : 'नया विचार या फोटो पोस्ट करें'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Good thoughts, devotional quotes, or temple darshan photos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title (Optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  शीर्षक (Title) - ऐच्छिक
                </label>
                <input
                  type="text"
                  placeholder="उदा. श्री कष्टभंजन देव दिव्य सुविचार"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Vichar Content (Required) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  अच्छे विचार / संदेश (Thought or Devotional Message) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="यहाँ अपने प्रेरक सुविचार, भक्ति प्रसंग या सुंदरकांड महिमा लिखें..."
                  value={formData.thought}
                  onChange={(e) => setFormData({ ...formData, thought: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-devanagari leading-relaxed"
                />
              </div>

              {/* Image Input (Upload file or link) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  फोटो जोड़ें (Upload Photo or Paste Link)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... (Google Drive/Dropbox/Image URL)"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>Upload</span>
                  </button>
                </div>
                {formData.imageUrl && (
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-amber-200">
                    <SafeImage src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    आपका नाम (Your Name)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. रमेश भाई पटेल"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    पद / परिचय (Role / Place)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. भक्त परिवार, नौगामा"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  टैग्स (Tags, comma separated)
                </label>
                <input
                  type="text"
                  placeholder="सुविचार, हनुमानजी, सारंगपुर"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex justify-end space-x-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingPost ? 'Save Changes' : 'पोस्ट प्रकाशित करें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
