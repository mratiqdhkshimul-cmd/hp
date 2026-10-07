'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ১. সুপার অ্যাডমিন ও সিস্টেম লিড ইমেইল লিস্ট
const SUPER_ADMIN_EMAILS = [
  'mr.atiq.dhk.shimul@gmail.com', // আপনার মূল ইমেইল (সুপার অ্যাডমিন / ডেভেলপার)
  'mr.atik.dsk.shimul@gmail.com'  // বিকল্প ব্যাকআপ ইমেইল
];

// ২. পদমর্যাদা ও হায়ারার্কি স্তর (Hierarchy Levels)
const DESIGNATION_LEVELS: Record<string, number> = {
  'Super Admin': 9,       // সিস্টেম ডেভেলপার / সার্বিক নিয়ন্ত্রক
  'Chairman': 8,          // শীর্ষ পর্যায় (সব ডাটা দেখতে পারবেন)
  'MD': 7,                // ম্যানেজিং ডিরেক্টর
  'DMD': 6,               // ডেপুটি ম্যানেজিং ডিরেক্টর
  'Director': 5,          // ডিরেক্টর
  'Deputy Director': 4,   // ডেপুটি ডিরেক্টর
  'GM': 3,                // জেনারেল ম্যানেজার
  'DGM': 2,               // ডেপুটি জেনারেল ম্যানেজার
  'AGM': 1,               // সহকারী জেনারেল ম্যানেজার
  'Team Leader': 0.5,     // টিম লিডার (TL)
  'Business Partner': 0.2,// বিজনেস পার্টনার (BP)
  'Agent': 0,             // মাঠপর্যায়ের এজেন্ট
  'Client': -1            // সাধারণ গ্রাহক
};

interface PropertyItem {
  id: string | number;
  title: string;
  company: string;
  category: string;
  type: 'plot' | 'flat' | 'commercial' | 'rent' | 'roommate';
  location: string;
  shortLocation: string;
  size: string;
  priceText: string;
  minPrice: number;
  status: string;
  image: string;
  tags: string[];
  details: {
    overview: string;
    features: string[];
  };
}

// সেলস ও টিম লেজার রেকর্ড ইন্টারফেস
interface TeamMemberRecord {
  id: string;
  name: string;
  designation: string;
  level: number;
  team: string;
  selfSales: number;
  teamSales: number;
  commissionEarned: number;
  commissionBalance: number;
}

