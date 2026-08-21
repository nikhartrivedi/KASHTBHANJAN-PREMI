export type UserRole = 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
}

export interface SunderkandCeremony {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:30 PM"
  endTime?: string; // e.g. "11:30 PM"
  venue: string;
  address: string;
  googleMapsUrl?: string;
  description: string;
  hostName?: string;
  hostContact?: string;
  photos: string[];
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Bhajan {
  id: string;
  title: string;
  gujaratiTitle?: string;
  hindiTitle?: string;
  category: 'Hanumanji' | 'Ramji' | 'Sunderkand Stuti & Doha' | 'Aarti' | 'Thal' | 'Dhoon' | 'Shivji' | 'Krishna';
  lyrics: string;
  description?: string;
  composer?: string;
  ragaOrScale?: string;
  dateAdded: string;
  youtubeUrl?: string;
  isPopular?: boolean;
}

export interface MandalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  bannerUrl?: string;
  photos?: string[];
  status: 'upcoming' | 'completed';
  category: 'Festival' | 'Padyatra' | 'Seva & Bhandara' | 'Sangeet Samaroh' | 'Mandal Meeting';
  attendeesCount?: number;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
}

export interface PhotoCollection {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'Sunderkand' | 'Mandal Events' | 'Shringar & Darshan' | 'Padyatra' | 'Annakshetra';
  coverPhoto: string;
  photos: PhotoItem[];
  ceremonyId?: string;
  eventId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent?: boolean;
  isPinned?: boolean;
  category: 'Sunderkand' | 'Bhajan' | 'Mandal Notice' | 'Important';
  author: string;
}

export interface AccountingTransaction {
  id: string;
  type: 'income' | 'expense';
  date: string;
  amount: number;
  category: string;
  sourceOrDonor?: string;
  description: string;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque';
  receiptNo?: string;
  voucherRef?: string;
  verifiedBy?: string;
  createdAt: string;
}

export type ActiveTab = 'home' | 'sunderkand' | 'bhajans' | 'events' | 'gallery' | 'accounting' | 'admin-hub';
