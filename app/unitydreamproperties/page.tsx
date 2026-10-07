'use client';

import React, { useState } from 'react';

// প্রজেক্ট তালিকা (ঢাকা ওয়েস্টার্ন ভ্যালি প্রথমে সেট করা)
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

export default function UnityDreamPortal() {
  const [showLedger, setShowLedger] = useState(false);
  const [salesAmount, setSalesAmount] = useState<number>(5000000);
  const [selectedTier, setSelectedTier] = useState<string>('direct');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // হায়ারার্কিক্যাল ইনকাম ও কমিশন হিসাব
  const calculateCommission = (amount: number, tier: string) => {
    switch (tier) {
      case 'direct':
        return amount * 0.05;
      case 'team_leader':
        return amount * 0.02;
      case 'manager':
        return amount * 0.01;
      default:
        return 0;
    }
  };

  const commission = calculateCommission(salesAmount, selectedTier);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    alert('সফলভাবে সাইন আউট করা হয়েছে।');
  };

  const handleSignIn = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between relative">
      
      {/* ===================== ১. অরিজিনাল নেভিগেশন বার ===================== */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* একক ব্র্যান্ড লোগো ও টাইটেল */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Unity Dream Properties Logo" 
                className="h-12 w-auto object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                  UNITY DREAM PROPERTIES
                </h1>
                <p className="text-xs font-semibold text-emerald-700">
                  পুষ্পধারা প্রপার্টিজ লিমিটেড পার্টনার ও ERP সিস্টেম
                </p>
              </div>
            </div>

            {/* আগের মূল নেভিগেশন লিঙ্কসমূহ */}
            <nav className="hidden xl:flex items-center space-x-5 text-sm font-semibold text-slate-700">
              <a href="#home" className="hover:text-emerald-600 transition-colors">Home</a>
              <a href="#for-sale" className="hover:text-emerald-600 transition-colors">For Sale</a>
              <a href="#for-rent" className="hover:text-emerald-600 transition-colors">For Rent</a>
              <a href="#roommates" className="hover:text-emerald-600 transition-colors">Roommates</a>
              <a href="#developers" className="hover:text-emerald-600 transition-colors">Developers</a>
              <a href="#jobs" className="hover:text-emerald-600 transition-colors">Jobs</a>
              <a href="#blog" className="hover:text-emerald-600 transition-colors">Blog</a>
              <a href="#erp" className="hover:text-emerald-600 transition-colors">ERP Module</a>
            </nav>

            {/* ইউজার স্টেটাস, সাইন আউট ও বাটনস */}
            <div className="flex items-center gap-3">
              <a 
                href="tel:+8801681196700" 
                className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200"
              >
                <span>📞</span> +880 1681-196700
              </a>

              {isLoggedIn ? (
                <div className="flex items-center gap-3 border-l pl-3 border-gray-200">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900">আতিকুর রহমান</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Developer & Super Admin</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1.5 rounded transition-colors"
                    title="Sign Out from Super Admin"
                  >
                    সাইন আউট
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                >
                  লগইন
                </button>
              )}

              <button className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-md shadow transition-colors">
                POST AD FREE
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ===================== ২. ম্যানেজমেন্ট ও ডিরেক্টর সেকশন ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 w-full">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
              MD
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Managing Director</div>
              <h3 className="text-base font-bold text-slate-900">Engr. Md Mustafizur Rahman Rashid</h3>
            </div>
          </div>
          <div className="text-xs text-slate-600">
            <span className="bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 font-medium inline-block">
              Pushpodhara Properties Ltd. & Sister Concerns
            </span>
          </div>
        </div>
      </section>

      {/* ===================== ৩. সেন্ট্রাল ক্লাউড ERP ব্যানার ও লেজার ===================== */}
      <section id="erp" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
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
              <span className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-lg">
                Master ERP Live
              </span>
            </div>
          </div>

          {/* হায়ারার্কিক্যাল কমিশন ও একাউন্টিং মডিউল */}
          {showLedger && (
            <div className="mt-6 pt-6 border-t border-slate-700/80 bg-slate-950/60 p-5 rounded-xl">
              <h3 className="text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
                📊 পার্টনার হায়ারার্কিক্যাল কমিশন ও একাউন্টিং লেজার সিমুলেটর
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">মোট বিক্রয় মূল্য (টাকা)</label>
                  <input 
                    type="number" 
                    value={salesAmount}
                    onChange={(e) => setSalesAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">পার্টনার স্তর / পদবী</label>
                  <select 
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="direct">সরাসরি পার্টনার (Direct Sales - 5%)</option>
                    <option value="team_leader">টিম লিডার (Team Override - 2%)</option>
                    <option value="manager">ম্যানেজারিয়াল স্তর (Management Bonus - 1%)</option>
                  </select>
                </div>
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-3 flex flex-col justify-center">
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase">মোট প্রাপ্য ইনকাম / কমিশন</span>
                  <span className="text-xl font-extrabold text-white">
                    {commission.toLocaleString('bn-BD')} ৳
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-2 border-t border-slate-800">
                <span>• রিয়েল-টাইম ক্লাউড সিংকিং সক্রিয়</span>
                <span>• পুষ্পধারা সেন্ট্রাল ডাটাবেজ দ্বারা সংরক্ষিত</span>
                <span>• অটোমেটেড ভ্যাট ও ট্যাক্স অ্যাডজাস্টমেন্ট সাপোর্ট</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================== ৪. প্রজেক্টস শোকেস সেকশন ===================== */}
      <main id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
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

      {/* ===================== ৫. ফুটার ও অফিস পরিচিতি ===================== */}
      <footer id="contact" className="w-full bg-slate-900 border-t border-slate-800 py-10 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-sm">
            <div>
              <h4 className="text-white font-bold text-base tracking-wide mb-2">UNITY DREAM PROPERTIES LTD.[cite: 1]</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                পুষ্পধারা প্রপার্টিজ লিমিটেডের অফিশিয়াল স্ট্র্যাটেজিক মার্কেটিং ও সেলস পার্টনার। সেন্ট্রাল ক্লাউড ডাটাবেজ সমন্বিত রিয়েল এস্টেট সলিউশন।
              </p>
              <div className="mt-3">
                <span className="text-xs text-slate-400 block">হটলাইন / মোবাইল:</span>
                <a href="tel:+8801681196700" className="text-amber-400 font-bold text-sm hover:underline">
                  +880 1681-196700
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-2">লিডারশিপ</h5>
              <p className="text-xs text-slate-200 font-bold">Engr. Md Mustafizur Rahman Rashid</p>
              <p className="text-xs text-emerald-400 font-medium">Managing Director</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Pushpodhara Properties Ltd.
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-2 flex items-center gap-1.5">
                <span>📍</span> কর্পোরেট অফিস
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                ৫/৬ আউটার সার্কুলার রোড, হোসাফ টাওয়ার (৪র্থ তলা),<br />
                মালিবাগ মোড়, মালিবাগ, ঢাকা-১২১৭, বাংলাদেশ।
              </p>
              <p className="text-[11px] text-emerald-400 mt-1.5 font-mono">
                5/6 Outer Circular Road, Hosaf Tower (4th floor), Malibag moor, Malibag, Dhaka-1217
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
              © 2026 Unity Dream Properties Ltd.[cite: 1] | Official Strategic Marketing & Sales Partner of Pushpodhara Properties Ltd.
            </p>
            <p className="text-slate-500">
              Hosaf Tower, Malibag, Dhaka
            </p>
          </div>

        </div>
      </footer>

      {/* ===================== ৬. ফ্লোটিং কল ও মেসেঞ্জার বাটন ===================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <a
          href="tel:+8801681196700"
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          title="সরাসরি কল করুন"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </a>

        <a
          href="https://m.me/unitydreamproperties"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0084FF] hover:bg-[#0072db] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          title="Chat with Unity Dream Properties on Messenger"
        >
          <svg 
            className="w-7 h-7 fill-current" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.518 3.734 7.218v3.524l3.38-1.855c.924.256 1.895.394 2.886.394 5.523 0 10-4.145 10-9.281C22 6.145 17.523 2 12 2zm1.066 12.443l-2.613-2.787-5.1 2.787 5.61-5.955 2.68 2.787 5.033-2.787-5.61 5.955z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}