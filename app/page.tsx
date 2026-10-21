'use client';

import React, { useState, useEffect } from 'react';

interface UserMember {
  id: string;
  username: string;
  password?: string;
  phone: string;
  email: string;
  nid: string;
  fatherName: string;
  spouseName: string;
  introducerName: string;
  presentAddress: string;
  permanentAddress: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Field Officer' | 'General';
  status: 'সক্রিয়' | 'নিষ্ক্রিয়';
  savingsBalance: number;
  loanBalance: number;
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

export default function MicrocreditApp() {
  const [currentUser, setCurrentUser] = useState<UserMember | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // পাসওয়ার্ড রিসেট স্টেট
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [newPasswordReset, setNewPasswordReset] = useState('');
  const [resetTargetUser, setResetTargetUser] = useState<UserMember | null>(null);

  // নেভিগেশন ট্যাব
  const [activeTab, setActiveTab] = useState<'banking' | 'accounts' | 'reports' | 'users' | 'search' | 'notices'>('banking');

  // সেন্ট্রাল ডাটাবেস
  const [members, setMembers] = useState<UserMember[]>([
    {
      id: '1',
      username: 'atiq',
      password: '123',
      phone: '01689333000',
      email: 'atiq@example.com',
      nid: '1987000000001',
      fatherName: 'মো: রফিকুল ইসলাম',
      spouseName: 'গৃহিণী',
      introducerName: 'সেলিম রেজা',
      presentAddress: 'মাদারগঞ্জ, জামালপুর',
      permanentAddress: 'মাদারগঞ্জ, জামালপুর',
      role: 'Super Admin',
      status: 'সক্রিয়',
      savingsBalance: 0,
      loanBalance: 0
    },
    {
      id: '2',
      username: 'selim',
      password: '123',
      phone: '01711000000',
      email: 'selim@example.com',
      nid: '1990000000002',
      fatherName: 'আজিজুল হক',
      spouseName: 'নাজমা বেগম',
      introducerName: 'আতিকুর রহমান',
      presentAddress: 'জামালপুর সদর',
      permanentAddress: 'জামালপুর সদর',
      role: 'Manager',
      status: 'সক্রিয়',
      savingsBalance: 5000,
      loanBalance: 0
    },
    {
      id: '3',
      username: 'sakib',
      password: '123',
      phone: '01811000000',
      email: 'sakib@example.com',
      nid: '1995000000003',
      fatherName: 'লুৎফর রহমান',
      spouseName: '',
      introducerName: 'সেলিম রেজা',
      presentAddress: 'চরভাটিয়ানী, মাদারগঞ্জ',
      permanentAddress: 'চরভাটিয়ানী, মাদারগঞ্জ',
      role: 'General',
      status: 'সক্রিয়',
      savingsBalance: 1200,
      loanBalance: 15000
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TRX-1001',
      date: '2026-10-21',
      time: '09:30 AM',
      memberId: '3',
      memberName: 'sakib',
      type: 'credit',
      category: 'কিস্তি আদায়',
      amount: 2500,
      recordedBy: 'selim'
    }
  ]);

  // লেনদেন স্টেট
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [txnCategory, setTxnCategory] = useState<'কিস্তি আদায়' | 'সঞ্চয় জমা' | 'ঋণ বিতরণ' | 'সঞ্চয় উত্তোলন' | 'অফিস খরচ'>('কিস্তি আদায়');
  const [txnAmount, setTxnAmount] = useState('');

  // নতুন সদস্য স্টেট
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNid, setNewNid] = useState('');
  const [newFatherName, setNewFatherName] = useState('');
  const [newSpouseName, setNewSpouseName] = useState('');
  const [newIntroducerName, setNewIntroducerName] = useState('');
  const [newPresentAddress, setNewPresentAddress] = useState('');
  const [newPermanentAddress, setNewPermanentAddress] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Manager' | 'Field Officer' | 'General'>('General');
  const [initialSavings, setInitialSavings] = useState('');
  const [initialLoan, setInitialLoan] = useState('');

  // সার্চ স্টেট
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<UserMember[]>([]);

  // এডিট স্টেট
  const [editingMember, setEditingMember] = useState<UserMember | null>(null);

  // নোটিশ স্টেট
  const [noticeMessage, setNoticeMessage] = useState('');

