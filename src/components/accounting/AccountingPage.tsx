import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccountingTransaction } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  Download,
  Filter,
  Search,
  X,
  FileText,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AccountingPage: React.FC = () => {
  const {
    isAdmin,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setIsAuthModalOpen,
    showToast
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<AccountingTransaction | null>(null);

  const [formData, setFormData] = useState({
    type: 'income' as AccountingTransaction['type'],
    title: '',
    amount: '',
    category: 'Donation (Bhet/Daan)' as AccountingTransaction['category'],
    date: new Date().toISOString().split('T')[0],
    donorOrReceiverName: '',
    paymentMode: 'Cash' as AccountingTransaction['paymentMode'],
    receiptNo: '',
    notes: '',
    recordedBy: 'Admin'
  });

  // STRICT ACCESS CONTROL: Only admins can view the accounting page
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 sm:p-10 rounded-3xl border-2 border-rose-200 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider">
            गोपनीय खाता (Restricted Access)
          </span>
          <h2 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900">
            मंडल आय-व्यय लेखा (Accounting Page)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
            यह पेज केवल मंडल के अधिकृत व्यवस्थापकों (Admin) के लिए सुरक्षित है। कृपया लेखा-जोखा देखने व एंट्री करने के लिए एडमिन लॉगिन करें।
          </p>
        </div>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 cursor-pointer transition-all inline-flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>एडमिन लॉगिन करें (Admin Login)</span>
        </button>
      </div>
    );
  }

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpense;

  const categories = [
    'Donation (Bhet/Daan)',
    'Sunderkand Seva',
    'Prasad & Bhandara',
    'Sound & Dholak',
    'Mandap & Lights',
    'Padyatra',
    'Miscellaneous'
  ];

  const openAddModal = (type: 'income' | 'expense' = 'income') => {
    setEditingTx(null);
    setFormData({
      type,
      title: '',
      amount: '',
      category: type === 'income' ? 'Donation (Bhet/Daan)' : 'Prasad & Bhandara',
      date: new Date().toISOString().split('T')[0],
      donorOrReceiverName: '',
      paymentMode: 'Cash',
      receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      notes: '',
      recordedBy: 'Admin'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tx: AccountingTransaction) => {
    setEditingTx(tx);
    setFormData({
      type: tx.type,
      title: tx.title,
      amount: String(tx.amount),
      category: tx.category,
      date: tx.date,
      donorOrReceiverName: tx.donorOrReceiverName || '',
      paymentMode: tx.paymentMode,
      receiptNo: tx.receiptNo || '',
      notes: tx.notes || '',
      recordedBy: tx.recordedBy || 'Admin'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || isNaN(Number(formData.amount))) {
      showToast('कृपया मान्य विवरण व राशि दर्ज करें');
      return;
    }

    if (editingTx) {
      await updateTransaction({
        ...editingTx,
        type: formData.type,
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        donorOrReceiverName: formData.donorOrReceiverName.trim() || undefined,
        paymentMode: formData.paymentMode,
        receiptNo: formData.receiptNo.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        recordedBy: formData.recordedBy.trim() || 'Admin'
      });
    } else {
      await addTransaction({
        type: formData.type,
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        donorOrReceiverName: formData.donorOrReceiverName.trim() || undefined,
        paymentMode: formData.paymentMode,
        receiptNo: formData.receiptNo.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        recordedBy: formData.recordedBy.trim() || 'Admin'
      });
    }

    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Type', 'Title', 'Amount (INR)', 'Category', 'Date', 'Donor / Receiver', 'Payment Mode', 'Receipt No', 'Notes'];
      const rows = transactions.map((t) => [
        t.id,
        t.type.toUpperCase(),
        `"${t.title.replace(/"/g, '""')}"`,
        t.amount,
        `"${t.category}"`,
        t.date,
        `"${(t.donorOrReceiverName || '').replace(/"/g, '""')}"`,
        t.paymentMode,
        t.receiptNo || '',
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Kashtabhanjan_Mandal_Accounting_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Accounting CSV Report Downloaded!');
    } catch (e) {
      showToast('Error generating CSV');
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.donorOrReceiverName && t.donorOrReceiverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.receiptNo && t.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>गोपनीय मंडल खाता (Admin Protected Ledger)</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold">
            मंडल आय-व्यय व दान खाता (Accounting)
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            सुंदरकांड पाठ, दान (भेंट), महाप्रसाद भंडारा, साउंड व मंडल सेवा के सभी वित्तीय लेन-देन का पारदर्शी रिकॉर्ड।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => openAddModal('income')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ आय / दान (Income)</span>
          </button>

          <button
            onClick={() => openAddModal('expense')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ खर्च (Expense)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Download CSV Ledger"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income (आवक) */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">कुल आवक / भेंट (Total Income)</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">
            ₹{totalIncome.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            {transactions.filter((t) => t.type === 'income').length} दान व आवक प्रविष्टियाँ
          </p>
        </div>

        {/* Total Expense (जावक) */}
        <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-xs font-bold uppercase tracking-wider">कुल जावक / खर्च (Total Expense)</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">
            ₹{totalExpense.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-rose-600 font-medium">
            {transactions.filter((t) => t.type === 'expense').length} सेवा व व्यवस्था खर्च
          </p>
        </div>

        {/* Current Balance (अंतिम शेष) */}
        <div className="bg-linear-to-br from-amber-500 to-orange-600 text-white p-5 rounded-3xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-amber-100">
            <span className="text-xs font-bold uppercase tracking-wider">वर्तमान शेष निधि (Net Balance)</span>
            <div className="p-2 rounded-xl bg-white/20 text-white">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">
            ₹{balance.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-amber-100 font-medium">
            Mandal Seva Fund Balance (Available)
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Type Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'income' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            आवक (Income)
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterType === 'expense' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            जावक (Expense)
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, donor, receipt..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
          </div>
        </div>
      </div>

      {/* Transactions Table / List View */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-amber-50/70 border-b border-amber-200/80 text-stone-800 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Date / Receipt</th>
                <th className="py-3.5 px-4">Description / Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Party / Donor</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-stone-900">{tx.date}</div>
                      {tx.receiptNo && (
                        <span className="text-[10px] text-stone-400 font-mono">
                          {tx.receiptNo}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-stone-900 leading-snug">{tx.title}</div>
                      {tx.notes && (
                        <p className="text-[11px] text-stone-500 line-clamp-1 italic mt-0.5">
                          {tx.notes}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-stone-800">
                        {tx.donorOrReceiverName || '—'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-stone-500">
                      {tx.paymentMode}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-bold ${
                          isIncome ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}₹{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(tx)}
                          className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete transaction "${tx.title}" (₹${tx.amount})?`)) {
                              deleteTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-400 text-xs">
                    No transaction records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl text-white ${formData.type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {formData.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-serif-devotional text-lg font-bold text-stone-900">
                    {editingTx ? 'लेनदेन संपादित करें (Edit)' : formData.type === 'income' ? 'नया दान / आवक जोड़ें (Add Income)' : 'नया खर्च दर्ज करें (Add Expense)'}
                  </h3>
                  <p className="text-[11px] text-stone-500">Mandal Account Ledger Entry</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    formData.type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  आवक / दान (Income)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    formData.type === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  जावक / खर्च (Expense)
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  विवरण / प्रयोजन (Description / Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सुंदरकांड पाठ हेतु गुप्त दान / महाप्रसाद खर्च"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    राशि (Amount in ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="5100"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    दिनांक (Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Category & Payment Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    श्रेणी (Category) *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    माध्यम (Payment Mode)
                  </label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="Cash">Cash (नकद)</option>
                    <option value="UPI/Online">UPI / QR / Online</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              {/* Donor/Receiver Name & Receipt No */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {formData.type === 'income' ? 'दानदाता का नाम (Donor Name)' : 'प्राप्तकर्ता / विक्रेता (Receiver/Vendor)'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. रमेश भाई पटेल"
                    value={formData.donorOrReceiverName}
                    onChange={(e) => setFormData({ ...formData, donorOrReceiverName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    रसीद / वाउचर नं. (Receipt No)
                  </label>
                  <input
                    type="text"
                    placeholder="REC-2026-001"
                    value={formData.receiptNo}
                    onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  विशेष टिप्पणी (Notes)
                </label>
                <input
                  type="text"
                  placeholder="अतिरिक्त विवरण या बिल संदर्भ..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              {/* Actions */}
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
                  className={`px-6 py-2 text-xs font-semibold text-white rounded-xl shadow-md cursor-pointer ${
                    formData.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {editingTx ? 'Save Changes' : 'दर्ज करें (Save Transaction)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
