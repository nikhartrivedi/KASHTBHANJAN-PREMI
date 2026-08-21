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

  // Reset / Clear Data
  resetToDefaults: () => Promise<void>;

  // Manual Save All to Cloud Button for Admin
  saveAllToCloud: () => Promise<boolean>;

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

  // Real-time Cloud Sync with Firebase Firestore & Automatic Seeding
  useEffect(() => {
    let isMounted = true;

    // Helper to auto-seed initial collection if cloud is empty
    const autoSeedIfEmpty = async (colName: string, initialList: any[]) => {
      try {
        const snap = await getDocs(collection(db, colName));
        if (snap.empty && initialList && initialList.length > 0) {
          const batch = writeBatch(db);
          initialList.forEach((item) => {
            const itemDoc = doc(db, colName, item.id);
            batch.set(itemDoc, item);
          });
          await batch.commit();
          console.log(`Cloud auto-seeded ${colName} with ${initialList.length} items.`);
        }
      } catch (err) {
        console.warn(`Error checking/seeding ${colName}:`, err);
      }
    };

    // Auto-seed all default data if Firestore is freshly initialized
    autoSeedIfEmpty('bhajans', INITIAL_BHAJANS);
    autoSeedIfEmpty('ceremonies', INITIAL_SUNDERKAND_CEREMONIES);
    autoSeedIfEmpty('announcements', INITIAL_ANNOUNCEMENTS);
    autoSeedIfEmpty('posts', INITIAL_POSTS);
    autoSeedIfEmpty('transactions', INITIAL_TRANSACTIONS);

    // Sunderkand Ceremonies Listener
    const unsubCeremonies = onSnapshot(
      collection(db, 'ceremonies'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as SunderkandCeremony[];
          setCeremonies(list);
        }
        setIsCloudSynced(true);
      },
      (error) => {
        console.warn('Firestore Ceremonies snapshot error:', error);
      }
    );

    // Bhajans Listener
    const unsubBhajans = onSnapshot(
      collection(db, 'bhajans'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Bhajan[];
          setBhajans(list);
        }
        setIsCloudSynced(true);
      },
      (error) => {
        console.warn('Firestore Bhajans snapshot error:', error);
      }
    );

    // Announcements Listener
    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as Announcement[];
          setAnnouncements(list);
        }
        setIsCloudSynced(true);
      },
      (error) => {
        console.warn('Firestore Announcements snapshot error:', error);
      }
    );

    // Posts Listener (Acche Vichar & Photos)
    const unsubPosts = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as CommunityPost[];
          setPosts(list);
        }
        setIsCloudSynced(true);
      },
      (error) => {
        console.warn('Firestore Posts snapshot error:', error);
      }
    );

    // Transactions Listener (Accounting - Aavak & Jaavak)
    const unsubTransactions = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          })) as AccountingTransaction[];
          setTransactions(list);
        }
        setIsCloudSynced(true);
      },
      (error) => {
        console.warn('Firestore Transactions snapshot error:', error);
      }
    );

    return () => {
      isMounted = false;
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

    try {
      await setDoc(doc(db, 'ceremonies', newId), newCeremony);
      showToast('✅ सुंदरकांड पाठ सफलतापूर्वक दर्ज व ऑटो-सेव हो गया (Saved to Cloud)');
    } catch (err) {
      console.error('Firestore addCeremony error:', err);
      showToast('✅ लोकल सुरक्षित हो गया (क्लाउड सिंक प्रगति पर)');
    }
  };

  const updateCeremony = async (ceremony: SunderkandCeremony) => {
    setCeremonies((prev) => prev.map((c) => (c.id === ceremony.id ? ceremony : c)));

    try {
      await setDoc(doc(db, 'ceremonies', ceremony.id), ceremony);
      showToast('✅ सुंदरकांड विवरण अपडेट व ऑटो-सेव हो गया');
    } catch (err) {
      console.error('Firestore updateCeremony error:', err);
    }
  };

  const deleteCeremony = async (id: string) => {
    if (!isAdmin) {
      showToast('❌ केवल एडमिन ही डिलीट कर सकते हैं (Only Admin can delete)');
      return;
    }
    setCeremonies((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteDoc(doc(db, 'ceremonies', id));
      showToast('🗑️ सुंदरकांड रिकॉर्ड सफलतापूर्वक हटा दिया गया');
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

    try {
      await setDoc(doc(db, 'bhajans', newId), newBhajan);
      showToast('✅ भजन लाइब्रेरी में जुड़ गया और Google Cloud पर ऑटो-सेव हो गया!');
    } catch (err) {
      console.error('Firestore addBhajan error:', err);
      showToast('✅ भजन लोकल में सुरक्षित सेव हो गया');
    }
  };

  const updateBhajan = async (bhajan: Bhajan) => {
    setBhajans((prev) => prev.map((b) => (b.id === bhajan.id ? bhajan : b)));

    try {
      await setDoc(doc(db, 'bhajans', bhajan.id), bhajan);
      showToast('✅ भजन अपडेट व सुरक्षित ऑटो-सेव हो गया');
    } catch (err) {
      console.error('Firestore updateBhajan error:', err);
    }
  };

  const deleteBhajan = async (id: string) => {
    if (!isAdmin) {
      showToast('❌ केवल एडमिन ही भजन डिलीट कर सकते हैं (Only Admin can delete)');
      return;
    }
    setBhajans((prev) => prev.filter((b) => b.id !== id));

    try {
      await deleteDoc(doc(db, 'bhajans', id));
      showToast('🗑️ भजन संग्रह से हटा दिया गया');
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

    try {
      await setDoc(doc(db, 'announcements', newId), newAnn);
      showToast('✅ सूचना प्रकाशित व Google Cloud पर ऑटो-सेव हो गई');
    } catch (err) {
      console.error('Firestore addAnnouncement error:', err);
    }
  };

  const updateAnnouncement = async (ann: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? ann : a)));

    try {
      await setDoc(doc(db, 'announcements', ann.id), ann);
      showToast('✅ सूचना अपडेट व ऑटो-सेव हो गई');
    } catch (err) {
      console.error('Firestore updateAnnouncement error:', err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!isAdmin) {
      showToast('❌ केवल एडमिन ही सूचना हटा सकते हैं');
      return;
    }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteDoc(doc(db, 'announcements', id));
      showToast('🗑️ सूचना हटा दी गई');
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

    try {
      await setDoc(doc(db, 'posts', newId), newPost);
      showToast('✅ पोस्ट प्रकाशित और क्लाउड पर ऑटो-सेव हो गई!');
    } catch (err) {
      console.error('Firestore addPost error:', err);
    }
  };

  const updatePost = async (post: CommunityPost) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));

    try {
      await setDoc(doc(db, 'posts', post.id), post);
      showToast('✅ पोस्ट अपडेट व ऑटो-सेव हो गई');
    } catch (err) {
      console.error('Firestore updatePost error:', err);
    }
  };

  const deletePost = async (id: string) => {
    const postToDelete = posts.find((p) => p.id === id);
    if (!isAdmin && postToDelete && postToDelete.authorRole !== 'admin') {
      showToast('❌ केवल एडमिन या लेखक ही पोस्ट हटा सकते हैं');
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteDoc(doc(db, 'posts', id));
      showToast('🗑️ पोस्ट हटा दी गई');
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
    if (!isAdmin) {
      showToast('❌ केवल एडमिन ही लेनदेन दर्ज कर सकते हैं');
      return;
    }
    const newId = 'acc-' + Date.now();
    const newTx: AccountingTransaction = {
      ...txData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);

    try {
      await setDoc(doc(db, 'transactions', newId), newTx);
      showToast('✅ हिसाब-किताब दर्ज व Google Cloud पर ऑटो-सेव हो गया!');
    } catch (err) {
      console.error('Firestore addTransaction error:', err);
    }
  };

  const updateTransaction = async (tx: AccountingTransaction) => {
    if (!isAdmin) {
      showToast('❌ केवल एडमिन ही खाता अपडेट कर सकते हैं');
      return;
    }
    setTransactions((prev) => prev.map((t) => (t.id === tx.id ? tx : t)));

    try {
      await setDoc(doc(db, 'transactions', tx.id), tx);
      showToast('✅ लेनदेन विवरण अपडेट व ऑटो-सेव हो गया');
    } catch (err) {
      console.error('Firestore updateTransaction error:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!isAdmin) {
      showToast('❌ केवल एडमिन ही लेनदेन हटा सकते हैं');
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'transactions', id));
      showToast('🗑️ लेनदेन रिकॉर्ड हटा दिया गया');
    } catch (err) {
      console.error('Firestore deleteTransaction error:', err);
    }
  };

  const resetToDefaults = async () => {
    if (typeof window !== 'undefined') {
      const confirmReset = window.confirm(
        'चेतावनी (Warning): क्या आप वाकई सारा डेटा खाली/रीसेट करना चाहते हैं?'
      );
      if (!confirmReset) return;
    }
    setCeremonies([]);
    setBhajans([]);
    setAnnouncements([]);
    setPosts([]);
    setTransactions([]);

    localStorage.setItem(STORAGE_KEYS.CEREMONIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BHAJANS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));

    try {
      // Clear Firestore collections
      const collections = ['ceremonies', 'bhajans', 'announcements', 'posts', 'transactions'];
      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName));
        if (!snap.empty) {
          const batch = writeBatch(db);
          snap.docs.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      showToast('सारा डेटा सफलतापूर्वक खाली/रीसेट कर दिया गया है।');
    } catch (err) {
      console.error('Reset batch commit error:', err);
      showToast('डेटा लोकल स्तर पर रीसेट कर दिया गया है।');
    }
  };

  // Manual Save All to Cloud (Admin 1-Click Save)
  const saveAllToCloud = async (): Promise<boolean> => {
    try {
      showToast('⏳ क्लाउड में सेव हो रहा है (Saving to Google Cloud)...');

      // Update local storage first
      localStorage.setItem(STORAGE_KEYS.CEREMONIES, JSON.stringify(ceremonies));
      localStorage.setItem(STORAGE_KEYS.BHAJANS, JSON.stringify(bhajans));
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

      // Batch save to Firebase Firestore
      const batch = writeBatch(db);

      ceremonies.forEach((c) => {
        if (c.id) batch.set(doc(db, 'ceremonies', c.id), c);
      });
      bhajans.forEach((b) => {
        if (b.id) batch.set(doc(db, 'bhajans', b.id), b);
      });
      announcements.forEach((a) => {
        if (a.id) batch.set(doc(db, 'announcements', a.id), a);
      });
      posts.forEach((p) => {
        if (p.id) batch.set(doc(db, 'posts', p.id), p);
      });
      transactions.forEach((t) => {
        if (t.id) batch.set(doc(db, 'transactions', t.id), t);
      });

      await batch.commit();
      setIsCloudSynced(true);
      showToast('☁️ आपका सारा डेटा (भजन, सुंदरकांड, सूचनाएं, खाते) सुरक्षित सेव हो गया!');
      return true;
    } catch (err) {
      console.error('saveAllToCloud batch error:', err);
      showToast('✅ डेटा आपके ब्राउज़र में सुरक्षित सेव है (Cloud Sync Retry)');
      return false;
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
        saveAllToCloud,
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
