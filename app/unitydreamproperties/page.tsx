'use client';

import React, { useState, useEffect } from 'react';

// ===================== Interfaces & Types =====================
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'Super Admin' | 'Accounts Head' | 'Accountant' | 'Office Staff' | 'Director' | 'Deputy Director' | 'GM' | 'DGM' | 'AGM' | 'Business Partner' | 'Agent';
  salesKatha: number;
  totalEarnings: number;
  teamSalesKatha: number;
  teamEarnings: number;
  isSuperAdmin: boolean;
  hasAccountsAccess: boolean;
  status: 'Active' | 'Pending' | 'Blocked';
}

interface AccountTransaction {
  id: string;
  date: string;
  type: 'Debit' | 'Credit';
  category: 'Office Expense' | 'Staff Salary' | 'Plot Sales Revenue' | 'Commission Payout' | 'Utility' | 'Client Booking';
  description: string;
  amount: number;
  recordedBy: string;
}

interface EmployeeRecord {
  id: string;
  name: string;
  phone: string;
  designation: string;
  department: 'Accounts' | 'Admin & Operations' | 'Sales & Marketing' | 'Field Support';
  basicSalary: number;
  allowance: number;
  totalSalary: number;
  status: 'Paid' | 'Pending';
}

// ===================== Default Core Data =====================
const MASTER_SUPER_ADMIN: UserProfile = {
  id: 'UDP-SA-001',
  name: 'MOHAMMAD ATIQUL ISLAM',
  email: 'mr.atiq.dhk.shimul@gmail.com',
  phone: '+8801689333000',
  password: 'password123',
  role: 'Super Admin',
  salesKatha: 45,
  totalEarnings: 3262500,
  teamSalesKatha: 120,
  teamEarnings: 1740000,
  isSuperAdmin: true,
  hasAccountsAccess: true,
  status: 'Active'
};

const INITIAL_USERS: UserProfile[] = [
  MASTER_SUPER_ADMIN,
  {
    id: 'UDP-ACC-01',
    name: 'Md. Tariqul Islam',
    email: 'accounts@unitydream.com',
    phone: '+8801711223344',
    password: 'password123',
    role: 'Accounts Head',
    salesKatha: 0,
    totalEarnings: 0,
    teamSalesKatha: 0,
    teamEarnings: 0,
    isSuperAdmin: false,
    hasAccountsAccess: true,
    status: 'Active'
  },
  {
    id: 'UDP-BP-102',
    name: 'Samia Parvin Shanta',
    email: 'samia.parvin.shanta@gmail.com',
    phone: '+8801700000000',
    password: 'password123',
    role: 'Business Partner',
    salesKatha: 10,
    totalEarnings: 725000,
    teamSalesKatha: 15,
    teamEarnings: 217500,
    isSuperAdmin: false,
    hasAccountsAccess: false,
    status: 'Active'
  }
];

const INITIAL_TRANSACTIONS: AccountTransaction[] = [
  {
    id: 'UDP-TXN-1001',
    date: '2026-10-01',
    type: 'Credit',
    category: 'Plot Sales Revenue',
    description: 'ঢাকা ওয়েস্টার্ন ভ্যালি - ৫ কাঠা ডাউন পেমেন্ট',
    amount: 1450000,
    recordedBy: 'MOHAMMAD ATIQUL ISLAM'
  },
  {
    id: 'UDP-TXN-1002',
    date: '2026-10-02',
    type: 'Debit',
    category: 'Commission Payout',
    description: 'পার্টনার কমিশন বিতরণ (UDP-BP-102)',
    amount: 72500,
    recordedBy: 'Md. Tariqul Islam'
  },
  {
    id: 'UDP-TXN-1003',
    date: '2026-10-05',
    type: 'Debit',
    category: 'Office Expense',
    description: 'হোসাফ টাওয়ার অফিস ভাড়া ও ইউটিলিটি বিল',
    amount: 85000,
    recordedBy: 'Md. Tariqul Islam'
  }
];

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'UDP-EMP-01',
    name: 'Md. Tariqul Islam',
    phone: '+8801711223344',
    designation: 'Senior Accountant',
    department: 'Accounts',
    basicSalary: 45000,
    allowance: 10000,
    totalSalary: 55000,
    status: 'Paid'
  },
  {
    id: 'UDP-EMP-02',
    name: 'Kamrul Hasan',
    phone: '+8801822334455',
    designation: 'Office Admin Officer',
    department: 'Admin & Operations',
    basicSalary: 30000,
    allowance: 5000,
    totalSalary: 35000,
    status: 'Paid'
  },
  {
    id: 'UDP-EMP-03',
    name: 'Sultana Razia',
    phone: '+8801933445566',
    designation: 'Front Desk Executive',
    department: 'Admin & Operations',
    basicSalary: 22000,
    allowance: 3000,
    totalSalary: 25000,
    status: 'Pending'
  }
];

