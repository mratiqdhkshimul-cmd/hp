'use client';

import React, { useState } from 'react';

// প্রজেক্ট তালিকা (ঢাকা ওয়েস্টার্ন ভ্যালি প্রথমে)
const initialProjects = [
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
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
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
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  }
];

// কোম্পানির প্রাতিষ্ঠানিক হায়ারার্কি প্রটোকল ও কমিশন হার
const companyHierarchy = [
  { role: 'Agent', bn: 'এজেন্ট', rate: 0.03, override: 0 },
  { role: 'Business Partner', bn: 'বিজনেস পার্টনার', rate: 0.05, override: 0.01 },
  { role: 'AGM', bn: 'সহকারী মহাব্যবস্থাপক (AGM)', rate: 0.06, override: 0.015 },
  { role: 'DGM', bn: 'উপ-মহাব্যবস্থাপক (DGM)', rate: 0.07, override: 0.02 },
  { role: 'GM', bn: 'মহাব্যবস্থাপক (GM)', rate: 0.08, override: 0.025 },
  { role: 'Deputy Director', bn: 'ডেপুটি ডিরেক্টর', rate: 0.09, override: 0.03 },
  { role: 'Director', bn: 'ডিরেক্টর', rate: 0.10, override: 0.035 },
  { role: 'Managing Director', bn: 'ম্যানেজিং ডিরেক্টর', rate: 0.11, override: 0.04 },
  { role: 'Chairman', bn: 'চেয়ারম্যান', rate: 0.12, override: 0.05 },
];

