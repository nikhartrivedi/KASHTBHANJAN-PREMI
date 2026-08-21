import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ActiveTab,
  SunderkandCeremony,
  Bhajan,
  MandalEvent,
  PhotoCollection,
  Announcement,
  AccountingTransaction
} from '../types';
import {
  INITIAL_SUNDERKAND_CEREMONIES,
  INITIAL_BHAJANS,
  INITIAL_MANDAL_EVENTS,
  INITIAL_PHOTO_COLLECTIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACCOUNTING_TRANSACTIONS
} from '../data/initialData';

interface AppContextType {
  user: User;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdmin: boolean;
  loginAsAdmin: (password?: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;
  
  // Sunderkand
  ceremonies: SunderkandCeremony[];
  nextSunderkand: SunderkandCeremony | undefined;
  addCeremony: (ceremony: Omit<SunderkandCeremony, 'id' | 'createdAt'>) => void;
  updateCeremony: (ceremony: SunderkandCeremony) => void;
  deleteCeremony: (id: string) => void;

  // Bhajans
  bhajans: Bhajan[];
  addBhajan: (bhajan: Omit<Bhajan, 'id' | 'dateAdded'>) => void;
  updateBhajan: (bhajan: Bhajan) => void;
  deleteBhajan: (id: string) => void;

  // Events
  events: MandalEvent[];
  addEvent: (event: Omit<MandalEvent, 'id'>) => void;
  updateEvent: (event: MandalEvent) => void;
  deleteEvent: (id: string) => void;

  // Gallery
  photoCollections: PhotoCollection[];
  addPhotoCollection: (collection: Omit<PhotoCollection, 'id'>) => void;
  updatePhotoCollection: (collection: PhotoCollection) => void;
  deletePhotoCollection: (id: string) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;

  // Accounting (Admin only)
  transactions: AccountingTransaction[];
  addTransaction: (transaction: Omit<AccountingTransaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (transaction: AccountingTransaction) => void;
  deleteTransaction: (id: string) => void;
  
  // Global search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Reset to initial demo data
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'kp_user',
  CEREMONIES: 'kp_ceremonies_v1',
  BHAJANS: 'kp_bhajans_v1',
  EVENTS: 'kp_events_v1',
  GALLERY: 'kp_gallery_v1',
  ANNOUNCEMENTS: 'kp_announcements_v1',
  TRANSACTIONS: 'kp_transactions_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // default to guest
      }
    }
    return {
      id: 'guest-1',
      name: 'Devotee Guest',
      role: 'guest'
    };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Data states with localStorage persistence
  const [ceremonies, setCeremonies] = useState<SunderkandCeremony[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CEREMONIES);
    return saved ? JSON.parse(saved) : INITIAL_SUNDERKAND_CEREMONIES;
  });

  const [bhajans, setBhajans] = useState<Bhajan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BHAJANS);
    return saved ? JSON.parse(saved) : INITIAL_BHAJANS;
  });

  const [events, setEvents] = useState<MandalEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_MANDAL_EVENTS;
  });

  const [photoCollections, setPhotoCollections] = useState<PhotoCollection[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
    return saved ? JSON.parse(saved) : INITIAL_PHOTO_COLLECTIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [transactions, setTransactions] = useState<AccountingTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTING_TRANSACTIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CEREMONIES, JSON.stringify(ceremonies));
  }, [ceremonies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BHAJANS, JSON.stringify(bhajans));
  }, [bhajans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(photoCollections));
  }, [photoCollections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Auth methods
  const isAdmin = user.role === 'admin';

  const loginAsAdmin = (password?: string) => {
    // Demo admin authentication - supports "admin" or "kashta123" or default one-click
    if (!password || password.trim().toLowerCase() === 'kashta123' || password.trim().toLowerCase() === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Mandal Administrator',
        role: 'admin',
        email: 'admin@kashtabhanjanpremi.org',
        phone: '+91 98250 99999'
      };
      setUser(adminUser);
      setIsAuthModalOpen(false);
      showToast('Jai Kashtabhanjan Dev! Admin Login Successful');
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      name: 'Devotee Guest',
      role: 'guest'
    };
    setUser(guestUser);
    setIsAuthModalOpen(false);
    showToast('Browsing as Devotee Guest');
  };

  const logout = () => {
    setUser({
      id: 'guest-1',
      name: 'Devotee Guest',
      role: 'guest'
    });
    if (activeTab === 'accounting' || activeTab === 'admin-hub') {
      setActiveTab('home');
    }
    showToast('Logged out successfully');
  };

  // Next Sunderkand helper
  const nextSunderkand = ceremonies
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Sunderkand operations
  const addCeremony = (ceremonyData: Omit<SunderkandCeremony, 'id' | 'createdAt'>) => {
    const newCeremony: SunderkandCeremony = {
      ...ceremonyData,
      id: 'sund-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCeremonies((prev) => [newCeremony, ...prev]);
    showToast('Sunderkand ceremony created successfully!');
  };

  const updateCeremony = (ceremony: SunderkandCeremony) => {
    setCeremonies((prev) => prev.map((c) => (c.id === ceremony.id ? ceremony : c)));
    showToast('Ceremony details updated!');
  };

  const deleteCeremony = (id: string) => {
    setCeremonies((prev) => prev.filter((c) => c.id !== id));
    showToast('Ceremony removed.');
  };

  // Bhajan operations
  const addBhajan = (bhajanData: Omit<Bhajan, 'id' | 'dateAdded'>) => {
    const newBhajan: Bhajan = {
      ...bhajanData,
      id: 'bhajan-' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBhajans((prev) => [newBhajan, ...prev]);
    showToast('New Bhajan lyrics published!');
  };

  const updateBhajan = (bhajan: Bhajan) => {
    setBhajans((prev) => prev.map((b) => (b.id === bhajan.id ? bhajan : b)));
    showToast('Bhajan updated successfully!');
  };

  const deleteBhajan = (id: string) => {
    setBhajans((prev) => prev.filter((b) => b.id !== id));
    showToast('Bhajan deleted.');
  };

  // Event operations
  const addEvent = (eventData: Omit<MandalEvent, 'id'>) => {
    const newEvent: MandalEvent = {
      ...eventData,
      id: 'event-' + Date.now()
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast('Mandal event added!');
  };

  const updateEvent = (event: MandalEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    showToast('Event updated!');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Event deleted.');
  };

  // Photo gallery operations
  const addPhotoCollection = (collectionData: Omit<PhotoCollection, 'id'>) => {
    const newCollection: PhotoCollection = {
      ...collectionData,
      id: 'album-' + Date.now()
    };
    setPhotoCollections((prev) => [newCollection, ...prev]);
    showToast('Photo album uploaded!');
  };

  const updatePhotoCollection = (collection: PhotoCollection) => {
    setPhotoCollections((prev) => prev.map((col) => (col.id === collection.id ? collection : col)));
    showToast('Gallery album updated!');
  };

  const deletePhotoCollection = (id: string) => {
    setPhotoCollections((prev) => prev.filter((col) => col.id !== id));
    showToast('Photo album deleted.');
  };

  // Announcement operations
  const addAnnouncement = (annData: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: 'ann-' + Date.now()
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Announcement published!');
  };

  const updateAnnouncement = (ann: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? ann : a)));
    showToast('Announcement updated!');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted.');
  };

  // Accounting operations (Admin only)
  const addTransaction = (trxData: Omit<AccountingTransaction, 'id' | 'createdAt'>) => {
    if (!isAdmin) {
      showToast('Permission denied: Admin role required for accounting');
      return;
    }
    const newTrx: AccountingTransaction = {
      ...trxData,
      id: 'acc-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTrx, ...prev]);
    showToast(`${trxData.type === 'income' ? 'Income' : 'Expense'} entry recorded!`);
  };

  const updateTransaction = (trx: AccountingTransaction) => {
    if (!isAdmin) return;
    setTransactions((prev) => prev.map((t) => (t.id === trx.id ? trx : t)));
    showToast('Transaction updated!');
  };

  const deleteTransaction = (id: string) => {
    if (!isAdmin) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaction removed.');
  };

  const resetToDefaults = () => {
    setCeremonies(INITIAL_SUNDERKAND_CEREMONIES);
    setBhajans(INITIAL_BHAJANS);
    setEvents(INITIAL_MANDAL_EVENTS);
    setPhotoCollections(INITIAL_PHOTO_COLLECTIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setTransactions(INITIAL_ACCOUNTING_TRANSACTIONS);
    showToast('Mandal data reset to authentic defaults.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        isAdmin,
        loginAsAdmin,
        loginAsGuest,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isApkModalOpen,
        setIsApkModalOpen,
        ceremonies,
        nextSunderkand,
        addCeremony,
        updateCeremony,
        deleteCeremony,
        bhajans,
        addBhajan,
        updateBhajan,
        deleteBhajan,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        photoCollections,
        addPhotoCollection,
        updatePhotoCollection,
        deletePhotoCollection,
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
