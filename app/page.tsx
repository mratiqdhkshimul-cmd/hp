'use client';

import React, { useState, useEffect } from 'react';

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
  type: 'credit' | 'debit';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'banking' | 'accounts' | 'users' | 'notices'>('banking');

  // ইউজার তালিকা
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'atiq', password: '123', role: 'Super Admin', status: 'সক্রিয়' },
    { id: '1792534535877', username: 'selim', password: '123', role: 'Manager', status: 'সক্রিয়' }
  ]);

  // নতুন ইউজার ফর্ম
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Manager' | 'Field Officer' | 'General'>('Admin');

  // সুপার অ্যাডমিন এডিট স্টেট
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'Super Admin' | 'Admin' | 'Manager' | 'Field Officer' | 'General'>('Admin');

  // সদস্য ও ট্রানজেকশন তালিকা
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

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [txnCategory, setTxnCategory] = useState<'কিস্তি আদায়' | 'সঞ্চয় জমা' | 'ঋণ বিতরণ' | 'সঞ্চয় উত্তোলন' | 'অফিস খরচ'>('কিস্তি আদায়');
  const [txnAmount, setTxnAmount] = useState('');

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [initialSavings, setInitialSavings] = useState('');

  // লোকাল স্টোরেজ সিঙ্ক
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

  // হোয়াটসঅ্যাপ নোটিফিকেশন প্রেরণ
  const sendWhatsAppNotification = (txn: Transaction) => {
    const targetPhone = '8801689333000';
    const message = `*🔔 নতুন আর্থিক লেনদেন বিবরণী*\n` +
      `--------------------------------\n` +
      `🏢 *প্রতিষ্ঠান:* চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড\n` +
      `📅 *তারিখ ও সময়:* ${txn.date} | ${txn.time}\n` +
      `📝 *খাত:* ${txn.category} (${txn.type === 'credit' ? 'জমা / Credit' : 'খরচ / Debit'})\n` +
      `👤 *গ্রাহক:* ${txn.memberName} (ID: ${txn.memberId})\n` +
      `💰 *পরিমাণ:* ৳ ${txn.amount.toLocaleString('en-IN')}\n` +
      `👨‍💼 *অপারেটর:* ${txn.recordedBy}\n` +
      `--------------------------------\n` +
      `_আতিক এন্টারপ্রাইজ আইটি অটোমেশন_`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // লেনদেন এন্ট্রি
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

    sendWhatsAppNotification(newTxn);

    setTxnAmount('');
    setSelectedMemberId('');
  };

  // নতুন সদস্য নিবন্ধন
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

    saveMembersToStorage([...members, newMem]);
    setNewMemberName('');
    setNewMemberPhone('');
    setInitialSavings('');
  };

  // আর্থিক ক্যালকুলেশন
  const totalCredit = transactions
    .filter((t) => t.type === 'credit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === 'debit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netCashInHand = totalCredit - totalDebit;
  const totalMemberSavings = members.reduce((acc, curr) => acc + curr.savingsBalance, 0);
  const totalOutstandingLoan = members.reduce((acc, curr) => acc + curr.loanBalance, 0);

  // লগইন হ্যান্ডলার
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

  // লগআউট
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mc_app_session');
  };

  // ইউজার ম্যানেজমেন্ট হ্যান্ডলার
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

  return (
    <>
      {/* গ্লোবাল রেসপনসিভ ও স্টাইলিং ইঞ্জিন */}
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: #f1f5f9;
          color: #1e293b;
        }

        /* লগইন স্ক্রিন ব্যাকগ্রাউন্ড */
        .login-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%);
          padding: 20px;
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 20px;
          padding: 40px 32px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          text-align: center;
        }

        .company-title {
          font-size: 22px;
          font-weight: 800;
          color: #165b33;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .company-sub {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 24px;
        }

        .form-group {
          text-align: left;
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          outline: none;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
          background: #ffffff;
        }

        .btn-primary {
          width: 100%;
          padding: 13px;
          background-color: #0284c7;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
          margin-top: 6px;
        }

        .btn-primary:hover {
          background-color: #0369a1;
        }

        /* ড্যাশবোর্ড হেডার */
        .dash-header {
          background: #165b33;
          color: #ffffff;
          padding: 14px 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        }

        .dash-nav {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 24px;
          display: flex;
          gap: 20px;
          overflow-x: auto;
          white-space: nowrap;
        }

        .nav-btn {
          padding: 14px 4px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn.active {
          color: #165b33;
          border-bottom-color: #165b33;
        }

        .dash-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        .grid-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          align-items: start;
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
        }

        .card-header {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        /* টেবিল স্টাইল */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          padding: 12px 10px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
        }

        td {
          padding: 12px 10px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .badge-green { background: #dcfce7; color: #166534; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-blue { background: #e0e7ff; color: #3730a3; }
        .badge-amber { background: #fef3c7; color: #92400e; }

        /* কেপিআই বক্স */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .kpi-box {
          background: #ffffff;
          padding: 20px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 800;
          margin-top: 8px;
          font-family: monospace;
        }

        @media (max-width: 640px) {
          .login-card {
            padding: 30px 20px;
          }
          .company-title {
            font-size: 18px;
          }
        }
      `}</style>

      {/* ================= ১. লগইন ইন্টারফেস ================= */}
      {!currentUser ? (
        <div className="login-wrapper">
          <div className="login-card">
            <h1 className="company-title">
              চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড
            </h1>
            <p className="company-sub">
              মাদারগঞ্জ, জামালপুর | ব্যাংকিং ও ফিনান্সিয়াল ম্যানেজমেন্ট সফটওয়্যার
            </p>

            {loginError && (
              <div style={{
                background: '#fee2e2',
                color: '#b91c1c',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">ইউজারনেম</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="ইউজারনেম লিখুন"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label">পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn-primary">
                নিরাপদ লগইন
              </button>
            </form>

            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                আতিক এন্টারপ্রাইজ আইটি লি:
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ================= ২. ড্যাশবোর্ড ইন্টারফেস ================= */
        <div>
          {/* টপ হেডার */}
          <header className="dash-header">
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700 }}>
                চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড
              </h1>
              <p style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '2px' }}>
                মাদারগঞ্জ, জামালপুর | ব্যাংকিং ও ফিনান্সিয়াল সিস্টেম
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#d1fae5' }}>ইউজার: </span>
                <strong style={{ fontSize: '14px' }}>{currentUser.username}</strong>
                <span className="badge badge-amber" style={{ marginLeft: '8px' }}>
                  {currentUser.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                লগআউট
              </button>
            </div>
          </header>

          {/* নেভ বার */}
          <nav className="dash-nav">
            <button
              onClick={() => setActiveTab('banking')}
              className={`nav-btn ${activeTab === 'banking' ? 'active' : ''}`}
            >
              💳 ব্যাংকিং ও লেনদেন (Banking)
            </button>

            {isManagement && (
              <button
                onClick={() => setActiveTab('accounts')}
                className={`nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
              >
                📊 অ্যাকাউন্টস ও ব্যালেন্স রিপোর্ট (Accounts)
              </button>
            )}

            <button
              onClick={() => setActiveTab('users')}
              className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            >
              👥 ইউজার ও অ্যাডমিন
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`nav-btn ${activeTab === 'notices' ? 'active' : ''}`}
            >
              🔔 নোটিশ বোর্ড
            </button>
          </nav>

          {/* মূল কন্টেন্ট */}
          <main className="dash-container">
            {/* ট্যাব ১: ব্যাংকিং ও লেনদেন */}
            {activeTab === 'banking' && (
              <div className="grid-layout">
                {/* লেনদেন ফর্ম */}
                <div className="card">
                  <div className="card-header" style={{ color: '#165b33' }}>
                    নতুন লেনদেন এন্ট্রি (Debit / Credit)
                  </div>
                  <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="form-label">লেনদেনের খাত / ক্যাটাগরি</label>
                      <select
                        value={txnCategory}
                        onChange={(e) => setTxnCategory(e.target.value as any)}
                        className="form-input"
                      >
                        <option value="কিস্তি আদায়">কিস্তি আদায় (Loan Repay - জমা/Credit)</option>
                        <option value="সঞ্চয় জমা">সঞ্চয় জমা (Savings Deposit - জমা/Credit)</option>
                        <option value="ঋণ বিতরণ">ঋণ বিতরণ (Loan Given - খরচ/Debit)</option>
                        <option value="সঞ্চয় উত্তোলন">সঞ্চয় উত্তোলন (Withdraw - খরচ/Debit)</option>
                        <option value="অফিস খরচ">অফিস সাধারণ খরচ (Office Expense - খরচ/Debit)</option>
                      </select>
                    </div>

                    {txnCategory !== 'অফিস খরচ' && (
                      <div>
                        <label className="form-label">গ্রাহক / সদস্য নির্বাচন করুন</label>
                        <select
                          value={selectedMemberId}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                          required
                          className="form-input"
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
                      <label className="form-label">টাকার পরিমাণ (৳)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={txnAmount}
                        onChange={(e) => setTxnAmount(e.target.value)}
                        placeholder="টাকার অংক দিন"
                        className="form-input"
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ background: '#165b33' }}>
                      লেনদেন সম্পন্ন করুন ও নোটিফিকেশন পাঠান
                    </button>
                    <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                      * স্বয়ংক্রিয়ভাবে +8801689333000 নম্বরে হোয়াটসঅ্যাপ নোটিফিকেশন প্রস্তুত হবে।
                    </p>
                  </form>

                  {/* নতুন গ্রাহক নিবন্ধন */}
                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#334155' }}>
                      + নতুন ব্যাংকিং গ্রাহক নিবন্ধন
                    </h3>
                    <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        required
                        placeholder="সদস্যের নাম"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 12px' }}
                      />
                      <input
                        type="text"
                        placeholder="মোবাইল নম্বর"
                        value={newMemberPhone}
                        onChange={(e) => setNewMemberPhone(e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 12px' }}
                      />
                      <input
                        type="number"
                        placeholder="প্রাথমিক সঞ্চয় জমা (ঐচ্ছিক)"
                        value={initialSavings}
                        onChange={(e) => setInitialSavings(e.target.value)}
                        className="form-input"
                        style={{ padding: '8px 12px' }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: '9px',
                          background: '#1e293b',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        গ্রাহক যোগ করুন
                      </button>
                    </form>
                  </div>
                </div>

                {/* দৈনিক ক্যাশ বহি */}
                <div className="card">
                  <div className="card-header">দৈনিক লেনদেন রেজিস্টার (Cash Book)</div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>তারিখ ও সময়</th>
                          <th>গ্রাহক</th>
                          <th>খাত</th>
                          <th>টাইপ</th>
                          <th>পরিমাণ</th>
                          <th>নোটিশ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t.id}>
                            <td style={{ color: '#64748b', fontSize: '12px' }}>
                              {t.date}<br />{t.time}
                            </td>
                            <td>
                              <strong>{t.memberName}</strong>
                              <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>ID: {t.memberId}</span>
                            </td>
                            <td>{t.category}</td>
                            <td>
                              <span className={`badge ${t.type === 'credit' ? 'badge-green' : 'badge-red'}`}>
                                {t.type === 'credit' ? '+ জমা (Credit)' : '- খরচ (Debit)'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                              ৳ {t.amount.toLocaleString('en-IN')}
                            </td>
                            <td>
                              <button
                                onClick={() => sendWhatsAppNotification(t)}
                                style={{
                                  background: '#16a34a',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
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

            {/* ট্যাব ২: অ্যাকাউন্টস রিপোর্ট */}
            {activeTab === 'accounts' && isManagement && (
              <div>
                <div className="kpi-grid">
                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>ক্যাশ ইন হ্যান্ড (নিট জমা)</span>
                    <div className="kpi-value" style={{ color: '#165b33' }}>
                      ৳ {netCashInHand.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>মোট সঞ্চয় আমানত</span>
                    <div className="kpi-value" style={{ color: '#2563eb' }}>
                      ৳ {totalMemberSavings.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>মাঠ পর্যায়ে ঋণ পাওনা</span>
                    <div className="kpi-value" style={{ color: '#d97706' }}>
                      ৳ {totalOutstandingLoan.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>মোট ব্যাংকিং গ্রাহক</span>
                    <div className="kpi-value" style={{ color: '#7c3aed' }}>
                      {members.length} জন
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">গ্রাহক লেজার ও আর্থিক ব্যালেন্স বিবরণী</div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>আইডি</th>
                          <th>নাম</th>
                          <th>মোবাইল</th>
                          <th>মোট সঞ্চয়</th>
                          <th>বর্তমান ঋণ</th>
                          <th>অবস্থা</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.id}>
                            <td style={{ color: '#64748b' }}>{m.id}</td>
                            <td><strong>{m.name}</strong></td>
                            <td>{m.phone}</td>
                            <td style={{ color: '#165b33', fontWeight: 700, fontFamily: 'monospace' }}>
                              ৳ {m.savingsBalance.toLocaleString('en-IN')}
                            </td>
                            <td style={{ color: '#d97706', fontWeight: 700, fontFamily: 'monospace' }}>
                              ৳ {m.loanBalance.toLocaleString('en-IN')}
                            </td>
                            <td>
                              <span className={`badge ${m.savingsBalance >= m.loanBalance ? 'badge-green' : 'badge-red'}`}>
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

            {/* ট্যাব ৩: ইউজার ও অ্যাডমিন */}
            {activeTab === 'users' && (
              <div className="grid-layout">
                <div className="card">
                  <div className="card-header">+ নতুন ইউজার যোগ করুন</div>
                  <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="form-label">ইউজারনেম</label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="যেমন: rohim"
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">পদবী / রোল (Role)</label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as any)}
                        className="form-input"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Field Officer">Field Officer</option>
                        <option value="General">General (সাধারণ সদস্য)</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">লগইন পাসওয়ার্ড</label>
                      <input
                        type="text"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="form-input"
                      />
                    </div>

                    <button type="submit" className="btn-primary">
                      ইউজার একাউন্ট খুলুন
                    </button>
                  </form>
                </div>

                <div className="card">
                  <div className="card-header">অনুমোদিত ইউজার তালিকা</div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>আইডি</th>
                          <th>ইউজারনেম</th>
                          <th>রোল</th>
                          <th>পাসওয়ার্ড</th>
                          <th>অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td style={{ color: '#64748b', fontSize: '11px' }}>{u.id}</td>
                            <td><strong>{u.username}</strong></td>
                            <td>
                              <span className={`badge ${u.role === 'Super Admin' ? 'badge-amber' : 'badge-blue'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'monospace' }}>
                              {currentUser.role === 'Super Admin' ? u.password : '••••••'}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {currentUser.role === 'Super Admin' && (
                                  <button
                                    onClick={() => handleStartEdit(u)}
                                    style={{
                                      background: '#f59e0b',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    এডিট
                                  </button>
                                )}
                                {u.role !== 'Super Admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    style={{
                                      background: '#ef4444',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      fontSize: '11px',
                                      cursor: 'pointer'
                                    }}
                                  >
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

            {/* ট্যাব ৪: নোটিশ বোর্ড */}
            {activeTab === 'notices' && (
              <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <h2 style={{ fontSize: '18px', color: '#165b33', marginBottom: '10px' }}>
                  অফিসিয়াল নোটিশ বোর্ড
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                  সমিতির সকল কিস্তি ও সঞ্চয় আদায়ের তথ্য তাৎক্ষণিক সেন্ট্রাল ম্যানেজমেন্টে নিবন্ধিত হচ্ছে।
                </p>
              </div>
            )}
          </main>

          {/* ইউজার এডিট পপআপ মডাল */}
          {editingUser && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 999
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: '#1e293b' }}>
                  ইউজার তথ্য এডিট করুন ({editingUser.username})
                </h3>
                <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label">ইউজারনেম</label>
                    <input
                      type="text"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">পাসওয়ার্ড</label>
                    <input
                      type="text"
                      required
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">পদবী / রোল</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                      className="form-input"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Field Officer">Field Officer</option>
                      <option value="General">General (সাধারণ সদস্য)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, background: '#165b33' }}>
                      সংরক্ষণ করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      style={{
                        padding: '10px 18px',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}