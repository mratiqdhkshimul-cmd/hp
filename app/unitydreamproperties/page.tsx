'use client';

import React, { useState } from 'react';

// ===================== টাইপ ডেফিনিশন =====================
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Accounts' | 'Director' | 'Deputy Director' | 'GM' | 'DGM' | 'AGM' | 'Business Partner' | 'Agent';
  salesKatha: number;
  totalEarnings: number;
  teamSalesKatha: number;
  teamEarnings: number;
  isSuperAdmin: boolean;
  hasAccountsAccess: boolean;
}

// প্রজেক্টের সম্পূর্ণ ডাটাবেজ ও বিস্তারিত শর্তাবলী
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
      "বুকিং মানি মোট মূল্যের ১০% প্রদান সাপেক্ষে সাময়িক প্লট বরাদ্দ নিশ্চিত করা হবে।",
      "প্রকল্প এলাকায় বিদ্যুৎ, সুপ্রশস্ত রাস্তা ও ড্রেনেজ নেটওয়ার্ক অন্তর্ভুক্ত।"
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
      "প্রতি স্কয়ার ফিটের বর্তমান কর্পোরেট মূল্য ৫০,০০০ টাকা নির্ধারিত।",
      "১০০, ৩০০, ৫০০, ১০০০, ২০০০, ৩০০০ এবং ৫০০০ স্কয়ার ফিট ফ্র্যাকশনাল ওনারশিপ শেয়ার বিক্রয়যোগ্য।",
      "আজীবন সাব-কবলা দলিল ও লভ্যাংশ (ROI) পাওয়ার শতভাগ আইনি গ্যারান্টি।",
      "বুকিংয়ের পর চুক্তিপত্র সম্পাদন এবং কিস্তিতে বিনিয়োগ পরিশোধের সুবিধা।",
      "প্রতি বছর হোটেল ও রিসোর্টে নির্ধারিত দিন পারিবারিক ফ্রি অবকাশ যাপনের সুবিধা।"
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
      "প্রকল্পে প্লট সাইজ সর্বনিম্ন ৫ কাঠা। ৩ কাঠার কোনো প্লট রাখা হয়নি।",
      "পদ্মা সেতু সংলগ্ন ও এক্সপ্রেসওয়ের সরাসরি সংযোগ সংবলিত আধুনিক ইকো-সিটি।",
      "৫০% মূল্য পরিশোধ সাপেক্ষে প্রাথমিক পজেশন ও বাউন্ডারি ওয়াল নির্মাণের অনুমতি।",
      "সহজ কিস্তির মেয়াদ সর্বনিম্ন ৩৬ মাস থেকে সর্বোচ্চ ৭২ মাস পর্যন্ত প্রযোজ্য।"
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
      "নাগরিক সকল সুযোগ-সুবিধা যেমন স্কুল, কলেজ, মসজিদ, পার্ক ও শপিংমল পরিকল্পিত।",
      "বুকিং মানি জমাদানের ৩০ দিনের মধ্যে কোম্পানি অনুমোদিত বায়না দলিল প্রদান।"
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
    terms: [
      "বাণিজ্যিক ও আবাসিক সমন্বিত নিরাপদ প্লট প্রকল্প।",
      "সর্বনিম্ন ৫ কাঠার প্লট বরাদ্দ। ভিজিট ও বুকিংয়ের জন্য কেন্দ্রীয় অফিসে যোগাযোগ প্রযোজ্য।"
    ]
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
    terms: [
      "ঢাকার প্রাণকেন্দ্রে আধুনিক কমার্শিয়াল ও রেসিডেন্সিয়াল ফ্লোর স্পেস।",
      "সরাসরি ডেভেলপার অংশীদারিত্ব ও শেয়ার ওনারশিপ বিনিয়োগ সুবিধা।"
    ]
  }
];

// একমাত্র ভেরিফাইড সুপার এডমিন প্রোফাইল
const defaultSuperAdmin: UserProfile = {
  id: 'UDP-SA-001',
  name: 'MOHAMMAD ATIQUL ISLAM',
  email: 'mr.atiq.dhk.shimul@gmail.com',
  phone: '+8801689333000',
  role: 'Super Admin',
  salesKatha: 45,
  totalEarnings: 3262500,
  teamSalesKatha: 120,
  teamEarnings: 1740000,
  isSuperAdmin: true,
  hasAccountsAccess: true
};

