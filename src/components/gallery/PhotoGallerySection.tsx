import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhotoCollection, PhotoItem } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  MapPin,
  Flame,
  Sparkles,
  Download,
  Share2
} from 'lucide-react';

export const PhotoGallerySection: React.FC = () => {
  const { photoCollections, addPhotoCollection, updatePhotoCollection, deletePhotoCollection, isAdmin, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoCollection | null>(null);

  // Lightbox modal
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; caption?: string; albumTitle: string } | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [activeLightboxAlbum, setActiveLightboxAlbum] = useState<PhotoCollection | null>(null);

  // Admin Add Album Modal
  const [isAddAlbumModalOpen, setIsAddAlbumModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: 'Ahmedabad',
    category: 'Sunderkand' as PhotoCollection['category'],
    coverPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    newPhotoUrl: '',
    photos: [
      { id: '1', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80', caption: 'Sunderkand recitation by devotees' },
      { id: '2', url: 'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=1200&q=80', caption: '108 Deepak Maha Aarti' }
    ] as PhotoItem[]
  });

  const categories = ['All', 'Sunderkand', 'Mandal Events', 'Shringar & Darshan', 'Padyatra', 'Annakshetra'];

  const openLightbox = (album: PhotoCollection, index: number) => {
    setActiveLightboxAlbum(album);
    setLightboxIndex(index);
    setLightboxPhoto({
      url: album.photos[index].url,
      caption: album.photos[index].caption,
      albumTitle: album.title
    });
  };

  const handleNextPhoto = () => {
    if (!activeLightboxAlbum) return;
    const nextIdx = (lightboxIndex + 1) % activeLightboxAlbum.photos.length;
    setLightboxIndex(nextIdx);
    setLightboxPhoto({
      url: activeLightboxAlbum.photos[nextIdx].url,
      caption: activeLightboxAlbum.photos[nextIdx].caption,
      albumTitle: activeLightboxAlbum.title
    });
  };

  const handlePrevPhoto = () => {
    if (!activeLightboxAlbum) return;
    const prevIdx = (lightboxIndex - 1 + activeLightboxAlbum.photos.length) % activeLightboxAlbum.photos.length;
    setLightboxIndex(prevIdx);
    setLightboxPhoto({
      url: activeLightboxAlbum.photos[prevIdx].url,
      caption: activeLightboxAlbum.photos[prevIdx].caption,
      albumTitle: activeLightboxAlbum.title
    });
  };

  const handleAddPhotoToNewAlbum = () => {
    if (albumForm.newPhotoUrl.trim()) {
      setAlbumForm((prev) => ({
        ...prev,
        photos: [
          ...prev.photos,
          {
            id: 'p-' + Date.now(),
            url: prev.newPhotoUrl.trim(),
            caption: 'Devotional darshan photo'
          }
        ],
        newPhotoUrl: ''
      }));
    }
  };

  const handleCreateAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title || albumForm.photos.length === 0) {
      showToast('Please enter an album title and at least one photo');
      return;
    }

    addPhotoCollection({
      title: albumForm.title,
      date: albumForm.date,
      location: albumForm.location,
      category: albumForm.category,
      coverPhoto: albumForm.photos[0]?.url || albumForm.coverPhoto,
      photos: albumForm.photos
    });

    setIsAddAlbumModalOpen(false);
  };

  const filteredAlbums = photoCollections.filter((album) => {
    return selectedCategory === 'All' || album.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ImageIcon className="w-4 h-4" />
            <span>Devotional Darshan & Ceremony Gallery</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900">
            Sunderkand & Mandal Photos
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse albums grouped by ceremony, deepotsav aarti, Sarangpur padyatra, and annakshetra seva.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddAlbumModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo Album</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-amber-50 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-3xl border border-amber-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Cover Photo */}
              <div
                onClick={() => openLightbox(album, 0)}
                className="aspect-16/10 overflow-hidden bg-stone-100 relative cursor-pointer"
              >
                <img
                  src={album.coverPhoto}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Album ({album.photos.length})</span>
                  </span>
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {album.category}
                </div>

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  <span>{album.photos.length} Photos</span>
                </div>
              </div>

              {/* Album Details */}
              <div className="p-5 space-y-3">
                <div>
                  <h3
                    onClick={() => openLightbox(album, 0)}
                    className="font-serif-devotional text-lg font-bold text-stone-900 group-hover:text-orange-700 transition-colors cursor-pointer"
                  >
                    {album.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-stone-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      {album.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-600" />
                      {album.location}
                    </span>
                  </div>
                </div>

                {/* Thumbnails row */}
                <div className="flex gap-1.5 overflow-hidden rounded-xl pt-1">
                  {album.photos.slice(0, 4).map((p, idx) => (
                    <div
                      key={p.id || idx}
                      onClick={() => openLightbox(album, idx)}
                      className="w-1/4 aspect-square rounded-lg overflow-hidden bg-stone-100 cursor-pointer border border-stone-200 hover:opacity-80 transition-opacity"
                    >
                      <img src={p.url} alt="thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Delete Action */}
            {isAdmin && (
              <div className="p-4 pt-0 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete album "${album.title}"?`)) {
                      deletePhotoCollection(album.id);
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-medium p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Album</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxPhoto && activeLightboxAlbum && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <h3 className="font-serif-devotional text-base sm:text-lg font-bold">
                {activeLightboxAlbum.title}
              </h3>
              <p className="text-xs text-amber-200/80">
                Photo {lightboxIndex + 1} of {activeLightboxAlbum.photos.length} • {activeLightboxAlbum.location} ({activeLightboxAlbum.date})
              </p>
            </div>

            <button
              onClick={() => setLightboxPhoto(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo View with Navigation arrows */}
          <div className="relative flex-1 flex items-center justify-center py-4">
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 z-10 p-3 bg-black/60 hover:bg-orange-600 text-white rounded-full transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[75vh] flex flex-col items-center justify-center">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption || 'Ceremony photo'}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              {lightboxPhoto.caption && (
                <p className="text-stone-300 text-xs sm:text-sm mt-3 text-center bg-black/40 px-4 py-1.5 rounded-full border border-white/10">
                  {lightboxPhoto.caption}
                </p>
              )}
            </div>

            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 z-10 p-3 bg-black/60 hover:bg-orange-600 text-white rounded-full transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {activeLightboxAlbum.photos.map((p, idx) => (
              <button
                key={p.id || idx}
                onClick={() => openLightbox(activeLightboxAlbum, idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === lightboxIndex ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN ADD PHOTO ALBUM MODAL */}
      {isAddAlbumModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-700 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-devotional text-xl font-bold">
                  Upload Photo Collection
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Group ceremony or festival photos into an album
                </p>
              </div>
              <button
                onClick={() => setIsAddAlbumModalOpen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbumSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Album / Ceremony Title *
                </label>
                <input
                  type="text"
                  required
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  placeholder="e.g. 52nd Sunderkand Deepotsav Darshan"
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
                    value={albumForm.date}
                    onChange={(e) => setAlbumForm({ ...albumForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={albumForm.location}
                    onChange={(e) => setAlbumForm({ ...albumForm, location: e.target.value })}
                    placeholder="Ahmedabad"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={albumForm.category}
                    onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value as PhotoCollection['category'] })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  >
                    <option value="Sunderkand">Sunderkand</option>
                    <option value="Mandal Events">Mandal Events</option>
                    <option value="Shringar & Darshan">Shringar & Darshan</option>
                    <option value="Padyatra">Padyatra</option>
                    <option value="Annakshetra">Annakshetra</option>
                  </select>
                </div>
              </div>

              {/* Photos List in Album */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Add Photos (Image URLs)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={albumForm.newPhotoUrl}
                    onChange={(e) => setAlbumForm({ ...albumForm, newPhotoUrl: e.target.value })}
                    placeholder="Paste image URL..."
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-orange-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoToNewAlbum}
                    className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900"
                  >
                    + Add
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-3">
                  {albumForm.photos.map((photo, i) => (
                    <div key={photo.id || i} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-300">
                      <img src={photo.url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAlbumForm({ ...albumForm, photos: albumForm.photos.filter((_, idx) => idx !== i) })}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddAlbumModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  Publish Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
