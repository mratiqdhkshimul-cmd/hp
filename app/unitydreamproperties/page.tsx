'use client';

import React, { useState, useMemo } from 'react';

// ডামি প্রোপার্টি ডাটা (bdhousing মার্কেটপ্লেস স্টাইল)
const initialProperties = [
  {
    id: 1,
    title: 'ঢাকা ওয়েস্টার্ন ভ্যালি - প্রাইম লেক ভিউ প্লট',
    type: 'plot',
    location: 'কেরানীগঞ্জ (বসিলা ব্রিজ সংলগ্ন)',
    size: '৫ কাঠা',
    pricePerUnit: '১২,৫০,০০০ ৳ / কাঠা',
    totalPrice: 6250000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
    tags: ['রেডি প্লট', 'বিদ্যুৎ সংযোগ', '৬০ ফুট রোড', '১০০% নিষ্কণ্টক'],
  },
  {
    id: 2,
    title: 'পুষ্প ইকো সিটি - সাউথ ফেসিং কমার্শিয়াল কর্নার',
    type: 'plot',
    location: 'পূর্বাচল (৩০০ ফিট এক্সপ্রেসওয়ে)',
    size: '১০ কাঠা',
    pricePerUnit: '১৮,০০,০০০ ৳ / কাঠা',
    totalPrice: 18000000,
    status: 'Limited',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
    tags: ['কর্নার প্লট', 'লেকভিউ', 'বাউন্ডারি রেডি', 'সহজ কিস্তি'],
  },
  {
    id: 3,
    title: 'গ্রিন হরাইজন লাক্সারি কনডোমিনিয়াম',
    type: 'flat',
    location: 'বসুন্ধরা আ/এ (Block-I)',
    size: '২১৫০ বর্গফুট (৪ বেড, ৪ বাথ)',
    pricePerUnit: '৮,৫০০ ৳ / বর্গফুট',
    totalPrice: 18275000,
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    tags: ['সুইমিং পুল', 'রুফটপ গার্ডেন', 'স্মার্ট ডোর লক'],
  },
  {
    id: 4,
    title: 'দ্য বে আইকন - রিটেইল শপ ও কর্পোরেট স্পেস',
    type: 'commercial',
    location: 'উত্তরা (সেক্টর ১১)',
    size: '১২০০ বর্গফুট',
    pricePerUnit: '১৫,০০০ ৳ / বর্গফুট',
    totalPrice: 18000000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
    tags: ['সেন্ট্রাল এসি', 'ডাবল লিফট', 'গ্রাউন্ড ফ্লোর'],
  },
  {
    id: 5,
    title: 'ড্রিম হেভেন - প্রাইম আবাসিক প্লট',
    type: 'plot',
    location: 'সাভার (স্মার্ট সিটির কাছে)',
    size: '৩ কাঠা',
    pricePerUnit: '৭,৫০,০০০ ৳ / কাঠা',
    totalPrice: 2250000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=60',
    tags: ['নিষ্কণ্টক জমি', 'সহজ কিস্তি', 'রেজিস্ট্রি সুযোগ'],
  },
];

