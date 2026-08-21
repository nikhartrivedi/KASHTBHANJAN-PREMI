// Utility for normalizing and handling image URLs and uploads reliably

export const FALLBACK_DEVOTIONAL_IMAGES = [
  'https://old.salangpurhanumanji.org/uploads/MobileHanumanji497_20250915113717.jpg',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
];

export const PRESET_DARSHAN_PHOTOS = [
  {
    title: 'श्री कष्टभंजन देव सारंगपुर धाम दर्शन',
    url: 'https://old.salangpurhanumanji.org/uploads/MobileHanumanji497_20250915113717.jpg'
  },
  {
    title: 'श्री कष्टभंजन देव प्रातः शृंगार दर्शन',
    url: 'https://old.salangpurhanumanji.org/uploads/MobileHanumanji497_20250915113717.jpg'
  },
  {
    title: 'महा सुंदरकांड 108 दीपक महाआरती',
    url: 'https://images.unsplash.com/photo-1609358905581-e5382c16a815?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'श्री राम-हनुमान पुष्प शृंगार',
    url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'दिव्य भजन कीर्तन एवं भक्ति मंडल',
    url: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Normalizes user-pasted image links (Google Drive, Dropbox, Imgur, PostImages, etc.)
 * into direct viewable image URLs.
 */
export function normalizeImageUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return FALLBACK_DEVOTIONAL_IMAGES[0];
  }

  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return FALLBACK_DEVOTIONAL_IMAGES[0];
  }

  // If already a Data URL (base64) or blob URL
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 1. Google Drive Links:
  // Examples:
  // https://drive.google.com/file/d/1aB2c3D4e5.../view?usp=sharing
  // https://drive.google.com/file/d/1aB2c3D4e5.../view
  // https://drive.google.com/open?id=1aB2c3D4e5...
  // https://drive.google.com/uc?id=1aB2c3D4e5...
  if (trimmed.includes('drive.google.com')) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      // lh3.googleusercontent.com is much more reliable and avoids CORS/hotlink blocks
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // 2. Dropbox Links:
  // Examples: https://www.dropbox.com/s/abcdef/photo.jpg?dl=0
  if (trimmed.includes('dropbox.com')) {
    return trimmed
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace(/[?&]dl=0/, '')
      .replace(/[?&]dl=1/, '');
  }

  // 3. Imgur Links:
  // Examples: https://imgur.com/aBcDeFg
  if (trimmed.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/)) {
    const match = trimmed.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
    if (match && match[1]) {
      return `https://i.imgur.com/${match[1]}.jpg`;
    }
  }

  // 4. Postimages Links:
  // Examples: https://postimg.cc/image/xxxx/ -> keep as direct if possible
  return trimmed;
}

/**
 * Process input image file or link: compresses file or normalizes link URL
 */
export async function processImageInput(input: File | string): Promise<string> {
  if (typeof input === 'string') {
    return normalizeImageUrl(input);
  }
  return compressAndReadFile(input);
}

/**
 * Reads a user-selected File from device and compresses it into a high-quality Data URL (Base64).
 */
export function compressAndReadFile(file: File, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate that it is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Corrupt image file'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas unavailable
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
