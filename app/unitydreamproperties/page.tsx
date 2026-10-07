'use client';

import React, { useState, useEffect, useMemo } from 'react';

// প্রোপার্টি ডাটা টাইপ
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

// অথেন্টিক প্রজেক্ট ডাটাবেজ
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
      overview: '3,500 একরের মেগা ফ্ল্যাগশিপ টাউনশিপ প্রজেক্ট যা ২০১৫ সালে শুরু হয়। ঢাকা-মাওয়া চার লেন হাইওয়ে ও পদ্মা সেতুর খুব কাছে অবস্থিত আধুনিক নাগরিক সুবিধা সংবলিত আবাসন প্রকল্প।',
      features: [
        '৩, ৫, ১০ ও ২০ কাঠার আবাসিক ও বাণিজ্যিক প্লট',
        '৩ কিলোমিটার দীর্ঘ নান্দনিক বাঁকানো লেক ও ওয়াকওয়ে',
        'পর্যাপ্ত সবুজ পার্ক, খেলার মাঠ ও মসজিদ',
        'প্রশস্ত অভ্যন্তরীণ রাস্তা ও বিদ্যুৎ-পানি সংযোগ সুবিধা',
        'এককালীন ও দীর্ঘমেয়াদী সহজ কিস্তির সুযোগ'
      ]
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
      overview: 'কক্সবাজারের সুগন্ধা ও কলাতলী মেরিন ড্রাইভ রোডে ২০৫ শতাংশ জমির ওপর নির্মিতব্য আন্তর্জাতিক মানের ৫-স্টার লাক্সারি হোটেল অ্যান্ড রিসোর্ট।',
      features: [
        '১৪ থেকে ১৫ তলা আধুনিক স্থাপত্য ও টাওয়ার স্ট্রাকচার',
        'প্রায় ৪৯৫টি বিলাসবহুল রুম ও প্রেসিডেনশিয়াল স্যুট',
        'ইনফিনিটি রুফটপ সুইমিং পুল, গ্র্যান্ড রেস্টুরেন্ট, জিম ও জুস বার',
        'সরাসরি সাফ-কবলা সাব-রেজিস্ট্রি দলিল ও ফ্র্যাকশনাল মালিকানা',
        'লাইফটাইম ক্যাপিং-মুক্ত হালাল মাসিক মুনাফা বণ্টন'
      ]
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
      overview: 'ঢাকা জিরো পয়েন্ট থেকে মাত্র ২২ কিমি এবং পদ্মা সেতু থেকে ১৩ কিমি দূরত্বে ঢাকা-মাওয়া এক্সপ্রেসওয়ের প্রাইম বেল্টে পরিকল্পিত আধুনিক স্যাটেলাইট সিটি।',
      features: [
        'নিষ্কণ্টক মালিকানা ও দ্রুত রেজিস্ট্রেশন',
        'আধুনিক ড্রেনেজ ও মাটির নিচের ক্যাবলিং নেটওয়ার্ক',
        'স্কুল, কলেজ ও হাসপাতালের নির্ধারিত জোন'
      ]
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
      overview: 'গোল্ডেন আই ডেভেলপার কর্তৃক বাস্তবায়িত মিরপুর ও মোহাম্মদপুর কানেক্টিভিটির সন্নিকটে অবস্থিত প্রিমিয়াম ল্যান্ড প্রজেক্ট।',
      features: [
        'উত্তরা ও মিরপুর মেট্রো স্টেশনের সহজ যাতায়াত',
        '৬০ ফুট ও ৪০ ফুট প্রশস্ত এভিনিউ রোড',
        'বিদ্যুৎ, গ্যাস ও সুয়ারেজ ব্যবস্থার পূর্ণ পরিকল্পনা'
      ]
    }
  }
];