  // লোকাল স্টোরেজ সিঙ্ক
  useEffect(() => {
    const savedMembers = localStorage.getItem('mc_app_master_members_v3');
    if (savedMembers) {
      try { setMembers(JSON.parse(savedMembers)); } catch (e) { console.error(e); }
    }
    const savedTxns = localStorage.getItem('mc_app_master_txns_v3');
    if (savedTxns) {
      try { setTransactions(JSON.parse(savedTxns)); } catch (e) { console.error(e); }
    }
    const session = localStorage.getItem('mc_app_session_v3');
    if (session) {
      try { setCurrentUser(JSON.parse(session)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveMembers = (data: UserMember[]) => {
    setMembers(data);
    localStorage.setItem('mc_app_master_members_v3', JSON.stringify(data));
  };

  const saveTransactions = (data: Transaction[]) => {
    setTransactions(data);
    localStorage.setItem('mc_app_master_txns_v3', JSON.stringify(data));
  };

  // হোয়াটসঅ্যাপ নোটিফিকেশন ইঞ্জিন
  const sendWhatsApp = (msg: string) => {
    const targetPhone = '8801689333000';
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // লেনদেন এন্ট্রি
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnAmount || Number(txnAmount) <= 0) return;

    const amount = Number(txnAmount);
    const member = members.find((m) => m.id === selectedMemberId);

    if (txnCategory !== 'অফিস খরচ' && !member) {
      alert('দয়া করে একজন সদস্য নির্বাচন করুন');
      return;
    }

    const memberName = member ? member.username : 'অফিস সাধারণ ব্যয়';
    const isCredit = txnCategory === 'কিস্তি আদায়' || txnCategory === 'সঞ্চয় জমা';

    const newTxn: Transaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      memberId: member ? member.id : 'OFFICE',
      memberName,
      type: isCredit ? 'credit' : 'debit',
      category: txnCategory,
      amount,
      recordedBy: currentUser?.username || 'admin'
    };

    if (member) {
      const updated = members.map((m) => {
        if (m.id === member.id) {
          let s = m.savingsBalance;
          let l = m.loanBalance;
          if (txnCategory === 'সঞ্চয় জমা') s += amount;
          if (txnCategory === 'সঞ্চয় উত্তোলন') s = Math.max(0, s - amount);
          if (txnCategory === 'ঋণ বিতরণ') l += amount;
          if (txnCategory === 'কিস্তি আদায়') l = Math.max(0, l - amount);
          return { ...m, savingsBalance: s, loanBalance: l };
        }
        return m;
      });
      saveMembers(updated);
    }

    const updatedTxns = [newTxn, ...transactions];
    saveTransactions(updatedTxns);

    // নোটিফিকেশন তৈরি
    const msg = `*🔔 নতুন আর্থিক লেনদেন নোটিশ*\n` +
      `--------------------------------\n` +
      `🏢 *প্রতিষ্ঠান:* চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লি:\n` +
      `📅 *তারিখ ও সময়:* ${newTxn.date} | ${newTxn.time}\n` +
      `📝 *খাত:* ${newTxn.category} (${newTxn.type === 'credit' ? 'জমা / Credit' : 'খরচ / Debit'})\n` +
      `👤 *সদস্য:* ${newTxn.memberName} (ID: ${newTxn.memberId})\n` +
      `💰 *পরিমাণ:* ৳ ${newTxn.amount.toLocaleString('en-IN')}\n` +
      `👨‍💼 *অপারেটর:* ${newTxn.recordedBy}\n` +
      `--------------------------------\n` +
      `_সফটওয়্যার নোটিফিকেশন সিস্টেম_`;
    sendWhatsApp(msg);

    setTxnAmount('');
    setSelectedMemberId('');
    alert('লেনদেন সম্পন্ন হয়েছে!');
  };

  // নতুন সদস্য যুক্তকরণ
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    const uname = newUsername.trim().toLowerCase();
    if (members.some((m) => m.username.toLowerCase() === uname)) {
      alert('এই ইউজারনেম ইতোমধ্যে বিদ্যমান!');
      return;
    }

    const newMember: UserMember = {
      id: Date.now().toString(),
      username: uname,
      password: newPassword.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim().toLowerCase(),
      nid: newNid.trim(),
      fatherName: newFatherName.trim(),
      spouseName: newSpouseName.trim(),
      introducerName: newIntroducerName.trim(),
      presentAddress: newPresentAddress.trim(),
      permanentAddress: newPermanentAddress.trim(),
      role: newRole,
      status: 'সক্রিয়',
      savingsBalance: Number(initialSavings) || 0,
      loanBalance: Number(initialLoan) || 0
    };

    saveMembers([...members, newMember]);

    // ফর্ম রিসেট
    setNewUsername('');
    setNewPassword('');
    setNewPhone('');
    setNewEmail('');
    setNewNid('');
    setNewFatherName('');
    setNewSpouseName('');
    setNewIntroducerName('');
    setNewPresentAddress('');
    setNewPermanentAddress('');
    setInitialSavings('');
    setInitialLoan('');
    alert(`সদস্য "${uname}" সফলভাবে নিবন্ধিত হয়েছে!`);
  };

  // সদস্য অনুসন্ধান
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResult([]);
      return;
    }
    const res = members.filter(
      (m) => m.username.toLowerCase().includes(q) || m.phone.includes(q) || m.nid.includes(q)
    );
    setSearchResult(res);
  };