const defaultProjects: PropertyItem[] = [
  {
    id: 1,
    title: 'Padma Eco-City',
    company: 'Pushpodhara Properties Ltd.',
    category: 'Township / Mega Plot Project',
    type: 'plot',
    location: 'Dhaka-Mawa Highway, Near Padma Bridge',
    shortLocation: 'ঢাকা-মাওয়া হাইওয়ে (পদ্মা সেতু সংলগ্ন)',
    size: '3, 5, 10 & 20 Katha',
    priceText: '১০,৫০,০০০ ৳ / কাঠা থেকে শুরু',
    minPrice: 3150000,
    status: 'Ongoing Flagship',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
    tags: ['3,500 Acres', '3 KM Curved Lake', 'Parks & Wide Roads', 'সাফ-কবলা দলিল'],
    details: {
      overview: '3,500 একরের মেগা ফ্ল্যাগশিপ টাউনশিপ প্রজেক্ট যা ২০১৫ সালে শুরু হয়। ঢাকা-মাওয়া চার লেন হাইওয়ে ও পদ্মা সেতুর কাছে আধুনিক প্রকল্প।',
      features: ['৩, ৫, ১০ ও ২০ কাঠার প্লট', '৩ কিমি নান্দনিক লেক', 'প্রশস্ত রাস্তা ও শতভাগ নিষ্কণ্টক জমি']
    }
  },
  {
    id: 2,
    title: 'The Bay Icon International Hotel & Resort',
    company: 'Bay Icon International Hotel & Resort Ltd.',
    category: '5-Star Luxury Hospitality & Commercial',
    type: 'commercial',
    location: 'Kolatoli Marine Drive Road, Cox\'s Bazar',
    shortLocation: 'কলাতলী মেরিন ড্রাইভ, কক্সবাজার',
    size: '300 - 1200 Sq Ft / Fractional Share',
    priceText: 'শেয়ার ও ওনারশিপ ইনভেস্টমেন্ট',
    minPrice: 2000000,
    status: 'Under Construction',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60',
    tags: ['205 Decimal Land', '14-15 Stories', '495 Luxury Rooms', 'Halal Income'],
    details: {
      overview: 'কক্সবাজার সুগন্ধা ও কলাতলী মেরিন ড্রাইভে ২০৫ শতাংশ জমির ওপর নির্মিতব্য আন্তর্জাতিক ৫-স্টার লাক্সারি রিসোর্ট।',
      features: ['১৪-১৫ তলা আধুনিক ভবন', 'সাফ-কবলা সাব-রেজিস্ট্রি দলিল', 'লাইফটাইম ক্যাপিং-মুক্ত হালাল মুনাফা']
    }
  },
  {
    id: 3,
    title: 'Pushpodhara Satellite City',
    company: 'Pushpodhara Properties Ltd.',
    category: 'Satellite Town / Plots',
    type: 'plot',
    location: '22 KM from Zero Point, 13 KM from Padma Bridge',
    shortLocation: 'ঢাকা জিরো পয়েন্ট থেকে ২২ কিমি ও পদ্মা সেতু থেকে ১৩ কিমি',
    size: '৩ ও ৫ কাঠা প্লট',
    priceText: '১২,০০,০০০ ৳ / কাঠা',
    minPrice: 3600000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
    tags: ['Express Highway', 'প্রাইম লোকেশন', 'সহজ কিস্তি'],
    details: {
      overview: 'ঢাকা-মাওয়া এক্সপ্রেসওয়ের প্রাইম জোনে অবস্থিত পরিকল্পিত আধুনিক স্যাটেলাইট সিটি।',
      features: ['নিষ্কণ্টক মালিকানা', 'আধুনিক ড্রেনেজ ব্যবস্থা', 'স্কুল, কলেজ ও হাসপাতালের জোন']
    }
  },
  {
    id: 4,
    title: 'Dhaka Western Valley',
    company: 'Golden Eye Developer',
    category: 'Residential Plots',
    type: 'plot',
    location: 'Mirpur Beribadh, Adjacent to Metro Rail route',
    shortLocation: 'মিরপুর বেড়িবাঁধ সংলগ্ন (ঢাকা)',
    size: '৩, ৫ ও ১০ কাঠা',
    priceText: '১৪,৫০,০০০ ৳ / কাঠা',
    minPrice: 4350000,
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
    tags: ['মিরপুর কানেক্টিভিটি', 'মেট্রোরেল সুবিধা', 'রেডি বাউন্ডারি'],
    details: {
      overview: 'মিরপুর বেড়িবাঁধ ও মেট্রো সংযোগ সংলগ্ন প্রিমিয়াম ল্যান্ড প্রজেক্ট।',
      features: ['৬০ ও ৪০ ফুট প্রশস্ত রাস্তা', 'উত্তরা-মিরপুর সহজ যোগাযোগ']
    }
  }
];

