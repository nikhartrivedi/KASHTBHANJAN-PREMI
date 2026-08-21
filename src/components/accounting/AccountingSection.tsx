import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AccountingTransaction } from '../../types';
import { DiyaIcon } from '../common/DevotionalIcons';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Download,
  Printer,
  Calendar,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  X,
  FileSpreadsheet,
  Receipt,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const AccountingSection: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, isAdmin, setIsAuthModalOpen, showToast } = useApp();

  // Guard: Admin Only Access
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-3xl border border-red-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif-devotional text-2xl font-bold text-stone-900">
          Accounting is Restricted to Mandal Admin
        </h2>
        <p className="text-xs sm:text-sm text-stone-600">
          Mandal financial ledgers, income, donor receipts, and expenses are protected under role-based security. Please log in with the administrator account to access accounting records.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold text-xs shadow-md cursor-pointer transition-all"
        >
          Login as Admin
        </button>
      </div>
    );
  }

  // Filters State
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add/Edit Transaction Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<AccountingTransaction | null>(null);

  const [trxForm, setTrxForm] = useState({
    type: 'income' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Ceremony Sponsorship',
    sourceOrDonor: '',
    description: '',
    paymentMethod: 'UPI' as AccountingTransaction['paymentMethod'],
    receiptNo: '',
    voucherRef: '',
    verifiedBy: 'Mandal Treasurer'
  });

  const incomeCategories = [
    'Ceremony Sponsorship',
    'Devotee Aarti Donations',
    'Annakshetra Fund',
    'Golden Jubilee Support',
    'Monthly Member Seva',
    'Suvarna Chhatra Fund',
    'General Hundi Collection'
  ];

  const expenseCategories = [
    'Prasad & Bhojan',
    'Sound System & Instruments',
    'Flowers & Shringar',
    'Panditji Dakshina',
    'Printing & Books',
    'Annakshetra & Bhandara',
    'Venue & Generator Lighting',
    'Padyatra Logistics & Fuel',
    'Miscellaneous Seva'
  ];

  // Financial calculations
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions]);

  const currentBalance = totalIncome - totalExpense;

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.sourceOrDonor && t.sourceOrDonor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.receiptNo && t.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (t.voucherRef && t.voucherRef.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStartDate = !startDate || t.date >= startDate;
      const matchesEndDate = !endDate || t.date <= endDate;

      return matchesType && matchesCategory && matchesSearch && matchesStartDate && matchesEndDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCategory, searchTerm, startDate, endDate]);

  const openAddModal = (type: 'income' | 'expense') => {
    setEditingTrx(null);
    setTrxForm({
      type,
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: type === 'income' ? incomeCategories[0] : expenseCategories[0],
      sourceOrDonor: '',
      description: '',
      paymentMethod: 'UPI',
      receiptNo: type === 'income' ? `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}` : '',
      voucherRef: type === 'expense' ? `VOUCH-${Math.floor(1000 + Math.random() * 9000)}` : '',
      verifiedBy: 'Mandal Treasurer'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (trx: AccountingTransaction) => {
    setEditingTrx(trx);
    setTrxForm({
      type: trx.type,
      date: trx.date,
      amount: String(trx.amount),
      category: trx.category,
      sourceOrDonor: trx.sourceOrDonor || '',
      description: trx.description,
      paymentMethod: trx.paymentMethod,
      receiptNo: trx.receiptNo || '',
      voucherRef: trx.voucherRef || '',
      verifiedBy: trx.verifiedBy || 'Mandal Treasurer'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxForm.amount || !trxForm.description) {
      showToast('Please enter an amount and description');
      return;
    }

    const numAmount = parseFloat(trxForm.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid positive amount');
      return;
    }

    if (editingTrx) {
      updateTransaction({
        ...editingTrx,
        type: trxForm.type,
        date: trxForm.date,
        amount: numAmount,
        category: trxForm.category,
        sourceOrDonor: trxForm.sourceOrDonor || undefined,
        description: trxForm.description,
        paymentMethod: trxForm.paymentMethod,
        receiptNo: trxForm.receiptNo || undefined,
        voucherRef: trxForm.voucherRef || undefined,
        verifiedBy: trxForm.verifiedBy || undefined
      });
    } else {
      addTransaction({
        type: trxForm.type,
        date: trxForm.date,
        amount: numAmount,
        category: trxForm.category,
        sourceOrDonor: trxForm.sourceOrDonor || undefined,
        description: trxForm.description,
        paymentMethod: trxForm.paymentMethod,
        receiptNo: trxForm.receiptNo || undefined,
        voucherRef: trxForm.voucherRef || undefined,
        verifiedBy: trxForm.verifiedBy || undefined
      });
    }

    setIsModalOpen(false);
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Category', 'Donor / Payee', 'Description', 'Amount (INR)', 'Payment Method', 'Receipt / Voucher'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      t.category,
      t.sourceOrDonor || '-',
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.paymentMethod,
      t.receiptNo || t.voucherRef || '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kashtabhanjan_Premi_Accounts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Accounting ledger exported to CSV!');
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>Mandal Financial Ledger & Accounts</span>
          </div>
          <h1 className="font-serif-devotional text-2xl sm:text-3xl font-bold text-stone-900">
            Accounting Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Official records of ceremony donations, prasad expenses, annakshetra funds, and balance ledger.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            id="add-income-btn"
            onClick={() => openAddModal('income')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Record Income</span>
          </button>

          <button
            id="add-expense-btn"
            onClick={() => openAddModal('expense')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Record Expense</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV Ledger"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Income */}
        <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Total Income / Seva
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
            {formatCurrency(totalIncome)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Ceremony sponsorships & donations
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-3xl border border-rose-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Total Expenses
            </span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
            {formatCurrency(totalExpense)}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Prasad, sound, flowers, bhandara
          </p>
        </div>

        {/* Current Net Balance */}
        <div className="bg-linear-to-br from-orange-600 to-amber-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-100 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Current Mandal Balance
            </span>
            <div className="p-2 bg-white/20 rounded-xl text-white">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            {formatCurrency(currentBalance)}
          </h3>
          <p className="text-xs text-amber-100/90 mt-1 font-medium">
            Available for upcoming Sunderkand & Seva
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Type filter */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              Income Only
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              Expenses Only
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search donor, item, receipt #..."
              className="w-full pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:border-orange-500 outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2" />
          </div>
        </div>

        {/* Date and Category filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-medium">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
            >
              <option value="all">All Categories</option>
              <optgroup label="Income Categories">
                {incomeCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
              <optgroup label="Expense Categories">
                {expenseCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
            />
            <span className="text-stone-500 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs outline-none"
            />
            {(startDate || endDate || filterCategory !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setFilterCategory('all');
                  setSearchTerm('');
                }}
                className="text-orange-700 hover:text-orange-900 font-semibold underline text-[11px] ml-2 cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Donor / Beneficiary</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-stone-800 whitespace-nowrap">
                    {trx.date}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      trx.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {trx.type === 'income' ? '+ Income' : '- Expense'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900 whitespace-nowrap">
                    {trx.category}
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">
                    {trx.sourceOrDonor || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate" title={trx.description}>
                    {trx.description}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                    <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {trx.paymentMethod}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 font-bold text-sm text-right whitespace-nowrap ${
                    trx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => openEditModal(trx)}
                        className="p-1.5 text-stone-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete entry of ${formatCurrency(trx.amount)}?`)) {
                            deleteTransaction(trx.id);
                          }
                        }}
                        className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-10 text-center text-stone-500 space-y-2">
            <DollarSign className="w-8 h-8 mx-auto text-stone-400" />
            <p className="text-sm font-semibold">No accounting transactions found</p>
            <p className="text-xs text-stone-400">Try adjusting your filters or record a new transaction.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT TRANSACTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200">
            <div className={`p-6 text-white flex items-center justify-between ${
              trxForm.type === 'income'
                ? 'bg-linear-to-r from-emerald-600 to-teal-700'
                : 'bg-linear-to-r from-rose-600 to-red-700'
            }`}>
              <div>
                <h3 className="font-serif-devotional text-xl font-bold">
                  {editingTrx ? 'Edit Transaction Entry' : trxForm.type === 'income' ? 'Record Income / Donation' : 'Record Expense Entry'}
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Maintain precise and auditable Mandal ledgers
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Type Switcher */}
              <div className="flex bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTrxForm({ ...trxForm, type: 'income', category: incomeCategories[0] })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    trxForm.type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  + Income (Donation/Seva)
                </button>
                <button
                  type="button"
                  onClick={() => setTrxForm({ ...trxForm, type: 'expense', category: expenseCategories[0] })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    trxForm.type === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600'
                  }`}
                >
                  - Expense (Prasad/Venue)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={trxForm.date}
                    onChange={(e) => setTrxForm({ ...trxForm, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Amount (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={trxForm.amount}
                    onChange={(e) => setTrxForm({ ...trxForm, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={trxForm.category}
                    onChange={(e) => setTrxForm({ ...trxForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  >
                    {(trxForm.type === 'income' ? incomeCategories : expenseCategories).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={trxForm.paymentMethod}
                    onChange={(e) => setTrxForm({ ...trxForm, paymentMethod: e.target.value as AccountingTransaction['paymentMethod'] })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {trxForm.type === 'income' ? 'Donor / Sponsor Name' : 'Payee / Vendor Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={trxForm.sourceOrDonor}
                  onChange={(e) => setTrxForm({ ...trxForm, sourceOrDonor: e.target.value })}
                  placeholder={trxForm.type === 'income' ? 'e.g. Shree Nileshbhai Shah' : 'e.g. Sai Sound Service / Prasad Vendor'}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description / Purpose *
                </label>
                <textarea
                  required
                  rows={2}
                  value={trxForm.description}
                  onChange={(e) => setTrxForm({ ...trxForm, description: e.target.value })}
                  placeholder="Detail notes about the income or expense item"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Receipt / Voucher Reference
                  </label>
                  <input
                    type="text"
                    value={trxForm.receiptNo}
                    onChange={(e) => setTrxForm({ ...trxForm, receiptNo: e.target.value })}
                    placeholder="REC-2026-XXXX or VOUCH-XXX"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-orange-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Verified By
                  </label>
                  <input
                    type="text"
                    value={trxForm.verifiedBy}
                    onChange={(e) => setTrxForm({ ...trxForm, verifiedBy: e.target.value })}
                    placeholder="Treasurer name"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 text-white text-xs font-semibold rounded-xl shadow-md ${
                    trxForm.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {editingTrx ? 'Save Changes' : 'Record Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
