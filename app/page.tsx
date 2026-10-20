'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Bell, 
  LogOut, 
  Edit3, 
  Trash2, 
  X, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Send, 
  BarChart3, 
  FileText,
  UserPlus
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  password?: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Field Officer' | 'General';
  status: 'সক্রিয়' | 'নিষ্ক্রিয়';
}

interface Transaction {
  id: string;
  date: string;
  time: string;
  memberId: string;
  memberName: string;
  type: 'credit' | 'debit'; // credit = জমা/আদায়, debit = উত্তোলন/ঋণ বিতরণ/খরচ
  category: 'কিস্তি আদায়' | 'সঞ্চয় জমা' | 'ঋণ বিতরণ' | 'সঞ্চয় উত্তোলন' | 'অফিস খরচ';
  amount: number;
  recordedBy: string;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  savingsBalance: number;
  loanBalance: number;
}

export default function MicrocreditApp() {
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'banking' | 'accounts' | 'users' | 'notices'>('banking');

  // Users Database
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'atiq', password: '123', role: 'Super Admin', status: 'সক্রিয়' },
    { id: '1792534535877', username: 'selim', password: '123', role: 'Manager', status: 'সক্রিয়' }
  ]);

  // Form State for User
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Manager' | 'Field Officer' | 'General'>('Admin');

  // Modal State for Editing User (Super Admin Feature)
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'Super Admin' | 'Admin' | 'Manager' | 'Field Officer' | 'General'>('Admin');

  // Banking State: Members & Transactions
  const [members, setMembers] = useState<Member[]>([
    { id: 'M-101', name: 'আব্দুল করিম', phone: '01711000000', savingsBalance: 15000, loanBalance: 40000 },
    { id: 'M-102', name: 'মোছাঃ রহিমা বেগম', phone: '01911000000', savingsBalance: 8500, loanBalance: 12000 }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TRX-1001',
      date: '2026-10-21',
      time: '09:30 AM',
      memberId: 'M-101',
      memberName: 'আব্দুল করিম',
      type: 'credit',
      category: 'কিস্তি আদায়',
      amount: 2500,
      recordedBy: 'selim'
    }
  ]);

  // New Transaction Form State
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [txnCategory, setTxnCategory] = useState<'কিস্তি আদায়' | 'সঞ্চয় জমা' | 'ঋণ বিতরণ' | 'সঞ্চয় উত্তোলন' | 'অফিস খরচ'>('কিস্তি আদায়');
  const [txnAmount, setTxnAmount] = useState('');

  // New Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [initialSavings, setInitialSavings] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('mc_app_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedTxns = localStorage.getItem('mc_app_transactions');
    if (savedTxns) setTransactions(JSON.parse(savedTxns));

    const savedMembers = localStorage.getItem('mc_app_members');
    if (savedMembers) setMembers(JSON.parse(savedMembers));

    const session = localStorage.getItem('mc_app_session');
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  const saveUsersToStorage = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem('mc_app_users', JSON.stringify(updated));
  };

  const saveTxnsToStorage = (updated: Transaction[]) => {
    setTransactions(updated);
    localStorage.setItem('mc_app_transactions', JSON.stringify(updated));
  };

  const saveMembersToStorage = (updated: Member[]) => {
    setMembers(updated);
    localStorage.setItem('mc_app_members', JSON.stringify(updated));
  };

  // WhatsApp Alert Function
  const sendWhatsAppNotification = (txn: Transaction) => {
    const targetPhone = '8801689333000';
    const message = `*🔔 নতুন আর্থিক ট্রানজেকশন নোটিশ*\n` +
      `--------------------------------\n` +
      `🏢 *প্রতিষ্ঠান:* চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লি:\n` +
      `📅 *তারিখ ও সময়:* ${txn.date} | ${txn.time}\n` +
      `📝 *ট্রানজেকশন টাইপ:* ${txn.category} (${txn.type === 'credit' ? 'জমা / Credit' : 'খরচ / Debit'})\n` +
      `👤 *সদস্য:* ${txn.memberName} (ID: ${txn.memberId})\n` +
      `💰 *পরিমাণ:* ৳ ${txn.amount.toLocaleString('en-IN')}\n` +
      `👨‍💼 *অপারেটর:* ${txn.recordedBy}\n` +
      `--------------------------------\n` +
      `_সফটওয়্যার নোটিফিকেশন সিস্টেম_`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${targetPhone}?text=${encodedMsg}`, '_blank');
  };

  // Handle Add Transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnAmount || Number(txnAmount) <= 0) return;

    const amount = Number(txnAmount);
    const member = members.find((m) => m.id === selectedMemberId);
    const memberName = member ? member.name : (txnCategory === 'অফিস খরচ' ? 'অফিস সাধারণ ব্যয়' : 'সাধারণ সদস্য');

    const isCredit = txnCategory === 'কিস্তি আদায়' || txnCategory === 'সঞ্চয় জমা';
    const newTxn: Transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      memberId: selectedMemberId || 'N/A',
      memberName,
      type: isCredit ? 'credit' : 'debit',
      category: txnCategory,
      amount,
      recordedBy: currentUser?.username || 'admin'
    };

    // Update Member Balances
    if (member) {
      const updatedMembers = members.map((m) => {
        if (m.id === member.id) {
          if (txnCategory === 'সঞ্চয় জমা') return { ...m, savingsBalance: m.savingsBalance + amount };
          if (txnCategory === 'সঞ্চয় উত্তোলন') return { ...m, savingsBalance: Math.max(0, m.savingsBalance - amount) };
          if (txnCategory === 'কিস্তি আদায়') return { ...m, loanBalance: Math.max(0, m.loanBalance - amount) };
          if (txnCategory === 'ঋণ বিতরণ') return { ...m, loanBalance: m.loanBalance + amount };
        }
        return m;
      });
      saveMembersToStorage(updatedMembers);
    }

    const updatedTxns = [newTxn, ...transactions];
    saveTxnsToStorage(updatedTxns);

    // Send WhatsApp Alert
    sendWhatsAppNotification(newTxn);

    // Reset Form
    setTxnAmount('');
    setSelectedMemberId('');
  };

  // Handle Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMem: Member = {
      id: `M-${Math.floor(100 + Math.random() * 900)}`,
      name: newMemberName.trim(),
      phone: newMemberPhone.trim() || 'N/A',
      savingsBalance: Number(initialSavings) || 0,
      loanBalance: 0
    };

    const updated = [...members, newMem];
    saveMembersToStorage(updated);
    setNewMemberName('');
    setNewMemberPhone('');
    setInitialSavings('');
  };

  // Financial Summary Calculation
  const totalCredit = transactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netCashInHand = totalCredit - totalDebit;
  const totalMemberSavings = members.reduce((acc, curr) => acc + curr.savingsBalance, 0);
  const totalOutstandingLoan = members.reduce((acc, curr) => acc + curr.loanBalance, 0);

  // Authentication Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedUser = loginUsername.trim().toLowerCase();
    const found = users.find(
      (u) => u.username.toLowerCase() === trimmedUser && u.password === loginPassword
    );

    if (found) {
      setCurrentUser(found);
      localStorage.setItem('mc_app_session', JSON.stringify(found));
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mc_app_session');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername.trim(),
      password: newPassword.trim(),
      role: newRole,
      status: 'সক্রিয়'
    };

    saveUsersToStorage([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
  };

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditPassword(user.password || '');
    setEditRole(user.role);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = users.map((u) => {
      if (u.id === editingUser.id) {
        return {
          ...u,
          username: editUsername.trim(),
          password: editPassword.trim(),
          role: editRole
        };
      }
      return u;
    });

    saveUsersToStorage(updated);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('আপনি কি এই ইউজারটি নিশ্চিতভাবে ডিলিট করতে চান?')) {
      saveUsersToStorage(users.filter((u) => u.id !== id));
    }
  };

  const isManagement = currentUser?.role === 'Super Admin' || currentUser?.role === 'Manager';

  // ==================== 1. LOGIN SCREEN ====================
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#1a56b4] to-[#2563eb] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e5631] leading-snug">
              চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              মাদারগঞ্জ, জামালপুর | ব্যাংকিং ও একাউন্টস ম্যানেজমেন্ট সফটওয়্যার
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ইউজারনেম
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="ইউজারনেম লিখুন"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-gray-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড দিন"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-gray-800 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-lg transition duration-200 text-sm shadow-md mt-2"
            >
              নিরাপদ লগইন
            </button>
          </form>

          <div className="mt-8 text-center border-t pt-4">
            <p className="text-xs text-gray-500 font-medium">
              আতিক এন্টারপ্রাইজ আইটি লি:
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==================== 2. MAIN APPLICATION ====================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#1e5631] text-white px-4 py-3 sm:px-8 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-lg sm:text-xl font-bold">
            চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড
          </h1>
          <p className="text-xs text-emerald-100">
            মাদারগঞ্জ, জামালপুর | ব্যাংকিং ও ফিনান্সিয়াল সিস্টেম
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-emerald-100">ইউজার:</div>
            <div className="font-semibold text-sm leading-tight">{currentUser.username}</div>
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] bg-emerald-800 text-white rounded">
              {currentUser.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition"
          >
            <LogOut size={14} />
            লগআউট
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 flex gap-6 text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('banking')}
          className={`py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'banking'
              ? 'border-[#1e5631] text-[#1e5631] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CreditCard size={16} />
          ব্যাংকিং ও লেনদেন (Banking)
        </button>

        {isManagement && (
          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
              activeTab === 'accounts'
                ? 'border-[#1e5631] text-[#1e5631] font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 size={16} />
            অ্যাকাউন্টস ও ফিনান্সিয়াল রিপোর্ট (Accounts)
          </button>
        )}

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'users'
              ? 'border-[#1e5631] text-[#1e5631] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} />
          ইউজার ও অ্যাডমিন
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`py-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'notices'
              ? 'border-[#1e5631] text-[#1e5631] font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bell size={16} />
          নোটিশ
        </button>
      </nav>

      {/* Main Content Areas */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* ================= 1. BANKING & TRANSACTIONS ================= */}
        {activeTab === 'banking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Transaction Form */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
              <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                <Wallet size={18} className="text-emerald-700" />
                নতুন লেনদেন এন্ট্রি (Debit / Credit)
              </h2>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    লেনদেনের খাত / ক্যাটাগরি
                  </label>
                  <select
                    value={txnCategory}
                    onChange={(e) => setTxnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="কিস্তি আদায়">কিস্তি আদায় (Loan Repay - জমা)</option>
                    <option value="সঞ্চয় জমা">সঞ্চয় জমা (Savings Deposit - জমা)</option>
                    <option value="ঋণ বিতরণ">ঋণ বিতরণ (Loan Given - খরচ)</option>
                    <option value="সঞ্চয় উত্তোলন">সঞ্চয় উত্তোলন (Withdraw - খরচ)</option>
                    <option value="অফিস খরচ">অফিস সাধারণ খরচ (Office Expense - খরচ)</option>
                  </select>
                </div>

                {txnCategory !== 'অফিস খরচ' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      গ্রাহক / সদস্য সিলেক্ট করুন
                    </label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-emerald-600 bg-white"
                    >
                      <option value="">-- সদস্য নির্বাচন করুন --</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.id}) - সঞ্চয়: ৳{m.savingsBalance} | ঋণ: ৳{m.loanBalance}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txnAmount}
                    onChange={(e) => setTxnAmount(e.target.value)}
                    placeholder="টাকার অংক দিন"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-sm font-medium transition shadow flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  লেনদেন সম্পন্ন করুন ও নোটিফিকেশন পাঠান
                </button>
                <p className="text-[11px] text-gray-400 text-center">
                  * লেনদেন সম্পন্ন হওয়ার সাথে সাথে +8801689333000 নম্বরে হোয়াটসঅ্যাপ নোটিফিকেশন যাবে।
                </p>
              </form>

              {/* Add Member Quick Box */}
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <UserPlus size={14} /> নতুন ব্যাংকিং সদস্য যোগ করুন
                </h3>
                <form onSubmit={handleAddMember} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="সদস্যের পুরো নাম"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="মোবাইল নম্বর"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                  <input
                    type="number"
                    placeholder="প্রাথমিক সঞ্চয় জমা (ঐচ্ছিক)"
                    value={initialSavings}
                    onChange={(e) => setInitialSavings(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-medium"
                  >
                    সদস্য একাউন্ট যুক্ত করুন
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Transaction Passbook Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center justify-between">
                <span>দৈনিক লেনদেন রেজিস্টার ও ক্যাশ বহি</span>
                <span className="text-xs font-normal text-gray-500">মোট ট্রানজেকশন: {transactions.length}</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ ও সময়</th>
                      <th className="py-2.5 px-3">সদস্যের নাম</th>
                      <th className="py-2.5 px-3">খাত (Category)</th>
                      <th className="py-2.5 px-3">টাইপ</th>
                      <th className="py-2.5 px-3">পরিমাণ (৳)</th>
                      <th className="py-2.5 px-3">অপারেটর</th>
                      <th className="py-2.5 px-3 text-right">নোটিশ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3 text-gray-500 text-xs">
                          {t.date} <br />
                          <span className="text-[10px] text-gray-400">{t.time}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-900">
                          {t.memberName}
                          <span className="block text-[10px] text-gray-400">ID: {t.memberId}</span>
                        </td>
                        <td className="py-3 px-3 text-gray-700">{t.category}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center w-fit gap-1 ${
                              t.type === 'credit'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {t.type === 'credit' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                            {t.type === 'credit' ? 'জমা (Credit)' : 'খরচ (Debit)'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold font-mono">
                          ৳ {t.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-xs">{t.recordedBy}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => sendWhatsAppNotification(t)}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-medium inline-flex items-center gap-1 shadow-sm"
                            title="হোয়াটসঅ্যাপে পাঠান"
                          >
                            <Send size={10} />
                            WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ACCOUNTS & FINANCIAL OVERVIEW (Super Admin & Manager) ================= */}
        {activeTab === 'accounts' && isManagement && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium">ক্যাশ ইন হ্যান্ড (নিট জমা)</span>
                  <Wallet size={18} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700">
                  ৳ {netCashInHand.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">মোট জমা মাইনাস মোট খরচ</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium">মোট সঞ্চয় আমানত</span>
                  <DollarSign size={18} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-blue-700">
                  ৳ {totalMemberSavings.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">সকল সদস্যের সঞ্চয় পুঞ্জীভূত</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium">মাঠ পর্যায়ে ঋণ পাওনা</span>
                  <ArrowUpRight size={18} className="text-amber-600" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-700">
                  ৳ {totalOutstandingLoan.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">বিতরণকৃত ঋণ ব্যালেন্স</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <span className="text-xs font-medium">নিবন্ধিত মোট সদস্য</span>
                  <Users size={18} className="text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {members.length} জন
                </div>
                <p className="text-[11px] text-gray-400 mt-1">সক্রিয় ঋণ ও সঞ্চয় গ্রাহক</p>
              </div>
            </div>

            {/* Member Ledger Overview Table */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center justify-between">
                <span>গ্রাহক লেজার ও আর্থিক ব্যালেন্স বিবরণী</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                  শুধুমাত্র সুপার অ্যাডমিন ও ম্যানেজারের এক্সেস
                </span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="py-2.5 px-3">সদস্য আইডি</th>
                      <th className="py-2.5 px-3">সদস্যের নাম</th>
                      <th className="py-2.5 px-3">মোবাইল নম্বর</th>
                      <th className="py-2.5 px-3">মোট সঞ্চয় স্থিতি</th>
                      <th className="py-2.5 px-3">বর্তমান ঋণ স্থিতি</th>
                      <th className="py-2.5 px-3">নিট অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3 font-mono font-medium text-gray-600">{m.id}</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">{m.name}</td>
                        <td className="py-3 px-3 text-gray-600">{m.phone}</td>
                        <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                          ৳ {m.savingsBalance.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 font-mono text-amber-700 font-bold">
                          ৳ {m.loanBalance.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              m.savingsBalance >= m.loanBalance
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {m.savingsBalance >= m.loanBalance ? 'নিরাপদ' : 'ঋণগ্রস্ত'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. USER & ADMIN MANAGEMENT ================= */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create User Form */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
              <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">
                + নতুন ইউজার যোগ করুন
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    ইউজারনেম (ইংরেজি ছোট হাত)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="যেমন: rohim"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    পদবী / রোল (Role)
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Field Officer">Field Officer</option>
                    <option value="General">General (সাধারণ সদস্য)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    লগইন পাসওয়ার্ড
                  </label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition shadow"
                >
                  ইউজার একাউন্ট খুলুন
                </button>
              </form>
            </div>

            {/* User List Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b">
                অনুমোদিত অ্যাডমিন ও ইউজার তালিকা
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-600 border-b">
                    <tr>
                      <th className="py-2.5 px-3">আইডি</th>
                      <th className="py-2.5 px-3">ইউজারনেম</th>
                      <th className="py-2.5 px-3">রোল (পদবী)</th>
                      <th className="py-2.5 px-3">পাসওয়ার্ড</th>
                      <th className="py-2.5 px-3">স্ট্যাটাস</th>
                      <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-3 text-gray-500 font-mono text-xs">{u.id}</td>
                        <td className="py-3 px-3 font-medium text-gray-900">{u.username}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              u.role === 'Super Admin'
                                ? 'bg-amber-100 text-amber-800'
                                : u.role === 'Manager'
                                ? 'bg-blue-100 text-blue-800'
                                : u.role === 'General'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.role === 'General' ? 'General (সাধারণ)' : u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-gray-600">
                          {currentUser.role === 'Super Admin' ? u.password : '••••••'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-600 font-medium text-xs">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {currentUser.role === 'Super Admin' && (
                              <button
                                onClick={() => handleStartEdit(u)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1 transition"
                                title="এডিট করুন"
                              >
                                <Edit3 size={12} />
                                এডিট
                              </button>
                            )}

                            {u.role !== 'Super Admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center gap-1 transition"
                                title="মুছুন"
                              >
                                <Trash2 size={12} />
                                মুছুন
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. NOTICE BOARD ================= */}
        {activeTab === 'notices' && (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-600 space-y-2">
            <Bell size={32} className="mx-auto text-emerald-700 mb-2" />
            <h3 className="text-base font-semibold text-gray-800">অফিসিয়াল নোটিশ বোর্ড</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              সমিতির সকল কিস্তি ও সঞ্চয় সংক্রান্ত নিয়মাবলী সময়মতো পরিশোধ করার অনুরোধ করা যাচ্ছে।
            </p>
          </div>
        )}
      </main>

      {/* Edit User Modal (Super Admin Only) */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-semibold text-gray-800 text-base">
                ইউজার তথ্য এডিট করুন ({editingUser.username})
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">ইউজারনেম</label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">পাসওয়ার্ড</label>
                <input
                  type="text"
                  required
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">পদবী / রোল</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Field Officer">Field Officer</option>
                  <option value="General">General (সাধারণ সদস্য)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium transition"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}