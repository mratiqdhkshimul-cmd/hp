'use client';

import React, { useState } from 'react';

export default function MicrocreditApp() {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Application Data States
  const [users, setUsers] = useState([
    { id: '1', username: 'atiq', role: 'Super Admin', pass: 'atiq', status: 'সক্রিয়' },
    { id: '1792534535877', username: 'selim', role: 'Manager', pass: '123', status: 'সক্রিয়' }
  ]);

  const [members, setMembers] = useState([
    { id: '101', name: 'মোঃ রহিম উদ্দিন', mobile: '01711000000', address: 'চর ভাটিয়ানী', status: 'সক্রিয়' },
    { id: '102', name: 'মোহাম্মদ করিম', mobile: '01812000000', address: 'মাদারগঞ্জ, জামালপুর', status: 'সক্রিয়' }
  ]);

  const [loans, setLoans] = useState([
    { id: 'L-501', memberName: 'মোঃ রহিম উদ্দিন', amount: 25000, paid: 15000, status: 'চলমান' },
    { id: 'L-502', memberName: 'মোহাম্মদ করিম', amount: 25000, paid: 2750, status: 'চলমান' }
  ]);

  const [collections, setCollections] = useState([
    { id: '#901', memberName: 'মোহাম্মদ করিম', amount: 2750, date: '2026-10-15', collector: 'atiq' }
  ]);

  // Form Inputs
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState('Admin');
  const [newPassword, setNewPassword] = useState('');

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberMobile, setNewMemberMobile] = useState('');
  const [newMemberAddress, setNewMemberAddress] = useState('');

  const [loanMember, setLoanMember] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const [collectMember, setCollectMember] = useState('');
  const [collectAmount, setCollectAmount] = useState('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && u.pass === loginPassword);
    if (user) {
      setCurrentUser({ username: user.username, role: user.role });
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginUsername('');
    setLoginPassword('');
  };

  // Add User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;
    const newUser = {
      id: Date.now().toString(),
      username: newUsername.trim().toLowerCase(),
      role: newRole,
      pass: newPassword,
      status: 'সক্রিয়'
    };
    setUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    alert('নতুন ইউজার সফলভাবে যুক্ত হয়েছে!');
  };

  // Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberMobile) return;
    const newM = {
      id: (100 + members.length + 1).toString(),
      name: newMemberName,
      mobile: newMemberMobile,
      address: newMemberAddress,
      status: 'সক্রিয়'
    };
    setMembers([...members, newM]);
    setNewMemberName('');
    setNewMemberMobile('');
    setNewMemberAddress('');
    alert('নতুন সদস্য সফলভাবে নিবন্ধিত হয়েছেন!');
  };

  // Add Loan
  const handleAddLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanMember || !loanAmount) return;
    const newL = {
      id: `L-${500 + loans.length + 1}`,
      memberName: loanMember,
      amount: Number(loanAmount),
      paid: 0,
      status: 'চলমান'
    };
    setLoans([...loans, newL]);
    setLoanMember('');
    setLoanAmount('');
    alert('নতুন ঋণ অনুমোদন করা হয়েছে!');
  };

  // Add Installment Collection
  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectMember || !collectAmount) return;
    const newC = {
      id: `#${900 + collections.length + 1}`,
      memberName: collectMember,
      amount: Number(collectAmount),
      date: new Date().toISOString().split('T')[0],
      collector: currentUser?.username || 'admin'
    };
    setCollections([newC, ...collections]);
    
    // update loan paid amount
    setLoans(loans.map(l => l.memberName === collectMember ? { ...l, paid: l.paid + Number(collectAmount) } : l));

    setCollectMember('');
    setCollectAmount('');
    alert('কিস্তি আদায় সফলভাবে সংরক্ষিত হয়েছে!');
  };

  // ------------------ LOGIN SCREEN ------------------
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'sans-serif' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '36px 30px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#166534', margin: '0 0 6px 0' }}>চর ভাটিয়ানী প্রভাতী সমাজকল্যাণ বহুমুখী সমবায় সমিতি লিঃ</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>মাদারগঞ্জ, জামালপুর | মাইক্রোক্রেডিট ম্যানেজমেন্ট সফটওয়্যার</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>ইউজারনেম</label>
              <input
                type="text"
                placeholder="যেমন: atiq অথবা selim"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="আপনার পাসওয়ার্ড দিন"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {loginError && (
              <p style={{ color: '#dc2626', fontSize: '13px', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>{loginError}</p>
            )}

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}
            >
              নিরাপদ লগইন
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
            সুপার অ্যাডমিন অ্যাক্সেস সুরক্ষিত প্যানেল
          </p>
        </div>
      </div>
    );
  }

  // ------------------ MAIN APPLICATION ------------------
  const totalLoanGiven = loans.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollected = collections.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'sans-serif' }}>
      {/* Top Banner Header */}
      <header style={{ background: '#137547', color: '#ffffff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>চর ভাটিয়ানী প্রভাতী সমাজকল্যাণ বহুমুখী সমবায় সমিতি লিঃ</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.9 }}>মাদারগঞ্জ, জামালপুর | মাইক্রোক্রেডিট সিস্টেম</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>ইউজার: {currentUser?.username}</div>
            <div style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '2px' }}>
              {currentUser?.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            লগআউট
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', gap: '20px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'ড্যাশবোর্ড ওভারভিউ' },
          { id: 'members', label: 'সদস্য তালিকা' },
          { id: 'loans', label: 'ঋণ ব্যবস্থাপনা' },
          { id: 'collection', label: 'কিস্তি আদায়' },
          { id: 'users', label: 'ইউজার ও অ্যাডমিন' },
          { id: 'notice', label: 'পাসওয়ার্ড ও নোটিশ' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '14px 4px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #137547' : '3px solid transparent',
              color: activeTab === tab.id ? '#137547' : '#4b5563',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content Body */}
      <main style={{ padding: '24px', maxWidth: '1350px', margin: '0 auto' }}>

        {/* 1. ড্যাশবোর্ড ওভারভিউ */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>মোট সদস্য সংখ্যা</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#137547', marginTop: '6px' }}>{members.length} জন</div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>মোট বিতরণকৃত ঋণ</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#0284c7', marginTop: '6px' }}>৳ {totalLoanGiven.toLocaleString()}</div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>মোট কিস্তি আদায়</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#16a34a', marginTop: '6px' }}>৳ {totalCollected.toLocaleString()}</div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ color: '#6b7280', fontSize: '13px' }}>চলমান লোন অ্যাকাউন্ট</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#7c3aed', marginTop: '6px' }}>{loans.length} টি</div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1f2937' }}>সাম্প্রতিক কিস্তি আদায় বিবরণী</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
                    <th style={{ padding: '10px' }}>আইডি</th>
                    <th style={{ padding: '10px' }}>সদস্যের নাম</th>
                    <th style={{ padding: '10px' }}>আদায়ের পরিমাণ</th>
                    <th style={{ padding: '10px' }}>তারিখ</th>
                    <th style={{ padding: '10px' }}>আদায়কারী</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 10px', color: '#6b7280' }}>{item.id}</td>
                      <td style={{ padding: '12px 10px', fontWeight: '500' }}>{item.memberName}</td>
                      <td style={{ padding: '12px 10px', color: '#16a34a', fontWeight: 'bold' }}>৳ {item.amount.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px', color: '#6b7280' }}>{item.date}</td>
                      <td style={{ padding: '12px 10px', color: '#6b7280' }}>{item.collector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. সদস্য তালিকা */}
        {activeTab === 'members' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>+ নতুন সদস্য ভর্তি</h3>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#374151' }}>সদস্যের নাম</label>
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#374151' }}>মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={newMemberMobile}
                    onChange={(e) => setNewMemberMobile(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#374151' }}>ঠিকানা</label>
                  <input
                    type="text"
                    value={newMemberAddress}
                    onChange={(e) => setNewMemberAddress(e.target.value)}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '10px', background: '#137547', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                  সদস্য যুক্ত করুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>সকল সদস্যের তালিকা ({members.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '8px' }}>আইডি</th>
                    <th style={{ padding: '8px' }}>নাম</th>
                    <th style={{ padding: '8px' }}>মোবাইল</th>
                    <th style={{ padding: '8px' }}>ঠিকানা</th>
                    <th style={{ padding: '8px' }}>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 8px' }}>{m.id}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{m.name}</td>
                      <td style={{ padding: '10px 8px' }}>{m.mobile}</td>
                      <td style={{ padding: '10px 8px' }}>{m.address}</td>
                      <td style={{ padding: '10px 8px', color: '#16a34a' }}>{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ঋণ ব্যবস্থাপনা */}
        {activeTab === 'loans' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>+ নতুন ঋণ বিতরণ</h3>
              <form onSubmit={handleAddLoan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#374151' }}>সদস্য নির্বাচন করুন</label>
                  <select
                    value={loanMember}
                    onChange={(e) => setLoanMember(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                  >
                    <option value="">-- নির্বাচন করুন --</option>
                    {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#374151' }}>ঋণের পরিমাণ (৳)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                  ঋণ অনুমোদন করুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '20px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#111827' }}>চলমান ঋণের বিবরণী</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '8px' }}>লোন আইডি</th>
                    <th style={{ padding: '8px' }}>সদস্য</th>
                    <th style={{ padding: '8px' }}>মোট ঋণ</th>
                    <th style={{ padding: '8px' }}>পরিশোধিত</th>
                    <th style={{ padding: '8px' }}>অবশিষ্ট</th>
                    <th style={{ padding: '8px' }}>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 8px' }}>{l.id}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{l.memberName}</td>
                      <td style={{ padding: '10px 8px' }}>৳ {l.amount.toLocaleString()}</td>
                      <td style={{ padding: '10px 8px', color: '#16a34a' }}>৳ {l.paid.toLocaleString()}</td>
                      <td style={{ padding: '10px 8px', color: '#dc2626' }}>৳ {(l.amount - l.paid).toLocaleString()}</td>
                      <td style={{ padding: '10px 8px' }}>{l.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. কিস্তি আদায় */}
        {activeTab === 'collection' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', background: '#ffffff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#111827' }}>নিয়মিত কিস্তি জমা গ্রহণ</h3>
            <form onSubmit={handleAddCollection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#374151' }}>ঋণগ্রহীতা সদস্য</label>
                <select
                  value={collectMember}
                  onChange={(e) => setCollectMember(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                >
                  <option value="">-- সদস্য নির্বাচন করুন --</option>
                  {loans.map(l => <option key={l.id} value={l.memberName}>{l.memberName} (বকেয়া: ৳{l.amount - l.paid})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#374151' }}>কিস্তির পরিমাণ (৳)</label>
                <input
                  type="number"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  placeholder="যেমন: ২৫০"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginTop: '4px' }}
                />
              </div>
              <button type="submit" style={{ padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
                কিস্তি জমা নিশ্চিত করুন
              </button>
            </form>
          </div>
        )}

        {/* 5. ইউজার ও অ্যাডমিন ম্যানেজমেন্ট */}
        {activeTab === 'users' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>+ নতুন ইউজার যোগ করুন</h3>
              <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>ইউজারনেম (ইংরেজি ছোট হাত)</label>
                  <input
                    type="text"
                    placeholder="যেমন: selim"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>পদবী / রোল (Role)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Field Officer">Field Officer</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#4b5563', marginBottom: '4px' }}>লগইন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    placeholder="পাসওয়ার্ড নির্ধারণ করুন"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '11px', background: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}
                >
                  ইউজার একাউন্ট খুলুন
                </button>
              </form>
            </div>

            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>অনুমোদিত অ্যাডমিন ও ইউজার তালিকা</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                    <th style={{ padding: '10px 8px' }}>আইডি</th>
                    <th style={{ padding: '10px 8px' }}>ইউজারনেম</th>
                    <th style={{ padding: '10px 8px' }}>রোল (পদবী)</th>
                    <th style={{ padding: '10px 8px' }}>পাসওয়ার্ড</th>
                    <th style={{ padding: '10px 8px' }}>স্ট্যাটাস</th>
                    <th style={{ padding: '10px 8px' }}>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px', color: '#6b7280' }}>{u.id}</td>
                      <td style={{ padding: '12px 8px', fontWeight: '500' }}>{u.username}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          background: u.role === 'Super Admin' ? '#fef3c7' : '#dbeafe',
                          color: u.role === 'Super Admin' ? '#92400e' : '#1e40af'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#6b7280' }}>{u.pass}</td>
                      <td style={{ padding: '12px 8px', color: '#16a34a', fontWeight: 'bold' }}>{u.status}</td>
                      <td style={{ padding: '12px 8px' }}>
                        {u.role !== 'Super Admin' && (
                          <button
                            onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            মুছুন
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. পাসওয়ার্ড ও নোটিশ */}
        {activeTab === 'notice' && (
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>নোটিশ বোর্ড ও গুরুত্বপূর্ণ নির্দেশনা</h3>
            <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
              ১. সকল লেনদেন ও কিস্তির হিসাবের জন্য ক্যাশ ইনপুট দেওয়ার সময় সতর্ক থাকুন।<br />
              ২. নতুন অ্যাডমিন তৈরি করার পর অবশ্যই পাসওয়ার্ড পরিবর্তন করতে বলুন।<br />
              ৩. ফিল্ড অফিসারদের শুধুমাত্র কিস্তি আদায়ের অনুমতি দেওয়া হলো।
            </p>
          </div>
        )}

      </main>
    </div>
  );
}