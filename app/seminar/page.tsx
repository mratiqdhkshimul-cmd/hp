'use client';

import React, { useState } from 'react';

export default function SeminarRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    profession: '',
    address: '',
    monthlyIncome: '',
  });

  const [incomeError, setIncomeError] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'monthlyIncome') {
      if (value === 'below_50k') {
        setIncomeError(true);
      } else {
        setIncomeError(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.monthlyIncome || formData.monthlyIncome === 'below_50k') {
      setIncomeError(true);
      return;
    }

    const incomeLabels: { [key: string]: string } = {
      '50k': '৫০,০০০ টাকা',
      '70k': '৭০,০০০ টাকা',
      '1lac': '১,০০,০০০ টাকা (১ লক্ষ)',
      '1.5lac': '১,৫০,০০০ টাকা (১.৫ লক্ষ)',
      '2lac': '২,০০,০০০ টাকা (২ লক্ষ)',
      'above_2lac': '২ লক্ষ টাকার উপরে',
    };

    const message = `*🏢 Unity Dream Properties - Free Seminar Registration 🏢*
---------------------------------------
👤 *নাম:* ${formData.fullName}
📱 *মোবাইল:* ${formData.phone}
📧 *ইমেইল:* ${formData.email}
💼 *পেশা:* ${formData.profession}
📍 *ঠিকানা:* ${formData.address}
💰 *মাসিক ইনকাম:* ${incomeLabels[formData.monthlyIncome] || formData.monthlyIncome}
---------------------------------------
_Sent via Web Seminar Portal_`;

    const encodedMessage = encodeURIComponent(message);
    const targetWhatsAppNumber = '8801681196700';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsAppNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setIsSuccessModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      profession: '',
      address: '',
      monthlyIncome: '',
    });
    setIncomeError(false);
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      
      {/* ব্যাকগ্রাউন্ড লাইটিং গ্লো */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none"></div>

      {/* মূল ফরম কার্ড */}
      <div className="relative z-10 max-w-xl w-full mx-auto bg-slate-900/80 border border-amber-500/25 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(245,158,11,0.15)] backdrop-blur-xl">
        
        {/* লোগো ও হেডার */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 mb-4 border border-amber-300">
            UDP
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 uppercase">
            Unity Dream Properties
          </h1>
          <div className="h-[2px] w-28 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-3" />
          <h2 className="text-amber-400 font-bold text-lg sm:text-xl tracking-wide">
            Free Seminar Registration Form
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
            ফ্রী সেমিনারে অংশ নিতে নিচের ফরমটি পূরণ করুন:
          </p>
        </div>

        {/* ইনপুট ফিল্ডসমূহ */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              ফুল নেম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="আপনার পুরো নাম লিখুন"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-200 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              মোবাইল নাম্বার <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-200 font-mono shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              ইমেইল এড্রেস <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-200 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                পেশা <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="profession"
                required
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="উদাঃ ব্যবসায়ী / চাকুরিজীবী"
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-200 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                এড্রেস <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                placeholder="বর্তমান ঠিকানা"
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-200 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              মাসিক আনুমানিক ইনকাম <span className="text-rose-500">*</span>
            </label>
            <select
              name="monthlyIncome"
              required
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition duration-200 cursor-pointer shadow-inner"
            >
              <option value="" disabled className="text-slate-500">ইনকাম রেঞ্জ নির্বাচন করুন</option>
              <option value="below_50k" className="bg-slate-900 text-rose-300">৫০,০০০ টাকার নিচে</option>
              <option value="50k" className="bg-slate-900">৫০,০০০</option>
              <option value="70k" className="bg-slate-900">৭০,০০০</option>
              <option value="1lac" className="bg-slate-900">১ লক্ষ</option>
              <option value="1.5lac" className="bg-slate-900">১.৫ লক্ষ</option>
              <option value="2lac" className="bg-slate-900">২ লক্ষ</option>
              <option value="above_2lac" className="bg-slate-900">২ লক্ষের উপরে</option>
            </select>
          </div>

          {/* ওয়ার্নিং মেসেজ */}
          {incomeError && (
            <div className="bg-rose-950/50 border border-rose-600/60 p-4 rounded-xl text-rose-200 text-xs sm:text-sm leading-relaxed backdrop-blur-md">
              ⚠️ দুঃখিত! এই বিশেষ ফ্রি সেমিনারটি ন্যূনতম ৫০,০০০ টাকা বা তার বেশি মাসিক ইনকাম সম্পন্ন ব্যক্তিদের জন্য নির্ধারিত। ৫০,০০০ টাকার নিচে হলে রেজিস্ট্রেশন সাবমিট হবে না।
            </div>
          )}

          {/* সাবমিট বাটন */}
          <button
            type="submit"
            disabled={incomeError || formData.monthlyIncome === 'below_50k'}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              incomeError || formData.monthlyIncome === 'below_50k'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 active:scale-[0.98]'
            }`}
          >
            রেজিস্ট্রেশন সাবমিট করুন
          </button>
        </form>
      </div>

      {/* সাকসেস পপআপ মোডাল */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-amber-500/30">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              Thank you for your registration
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              অতিসত্বর আমরা আপনার সাথে যোগাযোগ করে সেমিনারের তারিখ এবং সময় জানিয়ে দিব, আপনার মূল্যবান সময় দিয়ে রেজিস্ট্রেশন করার জন্য আন্তরিক ধন্যবাদ ও কৃতজ্ঞতা। ধন্যবাদ।
            </p>
            <button
              onClick={handleCloseModal}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      {/* ফুটার */}
      <footer className="relative z-10 text-center text-xs text-slate-500 mt-8 tracking-wider">
        design by@atiq 2026
      </footer>
    </div>
  );
}