export default function UnityDreamPropertiesModule() {
  // মোড নির্বাচন: 'portal' (মার্কেটপ্লেস) অথবা 'erp' (হিসাব-নিকাশ)
  const [viewMode, setViewMode] = useState<'portal' | 'erp'>('portal');
  const [erpRole, setErpRole] = useState<'client' | 'agent' | 'admin'>('client');

  // ফিল্টারিং স্টেট
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [maxBudget, setMaxBudget] = useState(25000000);
  const [searchQuery, setSearchQuery] = useState('');

  // মডাল ও ইনকোয়ারি স্টেট
  const [activePropertyModal, setActivePropertyModal] = useState<any>(null);
  const [isReceiptModal, setIsReceiptModal] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // লাইভ ডাটা ফিল্টারিং (খুব দ্রুত রেসপন্স)
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((item) => {
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchLoc = selectedLocation === 'all' || item.location.includes(selectedLocation);
      const matchBudget = item.totalPrice <= maxBudget;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchLoc && matchBudget && matchSearch;
    });
  }, [selectedType, selectedLocation, maxBudget, searchQuery]);

  // সরাসরি হোয়াটসঅ্যাপে ইনকোয়ারি পাঠানোর ফাংশন
  const handleSendWhatsAppInquiry = (property: any) => {
    if (!inquiryPhone) return;
    const msg = `*🏢 Unity Dream Properties - বুকিং ইনকোয়ারি 🏢*
---------------------------------------
👤 নাম: ${inquiryName || 'সম্মানিত ক্লায়েন্ট'}
📱 মোবাইল: ${inquiryPhone}
🏡 প্রজেক্ট: ${property.title}
📍 অবস্থান: ${property.location}
💰 প্যাকেজ মূল্য: ৳ ${property.totalPrice.toLocaleString('bn-BD')}
---------------------------------------
আমি এই প্রজেক্টের সাইট ভিজিট ও বুকিংয়ের শর্তাবলী জানতে আগ্রহী।`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=8801681196700&text=${encoded}`, '_blank');
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setActivePropertyModal(null);
      setInquiryName('');
      setInquiryPhone('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* ১. টপ হেডার বার */}
      <header className="border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('portal')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300">
              UDP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-wider">
                  UNITY DREAM PROPERTIES
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  NextGen
                </span>
              </div>
              <p className="text-[11px] text-amber-400/80 font-medium tracking-wider">
                স্মার্ট রিয়েল এস্টেট প্ল্যাটফর্ম ও অ্যাকাউন্টস ইআরপি
              </p>
            </div>
          </div>

          {/* পোর্টাল এবং ইআরপি স্যুইচ বাটন */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 w-full sm:w-auto justify-center">
            <button
              onClick={() => setViewMode('portal')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                viewMode === 'portal'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 প্রোপার্টি মার্কেটপ্লেস
            </button>
            <button
              onClick={() => setViewMode('erp')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                viewMode === 'erp'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💼 কাস্টমার ও এজেন্ট ERP
            </button>
          </div>
        </div>
      </header>

      {/* ২. মার্কেটপ্লেস সেকশন (bdhousing স্টাইল) */}
      {viewMode === 'portal' && (
        <main className="flex-1">
          {/* সার্চ ফিল্টার ব্যানার */}
          <div className="relative py-14 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-950 via-[#070e1e] to-[#060a12] border-b border-slate-800/80">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-3">
                ✨ নিরাপদ বিনিয়োগ ও আধুনিক আবাসন
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                আপনার কাঙ্ক্ষিত প্লট বা ফ্ল্যাট <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                  সহজেই খুঁজে নিন
                </span>
              </h2>

              {/* ফিল্টার বক্স */}
              <div className="mt-8 bg-slate-900/90 border border-amber-500/30 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">প্রজেক্ট নাম</label>
                  <input
                    type="text"
                    placeholder="নাম বা কিওয়ার্ড..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">ক্যাটাগরি</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    <option value="plot">প্লট / জমি (Land/Plots)</option>
                    <option value="flat">আবাসিক ফ্ল্যাট (Apartments)</option>
                    <option value="commercial">কমার্শিয়াল স্পেস (Commercial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">লোকেশন</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 outline-none cursor-pointer"
                  >
                    <option value="all">সকল লোকেশন</option>
                    <option value="কেরানীগঞ্জ">কেরানীগঞ্জ / বসিলা</option>
                    <option value="পূর্বাচল">পূর্বাচল এক্সপ্রেসওয়ে</option>
                    <option value="বসুন্ধরা">বসুন্ধরা আ/এ</option>
                    <option value="উত্তরা">উত্তরা</option>
                    <option value="সাভার">সাভার</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-400">সর্বোচ্চ বাজেট</label>
                    <span className="text-[11px] font-bold text-amber-400">৳ {(maxBudget / 100000).toFixed(1)} লাখ</span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="25000000"
                    step="500000"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* প্রোপার্টি কার্ডস */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
                উপলব্ধ প্রজেক্টসমূহ ({filteredProperties.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {item.type === 'plot' ? '🏡 প্লট / জমি' : item.type === 'flat' ? '🏢 অ্যাপার্টমেন্ট' : '🏬 কমার্শিয়াল'}
                      </div>
                      <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {item.status}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">📍 {item.location}</p>

                      <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-slate-500 block">সাইজ</span>
                          <span className="font-semibold text-slate-300">{item.size}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block">দর</span>
                          <span className="font-semibold text-amber-300">{item.pricePerUnit}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                      <div>
                        <p className="text-[10px] text-slate-500">মোট মূল্য</p>
                        <p className="text-base font-black text-amber-400">
                          ৳ {(item.totalPrice / 100000).toLocaleString('bn-BD')} লক্ষ
                        </p>
                      </div>
                      <button
                        onClick={() => setActivePropertyModal(item)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition"
                      >
                        বিস্তারিত ও বুকিং
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ৩. সমন্বিত একাউন্টস ও ইআরপি সেকশন */}
      {viewMode === 'erp' && (
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                রিয়েল এস্টেট একাউন্টিং ও লেজার
              </h2>
              <p className="text-xs text-slate-400">ব্যক্তিগত স্টেটমেন্ট ও বুকিং তদারকি</p>
            </div>
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setErpRole('client')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  erpRole === 'client' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                কাস্টমার লেজার
              </button>
              <button
                onClick={() => setErpRole('agent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  erpRole === 'agent' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                প্রতিনিধি / কমিশন
              </button>
              <button
                onClick={() => setErpRole('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  erpRole === 'admin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                অ্যাডমিন এন্ট্রি
              </button>
            </div>
          </div>

          {/* কাস্টমার লেজার ভিউ */}
          {erpRole === 'client' && (
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-mono">
                    UDP-CL-8821
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">জনাব মোহাম্মদ রফিকুল ইসলাম</h3>
                  <p className="text-xs text-slate-400">মোবাইল: 01711-XXXXXX | প্লট: ঢাকা ওয়েস্টার্ন ভ্যালি (Plot-12, Block-B)</p>
                </div>
                <button
                  onClick={() => setIsReceiptModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  📄 মানি রিসিট ভাউচার
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400">মোট চুক্তিমূল্য</p>
                  <h4 className="text-xl font-black text-white mt-1">৳ ৬২,৫০,০০০</h4>
                  <p className="text-xs text-emerald-400 mt-1">জমা: ৳ ৪৪,৫০,০০০</p>
                </div>
                <div className="bg-slate-900/60 border border-rose-900/30 p-4 rounded-xl bg-rose-950/10">
                  <p className="text-xs text-rose-300">অবশিষ্ট বকেয়া</p>
                  <h4 className="text-xl font-black text-rose-400 mt-1">৳ ১৮,০০,০০০</h4>
                  <p className="text-xs text-slate-400 mt-1">পরবর্তী কিস্তি: ১৫ নভেম্বর, ২০২৬</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400">দলিল ও বরাদ্দপত্র</p>
                  <h4 className="text-sm font-bold text-emerald-400 mt-1">✓ বরাদ্দপত্র ইস্যু সম্পন্ন</h4>
                  <p className="text-xs text-amber-400/80 mt-1">নামজারি: প্রক্রিয়াধীন</p>
                </div>
              </div>

              {/* লেজার টেবিল */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3">পেমেন্ট হিস্ট্রি</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">বিবরণ</th>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3">মেথড</th>
                        <th className="p-3">পরিমাণ</th>
                        <th className="p-3">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="p-3 font-semibold text-white">বুকিং মানি</td>
                        <td className="p-3">১০ জানুয়ারি, ২০২৬</td>
                        <td className="p-3">ব্যাংক চেক</td>
                        <td className="p-3 text-emerald-400 font-bold">৳ ৫,০০,০০০</td>
                        <td className="p-3"><span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">Paid</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">ডাউন পেমেন্ট</td>
                        <td className="p-3">২৫ ফেব্রুয়ারি, ২০২৬</td>
                        <td className="p-3">অনলাইন ব্যাংক ট্রান্সফার</td>
                        <td className="p-3 text-emerald-400 font-bold">৳ ৭,৫০,০০০</td>
                        <td className="p-3"><span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">Paid</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-white">মাসিক কিস্তি (১-৩২)</td>
                        <td className="p-3">মার্চ ২০২৬ - অক্টোবর ২০২৬</td>
                        <td className="p-3">অটো-ডেবিট</td>
                        <td className="p-3 text-emerald-400 font-bold">৳ ৩২,০০,০০০</td>
                        <td className="p-3"><span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">Paid</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* এজেন্ট ভিউ */}
          {erpRole === 'agent' && (
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-mono">
                    UDP-AG-104
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">মোহাম্মদ শওকত আলী</h3>
                  <p className="text-xs text-slate-400">পদবী: সিনিয়র সেলস পার্টনার | কমিশন হার: ৩.৫%</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl text-right">
                  <p className="text-xs text-amber-400">উত্তোলনযোগ্য ব্যালেন্স</p>
                  <h4 className="text-xl font-black text-amber-300">৳ ২,৪৬,০০০</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400">মোট বিক্রয়</p>
                  <h4 className="text-xl font-black text-white mt-1">৮ টি প্লট (৩২ কাঠা)</h4>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400">মোট সেলস ভলিউম</p>
                  <h4 className="text-xl font-black text-emerald-400 mt-1">৳ ২,৫৬,০০,০০০</h4>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                  <p className="text-xs text-slate-400">মোট অর্জিত কমিশন</p>
                  <h4 className="text-xl font-black text-amber-400 mt-1">৳ ৮,৯৬,০০০</h4>
                </div>
              </div>
            </div>
          )}

          {/* অ্যাডমিন এন্ট্রি ফর্ম */}
          {erpRole === 'admin' && (
            <div className="max-w-lg mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">নতুন বুকিং এন্ট্রি</h3>
              <p className="text-xs text-slate-400 mb-4">তথ্য প্রদান করে এন্ট্রি নিশ্চিত করুন।</p>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">ক্লায়েন্টের নাম</label>
                  <input type="text" placeholder="পুরো নাম" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">মোবাইল</label>
                    <input type="tel" placeholder="01XXXXXXXXX" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">প্রজেক্ট</label>
                    <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-white outline-none">
                      <option>ঢাকা ওয়েস্টার্ন ভ্যালি</option>
                      <option>পুষ্প ইকো সিটি</option>
                      <option>গ্রিন হরাইজন</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">কাঠা / সাইজ</label>
                    <input type="text" placeholder="৫ কাঠা" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">জমা পেমেন্ট (৳)</label>
                    <input type="number" placeholder="500000" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-amber-500" />
                  </div>
                </div>
                <button
                  onClick={() => alert('সফলভাবে এন্ট্রি সম্পন্ন হয়েছে!')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg transition text-xs mt-3"
                >
                  ডাটাবেজে যুক্ত করুন
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ৪. পপআপ: বুকিং ও ইনকোয়ারি */}
      {activePropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl text-left space-y-3">
            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
              <div>
                <h4 className="font-bold text-white text-base">{activePropertyModal.title}</h4>
                <p className="text-xs text-amber-400">{activePropertyModal.location}</p>
              </div>
              <button onClick={() => setActivePropertyModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg space-y-1 text-xs text-slate-300 border border-slate-800">
              <p><strong className="text-white">সাইজ:</strong> {activePropertyModal.size}</p>
              <p><strong className="text-white">মোট মূল্য:</strong> ৳ {(activePropertyModal.totalPrice / 100000).toLocaleString('bn-BD')} লক্ষ</p>
            </div>

            {inquirySuccess ? (
              <div className="bg-emerald-950 border border-emerald-500/50 p-2.5 rounded-lg text-center text-emerald-300 text-xs">
                ✓ আপনার রিকোয়েস্ট পাঠানো হয়েছে!
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  placeholder="মোবাইল নম্বর"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                />
                <button
                  onClick={() => handleSendWhatsAppInquiry(activePropertyModal)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition text-xs flex items-center justify-center gap-1.5"
                >
                  💬 হোয়াটসঅ্যাপে বুকিং মেসেজ পাঠান
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ৫. পপআপ: মানি রিসিট ভিউয়ার */}
      {isReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-left space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm">মানি রিসিট কপি</h4>
              <button onClick={() => setIsReceiptModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <p><strong className="text-white">আইডি:</strong> UDP-CL-8821</p>
              <p><strong className="text-white">নাম:</strong> জনাব মোহাম্মদ রফিকুল ইসলাম</p>
              <p><strong className="text-white">প্রজেক্ট:</strong> ঢাকা ওয়েস্টার্ন ভ্যালি</p>
              <p><strong className="text-white">মোট জমা:</strong> ৳ ৪৪,৫০,০০০</p>
              <p><strong className="text-white">বকেয়া:</strong> ৳ ১৮,০০,০০০</p>
            </div>

            <button
              onClick={() => setIsReceiptModal(false)}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-lg transition text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* ফুটার */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        © 2026 Unity Dream Properties Ltd. | All-in-One Smart Platform
      </footer>
    </div>
  );
}