  // নোটিশ থেকে হোয়াটসঅ্যাপ প্রেরণ
  const handleSendNoticeWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeMessage.trim()) return;
    const msg = `*📢 নোটিশ বোর্ড বার্তা*\n` +
      `--------------------------------\n` +
      `🏢 *প্রতিষ্ঠান:* চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লি:\n` +
      `👤 *প্রেরক:* ${currentUser?.username} (${currentUser?.role})\n` +
      `📅 *তারিখ:* ${new Date().toLocaleDateString('bn-BD')}\n` +
      `💬 *বার্তা:* ${noticeMessage.trim()}\n` +
      `--------------------------------`;
    sendWhatsApp(msg);
    setNoticeMessage('');
    alert('বার্তাটি হোয়াটসঅ্যাপে প্রেরণের জন্য প্রস্তুত করা হয়েছে!');
  };

  // পাসওয়ার্ড রিসেট ধাপ ১: কোড জেনারেট
  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    const target = members.find((m) => m.email.toLowerCase() === resetEmail.trim().toLowerCase());
    if (!target) {
      alert('এই ইমেইল অ্যাড্রেসটি ডাটাবেজে পাওয়া যায়নি!');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setResetTargetUser(target);
    setResetStep(2);
    alert(`আপনার ইমেইল (${target.email})-এ পাসওয়ার্ড রিসেট কোড পাঠানো হয়েছে: ${code}`);
  };

  // পাসওয়ার্ড রিসেট ধাপ ২: নতুন পাসওয়ার্ড সেভ
  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode !== generatedCode) {
      alert('ভেরিফিকেশন কোডটি সঠিক নয়!');
      return;
    }
    if (!newPasswordReset.trim()) return;

    if (resetTargetUser) {
      const updated = members.map((m) => {
        if (m.id === resetTargetUser.id) {
          return { ...m, password: newPasswordReset.trim() };
        }
        return m;
      });
      saveMembers(updated);
      alert('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন লগইন করুন।');
      setShowForgotModal(false);
      setResetStep(1);
      setResetEmail('');
      setInputCode('');
      setNewPasswordReset('');
    }
  };

  // আর্থিক ক্যালকুলেশন
  const totalCredit = transactions.filter((t) => t.type === 'credit').reduce((a, b) => a + b.amount, 0);
  const totalDebit = transactions.filter((t) => t.type === 'debit').reduce((a, b) => a + b.amount, 0);
  const netCashInHand = totalCredit - totalDebit;
  const totalMemberSavings = members.reduce((a, b) => a + b.savingsBalance, 0);
  const totalOutstandingLoan = members.reduce((a, b) => a + b.loanBalance, 0);

  // লগইন হ্যান্ডলার
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const u = loginUsername.trim().toLowerCase();
    const found = members.find((m) => m.username.toLowerCase() === u && m.password === loginPassword);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('mc_app_session_v3', JSON.stringify(found));
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setLoginError('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const isSuperAdmin = currentUser?.role === 'Super Admin';
  const isManager = currentUser?.role === 'Manager';
  const isOfficerOrAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Field Officer';
  const isManagement = isSuperAdmin || isManager;
  const isGeneral = currentUser?.role === 'General';

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f5f9; color: #1e293b; }
        .login-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at center, #2563eb 0%, #1e40af 50%, #0f2771 100%); padding: 20px; }
        .login-card { width: 100%; max-width: 440px; background: #fff; border-radius: 24px; padding: 36px 28px; box-shadow: 0 20px 45px rgba(0,0,0,0.35); text-align: center; }
        .form-input { width: 100%; padding: 11px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px; outline: none; background: #f8fafc; }
        .form-input:focus { border-color: #2563eb; background: #fff; }
        .btn-primary { width: 100%; padding: 12px; background: #0284c7; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
        .btn-primary:hover { background: #0369a1; }
        .dash-header { background: #165b33; color: #fff; padding: 14px 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
        .dash-nav { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 20px; display: flex; gap: 16px; overflow-x: auto; white-space: nowrap; }
        .nav-btn { padding: 14px 2px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 3px solid transparent; cursor: pointer; }
        .nav-btn.active { color: #165b33; border-bottom-color: #165b33; }
        .dash-container { max-width: 1240px; margin: 0 auto; padding: 20px 14px; }
        .card { background: #fff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.03); margin-bottom: 20px; }
        .card-header { font-size: 15px; font-weight: 700; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f8fafc; color: #475569; padding: 10px; text-align: left; border-bottom: 2px solid #e2e8f0; }
        td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-amber { background: #fef3c7; color: #92400e; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px; }
        .kpi-box { background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
      `}</style>

      {/* ================= ১. লগইন ইন্টারফেস ================= */}
      {!currentUser ? (
        <div className="login-wrapper">
          <div className="login-card">
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#165b33', lineHeight: 1.4, marginBottom: '6px' }}>
              চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড
            </h1>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '22px' }}>
              মাদারগঞ্জ, জামালপুর | ব্যাংকিং ও ফিনান্সিয়াল সিস্টেম
            </p>

            {loginError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '9px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>ইউজারনেম</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="ইউজারনেম লিখুন"
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>পাসওয়ার্ড</label>
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

              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  পাসওয়ার্ড ভুলে গেছেন? রিসেট করুন
                </button>
              </div>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                আতিক এন্টারপ্রাইজ আইটি লি:
              </p>
            </div>
          </div>

          {/* পাসওয়ার্ড রিসেট পপআপ */}
          {showForgotModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 999 }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '380px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>পাসওয়ার্ড রিসেট সিস্টেম</h3>
                {resetStep === 1 ? (
                  <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>সদস্য নিবন্ধনে দেওয়া ভ্যালিড ইমেইলটি লিখুন:</p>
                    <input
                      type="email"
                      required
                      placeholder="যেমন: sakib@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="form-input"
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>কোড পাঠান</button>
                      <button type="button" onClick={() => setShowForgotModal(false)} style={{ padding: '10px 14px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>বাতিল</button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCompleteReset} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '12px', color: '#166534' }}>কোডটি ইনপুট দিয়ে নতুন পাসওয়ার্ড সেট করুন:</p>
                    <input
                      type="text"
                      required
                      placeholder="৬ ডিজিটের কোড"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="password"
                      required
                      placeholder="নতুন পাসওয়ার্ড দিন"
                      value={newPasswordReset}
                      onChange={(e) => setNewPasswordReset(e.target.value)}
                      className="form-input"
                    />
                    <button type="submit" className="btn-primary">পাসওয়ার্ড নিশ্চিত করুন</button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= ২. মূল ড্যাশবোর্ড ================= */
        <div>
          <header className="dash-header">
            <div>
              <h1 style={{ fontSize: '17px', fontWeight: 700 }}>
                চরভাটিয়ানী প্রতিভা সমাজ কল্যাণ বহুমুখী সমবায় সমিতি লিমিটেড
              </h1>
              <p style={{ fontSize: '11px', color: '#a7f3d0' }}>ক্ষুদ্র ঋণ ও সঞ্চয় ব্যাংকিং সিস্টেম</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px' }}>ইউজার: </span>
                <strong style={{ fontSize: '13px' }}>{currentUser.username}</strong>
                <span className="badge badge-amber" style={{ marginLeft: '6px' }}>{currentUser.role}</span>
              </div>
              <button
                onClick={() => { setCurrentUser(null); localStorage.removeItem('mc_app_session_v3'); }}
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                লগআউট
              </button>
            </div>
          </header>

          <nav className="dash-nav">
            <button onClick={() => setActiveTab('banking')} className={`nav-btn ${activeTab === 'banking' ? 'active' : ''}`}>
              💳 ব্যাংকিং ও লেনদেন
            </button>

            {isManagement && (
              <>
                <button onClick={() => setActiveTab('accounts')} className={`nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}>
                  📊 ব্যালেন্স বিবরণী
                </button>
                <button onClick={() => setActiveTab('reports')} className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}>
                  📑 ট্রানজেকশন রিপোর্ট (Monthly)
                </button>
              </>
            )}

            {!isGeneral && (
              <>
                <button onClick={() => setActiveTab('users')} className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}>
                  👥 সদস্য ও ইউজার প্যানেল
                </button>
                <button onClick={() => setActiveTab('search')} className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}>
                  🔍 সদস্য সার্চ ইঞ্জিন
                </button>
              </>
            )}

            <button onClick={() => setActiveTab('notices')} className={`nav-btn ${activeTab === 'notices' ? 'active' : ''}`}>
              🔔 নোটিশ ও বার্তা
            </button>
          </nav>

          <main className="dash-container">
            {/* ================= ট্যাব ১: ব্যাংকিং ও লেনদেন ================= */}
            {activeTab === 'banking' && (
              <div>
                {/* সাধারণ ইউজার রেস্ট্রিকশন */}
                {isGeneral ? (
                  <div className="card">
                    <div className="card-header" style={{ color: '#165b33' }}>আপনার ব্যক্তিগত ব্যাংকিং হিসেব</div>
                    <div className="kpi-grid">
                      <div className="kpi-box">
                        <span style={{ fontSize: '12px', color: '#64748b' }}>আপনার মোট সঞ্চয় স্থিতি</span>
                        <h3 style={{ color: '#165b33', marginTop: '6px' }}>৳ {currentUser.savingsBalance.toLocaleString('en-IN')}</h3>
                      </div>
                      <div className="kpi-box">
                        <span style={{ fontSize: '12px', color: '#64748b' }}>আপনার বর্তমান ঋণ স্থিতি</span>
                        <h3 style={{ color: '#d97706', marginTop: '6px' }}>৳ {currentUser.loanBalance.toLocaleString('en-IN')}</h3>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '13px', margin: '14px 0 8px 0' }}>আপনার লেনদেনের তালিকা</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>তারিখ ও সময়</th>
                            <th>খাত</th>
                            <th>ধরন</th>
                            <th>পরিমাণ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.filter((t) => t.memberName.toLowerCase() === currentUser.username.toLowerCase()).map((t) => (
                            <tr key={t.id}>
                              <td>{t.date} | {t.time}</td>
                              <td>{t.category}</td>
                              <td>
                                <span className={`badge ${t.type === 'credit' ? 'badge-green' : 'badge-red'}`}>
                                  {t.type === 'credit' ? '+ জমা' : '- খরচ/ঋণ'}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700 }}>৳ {t.amount.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* অ্যাডমিন ও ম্যানেজমেন্টের জন্য ফুল ব্যাংকিং এন্ট্রি */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    <div className="card">
                      <div className="card-header" style={{ color: '#165b33' }}>নতুন লেনদেন এন্ট্রি (Debit / Credit)</div>
                      <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>লেনদেনের খাত</label>
                          <select
                            value={txnCategory}
                            onChange={(e) => setTxnCategory(e.target.value as any)}
                            className="form-input"
                            style={{ marginTop: '4px' }}
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
                            <label style={{ fontSize: '12px', fontWeight: 600 }}>গ্রাহক / সদস্য নির্বাচন করুন</label>
                            <select
                              value={selectedMemberId}
                              onChange={(e) => setSelectedMemberId(e.target.value)}
                              required
                              className="form-input"
                              style={{ marginTop: '4px' }}
                            >
                              <option value="">-- সদস্য নির্বাচন করুন --</option>
                              {members.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.username} ({m.role}) - সঞ্চয়: ৳{m.savingsBalance} | ঋণ: ৳{m.loanBalance}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>টাকার পরিমাণ (৳)</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={txnAmount}
                            onChange={(e) => setTxnAmount(e.target.value)}
                            placeholder="টাকার অংক দিন"
                            className="form-input"
                            style={{ marginTop: '4px' }}
                          />
                        </div>

                        <button type="submit" className="btn-primary" style={{ background: '#165b33', marginTop: '6px' }}>
                          লেনদেন সম্পন্ন করুন ও নোটিফিকেশন পাঠান
                        </button>
                      </form>
                    </div>

                    <div className="card">
                      <div className="card-header">সর্বশেষ ক্যাশ ট্রানজেকশন বহি</div>
                      <div style={{ overflowX: 'auto' }}>
                        <table>
                          <thead>
                            <tr>
                              <th>তারিখ</th>
                              <th>সদস্য</th>
                              <th>খাত</th>
                              <th>পরিমাণ</th>
                              <th>টাইপ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.slice(0, 8).map((t) => (
                              <tr key={t.id}>
                                <td>{t.date}</td>
                                <td><strong>{t.memberName}</strong></td>
                                <td>{t.category}</td>
                                <td style={{ fontWeight: 700 }}>৳ {t.amount.toLocaleString('en-IN')}</td>
                                <td>
                                  <span className={`badge ${t.type === 'credit' ? 'badge-green' : 'badge-red'}`}>
                                    {t.type === 'credit' ? '+ ক্রেডিট' : '- ডেবিট'}
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
              </div>
            )}

            {/* ================= ট্যাব ২: অ্যাকাউন্টস রিপোর্ট ================= */}
            {activeTab === 'accounts' && isManagement && (
              <div>
                <div className="kpi-grid">
                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>ক্যাশ ইন হ্যান্ড (নিট স্থিতি)</span>
                    <h3 style={{ color: '#165b33', marginTop: '6px' }}>৳ {netCashInHand.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>মোট সঞ্চয় আমানত</span>
                    <h3 style={{ color: '#2563eb', marginTop: '6px' }}>৳ {totalMemberSavings.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>মাঠ পর্যায়ে মোট ঋণ পাওনা</span>
                    <h3 style={{ color: '#d97706', marginTop: '6px' }}>৳ {totalOutstandingLoan.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="kpi-box">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>মোট নিবন্ধিত সদস্য</span>
                    <h3 style={{ color: '#7c3aed', marginTop: '6px' }}>{members.length} জন</h3>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">সদস্য লেজার ও পূর্ণাঙ্গ ব্যালেন্স বিবরণী</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>আইডি</th>
                          <th>নাম</th>
                          <th>পদবী</th>
                          <th>মোবাইল</th>
                          <th>মোট সঞ্চয়</th>
                          <th>বর্তমান ঋণ</th>
                          <th>আর্থিক অবস্থা</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.id}>
                            <td>{m.id}</td>
                            <td><strong>{m.username}</strong></td>
                            <td><span className="badge badge-amber">{m.role}</span></td>
                            <td>{m.phone}</td>
                            <td style={{ color: '#165b33', fontWeight: 700 }}>৳ {m.savingsBalance.toLocaleString('en-IN')}</td>
                            <td style={{ color: '#d97706', fontWeight: 700 }}>৳ {m.loanBalance.toLocaleString('en-IN')}</td>
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

            {/* ================= ট্যাব ৩: মান্থলি ট্রানজেকশন রিপোর্ট ================= */}
            {activeTab === 'reports' && isManagement && (
              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📑 মাসিক ও চূড়ান্ত ট্রানজেকশন রিপোর্ট</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>মোট রেকর্ড: {transactions.length} টি</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>তারিখ ও সময়</th>
                        <th>ট্রানজেকশন আইডি</th>
                        <th>সদস্যের নাম</th>
                        <th>লেনদেনের খাত</th>
                        <th>ধরন</th>
                        <th>পরিমাণ (৳)</th>
                        <th>এন্ট্রি করেছেন</th>
                        {isSuperAdmin && <th>অ্যাকশন</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id}>
                          <td>{t.date} | {t.time}</td>
                          <td style={{ fontFamily: 'monospace' }}>{t.id}</td>
                          <td><strong>{t.memberName}</strong></td>
                          <td>{t.category}</td>
                          <td>
                            <span className={`badge ${t.type === 'credit' ? 'badge-green' : 'badge-red'}`}>
                              {t.type === 'credit' ? '+ জমা' : '- খরচ'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700 }}>৳ {t.amount.toLocaleString('en-IN')}</td>
                          <td>{t.recordedBy}</td>
                          {isSuperAdmin && (
                            <td>
                              <button
                                onClick={() => {
                                  if (confirm('আপনি কি নিশ্চিতভাবে এই লেনদেনটি মুছতে চান?')) {
                                    saveTransactions(transactions.filter((tx) => tx.id !== t.id));
                                  }
                                }}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                              >
                                মুছুন
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= ট্যাব ৪: সদস্য ও ইউজার প্যানেল ================= */}
            {activeTab === 'users' && !isGeneral && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div className="card">
                  <div className="card-header">+ নতুন সদস্য / ইউজার যোগ করুন</div>
                  <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>ইউজারনেম *</label>
                        <input type="text" required placeholder="sakib" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="form-input" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>পদবী (Role) *</label>
                        <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="form-input">
                          <option value="General">General (সাধারণ সদস্য)</option>
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Field Officer">Field Officer</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>মোবাইল নম্বর *</label>
                        <input type="text" required placeholder="017xxxxxxxx" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="form-input" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>ইমেইল অ্যাড্রেস *</label>
                        <input type="email" required placeholder="name@email.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="form-input" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>এনআইডি নম্বর (NID)</label>
                        <input type="text" placeholder="জাতীয় পরিচয়পত্র নম্বর" value={newNid} onChange={(e) => setNewNid(e.target.value)} className="form-input" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>লগইন পাসওয়ার্ড *</label>
                        <input type="text" required placeholder="পাসওয়ার্ড" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>পিতার নাম</label>
                        <input type="text" placeholder="বাবার নাম" value={newFatherName} onChange={(e) => setNewFatherName(e.target.value)} className="form-input" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>স্বামী / স্ত্রীর নাম</label>
                        <input type="text" placeholder="স্বামী/স্ত্রীর নাম" value={newSpouseName} onChange={(e) => setNewSpouseName(e.target.value)} className="form-input" />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>পরিচয়কারীর নাম</label>
                      <input type="text" placeholder="পরিচয়দানকারীর নাম" value={newIntroducerName} onChange={(e) => setNewIntroducerName(e.target.value)} className="form-input" />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>বর্তমান ঠিকানা</label>
                      <input type="text" placeholder="গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা" value={newPresentAddress} onChange={(e) => setNewPresentAddress(e.target.value)} className="form-input" />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>স্থায়ী ঠিকানা</label>
                      <input type="text" placeholder="স্থায়ী ঠিকানা লিখুন" value={newPermanentAddress} onChange={(e) => setNewPermanentAddress(e.target.value)} className="form-input" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>প্রাথমিক সঞ্চয় (৳)</label>
                        <input type="number" placeholder="0" value={initialSavings} onChange={(e) => setInitialSavings(e.target.value)} className="form-input" />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600 }}>প্রাথমিক ঋণ (৳)</label>
                        <input type="number" placeholder="0" value={initialLoan} onChange={(e) => setInitialLoan(e.target.value)} className="form-input" />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
                      সদস্য যুক্ত করুন ও ব্যাংকিং এ সিঙ্ক করুন
                    </button>
                  </form>
                </div>

                <div className="card">
                  <div className="card-header">অনুমোদিত সদস্য ও ইউজার তালিকা</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>আইডি</th>
                          <th>ইউজারনেম</th>
                          <th>পদবী</th>
                          <th>মোবাইল</th>
                          <th>পাসওয়ার্ড</th>
                          <th>অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td><strong>{u.username}</strong></td>
                            <td><span className="badge badge-amber">{u.role}</span></td>
                            <td>{u.phone}</td>
                            <td style={{ fontFamily: 'monospace' }}>{isSuperAdmin ? u.password : '••••••'}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {isManagement && (
                                  <button
                                    onClick={() => setEditingMember(u)}
                                    style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '3px 7px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                                  >
                                    এডিট
                                  </button>
                                )}
                                {isSuperAdmin && u.role !== 'Super Admin' && (
                                  <button
                                    onClick={() => {
                                      if (confirm('আপনি কি এই সদস্যকে মুছতে চান?')) {
                                        saveMembers(members.filter((m) => m.id !== u.id));
                                      }
                                    }}
                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '3px 7px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
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

            {/* ================= ট্যাব ৫: স্মার্ট সার্চ ইঞ্জিন ================= */}
            {activeTab === 'search' && !isGeneral && (
              <div className="card">
                <div className="card-header">🔍 সদস্য ও গ্রাহক সার্চ ইঞ্জিন (মোবাইল বা ইউজারনেম দিয়ে)</div>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    required
                    placeholder="ইউজারনেম বা মোবাইল নম্বর বা NID লিখুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
                    অনুসন্ধান করুন
                  </button>
                </form>

                {searchResult.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>আইডি</th>
                          <th>নাম</th>
                          <th>মোবাইল</th>
                          <th>ইমেইল</th>
                          <th>পিতা/স্বামী</th>
                          <th>এনআইডি</th>
                          <th>সঞ্চয়</th>
                          <th>ঋণ</th>
                          <th>অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResult.map((m) => (
                          <tr key={m.id}>
                            <td>{m.id}</td>
                            <td><strong>{m.username}</strong></td>
                            <td>{m.phone}</td>
                            <td>{m.email}</td>
                            <td>{m.fatherName || m.spouseName || 'N/A'}</td>
                            <td>{m.nid || 'N/A'}</td>
                            <td style={{ color: '#165b33', fontWeight: 700 }}>৳ {m.savingsBalance}</td>
                            <td style={{ color: '#d97706', fontWeight: 700 }}>৳ {m.loanBalance}</td>
                            <td>
                              {isManagement && (
                                <button
                                  onClick={() => setEditingMember(m)}
                                  style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                                >
                                  এডিট
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#64748b' }}>ডাটাবেজে সার্চ করার জন্য নাম বা নম্বর লিখে অনুসন্ধান বাটনে ক্লিক করুন।</p>
                )}
              </div>
            )}

            {/* ================= ট্যাব ৬: নোটিশ ও হোয়াটসঅ্যাপ বার্তা ================= */}
            {activeTab === 'notices' && (
              <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card-header" style={{ color: '#165b33' }}>
                  🔔 নোটিশ বোর্ড ও সেন্ট্রাল হোয়াটসঅ্যাপ মেসেজ
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                  এখানে যেকোনো বার্তা বা জরুরি নোটিশ লিখে পাঠালে সরাসরি সুপার অ্যাডমিনের হোয়াটসঅ্যাপে (+8801689333000) চলে যাবে।
                </p>
                <form onSubmit={handleSendNoticeWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <textarea
                    rows={4}
                    required
                    placeholder="আপনার বার্তা বা নোটিশটি এখানে লিখুন..."
                    value={noticeMessage}
                    onChange={(e) => setNoticeMessage(e.target.value)}
                    className="form-input"
                  />
                  <button type="submit" className="btn-primary" style={{ background: '#16a34a' }}>
                    হোয়াটসঅ্যাপে নোটিশ পাঠান
                  </button>
                </form>
              </div>
            )}
          </main>

          {/* সদস্য এডিট মডাল */}
          {editingMember && isManagement && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 999 }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>সদস্য তথ্য এডিট ({editingMember.username})</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const updated = members.map((m) => (m.id === editingMember.id ? editingMember : m));
                    saveMembers(updated);
                    setEditingMember(null);
                    alert('তথ্য সংরক্ষিত হয়েছে!');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600 }}>মোবাইল নম্বর</label>
                    <input type="text" value={editingMember.phone} onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600 }}>পাসওয়ার্ড</label>
                    <input type="text" value={editingMember.password} onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600 }}>এনআইডি</label>
                    <input type="text" value={editingMember.nid} onChange={(e) => setEditingMember({ ...editingMember, nid: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600 }}>বর্তমান ঠিকানা</label>
                    <input type="text" value={editingMember.presentAddress} onChange={(e) => setEditingMember({ ...editingMember, presentAddress: e.target.value })} className="form-input" />
                  </div>
                  {isSuperAdmin && (
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>রোল</label>
                      <select value={editingMember.role} onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as any })} className="form-input">
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Field Officer">Field Officer</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button type="submit" className="btn-primary" style={{ flex: 1, background: '#165b33' }}>সংরক্ষণ</button>
                    <button type="button" onClick={() => setEditingMember(null)} style={{ padding: '10px 14px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>বাতিল</button>
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