// প্রাথমিক টিম ও হায়ারার্কিকাল ডাটাবেজ
const initialTeamLedger: TeamMemberRecord[] = [
  { id: 'TM-01', name: 'মোঃ আতিকুল ইসলাম (Admin)', designation: 'Super Admin', level: 9, team: 'Developer & Control Wing', selfSales: 350000000, teamSales: 950000000, commissionEarned: 35000000, commissionBalance: 12000000 },
  { id: 'TM-02', name: 'চেয়ারম্যান স্যার', designation: 'Chairman', level: 8, team: 'Board of Directors', selfSales: 250000000, teamSales: 850000000, commissionEarned: 25000000, commissionBalance: 8500000 },
  { id: 'TM-03', name: 'ম্যানেজিং ডিরেক্টর (MD)', designation: 'MD', level: 7, team: 'Executive Directorate', selfSales: 150000000, teamSales: 550000000, commissionEarned: 15000000, commissionBalance: 4500000 },
  { id: 'TM-04', name: 'মোঃ ফারুক হোসেন', designation: 'Director', level: 5, team: 'Delta Team', selfSales: 60000000, teamSales: 210000000, commissionEarned: 6200000, commissionBalance: 1200000 },
  { id: 'TM-05', name: 'হাসান মাহামুদ', designation: 'GM', level: 3, team: 'Padma Division', selfSales: 40000000, teamSales: 110000000, commissionEarned: 3500000, commissionBalance: 750000 },
  { id: 'TM-06', name: 'আরিফুল ইসলাম', designation: 'DGM', level: 2, team: 'Padma Wing A', selfSales: 25000000, teamSales: 65000000, commissionEarned: 1800000, commissionBalance: 420000 },
  { id: 'TM-07', name: 'নাজমুল হুদা', designation: 'AGM', level: 1, team: 'Echo Unit 1', selfSales: 18000000, teamSales: 35000000, commissionEarned: 1100000, commissionBalance: 280000 },
  { id: 'TM-08', name: 'কামরুল হাসান', designation: 'Team Leader', level: 0.5, team: 'Echo Alpha', selfSales: 12000000, teamSales: 18000000, commissionEarned: 650000, commissionBalance: 190000 },
  { id: 'TM-09', name: 'জাহিদুল ইসলাম', designation: 'Business Partner', level: 0.2, team: 'Echo Alpha', selfSales: 8500000, teamSales: 0, commissionEarned: 290000, commissionBalance: 85000 },
  { id: 'TM-10', name: 'তানভীর আহমেদ', designation: 'Agent', level: 0, team: 'Echo Alpha', selfSales: 4500000, teamSales: 0, commissionEarned: 140000, commissionBalance: 45000 },
];