export default function UnityDreamPortal() {
  // অথেন্টিকেশন স্টেট
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(defaultSuperAdmin);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [registerType, setRegisterType] = useState<'individual' | 'company'>('individual');

  // ERP মডিউল ও পারমিশন স্টেট
  const [showERP, setShowERP] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_ledger' | 'central_accounts' | 'access_control'>('my_ledger');
  
  // ট্রানজ্যাকশন এন্ট্রি স্টেট (সুপার এডমিন ও একাউন্টস ম্যানেজমেন্টের জন্য)
  const [newSaleKatha, setNewSaleKatha] = useState<number>(5);
  const [saleRate, setSaleRate] = useState<number>(1450000);
  const [partnerPhone, setPartnerPhone] = useState<string>('+8801689333000');
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>('MOHAMMAD ATIQUL ISLAM');

  // প্রজেক্টের বিস্তারিত শর্তাবলীর মোডাল
  const [selectedProjectForTerms, setSelectedProjectForTerms] = useState<typeof projectsData[0] | null>(null);

  // হোয়াটসঅ্যাপে ট্রানজ্যাকশন ও ভাউচার পাঠানোর সরাসরি ফাংশন
  const sendWhatsAppVoucher = (phone: string, name: string, katha: number, total: number, commission: number) => {
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*UNITY DREAM PROPERTIES LTD.* - Transaction Voucher\n` +
      `-------------------------------------------\n` +
      `মাননীয় পার্টনার: ${name}\n` +
      `বিক্রিত জমির পরিমাণ: ${katha} কাঠা\n` +
      `মোট সেলস ভ্যালু: ${total.toLocaleString('bn-BD')} ৳\n` +
      `আপনার প্রাপ্ত কমিশন: ${commission.toLocaleString('bn-BD')} ৳\n` +
      `স্ট্যাটাস: Approved by Central Accounts\n` +
      `-------------------------------------------\n` +
      `BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি:\n` +
      `হটলাইন: +8801689333000 | Hosaf Tower, Malibag, Dhaka`
    );
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${message}`, '_blank');
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    const totalVal = newSaleKatha * saleRate;
    const earnedCommission = totalVal * 0.05; // ৫% প্রমিত কমিশন
    alert(`সেন্ট্রাল ডাটাবেজে ${newSaleKatha} কাঠা সেল সফলভাবে যুক্ত হয়েছে!`);
    sendWhatsAppVoucher(partnerPhone, selectedPartnerName, newSaleKatha, totalVal, earnedCommission);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ===================== ১. হেডার ও মেনুবার ===================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
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

            {/* মূল মেনুবার */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-700">
              <a href="#home" className="hover:text-emerald-600 transition-colors">Home</a>
              <a href="#for-sale" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Sale</a>
              <a href="#for-rent" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Rent</a>
              <a href="#roommates" className="hover:text-emerald-600 transition-colors">Roommates</a>
              <a href="#developers" className="hover:text-emerald-600 transition-colors">Developers</a>
              <a href="#jobs" className="hover:text-emerald-600 transition-colors">Jobs</a>
              <a href="#blog" className="hover:text-emerald-600 transition-colors">Blog</a>
            </nav>

            {/* My Account কন্ট্রোল */}
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
                        onClick={() => { 
                          setCurrentUser(null); 
                          setShowERP(false);
                          setAccountMenuOpen(false); 
                        }}
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
                        <span>🔑</span> Login
                      </button>
                      <button 
                        onClick={() => { setAuthModal('register'); setAccountMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-800 flex items-center gap-2 font-bold"
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
      </header>

      {/* ===================== ২. কেন্দ্রীয় ক্লাউড ERP ব্যানার ও কন্ট্রোল প্যানেল ===================== */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                সেন্ট্রাল ক্লাউড ডাটাবেজ সংযুক্ত (অনলাইন সিংকিং সক্রিয়)
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Unity Dream Properties — সেন্ট্রাল একাউন্টিং ও রোল-বেসড টিম ERP
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                রোল ভিত্তিক এক্সেস কন্ট্রোল: পার্টনাররা নিজস্ব সেলস দেখবেন এবং সুপার এডমিন সেন্ট্রাল একাউন্টস নিয়ন্ত্রণ করবেন।
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowERP(!showERP)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-all flex items-center gap-2"
              >
                <span>{showERP ? 'ERP বন্ধ করুন' : 'সেন্ট্রাল ERP ও একাউন্টিং খুলুন'}</span>
              </button>
            </div>
          </div>

          {/* ===================== ২.১ ক্লাউড ERP ড্যাশবোর্ড ইন্টারফেস ===================== */}
          {showERP && (
            <div className="mt-6 pt-6 border-t border-slate-700/80 bg-slate-950/80 p-5 rounded-xl">
              
              {/* ERP ট্যাব নেভিগেশন */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-5">
                <button 
                  onClick={() => setActiveTab('my_ledger')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'my_ledger' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  👤 আমার নিজস্ব সেলস ও ইনকাম লেজার
                </button>

                {/* সেন্ট্রাল একাউন্টস এক্সেস কেবল সুপার এডমিন ও অনুমোদিত একাউন্টসের জন্য */}
                {currentUser?.hasAccountsAccess && (
                  <button 
                    onClick={() => setActiveTab('central_accounts')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'central_accounts' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔒 সেন্ট্রাল একাউন্টিং ও হোয়াটসঅ্যাপ ট্রানজ্যাকশন ভাউচার
                  </button>
                )}

                {/* এক্সেস কন্ট্রোল ও ইউজার পারমিশন (শুধুমাত্র সুপার এডমিন) */}
                {currentUser?.isSuperAdmin && (
                  <button 
                    onClick={() => setActiveTab('access_control')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'access_control' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚙️ ইউজার পারমিশন ও একাউন্টস কন্ট্রোল (Super Admin Only)
                  </button>
                )}
              </div>

              {/* ট্যাব ১: ইউজারের নিজস্ব সেলস ও কমিশন লেজার */}
              {activeTab === 'my_ledger' && currentUser && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">আমার মোট বিক্রিত জমি</span>
                      <span className="text-2xl font-black text-emerald-400">{currentUser.salesKatha} কাঠা</span>
                      <span className="text-[10px] text-slate-500 block mt-1">সরাসরি ক্লায়েন্ট সেলস</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">আমার প্রাপ্ত মোট কমিশন</span>
                      <span className="text-2xl font-black text-amber-400">
                        {currentUser.totalEarnings.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-emerald-400 block mt-1">সম্পূর্ণ পরিশোধিত ও অনুমোদিত</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">অধীনস্থ টিমের মোট সেলস</span>
                      <span className="text-2xl font-black text-blue-400">{currentUser.teamSalesKatha} কাঠা</span>
                      <span className="text-[10px] text-slate-500 block mt-1">টিম পার্টনারদের সেলস</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[11px] text-slate-400 block font-semibold">টিম ওভাররাইড ইনকাম</span>
                      <span className="text-2xl font-black text-purple-400">
                        {currentUser.teamEarnings.toLocaleString('bn-BD')} ৳
                      </span>
                      <span className="text-[10px] text-purple-300 block mt-1">হায়ারার্কিক্যাল ওভাররাইড বোনাস</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      আইডি: <strong className="text-white font-mono">{currentUser.id}</strong> | পদবী: <strong className="text-emerald-400">{currentUser.role}</strong>
                    </div>
                    <span className="text-emerald-400">● আপনার সকল ট্রানজ্যাকশন ডাটাবেজ সুরক্ষিত</span>
                  </div>
                </div>
              )}

              {/* ট্যাব ২: সেন্ট্রাল একাউন্টিং ও হোয়াটসঅ্যাপ ট্রানজ্যাকশন মডিউল */}
              {activeTab === 'central_accounts' && currentUser?.hasAccountsAccess && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <span>💳</span> নতুন ট্রানজ্যাকশন এন্ট্রি ও সরাসরি হোয়াটসঅ্যাপ ভাউচার প্রেরণ
                  </h4>

                  <form onSubmit={handleCreateSale} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">পার্টনারের নাম</label>
                      <input 
                        type="text" 
                        value={selectedPartnerName}
                        onChange={(e) => setSelectedPartnerName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">পার্টনারের হোয়াটসঅ্যাপ মোবাইল</label>
                      <input 
                        type="text" 
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono font-semibold focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">বিক্রিত পরিমাণ (কাঠা)</label>
                      <input 
                        type="number" 
                        value={newSaleKatha}
                        onChange={(e) => setNewSaleKatha(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">প্রতি কাঠার মূল্য (টাকা)</label>
                      <input 
                        type="number" 
                        value={saleRate}
                        onChange={(e) => setSaleRate(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="md:col-span-4 flex items-center justify-between pt-2 border-t border-slate-800">
                      <div className="text-xs text-slate-300">
                        মোট সেলস: <strong>{(newSaleKatha * saleRate).toLocaleString('bn-BD')} ৳</strong> | প্রাক্কলিত কমিশন (৫%): <strong>{((newSaleKatha * saleRate) * 0.05).toLocaleString('bn-BD')} ৳</strong>
                      </div>
                      <button 
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow flex items-center gap-2"
                      >
                        <span>📲</span> ট্রানজ্যাকশন সেভ ও হোয়াটসঅ্যাপে ভাউচার পাঠান
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ট্যাব ৩: সুপার এডমিন পারমিশন ও এক্সেস কন্ট্রোল */}
              {activeTab === 'access_control' && currentUser?.isSuperAdmin && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-xs">
                  <h4 className="text-sm font-bold text-red-400 mb-3">
                    👑 সেন্ট্রাল একাউন্টস এক্সেস ও ইউজার রোল ব্যবস্থাপনা (Super Admin Control)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2 px-3">নাম</th>
                          <th className="py-2 px-3">ইমেইল</th>
                          <th className="py-2 px-3">বর্তমান রোল</th>
                          <th className="py-2 px-3">সেন্ট্রাল একাউন্টস এক্সেস</th>
                          <th className="py-2 px-3">একশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td className="py-3 px-3 font-bold text-white">MOHAMMAD ATIQUL ISLAM</td>
                          <td className="py-3 px-3 font-mono">mr.atiq.dhk.shimul@gmail.com</td>
                          <td className="py-3 px-3 text-red-400 font-bold">Super Admin</td>
                          <td className="py-3 px-3 text-emerald-400 font-bold">পূর্ণ এক্সেস (Unrestricted)</td>
                          <td className="py-3 px-3 text-slate-500">Master Account</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3">সেন্ট্রাল একাউন্ট্যান্ট ১</td>
                          <td className="py-3 px-3 font-mono">accounts@unitydream.com</td>
                          <td className="py-3 px-3">Accounts Manager</td>
                          <td className="py-3 px-3 text-emerald-400">অনুমোদিত (Verified)</td>
                          <td className="py-3 px-3">
                            <button className="text-red-400 hover:underline">Revoke</button>
                          </td>
                        </tr>
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

              {/* বিস্তারিত ও বুকিং শর্তাবলী বাটন */}
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
                  <span className="text-[10px] text-gray-400 block">অফিসিয়াল বুকিং ও হেল্পলাইন</span>
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

      {/* ===================== ৬. লগইন ও রেজিস্ট্রেশন মোডাল (My Account) ===================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            
            <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>👤</span> {authModal === 'login' ? 'LOGIN TO ERP' : 'CREATE NEW ACCOUNT'}
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
                  // ডিফল্ট লগইন হিসেবে সুপার এডমিন সক্রিয় হবে
                  setCurrentUser(defaultSuperAdmin);
                  setAuthModal(null);
                  alert('স্বাগতম MOHAMMAD ATIQUL ISLAM! Super Admin হিসেবে সফলভাবে লগইন হয়েছে।');
                }}>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      defaultValue="mr.atiq.dhk.shimul@gmail.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      defaultValue="password123"
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
                    {registerType === 'individual' ? (
                      <div>
                        <label className="block font-medium text-gray-700 mb-0.5">Full Name *</label>
                        <input type="text" required placeholder="Enter full name" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block font-medium text-gray-700 mb-0.5">Company Name *</label>
                          <input type="text" required placeholder="Company name" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                        </div>
                        <div>
                          <label className="block font-medium text-gray-700 mb-0.5">Contact Person *</label>
                          <input type="text" required placeholder="Contact person name" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">E-mail *</label>
                      <input type="email" required placeholder="Enter e-mail" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Mobile (WhatsApp) *</label>
                      <input type="tel" required placeholder="WhatsApp enabled mobile number" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Password *</label>
                      <input type="password" required placeholder="Password" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700 mb-0.5">Confirm Password *</label>
                      <input type="password" required placeholder="Retype password" className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-emerald-600" />
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