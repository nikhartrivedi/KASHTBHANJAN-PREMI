import React, { useState, useEffect } from 'react';
import { normalizeImageUrl, FALLBACK_DEVOTIONAL_IMAGES } from '../../lib/imageUtils';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  className?: string;
  alt?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = FALLBACK_DEVOTIONAL_IMAGES[0],
  className = '',
  alt = 'Kashtabhanjan Premi Darshan',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(() => normalizeImageUrl(src) || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const normalized = normalizeImageUrl(src);
    setCurrentSrc(normalized || fallbackSrc);
    setHasError(false);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to beautiful devotional Hanumanji image
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center text-stone-400">
          <ImageIcon className="w-6 h-6 opacity-40 animate-bounce" />
        </div>
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