// Project Catalog
const projectsData = [
  {
    id: 1,
    name: "Dhaka Western Valley",
    developer: "পুষ্পধারা প্রপার্টিজ লিমিটেড অনুমোদিত",
    location: "ঢাকা ওয়েস্টার্ন জোন (সাভার সংলগ্ন)",
    tag: "Residential Plots",
    badge: "Ongoing Flagship",
    size: "সর্বনিম্ন ৫ কাঠা (৫ ও ১০ কাঠা প্লট)",
    price: "১৪,৫০,০০০ ৳ / কাঠা",
    statusBadge: "প্যাকেজ / রেট",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    terms: [
      "সর্বনিম্ন প্লট সাইজ ৫ কাঠা থেকে শুরু। ৩ কাঠার কোনো প্লট বরাদ্দযোগ্য নয়।",
      "এককালীন পরিশোধে বিশেষ মূল্যছাড় ও তাৎক্ষণিক সাফ-কবলা রেজিস্ট্রেশন সুবিধা।",
      "সর্বোচ্চ ৬০টি সহজ মাসিক কিস্তিতে মূল্য পরিশোধের সুবর্ণ সুযোগ।",
      "বুকিং মানি মোট মূল্যের ১০% প্রদান সাপেক্ষে সাময়িক প্লট বরাদ্দ নিশ্চিত করা হবে।"
    ]
  },
  {
    id: 2,
    name: "The Bay Icon International Hotel & Resort Ltd.",
    developer: "পুষ্পধারা প্রপার্টিজ লিমিটেড / Bay Icon Ltd.",
    location: "কলাতলী মেরিন ড্রাইভ, কক্সবাজার",
    tag: "5-Star Luxury Hospitality & Commercial",
    badge: "Under Construction",
    size: "১০০, ৩০০, ৫০০, ১,০০০, ২,০০০, ৩,০০০ ও ৫,০০০ Sq Ft / Fractional Share",
    price: "৫০,০০০ ৳ / প্রতি স্কয়ার ফিট",
    statusBadge: "শেয়ার ও ওনারশিপ ইনভেস্টমেন্ট",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    terms: [
      "প্রতি স্কয়ার ফিটের কর্পোরেট মূল্য ৫০,০০০ টাকা নির্ধারিত।",
      "১০০ থেকে ৫০০০ স্কয়ার ফিট ফ্র্যাকশনাল ওনারশিপ শেয়ার বরাদ্দযোগ্য।",
      "আজীবন সাব-কবলা দলিল ও নিয়মিত লভ্যাংশ (ROI) পাওয়ার আইনি নিশ্চয়তা।"
    ]
  },
  {
    id: 3,
    name: "Padma Eco-City",
    developer: "পুষ্পধারা প্রপার্টিজ লিমিটেড",
    location: "ঢাকা-মাওয়া এক্সপ্রেসওয়ে (পদ্মা সেতু সংলগ্ন)",
    tag: "Township / Mega Plot Project",
    badge: "Ongoing Flagship",
    size: "সর্বনিম্ন ৫ কাঠা (৫, ১০ ও ২০ কাঠা প্লট)",
    price: "১০,৫০,০০০ ৳ / কাঠা থেকে শুরু",
    statusBadge: "প্যাকেজ / রেট",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    terms: [
      "প্রকল্পে প্লট সাইজ সর্বনিম্ন ৫ কাঠা। ৩ কাঠার প্লট বরাদ্দ বন্ধ।",
      "পদ্মা সেতু সংলগ্ন আধুনিক ইকো-সিটি এবং সহজ ৩৬-৭২ মাসের কিস্তি সুবিধা।"
    ]
  },
  {
    id: 4,
    name: "Pushpodhara Satellite City",
    developer: "পুষ্পধারা প্রপার্টিজ লিমিটেড",
    location: "ঢাকা জেলা পয়েন্ট থেকে ২২ কিমি ও পদ্মা সেতু থেকে কাছে",
    tag: "Satellite Town / Plots",
    badge: "Available",
    size: "সর্বনিম্ন ৫ কাঠা (৫ ও ১০ কাঠা প্লট)",
    price: "আকর্ষণীয় কিস্তি সুবিধা",
    statusBadge: "প্যাকেজ / প্লট",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    terms: [
      "সর্বনিম্ন প্লট সাইজ ৫ কাঠা নির্ধারিত।",
      "স্কুল, কলেজ, মসজিদ, পার্ক ও বাণিজ্যিক জোন পরিকল্পিত।"
    ]
  },
  {
    id: 5,
    name: "Narayanganj Bhuighar Project",
    developer: "পুষ্পধারা প্রপার্টিজ লিমিটেড",
    location: "ভূঁইগড়, নারায়ণগঞ্জ",
    tag: "Residential / Commercial Land",
    badge: "Upcoming Project",
    size: "সর্বনিম্ন ৫ কাঠা প্লট",
    price: "যোগাযোগ সাপেক্ষে",
    statusBadge: "বুকিং চলছে",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    terms: ["বাণিজ্যিক ও আবাসিক সমন্বিত প্লট। সর্বনিম্ন ৫ কাঠা প্লট বরাদ্দ।"]
  },
  {
    id: 6,
    name: "Rampura Project",
    developer: "পুষ্পধারা প্রপার্টিজ লিমিটেড",
    location: "রামপুরা কাঁচাবাজার সংলগ্ন, ঢাকা",
    tag: "Commercial & Residential",
    badge: "Prime Location",
    size: "বাণিজ্যিক ও আবাসিক স্পেস",
    price: "যোগাযোগ সাপেক্ষে",
    statusBadge: "বুকিং চলছে",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    terms: ["বাণিজ্যিক ও আবাসিক স্পেসের সরাসরি ওনারশিপ বিনিয়োাগ সুবিধা।"]
  }
];

