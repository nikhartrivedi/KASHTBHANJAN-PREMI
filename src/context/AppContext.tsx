import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  User,
  ActiveTab,
  SunderkandCeremony,
  Bhajan,
  Announcement,
  CommunityPost,
  AccountingTransaction
} from '../types';
import {
  INITIAL_SUNDERKAND_CEREMONIES,
  INITIAL_BHAJANS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_POSTS,
  INITIAL_TRANSACTIONS
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
  addCeremony: (ceremony: Omit<SunderkandCeremony, 'id' | 'createdAt'>) => Promise<void>;
  updateCeremony: (ceremony: SunderkandCeremony) => Promise<void>;
  deleteCeremony: (id: string) => Promise<void>;

  // Bhajans
  bhajans: Bhajan[];
  addBhajan: (bhajan: Omit<Bhajan, 'id' | 'dateAdded'>) => Promise<void>;
  updateBhajan: (bhajan: Bhajan) => Promise<void>;
  deleteBhajan: (id: string) => Promise<void>;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
  updateAnnouncement: (announcement: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Community Posts / Acche Vichar
  posts: CommunityPost[];
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt'>) => Promise<void>;
  updatePost: (post: CommunityPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;

  // Accounting Transactions (Admin Only)
  transactions: AccountingTransaction[];
  addTransaction: (transaction: Omit<AccountingTransaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (transaction: AccountingTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Global search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Cloud status
  isCloudSynced: boolean;

  // Reset to initial demo data
  resetToDefaults: () => Promise<void>;

  // Permanent Backup and Restore
  exportAllData: () => void;
  importAllData: (jsonData: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'kp_user_v2',
  CEREMONIES: 'kp_ceremonies_v2',
  BHAJANS: 'kp_bhajans_v2',
  ANNOUNCEMENTS: 'kp_announcements_v2',
  POSTS: 'kp_posts_v2',
  TRANSACTIONS: 'kp_transactions_v2',
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Data states with fallback to initial data
  const [ceremonies, setCeremonies] = useState<SunderkandCeremony[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CEREMONIES);
    return saved ? JSON.parse(saved) : INITIAL_SUNDERKAND_CEREMONIES;
  });

  const [bhajans, setBhajans] = useState<Bhajan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BHAJANS);
    return saved ? JSON.parse(saved) : INITIAL_BHAJANS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [transactions, setTransactions] = useState<AccountingTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
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
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Real-time Cloud Sync with Firebase Firestore
  useEffect(() => {
    // Sunderkand Ceremonies Listener
    const unsubCeremonies = onSnapshot(
      collection(db, 'ceremonies'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as SunderkandCeremony[];
          setCeremonies(list);
          setIsCloudSynced(true);
        } else {
          // Initialize cloud collection with seed data if empty
          INITIAL_SUNDERKAND_CEREMONIES.forEach(async (c) => {
            await setDoc(doc(db, 'ceremonies', c.id), c);
          });
        }
      },
      (error) => {
        console.warn('Firestore Ceremonies snapshot error:', error);
      }
    );

    // Bhajans Listener
    const unsubBhajans = onSnapshot(
      collection(db, 'bhajans'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Bhajan[];
          setBhajans(list);
          setIsCloudSynced(true);
        } else {
          INITIAL_BHAJANS.forEach(async (b) => {
            await setDoc(doc(db, 'bhajans', b.id), b);
          });
        }
      },
      (error) => {
        console.warn('Firestore Bhajans snapshot error:', error);
      }
    );

    // Announcements Listener
    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Announcement[];
          setAnnouncements(list);
          setIsCloudSynced(true);
        } else {
          INITIAL_ANNOUNCEMENTS.forEach(async (a) => {
            await setDoc(doc(db, 'announcements', a.id), a);
          });
        }
      },
      (error) => {
        console.warn('Firestore Announcements snapshot error:', error);
      }
    );

    // Posts Listener (Acche Vichar & Photos)
    const unsubPosts = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as CommunityPost[];
          setPosts(list);
          setIsCloudSynced(true);
        } else {
          INITIAL_POSTS.forEach(async (p) => {
            await setDoc(doc(db, 'posts', p.id), p);
          });
        }
      },
      (error) => {
        console.warn('Firestore Posts snapshot error:', error);
      }
    );

    // Transactions Listener (Accounting - Aavak & Jaavak)
    const unsubTransactions = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as AccountingTransaction[];
          setTransactions(list);
          setIsCloudSynced(true);
        } else {
          INITIAL_TRANSACTIONS.forEach(async (t) => {
            await setDoc(doc(db, 'transactions', t.id), t);
          });
        }
      },
      (error) => {
        console.warn('Firestore Transactions snapshot error:', error);
      }
    );

    return () => {
      unsubCeremonies();
      unsubBhajans();
      unsubAnnouncements();
      unsubPosts();
      unsubTransactions();
    };
  }, []);

  // Auth methods
  const isAdmin = user.role === 'admin';

  const loginAsAdmin = (password?: string): boolean => {
    if (password === 'Premi@7252') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Mandal Admin',
        role: 'admin',
        phone: '+91 77329 43851'
      };
      setUser(adminUser);
      setIsAuthModalOpen(false);
      showToast('Admin logged in successfully!');
      return true;
    }
    showToast('अमान्य एडमिन पासवर्ड (Invalid Admin Password)');
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
    showToast('Welcome Devotee!');
  };

  const logout = () => {
    setUser({
      id: 'guest-' + Date.now(),
      name: 'Devotee Guest',
      role: 'guest'
    });
    showToast('Logged out.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Next upcoming Sunderkand calculation
  const nextSunderkand = ceremonies
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Sunderkand operations with Cloud Firestore + Local Fallback
  const addCeremony = async (ceremonyData: Omit<SunderkandCeremony, 'id' | 'createdAt'>) => {
    const newId = 'sund-' + Date.now();
    const newCeremony: SunderkandCeremony = {
      ...ceremonyData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    // Optimistic local update
    setCeremonies((prev) => [newCeremony, ...prev]);
    showToast('Sunderkand ceremony scheduled & saving to Cloud...');

    try {
      await setDoc(doc(db, 'ceremonies', newId), newCeremony);
      showToast('☁️ Sunderkand saved to Google Firebase Firestore!');
    } catch (err) {
      console.error('Firestore addCeremony error:', err);
    }
  };

  const updateCeremony = async (ceremony: SunderkandCeremony) => {
    setCeremonies((prev) => prev.map((c) => (c.id === ceremony.id ? ceremony : c)));
    showToast('Sunderkand details updated!');

    try {
      await setDoc(doc(db, 'ceremonies', ceremony.id), ceremony);
    } catch (err) {
      console.error('Firestore updateCeremony error:', err);
    }
  };

  const deleteCeremony = async (id: string) => {
    setCeremonies((prev) => prev.filter((c) => c.id !== id));
    showToast('Sunderkand ceremony removed.');

    try {
      await deleteDoc(doc(db, 'ceremonies', id));
    } catch (err) {
      console.error('Firestore deleteCeremony error:', err);
    }
  };

  // Bhajan operations with Cloud Firestore
  const addBhajan = async (bhajanData: Omit<Bhajan, 'id' | 'dateAdded'>) => {
    const newId = 'bhajan-' + Date.now();
    const newBhajan: Bhajan = {
      ...bhajanData,
      id: newId,
      dateAdded: new Date().toISOString()
    };
    setBhajans((prev) => [newBhajan, ...prev]);
    showToast('Bhajan added to library!');

    try {
      await setDoc(doc(db, 'bhajans', newId), newBhajan);
      showToast('☁️ Bhajan synced to Google Firestore!');
    } catch (err) {
      console.error('Firestore addBhajan error:', err);
    }
  };

  const updateBhajan = async (bhajan: Bhajan) => {
    setBhajans((prev) => prev.map((b) => (b.id === bhajan.id ? bhajan : b)));
    showToast('Bhajan updated successfully!');

    try {
      await setDoc(doc(db, 'bhajans', bhajan.id), bhajan);
    } catch (err) {
      console.error('Firestore updateBhajan error:', err);
    }
  };

  const deleteBhajan = async (id: string) => {
    setBhajans((prev) => prev.filter((b) => b.id !== id));
    showToast('Bhajan deleted.');

    try {
      await deleteDoc(doc(db, 'bhajans', id));
    } catch (err) {
      console.error('Firestore deleteBhajan error:', err);
    }
  };

  // Announcement operations with Cloud Firestore
  const addAnnouncement = async (annData: Omit<Announcement, 'id'>) => {
    const newId = 'ann-' + Date.now();
    const newAnn: Announcement = {
      ...annData,
      id: newId
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Announcement published!');

    try {
      await setDoc(doc(db, 'announcements', newId), newAnn);
      showToast('☁️ Notice published to Google Firestore!');
    } catch (err) {
      console.error('Firestore addAnnouncement error:', err);
    }
  };

  const updateAnnouncement = async (ann: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? ann : a)));
    showToast('Announcement updated!');

    try {
      await setDoc(doc(db, 'announcements', ann.id), ann);
    } catch (err) {
      console.error('Firestore updateAnnouncement error:', err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted.');

    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.error('Firestore deleteAnnouncement error:', err);
    }
  };

  // Community Posts / Acche Vichar CRUD
  const addPost = async (postData: Omit<CommunityPost, 'id' | 'createdAt'>) => {
    const newId = 'post-' + Date.now();
    const newPost: CommunityPost = {
      ...postData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('पोस्ट सफलतापूर्वक प्रकाशित हो गई!');

    try {
      await setDoc(doc(db, 'posts', newId), newPost);
      showToast('☁️ Post synced to Google Firestore!');
    } catch (err) {
      console.error('Firestore addPost error:', err);
    }
  };

  const updatePost = async (post: CommunityPost) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    showToast('पोस्ट अपडेट हो गई!');

    try {
      await setDoc(doc(db, 'posts', post.id), post);
    } catch (err) {
      console.error('Firestore updatePost error:', err);
    }
  };

  const deletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('पोस्ट हटा दी गई.');

    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (err) {
      console.error('Firestore deletePost error:', err);
    }
  };

  const likePost = async (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    const updatedPost = { ...target, likesCount: (target.likesCount || 0) + 1 };
    setPosts((prev) => prev.map((p) => (p.id === id ? updatedPost : p)));

    try {
      await setDoc(doc(db, 'posts', id), updatedPost);
    } catch (err) {
      console.error('Firestore likePost error:', err);
    }
  };

  // Accounting Transactions (Admin Only) CRUD
  const addTransaction = async (txData: Omit<AccountingTransaction, 'id' | 'createdAt'>) => {
    const newId = 'acc-' + Date.now();
    const newTx: AccountingTransaction = {
      ...txData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('लेखा-जोखा (Transaction) सफलतापूर्वक दर्ज किया गया!');

    try {
      await setDoc(doc(db, 'transactions', newId), newTx);
      showToast('☁️ Transaction saved in Firestore!');
    } catch (err) {
      console.error('Firestore addTransaction error:', err);
    }
  };

  const updateTransaction = async (tx: AccountingTransaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)));
    showToast('लेनदेन विवरण अपडेट हो गया!');

    try {
      await setDoc(doc(db, 'transactions', tx.id), tx);
    } catch (err) {
      console.error('Firestore updateTransaction error:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('लेनदेन रिकॉर्ड हटा दिया गया.');

    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (err) {
      console.error('Firestore deleteTransaction error:', err);
    }
  };

  const resetToDefaults = async () => {
    if (typeof window !== 'undefined') {
      const confirmReset = window.confirm(
        'चेतावनी (Warning): क्या आप वाकई सारा डेटा मूल डिफ़ॉल्ट पर रीसेट करना चाहते हैं? आपके द्वारा किए गए सभी कस्टम बदलाव मिट जाएंगे।'
      );
      if (!confirmReset) return;
    }
    setCeremonies(INITIAL_SUNDERKAND_CEREMONIES);
    setBhajans(INITIAL_BHAJANS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPosts(INITIAL_POSTS);
    setTransactions(INITIAL_TRANSACTIONS);

    try {
      // Sync defaults to Cloud Firestore
      const batch = writeBatch(db);
      INITIAL_SUNDERKAND_CEREMONIES.forEach((c) => {
        batch.set(doc(db, 'ceremonies', c.id), c);
      });
      INITIAL_BHAJANS.forEach((b) => {
        batch.set(doc(db, 'bhajans', b.id), b);
      });
      INITIAL_ANNOUNCEMENTS.forEach((a) => {
        batch.set(doc(db, 'announcements', a.id), a);
      });
      INITIAL_POSTS.forEach((p) => {
        batch.set(doc(db, 'posts', p.id), p);
      });
      INITIAL_TRANSACTIONS.forEach((t) => {
        batch.set(doc(db, 'transactions', t.id), t);
      });
      await batch.commit();
      showToast('Mandal data reset to authentic defaults in Cloud Firestore.');
    } catch (err) {
      console.error('Reset batch commit error:', err);
      showToast('Mandal data reset locally.');
    }
  };

  // Export full application state as downloadable JSON backup
  const exportAllData = () => {
    try {
      const backupPayload = {
        mandal: 'SHREE KASHTBHANJAN PREMI, Nougama, Banswara',
        exportedAt: new Date().toISOString(),
        version: '3.0 (Firebase Firestore Cloud Sync)',
        data: {
          ceremonies,
          bhajans,
          announcements,
          posts,
          transactions
        }
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `Kashtabhanjan_Premi_Cloud_Backup_${new Date().toISOString().split('T')[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('डेटा बैकअप फ़ाइल सफलतापूर्वक डाउनलोड हो गई!');
    } catch (err) {
      console.error('Export error', err);
      showToast('बैकअप डाउनलोड करने में त्रुटि हुई');
    }
  };

  // Import JSON backup and apply immediately to both local and Firestore
  const importAllData = async (jsonData: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonData);
      const payload = parsed.data || parsed;

      const batch = writeBatch(db);

      if (payload.ceremonies && Array.isArray(payload.ceremonies)) {
        setCeremonies(payload.ceremonies);
        localStorage.setItem(STORAGE_KEYS.CEREMONIES, JSON.stringify(payload.ceremonies));
        payload.ceremonies.forEach((c: SunderkandCeremony) => {
          if (c.id) batch.set(doc(db, 'ceremonies', c.id), c);
        });
      }
      if (payload.bhajans && Array.isArray(payload.bhajans)) {
        setBhajans(payload.bhajans);
        localStorage.setItem(STORAGE_KEYS.BHAJANS, JSON.stringify(payload.bhajans));
        payload.bhajans.forEach((b: Bhajan) => {
          if (b.id) batch.set(doc(db, 'bhajans', b.id), b);
        });
      }
      if (payload.announcements && Array.isArray(payload.announcements)) {
        setAnnouncements(payload.announcements);
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(payload.announcements));
        payload.announcements.forEach((a: Announcement) => {
          if (a.id) batch.set(doc(db, 'announcements', a.id), a);
        });
      }
      if (payload.posts && Array.isArray(payload.posts)) {
        setPosts(payload.posts);
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(payload.posts));
        payload.posts.forEach((p: CommunityPost) => {
          if (p.id) batch.set(doc(db, 'posts', p.id), p);
        });
      }
      if (payload.transactions && Array.isArray(payload.transactions)) {
        setTransactions(payload.transactions);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(payload.transactions));
        payload.transactions.forEach((t: AccountingTransaction) => {
          if (t.id) batch.set(doc(db, 'transactions', t.id), t);
        });
      }

      await batch.commit();
      showToast('बैकअप डेटा Google Firebase Firestore पर सिंक और सुरक्षित हो गया!');
      return true;
    } catch (err) {
      console.error('Import parse error', err);
      showToast('अमान्य बैकअप फ़ाइल (Invalid backup JSON)');
      return false;
    }
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
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        posts,
        addPost,
        updatePost,
        deletePost,
        likePost,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        isCloudSynced,
        resetToDefaults,
        exportAllData,
        importAllData
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