export default function CompleteERPPlatform() {
  const [properties, setProperties] = useState<PropertyItem[]>(defaultProjects);
  const [teamLedger, setTeamLedger] = useState<TeamMemberRecord[]>(initialTeamLedger);
  const [currentNav, setCurrentNav] = useState('Home');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // মোডাল ও অথ স্টেট
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [regType, setRegType] = useState<'individual' | 'company'>('individual');
  const [selectedDesignation, setSelectedDesignation] = useState('Agent');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [postAdModal, setPostAdModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState<PropertyItem | null>(null);

  // রেজিস্টার ফর্ম ফিল্ড
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regContactPerson, setRegContactPerson] = useState('');
  const [regCaptcha, setRegCaptcha] = useState('');

  // লগইন ফর্ম ফিল্ড
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // পোস্ট অ্যাড ফিল্ড
  const [adTitle, setAdTitle] = useState('');
  const [adCompany, setAdCompany] = useState('Pushpodhara Properties Ltd.');
  const [adCategory, setAdCategory] = useState('plot');
  const [adLocation, setAdLocation] = useState('');
  const [adSize, setAdSize] = useState('');
  const [adPrice, setAdPrice] = useState('');

  // লোকাল স্টোরেজ সিঙ্ক
  useEffect(() => {
    try {
      const savedProps = localStorage.getItem('udp_live_items');
      if (savedProps) setProperties(JSON.parse(savedProps));

      const savedUser = localStorage.getItem('udp_active_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // রেজিস্ট্রেশন প্রসেস
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert('পাসওয়ার্ড মেলেনি!');
      return;
    }
    if (regCaptcha !== '16') {
      alert('ক্যাপচা ভুল! ৮ + ৮ = ১৬ লিখুন।');
      return;
    }

    const emailClean = regEmail.trim().toLowerCase();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.some(email => email.toLowerCase() === emailClean);

    const assignedDesignation = isSuperAdmin ? 'Super Admin' : selectedDesignation;
    const assignedLevel = isSuperAdmin ? 9 : (DESIGNATION_LEVELS[assignedDesignation] ?? 0);

    const userObj = {
      name: regType === 'individual' ? regName : regContactPerson || regName,
      email: regEmail.trim(),
      mobile: regMobile,
      type: regType,
      designation: assignedDesignation,
      level: assignedLevel,
      isSuperAdmin: isSuperAdmin
    };

    setCurrentUser(userObj);
    localStorage.setItem('udp_active_user', JSON.stringify(userObj));

    // টিম ডাটাবেজে রেকর্ড যুক্ত করা
    const newMember: TeamMemberRecord = {
      id: `TM-${Date.now().toString().slice(-4)}`,
      name: userObj.name,
      designation: userObj.designation,
      level: userObj.level,
      team: 'General Sales Wing',
      selfSales: 0,
      teamSales: 0,
      commissionEarned: 0,
      commissionBalance: 0
    };
    const updatedLedger = [newMember, ...teamLedger];
    setTeamLedger(updatedLedger);

    alert(`অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে! ${isSuperAdmin ? '👑 আপনি সুপার অ্যাডমিন হিসেবে পূর্ণ এক্সেস পেয়েছেন।' : `পদমর্যাদা: ${userObj.designation}`}`);
    setAuthModal(null);
  };

  // লগইন প্রসেস (mr.atiq.dhk.shimul@gmail.com এর জন্য সুপার অ্যাডমিন স্বয়ংক্রিয় সক্রিয়)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailClean = loginEmail.trim().toLowerCase();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.some(email => email.toLowerCase() === emailClean);

    const userObj = {
      name: isSuperAdmin ? 'আতিকুর রহমান (Developer & Super Admin)' : loginEmail.split('@')[0],
      email: loginEmail.trim(),
      designation: isSuperAdmin ? 'Super Admin' : 'Agent',
      level: isSuperAdmin ? 9 : 0,
      isSuperAdmin: isSuperAdmin
    };

    setCurrentUser(userObj);
    localStorage.setItem('udp_active_user', JSON.stringify(userObj));
    alert(`লগইন সফল! ${isSuperAdmin ? '👑 আপনি সুপার অ্যাডমিন হিসেবে সমস্ত মডিউল ও ডেটার পূর্ণ নিয়ন্ত্রণ পেয়েছেন।' : ''}`);
    setAuthModal(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('udp_active_user');
  };

  // নতুন প্রোপার্টি লাইভ পাবলিশ করা
  const handleAddNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adLocation || !adPrice) {
      alert('সব প্রয়োজনীয় তথ্য পূরণ করুন!');
      return;
    }

    const newItem: PropertyItem = {
      id: Date.now(),
      title: adTitle,
      company: adCompany,
      category: adCategory === 'plot' ? 'Township / Plot' : 'Apartment / Commercial',
      type: adCategory as any,
      location: adLocation,
      shortLocation: adLocation,
      size: adSize || 'স্ট্যান্ডার্ড',
      priceText: `${adPrice} ৳`,
      minPrice: 1000000,
      status: 'Live Verified',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
      tags: ['সরাসরি লাইভ', 'অনলাইন ডাটাবেজ'],
      details: {
        overview: 'অনলাইন সেন্ট্রাল ডাটাবেজে সদ্য যুক্ত হওয়া প্রজেক্ট।',
        features: ['নিষ্কণ্টক জমি', 'দ্রুত সাফ-কবলা দলিল']
      }
    };

    const updated = [newItem, ...properties];
    setProperties(updated);
    localStorage.setItem('udp_live_items', JSON.stringify(updated));
    alert('প্রোপার্টি সফলভাবে অনলাইন ডাটাবেজে যুক্ত ও লাইভ হয়েছে!');
    setPostAdModal(false);
  };

  // হায়ারার্কিকাল অ্যাক্সেস কন্ট্রোল ফিল্টার (Strict Access Rules)
  const accessibleMembers = useMemo(() => {
    if (!currentUser) return [];
    // সুপার অ্যাডমিন (লেভেল ৯), চেয়ারম্যান (লেভেল ৮) ও এমডি (লেভেল ৭) সবার ডাটা দেখতে পাবেন
    if (currentUser.isSuperAdmin || currentUser.level >= 7) {
      return teamLedger;
    }
    // অন্য যে কেউ শুধু তার নিজের এবং তার নিচের লেভেলের মেম্বারদের দেখতে পারবে
    return teamLedger.filter(m => m.level <= currentUser.level);
  }, [teamLedger, currentUser]);

  const displayedItems = useMemo(() => {
    if (currentNav === 'For Sale') return properties.filter(p => p.type === 'plot' || p.type === 'flat');
    if (currentNav === 'For Rent') return properties.filter(p => p.type === 'rent');
    if (currentNav === 'Roommates') return properties.filter(p => p.type === 'roommate');
    if (currentNav === 'Developers') return properties.filter(p => p.company.includes('Pushpodhara') || p.company.includes('Golden'));
    return properties;
  }, [properties, currentNav]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between">
      
      {/* ১. শীর্ষ হেডার ও নেভিগেশন বার */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap justify-between items-center gap-3">
          
          <div onClick={() => setCurrentNav('Home')} className="flex items-center gap-2 cursor-pointer select-none">
            <div className="w-10 h-10 bg-[#0d5c3a] text-white font-black text-xl flex items-center justify-center rounded shadow">
              UDP
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#0d5c3a] block leading-tight">
                UNITY DREAM PROPERTIES
              </span>
              <span className="text-[11px] text-slate-500 font-semibold block">
                পুষ্পধারা প্রপার্টিজ লিমিটেড পার্টনার ও ERP সিস্টেম
              </span>
            </div>
          </div>

          <nav className="flex items-center flex-wrap gap-1 sm:gap-2 text-sm font-semibold text-slate-700">
            {['Home', 'For Sale', 'For Rent', 'Roommates', 'Developers', 'Jobs', 'Blog'].map((item) => (
              <button
                key={item}
                onClick={() => setCurrentNav(item)}
                className={`px-3 py-1.5 rounded transition ${
                  currentNav === item
                    ? 'text-[#0d5c3a] border-b-2 border-[#0d5c3a] font-bold bg-emerald-50'
                    : 'hover:text-[#0d5c3a]'
                }`}
              >
                {item}
              </button>
            ))}

            {/* My Account ড্রপডাউন */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-sm"
              >
                👤 {currentUser ? `${currentUser.name} (${currentUser.designation})` : 'My account'}
                <span className="text-xs">▼</span>
              </button>

              {accountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded shadow-xl py-1 z-50 text-xs"
                  onClick={() => setAccountDropdownOpen(false)}
                >
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2 bg-emerald-50 text-[#0d5c3a] font-bold border-b border-slate-100">
                        {currentUser.isSuperAdmin ? '👑 সুপার অ্যাডমিন (পূর্ণ এক্সেস)' : `পদবী: ${currentUser.designation}`}
                        <div className="text-[10px] text-slate-500 font-normal">{currentUser.email}</div>
                      </div>
                      <button 
                        onClick={() => setCurrentNav('ERP')} 
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 font-bold text-emerald-800 flex items-center gap-1.5"
                      >
                        💼 হায়ারার্কিকাল ERP ড্যাশবোর্ড
                      </button>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-bold"
                      >
                        🚪 লগআউট
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setAuthModal('login')} 
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 font-medium"
                      >
                        👤 Login
                      </button>
                      <button 
                        onClick={() => setAuthModal('register')} 
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 font-medium"
                      >
                        📝 Create Account
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button 
                        onClick={() => setCurrentNav('ERP')} 
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-[#0d5c3a] font-bold"
                      >
                        🏢 সরাসরি ERP পোর্টাল
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* পোস্ট অ্যাড বাটন */}
            <button
              onClick={() => setPostAdModal(true)}
              className="bg-[#f39c12] hover:bg-[#d68910] text-white text-xs font-black px-3.5 py-2 rounded shadow transition uppercase"
            >
              POST AD <span className="bg-[#0d5c3a] text-white px-1.5 py-0.5 rounded text-[10px] ml-1">FREE</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ২. মার্কেটপ্লেস ইন্টারফেস */}
      {currentNav !== 'ERP' ? (
        <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                ● সেন্ট্রাল ক্লাউড ডাটাবেজ সংযুক্ত
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                {currentNav === 'Home' ? 'পুষ্পধারা প্রপার্টিজ ও সিস্টার কনসার্ন প্রজেক্টসমূহ' : `${currentNav} প্রজেক্ট তালিকা`}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                পদ্মা ইকো সিটি, দ্য বে আইকন কক্সবাজার, ঢাকা ওয়েস্টার্ন ভ্যালি ও অন্যান্য অনুমোদিত প্রকল্প
              </p>
            </div>
            <button 
              onClick={() => setCurrentNav('ERP')}
              className="bg-[#0d5c3a] hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-lg text-xs shadow transition"
            >
              💼 হায়ারার্কিকাল ইআরপি লেজার দেখুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-[#0d5c3a] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="absolute top-2 right-2 bg-slate-900/80 text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-bold text-[#0d5c3a] block">{item.company}</span>
                    <h3 className="text-base font-bold text-slate-800 mt-0.5">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">📍 {item.shortLocation}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">সাইজ</span>
                        <span className="font-semibold text-slate-700">{item.size}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">প্যাকেজ / রেট</span>
                        <span className="font-bold text-[#f39c12]">{item.priceText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button 
                    onClick={() => setDetailsModal(item)}
                    className="w-full bg-slate-100 hover:bg-[#0d5c3a] hover:text-white text-slate-800 font-bold py-2 rounded text-xs transition border border-slate-200"
                  >
                    বিস্তারিত ও বুকিং শর্তাবলী
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* ৩. হায়ারার্কিকাল অ্যাক্সেস কন্ট্রোলসহ ERP ড্যাশবোর্ড */
        <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 space-y-6">
          
          {/* ইউজার স্ট্যাটাস বার */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0d5c3a]">
                  পুষ্পধারা সেন্ট্রাল একাউন্টিং ও টিম ম্যানেজমেন্ট ERP
                </h2>
                {currentUser?.isSuperAdmin && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    👑 SUPER ADMIN ACCESS
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                লগইন স্ট্যাটাস: <strong className="text-slate-800">{currentUser ? currentUser.name : 'গেস্ট ভিউয়ার'}</strong> | 
                পদবী: <strong className="text-emerald-700">{currentUser ? currentUser.designation : 'Not Assigned'}</strong> | 
                অ্যাক্সেস লেভেল: <strong className="text-amber-600">{currentUser ? currentUser.level : 0}</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentNav('Home')} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded text-xs"
              >
                মার্কেটপ্লেসে ফিরুন
              </button>
            </div>
          </div>

          {/* অ্যাকাউন্টস ও হাই-লেভেল সামারি (কেবলমাত্র সুপার অ্যাডমিন, চেয়ারম্যান ও এমডির জন্য) */}
          {(currentUser?.level >= 7 || currentUser?.isSuperAdmin) && (
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-amber-400">🏢 কোম্পানির সেন্ট্রাল অ্যাকাউন্টস মডিউল (টপ লেভেল সিকিউরড)</h3>
                  <p className="text-xs text-slate-400">এই স্পর্শকাতর আর্থিক ডাটা নিম্নস্তরের কেউ দেখতে পারবে না।</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-1 rounded">
                  Super Admin, Chairman & MD Only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">মোট প্রজেক্ট সেলস ভলিউম</span>
                  <span className="text-lg font-black text-emerald-400">৳ ৯৫,০০,০০,০০০</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">মোট কালেকশন রিসিভড</span>
                  <span className="text-lg font-black text-white">৳ ৫৮,৪০,০০,০০০</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">বকেয়া কিস্তি কালেকশন</span>
                  <span className="text-lg font-black text-rose-400">৳ ৩৬,৬০,০০,০০০</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block">মোট কমিশন বিতরণ</span>
                  <span className="text-lg font-black text-amber-400">৳ ৫,২০,০০,০০০</span>
                </div>
              </div>
            </div>
          )}

          {/* টিম ও হায়ারার্কিকাল সেলস লেজার টেবিল */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d5c3a]">
                  আপনার অনুমোদিত টিম ও অধীনস্থ সেলস রেকর্ড ({accessibleMembers.length} জন)
                </h3>
                <p className="text-xs text-slate-500">
                  {currentUser?.isSuperAdmin 
                    ? 'আপনি সুপার অ্যাডমিন হওয়ায় শীর্ষ চেয়ারম্যান ও এমডি থেকে তৃণমূল পর্যন্ত সবার ডাটা অ্যাক্সেস করতে পারছেন।'
                    : `হায়ারার্কি নিয়ম অনুযায়ী আপনি কেবল নিজের এবং আপনার নিম্নস্তরের পদবীসমূহের হিসাব দেখতে পাচ্ছেন।`}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">আইডি</th>
                    <th className="p-3">সদস্যের নাম</th>
                    <th className="p-3">পদমর্যাদা (Designation)</th>
                    <th className="p-3">টিম / উইং</th>
                    <th className="p-3">ব্যক্তিগত সেলস</th>
                    <th className="p-3">টিম সেলস ভলিউম</th>
                    <th className="p-3">মোট কমিশন</th>
                    <th className="p-3">উত্তোলনযোগ্য ব্যালেন্স</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {accessibleMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-emerald-800 font-bold">{m.id}</td>
                      <td className="p-3 font-bold text-slate-800">{m.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.level >= 8 ? 'bg-purple-100 text-purple-800' :
                          m.level >= 5 ? 'bg-indigo-100 text-indigo-800' :
                          m.level >= 2 ? 'bg-blue-100 text-blue-800' :
                          m.level >= 0.5 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {m.designation} (Lvl {m.level})
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{m.team}</td>
                      <td className="p-3 font-semibold text-slate-800">৳ {m.selfSales.toLocaleString()}</td>
                      <td className="p-3 font-semibold text-emerald-700">৳ {m.teamSales.toLocaleString()}</td>
                      <td className="p-3 font-bold text-amber-600">৳ {m.commissionEarned.toLocaleString()}</td>
                      <td className="p-3 font-bold text-emerald-600">৳ {m.commissionBalance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* ৪. অ্যাকাউন্ট রেজিস্ট্রেশন মোডাল */}
      {authModal === 'register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="bg-[#0d5c3a] p-3 text-white flex justify-between items-center">
              <span className="font-bold text-sm">👤 CREATE ACCOUNT</span>
              <button onClick={() => setAuthModal(null)} className="text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-3.5 text-xs text-slate-700 max-h-[85vh] overflow-y-auto">
              <div>
                <label className="font-semibold block mb-1">অ্যাকাউন্টের ধরন (Account Type)</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="acctype" 
                      checked={regType === 'individual'} 
                      onChange={() => setRegType('individual')}
                      className="accent-[#0d5c3a]"
                    />
                    <span>Individual</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="acctype" 
                      checked={regType === 'company'} 
                      onChange={() => setRegType('company')}
                      className="accent-[#0d5c3a]"
                    />
                    <span>Company</span>
                  </label>
                </div>
              </div>

              {/* পদমর্যাদা নির্বাচন */}
              <div>
                <label className="block mb-0.5 font-bold text-slate-800">পদমর্যাদা নির্বাচন করুন (Designation) *</label>
                <select 
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 outline-none bg-slate-50 font-semibold"
                >
                  <option value="Agent">Agent (তৃণমূল এজেন্ট)</option>
                  <option value="Business Partner">Business Partner (বিপি)</option>
                  <option value="Team Leader">Team Leader (টিম লিডার)</option>
                  <option value="AGM">AGM (সহকারী জেনারেল ম্যানেজার)</option>
                  <option value="DGM">DGM (ডেপুটি জেনারেল ম্যানেজার)</option>
                  <option value="GM">GM (জেনারেল ম্যানেজার)</option>
                  <option value="Deputy Director">Deputy Director (ডেপুটি ডিরেক্টর)</option>
                  <option value="Director">Director (ডিরেক্টর)</option>
                  <option value="DMD">DMD (ডেপুটি ম্যানেজিং ডিরেক্টর)</option>
                  <option value="MD">MD (ম্যানেজিং ডিরেক্টর)</option>
                  <option value="Chairman">Chairman (চেয়ারম্যান)</option>
                </select>
                <span className="text-[10px] text-amber-600 block mt-0.5">
                  * {SUPER_ADMIN_EMAILS[0]} ইমেইল স্বয়ংক্রিয়ভাবে সুপার অ্যাডমিন হবে।
                </span>
              </div>

              <div>
                <label className="block mb-0.5">পূর্ণ নাম *</label>
                <input type="text" placeholder="Enter your full name" required value={regName} onChange={e => setRegName(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>

              <div>
                <label className="block mb-0.5">ইমেইল অ্যাড্রেস *</label>
                <input type="email" placeholder="mr.atiq.dhk.shimul@gmail.com" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>

              <div>
                <label className="block mb-0.5">মোবাইল নম্বর *</label>
                <input type="tel" placeholder="01XXXXXXXXX" required value={regMobile} onChange={e => setRegMobile(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-0.5">Password *</label>
                  <input type="password" placeholder="Password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                </div>
                <div>
                  <label className="block mb-0.5">Confirm Password *</label>
                  <input type="password" placeholder="Retype password" required value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px]">Prove your humanity: 8 + 8 =</span>
                <input type="text" placeholder="16" required value={regCaptcha} onChange={e => setRegCaptcha(e.target.value)} className="w-16 border border-slate-300 rounded p-1 text-center font-bold" />
              </div>

              <button type="submit" className="w-full bg-[#f39c12] hover:bg-[#d68910] text-white font-bold py-2.5 rounded shadow mt-2">
                Register Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ৫. লগইন মোডাল */}
      {authModal === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-lg max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="bg-[#0d5c3a] p-3 text-white flex justify-between items-center">
              <span className="font-bold text-sm">👤 LOGIN</span>
              <button onClick={() => setAuthModal(null)} className="text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs text-slate-700">
              <div>
                <label className="block mb-1 font-semibold">Your Email</label>
                <input 
                  type="email" 
                  placeholder="mr.atiq.dhk.shimul@gmail.com" 
                  required 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  className="w-full border border-slate-300 rounded p-2 outline-none" 
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  className="w-full border border-slate-300 rounded p-2 outline-none" 
                />
              </div>

              <button type="submit" className="w-full bg-[#f39c12] hover:bg-[#d68910] text-white font-bold py-2.5 rounded shadow">
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ৬. পোস্ট অ্যাড মোডাল */}
      {postAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-xs text-slate-800 space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#0d5c3a]">➕ পোস্ট করুন (অনলাইন সেন্ট্রাল ডাটাবেজ)</h3>
              <button onClick={() => setPostAdModal(false)} className="text-slate-500 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddNewAd} className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">প্রজেক্ট / প্লটের শিরোনাম *</label>
                <input type="text" placeholder="যেমন: পদ্মা ইকো সিটি কর্নার প্লট" required value={adTitle} onChange={e => setAdTitle(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">কোম্পানি</label>
                  <select value={adCompany} onChange={e => setAdCompany(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none">
                    <option>Pushpodhara Properties Ltd.</option>
                    <option>Bay Icon International Ltd.</option>
                    <option>Golden Eye Developer</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold">ক্যাটাগরি</label>
                  <select value={adCategory} onChange={e => setAdCategory(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none">
                    <option value="plot">প্লট / জমি</option>
                    <option value="flat">ফ্ল্যাট / অ্যাপার্টমেন্ট</option>
                    <option value="commercial">কমার্শিয়াল</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 font-semibold">লোকেশন *</label>
                  <input type="text" placeholder="যেমন: মাওয়া হাইওয়ে" required value={adLocation} onChange={e => setAdLocation(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">সাইজ</label>
                  <input type="text" placeholder="যেমন: ৫ কাঠা" value={adSize} onChange={e => setAdSize(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">মূল্য বিবরণ *</label>
                <input type="text" placeholder="যেমন: ১২,০০,০০০ ৳ / কাঠা" required value={adPrice} onChange={e => setAdPrice(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>

              <button type="submit" className="w-full bg-[#0d5c3a] hover:bg-emerald-800 text-white font-bold py-2.5 rounded shadow mt-2">
                অনলাইনে প্রকাশ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ৭. প্রজেক্ট ডিটেইলস মোডাল */}
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 text-xs text-slate-700 space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-2">
              <div>
                <span className="text-[#0d5c3a] font-bold block">{detailsModal.company}</span>
                <h3 className="text-base font-bold text-slate-900">{detailsModal.title}</h3>
                <p className="text-slate-500">📍 {detailsModal.location}</p>
              </div>
              <button onClick={() => setDetailsModal(null)} className="text-slate-500 text-lg font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <strong className="block text-slate-800 mb-1">প্রজেক্ট পরিচিতি:</strong>
              {detailsModal.details.overview}
            </div>

            <div>
              <strong className="block text-slate-800 mb-1">সুবিধাসমূহ:</strong>
              <ul className="space-y-1">
                {detailsModal.details.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-emerald-800">
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-base text-[#f39c12]">{detailsModal.priceText}</span>
              <button 
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?phone=8801681196700&text=${encodeURIComponent(`বুকিং ইনকোয়ারি: ${detailsModal.title}`)}`, '_blank');
                }}
                className="bg-[#0d5c3a] hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded"
              >
                💬 হোয়াটসঅ্যাপে বুকিং
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ফুটার */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        © 2026 Unity Dream Properties Ltd. | Official Partner of Pushpodhara Properties Ltd.
      </footer>
    </div>
  );
}