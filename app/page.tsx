'use client';

import React, { useState, useEffect } from 'react';

// ডেটা টাইপ ডেফিনিশন
interface Member {
  id: number;
  name: string;
  phone: string;
  nid: string;
  address: string;
  joinDate: string;
}

interface Loan {
  id: number;
  memberName: string;
  scheme: string; // যেমন: সাধারণ ঋণ, কৃষি ঋণ
  amount: number;
  interestRate: number; // %
  durationMonths: number;
  totalPayable: number;
  status: 'Active' | 'Paid' | 'Defaulted';
}

interface Collection {
  id: number;
  loanId: number;
  memberName: string;
  installmentAmount: number;
  date: string;
  receivedBy: string;
}

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export default function MicrocreditFullApp() {
  // ১. অথেন্টিকেশন স্টেট
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [loginInputUser, setLoginInputUser] = useState('');
  const [loginInputPass, setLoginInputPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // ২. ন্যাভিগেশন ট্যাব
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'loans' | 'collections' | 'users' | 'settings'>('dashboard');

  // ৩. মূল ডেটাসেট (LocalStorage সহ ডাইনামিক সংরক্ষণ)
  const [members, setMembers] = useState<Member[]>([
    { id: 101, name: 'মোহাম্মদ করিম', phone: '01711000000', nid: '1985269123456', address: 'ভাটিয়ানী, মাদারগঞ্জ', joinDate: '2026-01-10' },
    { id: 102, name: 'মোছাঃ রহিমা বেগম', phone: '01811000000', nid: '1990269123457', address: 'চর ভাটিয়ানী', joinDate: '2026-02-15' }
  ]);

  const [loans, setLoans] = useState<Loan[]>([
    { id: 501, memberName: 'মোহাম্মদ করিম', scheme: 'ক্ষুদ্র ব্যবসা ঋণ', amount: 30000, interestRate: 10, durationMonths: 12, totalPayable: 33000, status: 'Active' },
    { id: 502, memberName: 'মোছাঃ রহিমা বেগম', scheme: 'কৃষি উৎপাদন ঋণ', amount: 20000, interestRate: 8, durationMonths: 6, totalPayable: 20800, status: 'Active' }
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    { id: 901, loanId: 501, memberName: 'মোহাম্মদ করিম', installmentAmount: 2750, date: '2026-10-15', receivedBy: 'atiq' }
  ]);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: 1, username: 'atiq', role: 'Super Admin' }
  ]);

  // নতুন ফর্ম স্টেটসমূহ
  const [newMember, setNewMember] = useState({ name: '', phone: '', nid: '', address: '' });
  const [newLoan, setNewLoan] = useState({ memberName: '', scheme: 'সাধারণ ঋণ', amount: 0, interestRate: 10, durationMonths: 12 });
  const [newCollection, setNewCollection] = useState({ loanId: 0, memberName: '', installmentAmount: 0 });
  const [newAdmin, setNewAdmin] = useState({ username: '', role: 'Admin' });
  const [changePassword, setChangePassword] = useState({ oldPass: '', newPass: '' });
  const [message, setMessage] = useState('');

  // অটো লগইন ও ডাটা রিকভারি
  useEffect(() => {
    const savedAuth = localStorage.getItem('mc_isLoggedIn');
    const savedUser = localStorage.getItem('mc_loggedUser');
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUsername(savedUser);
    }
  }, []);

  // লগইন হ্যান্ডলার
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const u = loginInputUser.trim().toLowerCase();
    const p = loginInputPass.trim();

    // ডিফল্ট সুপার অ্যাডমিন ক্রেডেনশিয়াল
    const storedPass = localStorage.getItem('mc_admin_pass') || 'atiq12345';

    if (u === 'atiq' && p === storedPass) {
      setIsAuthenticated(true);
      setCurrentUsername('atiq');
      localStorage.setItem('mc_isLoggedIn', 'true');
      localStorage.setItem('mc_loggedUser', 'atiq');
    } else {
      setLoginError('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mc_isLoggedIn');
    localStorage.removeItem('mc_loggedUser');
  };

  // মেম্বার অ্যাড
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;
    const added: Member = {
      id: Date.now(),
      ...newMember,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setMembers([added, ...members]);
    setNewMember({ name: '', phone: '', nid: '', address: '' });
    triggerAlert('সদস্য সফলভাবে যুক্ত করা হয়েছে!');
  };

  // লোন অ্যাড
  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoan.memberName || newLoan.amount <= 0) return;
    const total = Number(newLoan.amount) + (Number(newLoan.amount) * (Number(newLoan.interestRate) / 100));
    const addedLoan: Loan = {
      id: Math.floor(100 + Math.random() * 900),
      memberName: newLoan.memberName,
      scheme: newLoan.scheme,
      amount: Number(newLoan.amount),
      interestRate: Number(newLoan.interestRate),
      durationMonths: Number(newLoan.durationMonths),
      totalPayable: total,
      status: 'Active'
    };
    setLoans([addedLoan, ...loans]);
    setNewLoan({ memberName: '', scheme: 'সাধারণ ঋণ', amount: 0, interestRate: 10, durationMonths: 12 });
    triggerAlert('লোন সফলভাবে বরাদ্দ করা হয়েছে!');
  };

  // কালেকশন অ্যাড
  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollection.memberName || newCollection.installmentAmount <= 0) return;
    const addedCol: Collection = {
      id: Date.now(),
      loanId: newCollection.loanId || 101,
      memberName: newCollection.memberName,
      installmentAmount: Number(newCollection.installmentAmount),
      date: new Date().toISOString().split('T')[0],
      receivedBy: currentUsername
    };
    setCollections([addedCol, ...collections]);
    setNewCollection({ loanId: 0, memberName: '', installmentAmount: 0 });
    triggerAlert('কিস্তি আদায় সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // ইউজার তৈরি
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username) return;
    setAdminUsers([...adminUsers, { id: Date.now(), username: newAdmin.username.toLowerCase(), role: newAdmin.role }]);
    setNewAdmin({ username: '', role: 'Admin' });
    triggerAlert('নতুন অ্যাডমিন/ইউজার সংযুক্ত করা হয়েছে!');
  };

  // পাসওয়ার্ড পরিবর্তন
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStoredPass = localStorage.getItem('mc_admin_pass') || 'atiq12345';
    if (changePassword.oldPass !== currentStoredPass) {
      triggerAlert('বর্তমান পাসওয়ার্ড ভুল দিয়েছেন!');
      return;
    }
    if (changePassword.newPass.length < 5) {
      triggerAlert('নতুন পাসওয়ার্ড অন্তত ৫ অক্ষরের হতে হবে!');
      return;
    }
    localStorage.setItem('mc_admin_pass', changePassword.newPass);
    setChangePassword({ oldPass: '', newPass: '' });
    triggerAlert('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
  };

  const triggerAlert = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // ====================== ১. লগইন ইন্টারফেস ======================
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #091e3a 0%, #2f80ed 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          
          <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '19px', color: '#1e293b', fontWeight: 800, lineHeight: 1.4 }}>
              চর ভাটিয়ানী প্রভাতী সমাজকল্যাণ বহুমুখী সমবায় সমিতি লিঃ
            </h2>
            <p style={{ margin: '6px 0 0 0', color: '#0284c7', fontSize: '14px', fontWeight: 600 }}>
              মাদারগঞ্জ, জামালপুর
            </p>
            <span style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
              মাইক্রোক্রেডিট ম্যানেজমেন্ট সফটওয়্যার
            </span>
          </div>

          {loginError && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>সুপার অ্যাডমিন ইউজারনেম</label>
              <input
                type="text"
                placeholder="atiq"
                value={loginInputUser}
                onChange={(e) => setLoginInputUser(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginInputPass}
                onChange={(e) => setLoginInputPass(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ marginTop: '8px', padding: '13px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}
            >
              নিরাপদ লগইন
            </button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>সুপার অ্যাডমিন অ্যাক্সেস সুরক্ষিত প্যানেল</p>
        </div>
      </div>
    );
  }

  // ====================== ২. মূল ড্যাশবোর্ড ইন্টারফেস ======================
  const totalLoanAmount = loans.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollections = collections.reduce((acc, curr) => acc + curr.installmentAmount, 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#1e293b', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* টপ হেডার বার */}
      <header style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
            চর ভাটিয়ানী প্রভাতী সমাজকল্যাণ বহুমুখী সমবায় সমিতি লিঃ
          </h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>মাদারগঞ্জ, জামালপুর | মাইক্রোক্রেডিট সিস্টেম</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '13px', color: '#e2e8f0', display: 'block' }}>ইউজার: <strong>{currentUsername}</strong></span>
            <span style={{ fontSize: '11px', color: '#4ade80' }}>● সুপার অ্যাডমিন মোড</span>
          </div>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            লগআউট
          </button>
        </div>
      </header>

      {/* মেসেজ অ্যালার্ট বার */}
      {message && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px 28px', fontWeight: 600, fontSize: '14px', borderBottom: '1px solid #bbf7d0', textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* নেভিগেশন মেনুবার */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', padding: '0 28px' }}>
        {[
          { id: 'dashboard', label: '📊 ড্যাশবোর্ড ওভারভিউ' },
          { id: 'members', label: '👥 সদস্য তালিকা' },
          { id: 'loans', label: '💰 ঋণ ব্যবস্থাপনা' },
          { id: 'collections', label: '📑 কিস্তি আদায়' },
          { id: 'users', label: '🔑 ইউজার ও অ্যাডমিন' },
          { id: 'settings', label: '⚙️ পাসওয়ার্ড ও সেটিংস' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '14px 18px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #0284c7' : '3px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#0284c7' : '#64748b',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* মূল কনটেন্ট এরিয়া */}
      <main style={{ padding: '28px', maxWidth: '1300px', margin: '0 auto' }}>

        {/* ১. ড্যাশবোর্ড ওভারভিউ ট্যাব */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #0284c7', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>মোট সদস্য সংখ্যা</span>
                <h2 style={{ margin: '8px 0 0', fontSize: '28px', color: '#0f172a' }}>{members.length} জন</h2>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #16a34a', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>মোট বিতরণকৃত ঋণ</span>
                <h2 style={{ margin: '8px 0 0', fontSize: '28px', color: '#0f172a' }}>৳ {totalLoanAmount.toLocaleString()}</h2>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #eab308', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>মোট কিস্তি আদায়</span>
                <h2 style={{ margin: '8px 0 0', fontSize: '28px', color: '#0f172a' }}>৳ {totalCollections.toLocaleString()}</h2>
              </div>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #8b5cf6', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>চলমান লোন অ্যাকাউন্ট</span>
                <h2 style={{ margin: '8px 0 0', fontSize: '28px', color: '#0f172a' }}>{loans.filter(l => l.status === 'Active').length} টি</h2>
              </div>
            </div>

            {/* শর্টকাট সাম্প্রতিক কালেকশন টেবিল */}
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b' }}>সাম্প্রতিক আদায় বিবরণী</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px' }}>আইডি</th>
                    <th style={{ padding: '12px' }}>সদস্যের নাম</th>
                    <th style={{ padding: '12px' }}>আদায়ের পরিমাণ</th>
                    <th style={{ padding: '12px' }}>তারিখ</th>
                    <th style={{ padding: '12px' }}>আদায়কারী</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>#{c.id}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{c.memberName}</td>
                      <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>৳ {c.installmentAmount}</td>
                      <td style={{ padding: '12px' }}>{c.date}</td>
                      <td style={{ padding: '12px' }}>{c.receivedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ২. সদস্য ব্যবস্থাপনা ট্যাব */}
        {activeTab === 'members' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', color: '#0284c7' }}>+ নতুন সদস্য ফরম</h3>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="সদস্যের পূর্ণ নাম"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="মোবাইল নম্বর"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="জাতীয় পরিচয়পত্র (NID)"
                  value={newMember.nid}
                  onChange={(e) => setNewMember({ ...newMember, nid: e.target.value })}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <textarea
                  placeholder="ঠিকানা (গ্রাম, ইউনিয়ন)"
                  value={newMember.address}
                  onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  সদস্য যুক্ত করুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>নিবন্ধিত সদস্যদের তালিকা</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px' }}>আইডি</th>
                    <th style={{ padding: '10px' }}>নাম</th>
                    <th style={{ padding: '10px' }}>মোবাইল</th>
                    <th style={{ padding: '10px' }}>এনআইডি</th>
                    <th style={{ padding: '10px' }}>ঠিকানা</th>
                    <th style={{ padding: '10px' }}>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}>{m.id}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{m.name}</td>
                      <td style={{ padding: '10px' }}>{m.phone}</td>
                      <td style={{ padding: '10px' }}>{m.nid}</td>
                      <td style={{ padding: '10px' }}>{m.address}</td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => setMembers(members.filter((x) => x.id !== m.id))}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          মুছুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ৩. ঋণ ও স্কিম ব্যবস্থাপনা ট্যাব */}
        {activeTab === 'loans' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', color: '#16a34a' }}>+ নতুন ঋণ বিতরণ</h3>
              <form onSubmit={handleAddLoan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="সদস্যের নাম"
                  value={newLoan.memberName}
                  onChange={(e) => setNewLoan({ ...newLoan, memberName: e.target.value })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <select
                  value={newLoan.scheme}
                  onChange={(e) => setNewLoan({ ...newLoan, scheme: e.target.value })}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="সাধারণ ক্ষুদ্র ঋণ">সাধারণ ক্ষুদ্র ঋণ</option>
                  <option value="কৃষি উৎপাদন ঋণ">কৃষি উৎপাদন ঋণ</option>
                  <option value="ব্যবসায়িক স্কিম ঋণ">ব্যবসায়িক স্কিম ঋণ</option>
                  <option value="জরুরী সহায়তা লোন">জরুরী সহায়তা লোন</option>
                </select>
                <input
                  type="number"
                  placeholder="ঋণের পরিমাণ (টাকা)"
                  value={newLoan.amount || ''}
                  onChange={(e) => setNewLoan({ ...newLoan, amount: Number(e.target.value) })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="সুদ %"
                    value={newLoan.interestRate}
                    onChange={(e) => setNewLoan({ ...newLoan, interestRate: Number(e.target.value) })}
                    style={{ width: '50%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="number"
                    placeholder="মেয়াদ (মাস)"
                    value={newLoan.durationMonths}
                    onChange={(e) => setNewLoan({ ...newLoan, durationMonths: Number(e.target.value) })}
                    style={{ width: '50%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <button type="submit" style={{ padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  ঋণ অনুমোদন করুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>সক্রিয় ঋণের বিবরণী ও স্ট্যাটাস</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px' }}>লোন নং</th>
                    <th style={{ padding: '10px' }}>সদস্য</th>
                    <th style={{ padding: '10px' }}>স্কিম</th>
                    <th style={{ padding: '10px' }}>মূল টাকা</th>
                    <th style={{ padding: '10px' }}>মোট ফেরতযোগ্য</th>
                    <th style={{ padding: '10px' }}>অবস্থা</th>
                    <th style={{ padding: '10px' }}>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((l) => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}>#{l.id}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{l.memberName}</td>
                      <td style={{ padding: '10px' }}>{l.scheme}</td>
                      <td style={{ padding: '10px' }}>৳ {l.amount}</td>
                      <td style={{ padding: '10px', color: '#0284c7', fontWeight: 'bold' }}>৳ {l.totalPayable}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ background: l.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: l.status === 'Active' ? '#15803d' : '#64748b', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => setLoans(loans.filter((x) => x.id !== l.id))}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          মুছুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ৪. কিস্তি আদায় ট্যাব */}
        {activeTab === 'collections' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', color: '#eab308' }}>+ কিস্তি আদায় এন্ট্রি</h3>
              <form onSubmit={handleAddCollection} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="সদস্যের নাম"
                  value={newCollection.memberName}
                  onChange={(e) => setNewCollection({ ...newCollection, memberName: e.target.value })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="number"
                  placeholder="আদায়ের পরিমাণ (টাকা)"
                  value={newCollection.installmentAmount || ''}
                  onChange={(e) => setNewCollection({ ...newCollection, installmentAmount: Number(e.target.value) })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#eab308', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  কালেকশন সেভ করুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>আদায়কৃত কিস্তির বিস্তারিত খতিয়ান</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px' }}>রশিদ নং</th>
                    <th style={{ padding: '10px' }}>সদস্য</th>
                    <th style={{ padding: '10px' }}>পরিমাণ</th>
                    <th style={{ padding: '10px' }}>তারিখ</th>
                    <th style={{ padding: '10px' }}>কালেকশন অফিসার</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}>#{c.id}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{c.memberName}</td>
                      <td style={{ padding: '10px', color: '#16a34a', fontWeight: 'bold' }}>৳ {c.installmentAmount}</td>
                      <td style={{ padding: '10px' }}>{c.date}</td>
                      <td style={{ padding: '10px' }}>{c.receivedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ৫. সুপার অ্যাডমিন ও ইউজার তৈরি প্যানেল */}
        {activeTab === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', color: '#8b5cf6' }}>+ নতুন ইউজার যোগ করুন</h3>
              <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="ইউজারনেম (ইংরেজি ছোট হাত)"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  required
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Field Officer">Field Officer</option>
                </select>
                <button type="submit" style={{ padding: '10px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  ইউজার অ্যাকাউন্ট খুলুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>অনুমোদিত অ্যাডমিন ও ইউজার তালিকা</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px' }}>আইডি</th>
                    <th style={{ padding: '10px' }}>ইউজারনেম</th>
                    <th style={{ padding: '10px' }}>রোল (পদবি)</th>
                    <th style={{ padding: '10px' }}>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px' }}>{u.id}</td>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{u.username}</td>
                      <td style={{ padding: '10px' }}>{u.role}</td>
                      <td style={{ padding: '10px', color: '#16a34a' }}>সক্রিয়</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ৬. সেটিংস ও পাসওয়ার্ড পরিবর্তন */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '480px', background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#0f172a' }}>সুপার অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>ইউজার `atiq` এর বর্তমান পাসওয়ার্ড পরিবর্তন করতে নিচের ঘরগুলো পূরণ করুন।</p>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  value={changePassword.oldPass}
                  onChange={(e) => setChangePassword({ ...changePassword, oldPass: e.target.value })}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>নতুন পাসওয়ার্ড</label>
                <input
                  type="password"
                  value={changePassword.newPass}
                  onChange={(e) => setChangePassword({ ...changePassword, newPass: e.target.value })}
                  placeholder="নতুন পাসওয়ার্ড দিন"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>
              <button
                type="submit"
                style={{ padding: '11px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                পাসওয়ার্ড আপডেট করুন
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}