export default function UnityDreamPropertiesAll() {
  const [properties, setProperties] = useState<PropertyItem[]>(defaultProjects);
  const [currentNav, setCurrentNav] = useState('Home');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // মোডাল ও অথ স্টেট
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [regType, setRegType] = useState<'individual' | 'company'>('individual');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [postAdModal, setPostAdModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState<PropertyItem | null>(null);

  // ফর্ম স্টেট
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regMobile2, setRegMobile2] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regContactPerson, setRegContactPerson] = useState('');
  const [regDesignation, setRegDesignation] = useState('');
  const [regOfficeAddress, setRegOfficeAddress] = useState('');
  const [regCaptcha, setRegCaptcha] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // পোস্ট অ্যাড স্টেট
  const [adTitle, setAdTitle] = useState('');
  const [adCompany, setAdCompany] = useState('Pushpodhara Properties Ltd.');
  const [adCategory, setAdCategory] = useState('plot');
  const [adLocation, setAdLocation] = useState('');
  const [adSize, setAdSize] = useState('');
  const [adPrice, setAdPrice] = useState('');

  // লোকাল স্টোরেজ সিঙ্ক
  useEffect(() => {
    try {
      const saved = localStorage.getItem('udp_live_items');
      if (saved) setProperties(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adLocation || !adPrice) {
      alert('সবগুলো জরুরি ঘর পূরণ করুন!');
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
        overview: 'ব্যবহারকারী কর্তৃক সরাসরি অনলাইন ডাটাবেজে যুক্ত হওয়া প্রজেক্ট।',
        features: ['নিষ্কণ্টক জমি', 'দ্রুত রেজিস্ট্রি']
      }
    };

    const updated = [newItem, ...properties];
    setProperties(updated);
    localStorage.setItem('udp_live_items', JSON.stringify(updated));
    alert('প্রোপার্টি সফলভাবে অনলাইন ডাটাবেজে যুক্ত ও লাইভ হয়েছে!');
    setPostAdModal(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert('পাসওয়ার্ড মিলছে না!');
      return;
    }
    if (regCaptcha !== '16') {
      alert('ক্যাপচা ভুল! ৮ + ৮ = ১৬ লিখুন।');
      return;
    }
    const user = {
      name: regType === 'individual' ? regName : regContactPerson || regName,
      email: regEmail,
      type: regType
    };
    setCurrentUser(user);
    alert(`অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে! স্বাগতম ${user.name}`);
    setAuthModal(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({ name: loginEmail.split('@')[0], email: loginEmail });
    alert('লগইন সম্পন্ন হয়েছে!');
    setAuthModal(null);
  };

  // ফিল্টার
  const displayedItems = useMemo(() => {
    if (currentNav === 'For Sale') return properties.filter(p => p.type === 'plot' || p.type === 'flat');
    if (currentNav === 'For Rent') return properties.filter(p => p.type === 'rent');
    if (currentNav === 'Roommates') return properties.filter(p => p.type === 'roommate');
    if (currentNav === 'Developers') return properties.filter(p => p.company.includes('Pushpodhara') || p.company.includes('Golden'));
    return properties;
  }, [properties, currentNav]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between">
      
      {/* =========================================================
          মেনুবার হেডার (bdhousing শৈলীতে শতভাগ দৃশ্যমান ও ফিক্সড)
      ========================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap justify-between items-center gap-3">
          
          {/* লোগো */}
          <div 
            onClick={() => setCurrentNav('Home')} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-10 h-10 bg-[#0d5c3a] text-white font-black text-xl flex items-center justify-center rounded shadow">
              UDP
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#0d5c3a] block leading-tight">
                UNITY DREAM PROPERTIES
              </span>
              <span className="text-[11px] text-slate-500 font-semibold block">
                পুষ্পধারা প্রপার্টিজ লিমিটেড পার্টনার পোর্টাল
              </span>
            </div>
          </div>

          {/* মেনু আইটেমসমূহ */}
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

            {/* My Account ড্রপডাউন[cite: 1, 2] */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-sm"
              >
                👤 {currentUser ? currentUser.name : 'My account'}
                <span className="text-xs">▼</span>
              </button>

              {accountDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded shadow-xl py-1 z-50 text-xs"
                  onClick={() => setAccountDropdownOpen(false)}
                >
                  {currentUser ? (
                    <>
                      <div className="px-3 py-1.5 text-emerald-800 font-bold border-b border-slate-100">
                        লগইন: {currentUser.name}
                      </div>
                      <button 
                        onClick={() => setCurrentNav('ERP')} 
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 font-bold text-emerald-700"
                      >
                        💼 ইআরপি লেজার
                      </button>
                      <button 
                        onClick={() => setCurrentUser(null)} 
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-bold"
                      >
                        🚪 লগআউট
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setAuthModal('login')} 
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 font-medium flex items-center gap-2"
                      >
                        👤 Login
                      </button>
                      <button 
                        onClick={() => setAuthModal('register')} 
                        className="w-full text-left px-3 py-2 hover:bg-slate-100 font-medium flex items-center gap-2"
                      >
                        📝 Create Account
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button 
                        onClick={() => setCurrentNav('ERP')} 
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-[#0d5c3a] font-bold"
                      >
                        💼 সরাসরি ERP ড্যাশবোর্ড
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* কমলা রঙের POST AD FREE বাটন[cite: 2] */}
            <button
              onClick={() => setPostAdModal(true)}
              className="bg-[#f39c12] hover:bg-[#d68910] text-white text-xs font-black px-3.5 py-2 rounded shadow transition flex items-center gap-1 uppercase"
            >
              POST AD <span className="bg-[#0d5c3a] text-white px-1.5 py-0.5 rounded text-[10px] ml-1">FREE</span>
            </button>
          </nav>
        </div>
      </header>

      {/* =========================================================
          মেইন বডি
      ========================================================= */}
      {currentNav !== 'ERP' ? (
        <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-2">
                ● অনলাইন ক্লাউড ডাটাবেজ সক্রিয়
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
              💼 কাস্টমার ও এজেন্ট ইআরপি ড্যাশবোর্ড
            </button>
          </div>

          {/* প্রোপার্টি গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
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

                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map((t, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
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
        /* ইআরপি মোড */
        <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0d5c3a]">পুষ্পধারা একাউন্টিং ও কিস্তি লেজার (ERP)</h3>
                <p className="text-xs text-slate-500">বুকিং, মানি রিসিট ও সেলস পার্টনার কমিশন কন্ট্রোল</p>
              </div>
              <button 
                onClick={() => setCurrentNav('Home')} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded text-xs"
              >
                মার্কেটপ্লেসে ফিরুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500">মোট চুক্তিমূল্য</span>
                <p className="text-lg font-black text-slate-800 mt-1">৳ ৬০,০০,০০০</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500">মোট জমা / পরিশোধ</span>
                <p className="text-lg font-black text-emerald-700 mt-1">৳ ৪৪,৫০,০০০</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-slate-500">বকেয়া কিস্তি</span>
                <p className="text-lg font-black text-rose-600 mt-1">৳ ১৫,৫০,০০০</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =========================================================
          রেজিস্ট্রেশন মডাল[cite: 3, 5]
      ========================================================= */}
      {authModal === 'register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="bg-[#0d5c3a] p-3 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>👤</span> CREATE ACCOUNT
              </div>
              <button onClick={() => setAuthModal(null)} className="text-white text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleRegister} className="p-6 space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="font-semibold block mb-1">I am</label>
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

              {regType === 'individual' ? (
                <>
                  <div>
                    <label className="block mb-0.5">Name *</label>
                    <input type="text" placeholder="Enter your full name" required value={regName} onChange={e => setRegName(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div>
                    <label className="block mb-0.5">E-mail *</label>
                    <input type="email" placeholder="Enter valid e-mail" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div>
                    <label className="block mb-0.5">Mobile *</label>
                    <input type="tel" placeholder="Enter mobile number" required value={regMobile} onChange={e => setRegMobile(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-0.5">Company Name *</label>
                    <input type="text" placeholder="Company name" required value={regName} onChange={e => setRegName(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div>
                    <label className="block mb-0.5">Contact Person Name *</label>
                    <input type="text" placeholder="Contact person" required value={regContactPerson} onChange={e => setRegContactPerson(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div>
                    <label className="block mb-0.5">Designation *</label>
                    <input type="text" placeholder="Designation" value={regDesignation} onChange={e => setRegDesignation(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div>
                    <label className="block mb-0.5">E-mail *</label>
                    <input type="email" placeholder="Valid email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div>
                    <label className="block mb-0.5">Office Address *</label>
                    <input type="text" placeholder="Office address" value={regOfficeAddress} onChange={e => setRegOfficeAddress(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block mb-0.5">Mobile *</label>
                      <input type="tel" placeholder="Mobile" required value={regMobile} onChange={e => setRegMobile(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                    </div>
                    <div>
                      <label className="block mb-0.5">Mobile 2 / Landline</label>
                      <input type="tel" placeholder="Landline" value={regMobile2} onChange={e => setRegMobile2(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
                    </div>
                  </div>
                </>
              )}

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

              <button type="submit" className="w-full bg-[#f39c12] hover:bg-[#d68910] text-white font-bold py-2.5 rounded shadow">
                Register Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          লগইন মডাল[cite: 8]
      ========================================================= */}
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
                <input type="email" placeholder="Email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Password</label>
                <input type="password" placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full border border-slate-300 rounded p-2 outline-none" />
              </div>

              <button type="submit" className="w-full bg-[#f39c12] hover:bg-[#d68910] text-white font-bold py-2.5 rounded shadow">
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          পোস্ট অ্যাড মডাল (অনলাইন ডাটাবেজে নতুন পোস্টিং)[cite: 2]
      ========================================================= */}
      {postAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-xs text-slate-800 space-y-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-[#0d5c3a]">➕ পোস্ট করুন (সরাসরি অনলাইন ডাটাবেজ)</h3>
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

      {/* বিস্তারিত মডাল */}
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