export default function UnityDreamPortal() {
  // মেনু ও মোডাল স্টেট
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [registerType, setRegisterType] = useState<'individual' | 'company'>('individual');
  
  // ইউজার ও অথেন্টিকেশন স্টেট (ডিফল্ট সুপার এডমিন সক্রিয়)
  const [currentUser, setCurrentUser] = useState({
    name: 'আতিকুর রহমান',
    email: 'atiq@unitydream.com',
    role: 'Super Admin',
    isLoggedIn: true
  });

  // ERP ও হায়ারার্কিক্যাল লেজার স্টেট
  const [showLedger, setShowLedger] = useState(false);
  const [soldKatha, setSoldKatha] = useState<number>(5);
  const [pricePerKatha, setPricePerKatha] = useState<number>(1450000);
  const [selectedRole, setSelectedRole] = useState<string>('Business Partner');

  // হায়ারার্কিক্যাল ইনকাম ও লেজার ক্যালকুলেশন
  const totalSalesAmount = soldKatha * pricePerKatha;
  const currentHierarchy = companyHierarchy.find(h => h.role === selectedRole) || companyHierarchy[1];
  const directCommission = totalSalesAmount * currentHierarchy.rate;
  const teamOverrideCommission = totalSalesAmount * currentHierarchy.override;
  const totalEarning = directCommission + teamOverrideCommission;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ===================== ১. হেডার ও অরিজিনাল নেভিগেশন বার ===================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* লোগো ও ব্র্যান্ড নাম (এক লাইনে ও ডুপ্লিকেশন মুক্ত) */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Unity Dream Properties" 
                className="h-12 w-auto object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
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

            {/* অরিজিনাল মেনু আইটেমসমূহ */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-700">
              <a href="#home" className="hover:text-emerald-600 transition-colors">Home</a>
              <a href="#for-sale" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Sale</a>
              <a href="#for-rent" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Rent</a>
              <a href="#roommates" className="hover:text-emerald-600 transition-colors">Roommates</a>
              <a href="#developers" className="hover:text-emerald-600 transition-colors">Developers</a>
              <a href="#jobs" className="hover:text-emerald-600 transition-colors">Jobs</a>
              <a href="#blog" className="hover:text-emerald-600 transition-colors">Blog</a>
            </nav>

            {/* My Account ড্রপডাউন ও ইউজার কন্ট্রোল */}
            <div className="relative flex items-center gap-3">
              
              <div className="relative">
                <button 
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3.5 py-2 rounded-md border border-slate-300 text-xs font-bold transition-colors"
                >
                  <span>My account</span>
                  <span className="text-[10px]">▼</span>
                </button>

                {/* My Account ড্রপডাউন মেনু */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 text-xs">
                    {currentUser.isLoggedIn ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-[11px] text-emerald-600 font-semibold">{currentUser.role}</p>
                          <p className="text-[10px] text-gray-400">{currentUser.email}</p>
                        </div>
                        <button 
                          onClick={() => { setShowLedger(true); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-slate-700 font-medium"
                        >
                          📊 ERP লেজার ও হিসাব
                        </button>
                        <button 
                          onClick={() => { 
                            setCurrentUser({ ...currentUser, isLoggedIn: false }); 
                            setAccountMenuOpen(false); 
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-bold border-t border-gray-100"
                        >
                          🚪 Sign Out (সাইন আউট)
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setAuthModal('login'); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-semibold"
                        >
                          <span>👤</span> Login
                        </button>
                        <button 
                          onClick={() => { setAuthModal('register'); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-semibold"
                        >
                          <span>📝</span> Create Account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* ===================== ২. সেন্ট্রাল ক্লাউড ERP ও হায়ারার্কি লেজার ===================== */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                সেন্ট্রাল ক্লাউড ডাটাবেজ সংযুক্ত
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Unity Dream Properties — সেন্ট্রাল একাউন্টিং ও টিম ম্যানেজমেন্ট ERP
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                পুষ্পধারা প্রপার্টিজ লিমিটেডের অধীনে পরিচালিত সকল মেগা প্রজেক্টের অফিশিয়াল সেলস ও ভেরিফাইড ম্যানেজমেন্ট সিস্টেম।
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowLedger(!showLedger)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-all flex items-center gap-2"
              >
                <span>{showLedger ? 'লেজার বন্ধ করুন' : 'হায়ারার্কিক্যাল ইনকাম ও লেজার দেখুন'}</span>
              </button>
            </div>
          </div>

          {/* হায়ারার্কিক্যাল একাউন্টিং ও ইনকাম লেজার সিমুলেটর */}
          {showLedger && (
            <div className="mt-6 pt-6 border-t border-slate-700/80 bg-slate-950/70 p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-sm md:text-base font-bold text-amber-400">
                  📊 প্রাতিষ্ঠানিক হায়ারার্কি ভিত্তিক কাঠা সেলস ও ইনকাম লেজার
                </h3>
                <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded">
                  ERP Live Sync Active
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* কাঠা সংখ্যা */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">বিক্রিত মোট জমির পরিমাণ</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="1"
                      value={soldKatha}
                      onChange={(e) => setSoldKatha(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 font-bold"
                    />
                    <span className="ml-2 text-xs text-slate-400 whitespace-nowrap">কাঠা</span>
                  </div>
                </div>

                {/* কাঠা প্রতি রেট */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">প্রতি কাঠার প্যাকেজ রেট (টাকা)</label>
                  <input 
                    type="number" 
                    value={pricePerKatha}
                    onChange={(e) => setPricePerKatha(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                {/* হায়ারার্কি পদবী নির্ধারণ */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">কোম্পানি প্রটোকল পদবী</label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {companyHierarchy.map((h) => (
                      <option key={h.role} value={h.role}>
                        {h.bn} ({h.rate * 100}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* মোট ইনকাম ডিসপ্লে */}
                <div className="bg-slate-900/90 border border-emerald-500/40 rounded-lg p-3 flex flex-col justify-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    মোট প্রাপ্য কমিশন ও ওভাররাইড
                  </span>
                  <span className="text-xl font-extrabold text-amber-400 mt-0.5">
                    {Math.round(totalEarning).toLocaleString('bn-BD')} ৳
                  </span>
                </div>
              </div>

              {/* হিসাবের বিস্তারিত ব্রেকডাউন */}
              <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>• মোট সেলস ভ্যালু: <strong>{totalSalesAmount.toLocaleString('bn-BD')} ৳</strong></div>
                <div>• পদবীর বেসিক কমিশন: <strong>{directCommission.toLocaleString('bn-BD')} ৳ ({currentHierarchy.rate * 100}%)</strong></div>
                <div>• টিম ওভাররাইড বোনাস: <strong>{teamOverrideCommission.toLocaleString('bn-BD')} ৳ ({currentHierarchy.override * 100}%)</strong></div>
              </div>
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
          {initialProjects.map((project) => (
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
                <button className="w-full text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors">
                  বিস্তারিত ও বুকিং শর্তাবলী
                </button>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* ===================== ৪. ফুটার সেকশন ===================== */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-10 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-sm">
            <div>
              <h4 className="text-white font-bold text-base tracking-wide mb-2">UNITY DREAM PROPERTIES</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি:। সেন্ট্রাল ক্লাউড ডাটাবেজ সমন্বিত রিয়েল এস্টেট ইআরপি সিস্টেম।
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

      {/* ===================== ৫. লগইন ও রেজিস্ট্রেশন মোডাল (My Account) ===================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            
            {/* মোডাল হেডার */}
            <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>👤</span> {authModal === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
              </h3>
              <button 
                onClick={() => setAuthModal(null)}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              
              {/* --- LOGIN FORM --- */}
              {authModal === 'login' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setCurrentUser({
                    name: 'আতিকুর রহমান',
                    email: 'atiq@unitydream.com',
                    role: 'Super Admin',
                    isLoggedIn: true
                  });
                  setAuthModal(null);
                  alert('সফলভাবে লগইন হয়েছে!');
                }}>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="Email" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      placeholder="Password" 
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded shadow transition-colors text-sm"
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

              {/* --- CREATE ACCOUNT FORM (Individual vs Company) --- */}
              {authModal === 'register' && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে লগইন করুন।');
                  setAuthModal('login');
                }}>
                  
                  {/* Account Type Selector */}
                  <div className="flex items-center gap-6 mb-4 text-xs font-bold text-gray-700">
                    <span>I am:</span>
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
                    {registerType === 'individual' ? (
                      <div>
                        <label className="block font-medium text-gray-700 mb-0.5">Name *</label>
                        <input type="text" required placeholder="Enter your full name" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block font-medium text-gray-700 mb-0.5">Company Name *</label>
                          <input type="text" required placeholder="Company name" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-0.5">Contact Person Name *</label>
                          <input type="text" required placeholder="Enter contact person name" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-0.5">Designation *</label>
                          <input type="text" required placeholder="Enter designation" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-0.5">Office Address *</label>
                          <input type="text" required placeholder="Enter office address" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">E-mail *</label>
                      <input type="email" required placeholder="Enter valid e-mail address" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Mobile *</label>
                      <input type="tel" required placeholder="Enter your valid mobile number" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Password *</label>
                      <input type="password" required placeholder="Password" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Confirm Password *</label>
                      <input type="password" required placeholder="Retype password" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div className="pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                        <input type="checkbox" required defaultChecked />
                        I am Agree to Terms & Conditions
                      </label>
                    </div>

                    {/* Humanity Captcha */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-gray-600">Prove your humanity: 8 + 8 =</span>
                      <input type="number" required placeholder="16" className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold" />
                    </div>

                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded shadow transition-colors text-sm"
                  >
                    Register Now
                  </button>

                  <div className="mt-3 text-center text-xs text-gray-600">
                    <button 
                      type="button"
                      onClick={() => setAuthModal('login')}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Click for login
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