export default function UnityDreamPortal() {
  // App States
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USERS);
  const [transactions, setTransactions] = useState<AccountTransaction[]>(INITIAL_TRANSACTIONS);
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Modals & Menu States
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [registerType, setRegisterType] = useState<'individual' | 'company'>('individual');
  const [showERP, setShowERP] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_ledger' | 'general_ledger' | 'balance_sheet' | 'salary_sheet' | 'access_control'>('my_ledger');
  const [selectedProjectForTerms, setSelectedProjectForTerms] = useState<typeof projectsData[0] | null>(null);

  // Forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // New Transaction Form
  const [txnType, setTxnType] = useState<'Debit' | 'Credit'>('Credit');
  const [txnCategory, setTxnCategory] = useState<AccountTransaction['category']>('Plot Sales Revenue');
  const [txnDesc, setTxnDesc] = useState('');
  const [txnAmount, setTxnAmount] = useState<number>(0);

  // Sync with LocalStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('udp_users_db');
    if (savedUsers) {
      try { setUsersList(JSON.parse(savedUsers)); } catch (e) { console.error(e); }
    }
    const savedTxn = localStorage.getItem('udp_txns_db');
    if (savedTxn) {
      try { setTransactions(JSON.parse(savedTxn)); } catch (e) { console.error(e); }
    }
    const savedEmp = localStorage.getItem('udp_emp_db');
    if (savedEmp) {
      try { setEmployees(JSON.parse(savedEmp)); } catch (e) { console.error(e); }
    }
    const activeSession = localStorage.getItem('udp_active_session');
    if (activeSession) {
      try { setCurrentUser(JSON.parse(activeSession)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveUsers = (list: UserProfile[]) => {
    setUsersList(list);
    localStorage.setItem('udp_users_db', JSON.stringify(list));
  };

  const saveTxns = (list: AccountTransaction[]) => {
    setTransactions(list);
    localStorage.setItem('udp_txns_db', JSON.stringify(list));
  };

  const saveEmps = (list: EmployeeRecord[]) => {
    setEmployees(list);
    localStorage.setItem('udp_emp_db', JSON.stringify(list));
  };

  // Financial Balance Calculations
  const totalCredit = transactions.filter(t => t.type === 'Credit').reduce((acc, t) => acc + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'Debit').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalCredit - totalDebit;
  const totalSalaries = employees.reduce((acc, e) => acc + e.totalSalary, 0);

  // WhatsApp Alert Function
  const sendWhatsAppMsg = (phone: string, text: string) => {
    const formatted = phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usersList.find(u => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase());
    if (!user) {
      alert('ইমেইলটি সঠিক নয় অথবা অ্যাকাউন্ট পাওয়া যায়নি!');
      return;
    }
    if (user.password && user.password !== loginPassword) {
      alert('পাসওয়ার্ড ভুল হয়েছে!');
      return;
    }
    setCurrentUser(user);
    localStorage.setItem('udp_active_session', JSON.stringify(user));
    setAuthModal(null);
    setLoginEmail('');
    setLoginPassword('');
    alert(`স্বাগতম ${user.name}! সফলভাবে লগইন হয়েছে।`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = regEmail.trim().toLowerCase();
    if (usersList.some(u => u.email.trim().toLowerCase() === cleanEmail)) {
      alert('এই ইমেইলে ইতোমধ্যে অ্যাকাউন্ট রয়েছে!');
      setAuthModal('login');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert('পাসওয়ার্ড মেলেনি!');
      return;
    }

    const newId = `UDP-BP-${Math.floor(100 + Math.random() * 900)}`;
    const newUser: UserProfile = {
      id: newId,
      name: regName.trim(),
      email: cleanEmail,
      phone: regPhone.trim(),
      password: regPassword,
      role: 'Business Partner',
      salesKatha: 0,
      totalEarnings: 0,
      teamSalesKatha: 0,
      teamEarnings: 0,
      isSuperAdmin: false,
      hasAccountsAccess: false,
      status: 'Active'
    };

    const updated = [...usersList, newUser];
    saveUsers(updated);
    setCurrentUser(newUser);
    localStorage.setItem('udp_active_session', JSON.stringify(newUser));
    setAuthModal(null);

    sendWhatsAppMsg(
      newUser.phone,
      `*UNITY DREAM PROPERTIES LTD. Registration Confirmed*\nUser ID: ${newUser.id}\nName: ${newUser.name}\nRole: Business Partner\nLogin: https://hp-seven-weld.vercel.app/unitydreamproperties`
    );

    setRegName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegConfirmPassword('');
    alert(`অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ইউজার আইডি: ${newId}`);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usersList.find(u => u.email.trim().toLowerCase() === forgotEmail.trim().toLowerCase());
    if (!user) {
      alert('ইমেইলটি ডাটাবেজে পাওয়া যায়নি!');
      return;
    }
    if (user.password) {
      sendWhatsAppMsg(user.phone, `*UNITY DREAM PROPERTIES LTD. Credentials*\nUser ID: ${user.id}\nPassword: ${user.password}`);
      alert(`ইউজার আইডি (${user.id}) ও পাসওয়ার্ড আপনার হোয়াটসঅ্যাপে পাঠানো হয়েছে!`);
    }
    setForgotEmail('');
    setAuthModal('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('udp_active_session');
    setShowERP(false);
    setAccountMenuOpen(false);
    alert('লগআউট সম্পন্ন হয়েছে।');
  };

  // Add Debit / Credit Transaction (1 Taka transaction also audited)
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (txnAmount <= 0) {
      alert('টাকার পরিমাণ ০ এর বেশি হতে হবে!');
      return;
    }
    const newTxn: AccountTransaction = {
      id: `UDP-TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      type: txnType,
      category: txnCategory,
      description: txnDesc.trim(),
      amount: txnAmount,
      recordedBy: currentUser?.name || 'Authorized Accounts'
    };

    const updated = [newTxn, ...transactions];
    saveTxns(updated);
    setTxnDesc('');
    setTxnAmount(0);
    alert(`লেনদেন (${newTxn.id}) সফলভাবে জেনারেল লেজারে অন্তর্ভুক্ত হয়েছে!`);
  };

  // Super Admin Action: Toggle Accounts Access
  const toggleAccountsAccess = (targetEmail: string) => {
    if (!currentUser?.isSuperAdmin) return;
    const updated = usersList.map(u => {
      if (u.email === targetEmail) {
        return { ...u, hasAccountsAccess: !u.hasAccountsAccess };
      }
      return u;
    });
    saveUsers(updated);
    alert('ইউজারের সেন্ট্রাল একাউন্টস এক্সেস পারমিশন আপডেট হয়েছে!');
  };

  // Toggle Employee Salary Status
  const toggleSalaryStatus = (empId: string) => {
    if (!currentUser?.hasAccountsAccess && !currentUser?.isSuperAdmin) return;
    const updated = employees.map(emp => {
      if (emp.id === empId) {
        return { ...emp, status: (emp.status === 'Paid' ? 'Pending' : 'Paid') as 'Paid' | 'Pending' };
      }
      return emp;
    });
    saveEmps(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ===================== ১. হেডার ও মেনুবার ===================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Unity Dream Properties" 
                className="h-12 w-auto object-contain rounded"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              <div className="flex flex-col justify-center">
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap">
                  UNITY DREAM PROPERTIES
                </span>
                <span className="text-xs font-semibold text-emerald-700 tracking-wide">
                  <span className="hidden sm:inline">BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি:</span>
                  <span className="sm:hidden">বিটিএম পার্টনার অফ PPL</span>
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-700">
              <a href="#home" className="hover:text-emerald-600 transition-colors">Home</a>
              <a href="#for-sale" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Sale</a>
              <a href="#for-rent" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Rent</a>
              <a href="#roommates" className="hover:text-emerald-600 transition-colors">Roommates</a>
              <a href="#developers" className="hover:text-emerald-600 transition-colors">Developers</a>
              <a href="#jobs" className="hover:text-emerald-600 transition-colors">Jobs</a>
              <a href="#blog" className="hover:text-emerald-600 transition-colors">Blog</a>
            </nav>

            <div className="relative">
              <button 
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-4 py-2 rounded-lg border border-emerald-200 text-xs font-bold transition-all"
              >
                <span>👤</span>
                <span>{currentUser ? currentUser.name.split(' ')[0] : 'My account'}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 text-xs">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-slate-50">
                        <p className="font-extrabold text-slate-900 leading-tight">{currentUser.name}</p>
                        <p className="text-[11px] text-emerald-600 font-bold mt-0.5">{currentUser.role}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{currentUser.email}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{currentUser.phone}</p>
                      </div>

                      <button 
                        onClick={() => { setShowERP(true); setAccountMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-slate-700 font-bold flex items-center gap-2"
                      >
                        <span>📊</span> ERP লেজার ও ড্যাশবোর্ড
                      </button>

                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-bold border-t border-gray-100 flex items-center gap-2"
                      >
                        <span>🚪</span> Log Out (লগআউট)
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setAuthModal('login'); setAccountMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-800 flex items-center gap-2 font-bold"
                      >
                        <span>🔑</span> Login (লগইন)
                      </button>
                      <button 
                        onClick={() => { setAuthModal('register'); setAccountMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-800 flex items-center gap-2 font-bold"
                      >
                        <span>📝</span> Create Account (নতুন অ্যাকাউন্ট)
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ===================== ২. কেন্দ্রীয় ক্লাউড ERP ব্যানার ===================== */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                সেন্ট্রাল ক্লাউড ডাটাবেজ সংযুক্ত (অনলাইন সিংকিং সক্রিয়)
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Unity Dream Properties — সেন্ট্রাল একাউন্টিং, এইচআর ও টিম ERP
              </h2>
            </div>
            
            <div>
              <button 
                onClick={() => {
                  if (!currentUser) {
                    alert('অনুগ্রহ করে আগে লগইন করুন!');
                    setAuthModal('login');
                    return;
                  }
                  setShowERP(!showERP);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>{showERP ? 'ERP বন্ধ করুন' : 'সেন্ট্রাল ERP ও একাউন্টিং খুলুন'}</span>
              </button>
            </div>
          </div>

          {/* ===================== ২.১ ক্লাউড ERP পূর্ণাঙ্গ মডিউল ===================== */}
          {showERP && currentUser && (
            <div className="mt-6 pt-6 border-t border-slate-700/80 bg-slate-950/90 p-5 rounded-xl">
              
              {/* মডিউল ট্যাব বার */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-5">
                <button 
                  onClick={() => setActiveTab('my_ledger')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'my_ledger' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  👤 আমার নিজস্ব সেলস ও কমিশন
                </button>

                {/* জেনারেল লেজার ও ডেবিট ক্রেডিট (অ্যাকাউন্টস ও সুপার এডমিন) */}
                {(currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                  <button 
                    onClick={() => setActiveTab('general_ledger')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'general_ledger' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    📒 জেনারেল লেজার (Debit / Credit)
                  </button>
                )}

                {/* ব্যালেন্স শীট ও আর্থিক সারসংক্ষেপ */}
                {(currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                  <button 
                    onClick={() => setActiveTab('balance_sheet')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'balance_sheet' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    📈 ব্যালেন্স শীট ও মাসিক গ্রোথ
                  </button>
                )}

                {/* এইচআর পে-রোল ও স্যালারি শীট */}
                {(currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                  <button 
                    onClick={() => setActiveTab('salary_sheet')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'salary_sheet' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    💼 কর্মকর্তা-কর্মচারী স্যালারি শীট
                  </button>
                )}

                {/* সুপার এডমিন পারমিশন ও পোস্ট কন্ট্রোল */}
                {currentUser.isSuperAdmin && (
                  <button 
                    onClick={() => setActiveTab('access_control')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'access_control' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚙️ একাউন্টস এক্সেস কন্ট্রোল (Super Admin)
                  </button>
                )}
              </div>

              {/* ট্যাব ১: পার্টনারের নিজস্ব সেলস ও কমিশন */}
              {activeTab === 'my_ledger' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">আমার মোট বিক্রিত জমি</span>
                      <span className="text-2xl font-black text-emerald-400">{currentUser.salesKatha} কাঠা</span>
                      <span className="text-[10px] text-slate-500 block mt-1">সরাসরি ক্লায়েন্ট সেলস</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">আমার মোট প্রাপ্ত কমিশন</span>
                      <span className="text-2xl font-black text-amber-400">
                        {currentUser.totalEarnings.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-emerald-400 block mt-1">অ্যাকাউন্টস অনুমোদিত</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">টিমের মোট সেলস</span>
                      <span className="text-2xl font-black text-blue-400">{currentUser.teamSalesKatha} কাঠা</span>
                      <span className="text-[10px] text-slate-500 block mt-1">অধীনস্থ পার্টনারদের সেলস</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">টিম ওভাররাইড ইনকাম</span>
                      <span className="text-2xl font-black text-purple-400">
                        {currentUser.teamEarnings.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-purple-300 block mt-1">হায়ারার্কিক্যাল বোনাস</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      আইডি: <strong className="text-white font-mono">{currentUser.id}</strong> | পদবী: <strong className="text-emerald-400">{currentUser.role}</strong>
                    </div>
                    <span className="text-emerald-400">● আপনার নিজস্ব ডাটাবেজ সংরক্ষিত</span>
                  </div>
                </div>
              )}

              {/* ট্যাব ২: জেনারেল লেজার (Debit / Credit এন্ট্রি ও হিস্ট্রি) */}
              {activeTab === 'general_ledger' && (currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                <div>
                  {/* নতুন লেনদেন ফর্ম */}
                  <form onSubmit={handleAddTransaction} className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 text-xs">
                    <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                      <span>✍️</span> নতুন ডেবিট / ক্রেডিট ভাউচার এন্ট্রি (১ টাকা হলেও সফটওয়্যারে ইন/আউট হবে)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">লেনদেনের ধরন (Type)</label>
                        <select 
                          value={txnType} 
                          onChange={(e) => setTxnType(e.target.value as 'Debit' | 'Credit')}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold"
                        >
                          <option value="Credit">Credit (আয় / সফটওয়্যারে ইন)</option>
                          <option value="Debit">Debit (ব্যয় / সফটওয়্যার থেকে আউট)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">খাত (Category)</label>
                        <select 
                          value={txnCategory} 
                          onChange={(e) => setTxnCategory(e.target.value as AccountTransaction['category'])}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-medium"
                        >
                          <option value="Plot Sales Revenue">Plot Sales Revenue (প্লট বিক্রি বাবদ আয়)</option>
                          <option value="Client Booking">Client Booking (বুকিং মানি)</option>
                          <option value="Staff Salary">Staff Salary (কর্মকর্তা বেতন)</option>
                          <option value="Commission Payout">Commission Payout (পার্টনার কমিশন)</option>
                          <option value="Office Expense">Office Expense (অফিস খরচ)</option>
                          <option value="Utility">Utility (ইউটিলিটি ও আনুষঙ্গিক)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">বিবরণ (Narration)</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="ভাউচারের বিস্তারিত বিবরণ"
                          value={txnDesc}
                          onChange={(e) => setTxnDesc(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1">টাকার পরিমাণ (Amount ৳)</label>
                        <input 
                          type="number" 
                          required 
                          min="1"
                          placeholder="পরিমাণ"
                          value={txnAmount || ''}
                          onChange={(e) => setTxnAmount(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold text-amber-400"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button 
                        type="submit" 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded shadow text-xs"
                      >
                        ভাউচার সেভ করুন
                      </button>
                    </div>
                  </form>

                  {/* লেজার টেবিল */}
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">ভাউচার আইডি</th>
                          <th className="py-2.5 px-3">তারিখ</th>
                          <th className="py-2.5 px-3">খাত</th>
                          <th className="py-2.5 px-3">বিবরণ</th>
                          <th className="py-2.5 px-3 text-right">Debit (ব্যয়)</th>
                          <th className="py-2.5 px-3 text-right">Credit (আয়)</th>
                          <th className="py-2.5 px-3 text-center">এন্ট্রিকারী</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {transactions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-900/50">
                            <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{t.id}</td>
                            <td className="py-2.5 px-3 font-mono">{t.date}</td>
                            <td className="py-2.5 px-3">{t.category}</td>
                            <td className="py-2.5 px-3 text-slate-200">{t.description}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-red-400">
                              {t.type === 'Debit' ? `${t.amount.toLocaleString('bn-BD')} ৳` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                              {t.type === 'Credit' ? `${t.amount.toLocaleString('bn-BD')} ৳` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-400 text-[11px]">{t.recordedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ট্যাব ৩: ব্যালেন্স শীট ও মাসিক সেলস গ্রোথ */}
              {activeTab === 'balance_sheet' && (currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                <div className="text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block font-semibold">সর্বমোট ক্রেডিট (Total Credit / আয়)</span>
                      <span className="text-2xl font-black text-emerald-400 mt-1 block">
                        {totalCredit.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-slate-500">সকল বুকিং ও সেলস ইনকাম</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block font-semibold">সর্বমোট ডেবিট (Total Debit / ব্যয়)</span>
                      <span className="text-2xl font-black text-red-400 mt-1 block">
                        {totalDebit.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-slate-500">বেতন, কমিশন ও পরিচালন ব্যয়</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block font-semibold">নেট ক্যাশ ব্যালেন্স (Cash in Hand)</span>
                      <span className="text-2xl font-black text-amber-400 mt-1 block">
                        {netBalance.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-emerald-400">ব্যালেন্স শীট ডেবিট-ক্রেডিট সমন্বিত</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-2">📊 মাসিক সেলস গ্রোথ অ্যানালাইসিস (October 2026)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-300">
                      <div>• বর্তমান মাসের মোট বিক্রিত জমি: <strong>৫৫ কাঠা</strong></div>
                      <div>• পূর্ববর্তী মাসের তুলনায় গ্রোথ রেট: <strong className="text-emerald-400">+ ১৮.৫% (বৃদ্ধি)</strong></div>
                      <div>• মাসিক নেট প্রফিট মার্জিন: <strong className="text-amber-400">৯২.২%</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ট্যাব ৪: কর্মকর্তা-কর্মচারী স্যালারি শীট (Payroll) */}
              {activeTab === 'salary_sheet' && (currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                <div className="text-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-teal-400">
                      💼 কর্মকর্তা-কর্মচারী মাসিক স্যালারি রেজিস্টার ও পে-রোল
                    </h4>
                    <span className="text-slate-300">
                      মাসিক মোট প্রদেয় বেতন: <strong className="text-amber-400 font-bold">{totalSalaries.toLocaleString('bn-BD')} ৳</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">এমপ্লয়ী আইডি</th>
                          <th className="py-2.5 px-3">নাম</th>
                          <th className="py-2.5 px-3">পদবী</th>
                          <th className="py-2.5 px-3">বিভাগ</th>
                          <th className="py-2.5 px-3 text-right">মূল বেতন</th>
                          <th className="py-2.5 px-3 text-right">ভাতা</th>
                          <th className="py-2.5 px-3 text-right">মোট প্রদেয় বেতন</th>
                          <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                          <th className="py-2.5 px-3 text-center">একশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {employees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-900/50">
                            <td className="py-2.5 px-3 font-mono text-teal-400 font-bold">{emp.id}</td>
                            <td className="py-2.5 px-3 font-bold text-white">{emp.name}</td>
                            <td className="py-2.5 px-3">{emp.designation}</td>
                            <td className="py-2.5 px-3">{emp.department}</td>
                            <td className="py-2.5 px-3 text-right">{emp.basicSalary.toLocaleString('bn-BD')} ৳</td>
                            <td className="py-2.5 px-3 text-right">{emp.allowance.toLocaleString('bn-BD')} ৳</td>
                            <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                              {emp.totalSalary.toLocaleString('bn-BD')} ৳
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                emp.status === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {emp.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button 
                                onClick={() => toggleSalaryStatus(emp.id)}
                                className="text-emerald-400 hover:underline font-bold text-[11px]"
                              >
                                {emp.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ট্যাব ৫: একাউন্টস এক্সেস কন্ট্রোল (Super Admin Only) */}
              {activeTab === 'access_control' && currentUser.isSuperAdmin && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-red-400">
                      👑 সেন্ট্রাল ইউজার পারমিশন ও একাউন্টস কন্ট্রোল (Super Admin Control)
                    </h4>
                    <span className="bg-red-950 text-red-300 px-3 py-1 rounded text-[11px] font-bold border border-red-800">
                      Master Control: MOHAMMAD ATIQUL ISLAM
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-3">ইউজার আইডি</th>
                          <th className="py-2.5 px-3">নাম</th>
                          <th className="py-2.5 px-3">ইমেইল</th>
                          <th className="py-2.5 px-3">পদবী (Role)</th>
                          <th className="py-2.5 px-3">পাসওয়ার্ড</th>
                          <th className="py-2.5 px-3">সেন্ট্রাল একাউন্টস এক্সেস</th>
                          <th className="py-2.5 px-3 text-center">একশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {usersList.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{user.id}</td>
                            <td className="py-3 px-3 font-bold text-white">{user.name}</td>
                            <td className="py-3 px-3 font-mono">{user.email}</td>
                            <td className="py-3 px-3">{user.role}</td>
                            <td className="py-3 px-3 font-mono text-amber-300">{user.password || 'N/A'}</td>
                            <td className="py-3 px-3">
                              {user.hasAccountsAccess ? (
                                <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800">
                                  Approved
                                </span>
                              ) : (
                                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                  Restricted
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {user.isSuperAdmin ? (
                                <span className="text-slate-500 font-mono">Master</span>
                              ) : (
                                <button 
                                  onClick={() => toggleAccountsAccess(user.email)}
                                  className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                                    user.hasAccountsAccess 
                                      ? 'bg-red-900/60 hover:bg-red-800 text-red-200' 
                                      : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                                  }`}
                                >
                                  {user.hasAccountsAccess ? 'Revoke Access' : 'Approve Accounts'}
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

            </div>
          )}
        </div>
      </section>

      {/* ===================== ৩. প্রজেক্টস শোকেস সেকশন ===================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 bg-emerald-600 rounded"></span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              আমাদের অনুমোদিত ও পার্টনার প্রজেক্টসমূহ
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            ঢাকা ওয়েস্টার্ন ভ্যালি, দ্য বে আইকন কক্সবাজার, পদ্মা ইকো সিটি, পুষ্পধারা স্যাটেলাইট সিটি, নারায়ণগঞ্জ ভূঁইগড় ও রামপুরা প্রজেক্ট
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project) => (
            <div 
              key={project.id} 
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-800/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow">
                    {project.tag}
                  </span>
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-md shadow">
                    {project.badge}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs text-slate-500 font-semibold">{project.developer}</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                    📍 {project.location}
                  </p>

                  <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-end">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">সাইজ</span>
                      <span className="font-bold text-xs text-slate-800">{project.size}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        {project.statusBadge}
                      </span>
                      <span className="font-extrabold text-sm text-emerald-700">{project.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button 
                  onClick={() => setSelectedProjectForTerms(project)}
                  className="w-full text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                >
                  বিস্তারিত ও বুকিং শর্তাবলী
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* ===================== ৪. প্রজেক্টের বিস্তারিত শর্তাবলীর মোডাল ===================== */}
      {selectedProjectForTerms && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedProjectForTerms.name}</h3>
                <p className="text-xs text-emerald-200 mt-0.5">{selectedProjectForTerms.location}</p>
              </div>
              <button 
                onClick={() => setSelectedProjectForTerms(null)}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                📋 বুকিং নিয়মাবলী ও আইনি শর্তসমূহ:
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                {selectedProjectForTerms.terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">অফিসিয়াল বুকিং ও হেল্পলাইন</span>
                  <span className="text-xs font-bold text-emerald-800">+8801689333000</span>
                </div>
                <button 
                  onClick={() => setSelectedProjectForTerms(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-lg"
                >
                  ঠিক আছে
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== ৫. ফুটার সেকশন ===================== */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-10 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-sm">
            <div>
              <h4 className="text-white font-bold text-base tracking-wide mb-2">UNITY DREAM PROPERTIES</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি:। সেন্ট্রাল ক্লাউড ডাটাবেজ সমন্বিত রিয়েল এস্টেট ইআরপি সিস্টেম।
              </p>
              <p className="text-xs text-amber-400 mt-2 font-mono">
                Helpline: +8801689333000
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-2 flex items-center gap-1.5">
                <span>📍</span> কর্পোরেট হেড অফিস
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                ৫/৬ আউটার সার্কুলার রোড, হোসাফ টাওয়ার (৪র্থ তলা),<br />
                মালিবাগ মোড়, মালিবাগ, ঢাকা-১২১৭, বাংলাদেশ।
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-2">অনুমোদিত প্রকল্পসমূহ</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                ঢাকা ওয়েস্টার্ন ভ্যালি • দ্য বে আইকন • পদ্মা ইকো সিটি • পুষ্পধারা স্যাটেলাইট সিটি • নারায়ণগঞ্জ ভূঁইগড় • রামপুরা
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-slate-400">
              © 2026 Unity Dream Properties | BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি:
            </p>
            <p className="text-slate-500">
              Hosaf Tower, Malibag, Dhaka
            </p>
          </div>

        </div>
      </footer>

      {/* ===================== ৬. অথেন্টিকেশন ও পাসওয়ার্ড রিকভারি মোডাল ===================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>👤</span> 
                {authModal === 'login' && 'LOGIN TO ERP'}
                {authModal === 'register' && 'CREATE NEW ACCOUNT'}
                {authModal === 'forgot' && 'PASSWORD RECOVERY'}
              </h3>
              <button 
                onClick={() => setAuthModal(null)}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              
              {/* LOGIN FORM */}
              {authModal === 'login' && (
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter registered email" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Password</label>
                      <button 
                        type="button"
                        onClick={() => setAuthModal('forgot')}
                        className="text-[11px] text-red-600 hover:underline font-bold"
                      >
                        Forgot Password? (পাসওয়ার্ড ভুলে গেছেন?)
                      </button>
                    </div>
                    <input 
                      type="password" 
                      required 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded shadow transition-colors text-sm mt-2"
                  >
                    Login
                  </button>

                  <div className="mt-4 text-center text-xs text-gray-600">
                    Don't have an account yet?{' '}
                    <button 
                      type="button"
                      onClick={() => setAuthModal('register')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Create New Account
                    </button>
                  </div>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {authModal === 'forgot' && (
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      আপনার নিবন্ধিত ইমেইল লিখুন। আপনার ইউজার আইডি ও পাসওয়ার্ড সরাসরি নিবন্ধিত নম্বরে WhatsApp-এ পাঠানো হবে।
                    </p>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Registered Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter registered email" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded shadow transition-colors text-sm"
                  >
                    Send Recovery Details on WhatsApp
                  </button>

                  <div className="mt-4 text-center text-xs text-gray-600 flex justify-between items-center pt-3 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => setAuthModal('login')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      ← Back to Login
                    </button>
                    <a 
                      href="https://api.whatsapp.com/send?phone=8801689333000&text=আমার%20ইউজার%20আইডি%20ও%20পাসওয়ার্ড%20রিকভারি%20সহায়তা%20প্রয়োজন"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-bold hover:underline"
                    >
                      Super Admin Help
                    </a>
                  </div>
                </form>
              )}

              {/* REGISTER FORM */}
              {authModal === 'register' && (
                <form onSubmit={handleRegister}>
                  <div className="flex items-center gap-6 mb-4 text-xs font-bold text-gray-700">
                    <span>Account Type:</span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="accountType" 
                        checked={registerType === 'individual'} 
                        onChange={() => setRegisterType('individual')}
                      />
                      Individual
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="radio" 
                        name="accountType" 
                        checked={registerType === 'company'} 
                        onChange={() => setRegisterType('company')}
                      />
                      Company
                    </label>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Full Name / Organization *</label>
                      <input 
                        type="text" 
                        required 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Enter full name" 
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" 
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">E-mail *</label>
                      <input 
                        type="email" 
                        required 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Enter valid e-mail" 
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" 
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Mobile (WhatsApp Number) *</label>
                      <input 
                        type="tel" 
                        required 
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="e.g. +8801700000000" 
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600 font-mono" 
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Password *</label>
                      <input 
                        type="password" 
                        required 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Password" 
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" 
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Confirm Password *</label>
                      <input 
                        type="password" 
                        required 
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Retype password" 
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" 
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-gray-600">Prove your humanity: 8 + 8 =</span>
                      <input type="number" required placeholder="16" className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold" />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded shadow transition-colors text-sm"
                  >
                    Register & Send WhatsApp ID
                  </button>

                  <div className="mt-3 text-center text-xs text-gray-600">
                    <button 
                      type="button"
                      onClick={() => setAuthModal('login')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Already have an account? Click for login
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}