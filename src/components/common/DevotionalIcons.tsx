import React from 'react';

export const DiyaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-amber-500' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Diya Flame */}
    <path
      d="M12 2C11.5 4 9.5 6 9.5 8C9.5 9.38 10.62 10.5 12 10.5C13.38 10.5 14.5 9.38 14.5 8C14.5 6 12.5 4 12 2Z"
      fill="#f97316"
    />
    <path
      d="M12 4C11.7 5.2 10.8 6.5 10.8 7.6C10.8 8.3 11.3 8.8 12 8.8C12.7 8.8 13.2 8.3 13.2 7.6C13.2 6.5 12.3 5.2 12 4Z"
      fill="#fde047"
    />
    {/* Diya Base / Lamp */}
    <path
      d="M4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 11.5 19.5 11 19 11L5 11C4.5 11 4 11.5 4 12Z"
      fill="#d97706"
    />
    <path
      d="M8 20L7 22H17L16 20H8Z"
      fill="#b45309"
    />
  </svg>
);

export const GadaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-orange-600' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a4 4 0 0 1 4 4c0 1.9-1.3 3.5-3 3.9V21a1 1 0 0 1-2 0V9.9C9.3 9.5 8 7.9 8 6a4 4 0 0 1 4-4z" />
    <path d="M10 5h4" />
    <path d="M9 7h6" />
    <circle cx="12" cy="6" r="1.5" fill="currentColor" />
  </svg>
);

export const OmSymbol: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-orange-600' }) => (
  <span className={`inline-flex items-center justify-center font-bold font-devanagari select-none ${className}`}>
    ॐ
  </span>
);

export const SwastikSymbol: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-red-600' }) => (
  <span className={`inline-flex items-center justify-center font-bold font-devanagari select-none ${className}`}>
    卐
  </span>
);
