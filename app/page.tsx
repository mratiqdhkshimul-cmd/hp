'use client';

import React, { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  type: string;
  price: number;
}

const TOOLS: Tool[] = [
  { id: 'gemini', name: 'Gemini Premium', type: 'AI Workspace / Model', price: 599 },
  { id: 'chatgpt', name: 'ChatGPT Plus', type: 'Official Access', price: 599 },
  { id: 'filmora', name: 'Filmora Pro', type: 'Lifetime / 1 Year', price: 599 },
];

export default function PremiumPortal() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    paymentRef: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTool) return;

    // WhatsApp Message Format toiri kora hocche
    const message = `*--- Notun Order Request ---*
*Service:* ${selectedTool.name}
*Price:* ${selectedTool.price} BDT

*Customer Details:*
• Name: ${formData.name}
• WhatsApp: ${formData.whatsapp}
• Gmail: ${formData.email}
• Payment Ref/TrxID: ${formData.paymentRef}

Payment Pathano Hoyeche: 01689333000 (bKash/Nagad)`;

    // WhatsApp link URL encode kora
    const encodedMessage = encodeURIComponent(message);
    const targetWhatsAppNumber = '8801689333000';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsAppNumber}&text=${encodedMessage}`;

    // Notun tab-e WhatsApp open kora (Mobile-e app ebong PC-te Web open hobe)
    window.open(whatsappUrl, '_blank');

    alert('Apnar tothyo gulo WhatsApp-e pathanor jonno window open hocche. Message-ti Send korun.');
    
    // Form reset kora
    setFormData({ name: '', whatsapp: '', email: '', paymentRef: '' });
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center text-blue-500">
          প্রিমিয়াম অ্যাপস পোর্টাল
        </h1>
        <p className="text-gray-400 text-center mb-10">
          আপনার পছন্দের সার্ভিসটি সিলেক্ট করে সাবস্ক্রিপশন সম্পন্ন করুন।
        </p>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{tool.name}</h2>
                <p className="text-sm text-gray-400 mb-4">{tool.type}</p>
                <div className="text-3xl font-extrabold text-green-400 mb-6">{tool.price} ৳</div>
              </div>
              <button
                onClick={() => {
                  setSelectedTool(tool);
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition duration-200"
              >
                এখনই কিনুন
              </button>
            </div>
          ))}
        </div>

        {/* Subscription Form Section */}
        {selectedTool && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8 max-w-lg mx-auto shadow-2xl transition-all">
            <h2 className="text-2xl font-bold mb-3 text-center text-white">
              {selectedTool.name} সাবস্ক্রিপশন ফর্ম
            </h2>
            
            {/* Payment Guidelines */}
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl mb-6 text-sm text-gray-300">
              <p className="font-semibold text-yellow-400 mb-2">📌 পেমেন্ট নির্দেশিকা:</p>
              <p>১. বিকাশ বা নগদ সেন্ড মানি করুন: <span className="text-white font-mono font-bold bg-gray-700 px-2 py-0.5 rounded">01689333000</span></p>
              <p className="mt-1">২. মোট ফি: <span className="text-green-400 font-bold">{selectedTool.price} টাকা</span></p>
              <p className="mt-1 text-xs text-gray-400">টাকা পাঠানোর পর ট্রানজেকশন আইডি বা রেফারেন্স নিচে লিখে সাবমিট করুন।</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">আপনার নাম</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="আপনার পুরো নাম"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">হোয়াটসঅ্যাপ নম্বর</label>
                <input
                  type="text"
                  name="whatsapp"
                  required
                  placeholder="01XXXXXXXXX"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">ভ্যালিড জিমেইল আইডি (Family Share-এর জন্য)</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300 font-medium">পেমেন্ট ট্রানজেকশন আইডি / রেফারেন্স</label>
                <input
                  type="text"
                  name="paymentRef"
                  required
                  placeholder="TrxID অথবা প্রেরক নম্বর"
                  value={formData.paymentRef}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedTool(null)}
                  className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                >
                  তথ্য সাবমিট করুন
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}