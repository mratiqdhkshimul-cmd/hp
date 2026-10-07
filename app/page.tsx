"use client";

import React, { useState } from "react";

// সার্ভিস/টুলগুলোর তালিকা
interface Tool {
  id: string;
  name: string;
  type: string;
  price: number;
  durationDays: number;
  color: string;
  iconBg: string;
  link: string;
}

const TOOLS: Tool[] = [
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    type: "Official Access",
    price: 599,
    durationDays: 30,
    color: "from-blue-600 to-indigo-900",
    iconBg: "bg-blue-500",
    link: "https://gemini.google.com",
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    type: "Official Access",
    price: 329,
    durationDays: 30,
    color: "from-amber-600 to-orange-950",
    iconBg: "bg-amber-500",
    link: "https://chatgpt.com",
  },
  {
    id: "filmora-pro",
    name: "Filmora Pro",
    type: "Lifetime / 1 Year",
    price: 499,
    durationDays: 365,
    color: "from-teal-600 to-emerald-950",
    iconBg: "bg-teal-500",
    link: "#",
  },
  {
    id: "chatgpt-go",
    name: "ChatGPT Go",
    type: "Unofficial",
    price: 99,
    durationDays: 15,
    color: "from-purple-600 to-purple-950",
    iconBg: "bg-purple-500",
    link: "https://chatgpt.com",
  },
];

export default function ChatSDPPortal() {
  // ইউজার স্টেট (লগইন)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authForm, setAuthForm] = useState({ name: "", email: "" });

  // সাবস্ক্রিপশন ও পেমেন্ট স্টেট
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad">("bkash");
  const [trxId, setTrxId] = useState("");
  const [activeSubscriptions, setActiveSubscriptions] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState<Tool | null>(null);

  // লগইন হ্যান্ডলার
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authForm.name && authForm.email) {
      setUser({ name: authForm.name, email: authForm.email });
    }
  };

  // পেমেন্ট সাবমিট
  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId || !selectedTool) return;

    // মেয়াদ নির্ধারণ
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + selectedTool.durationDays);

    setActiveSubscriptions((prev) => ({
      ...prev,
      [selectedTool.id]: expiryDate.toLocaleDateString("bn-BD"),
    }));

    setShowSuccess(selectedTool);
    setSelectedTool(null);
    setTrxId("");
  };

  // ১. লগইন না থাকলে লগইন ফর্ম দেখাবে
  if (!user) {
    return (
      <main className="min-h-screen bg-[#070b14] text-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#0e1626] border border-blue-900/40 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-wider text-blue-400">CHATSDP</h1>
            <p className="text-sm text-gray-400 mt-1">সব এআই টুল এক প্ল্যাটফর্মে</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">আপনার নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ আতিক"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#162032] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">ইমেইল অ্যাড্রেস</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-[#162032] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg shadow-lg transition"
            >
              লগইন / অ্যাকাউন্ট খুলুন
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ২. ড্যাশবোর্ড ও টুলস লিস্ট
  return (
    <main className="min-h-screen bg-[#080d1a] text-white p-4 sm:p-8">
      {/* হেডার */}
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">CHATSDP</h1>
          <p className="text-xs text-gray-400">স্বাগতম, {user.name} ({user.email})</p>
        </div>
        <button
          onClick={() => setUser(null)}
          className="text-xs bg-red-950/60 border border-red-800/60 text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-900/80"
        >
          লগআউট
        </button>
      </header>

      {/* অ্যাপস গ্রিড */}
      <section className="max-w-5xl mx-auto mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">প্রিমিয়াম সফটওয়্যার সমূহ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const isSubscribed = !!activeSubscriptions[tool.id];
            return (
              <div
                key={tool.id}
                className={`rounded-2xl p-5 border border-gray-700/50 bg-gradient-to-b ${tool.color} flex flex-col justify-between shadow-xl`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${tool.iconBg}`}>
                      {tool.name[0]}
                    </div>
                    <span className="text-xs bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                      ৳ {tool.price} / {tool.durationDays} দিন
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{tool.name}</h3>
                  <p className="text-xs text-gray-300 mt-0.5">{tool.type}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  {isSubscribed ? (
                    <div>
                      <p className="text-xs text-emerald-300 mb-2">
                        মেয়াদ শেষ: {activeSubscriptions[tool.id]}
                      </p>
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-sm transition"
                      >
                        সফটওয়্যার ওপেন করুন
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTool(tool)}
                      className="w-full py-2.5 bg-black/50 hover:bg-black/70 border border-white/20 rounded-lg text-sm font-semibold tracking-wide transition"
                    >
                      আনলক করুন (UNLOCK)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ৩. পেমেন্ট মডাল (Send Money ও TrxID) */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121927] border border-gray-700 w-full max-w-md rounded-2xl p-6 relative">
            <button
              onClick={() => setSelectedTool(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-center text-white">{selectedTool.name} সাবস্ক্রিপশন</h3>
            <p className="text-center text-sm text-emerald-400 font-semibold mb-4">
              প্রদেয় ফি: ৳ {selectedTool.price} ({selectedTool.durationDays} দিন)
            </p>

            {/* মেথড সিলেকশন */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("bkash")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                  paymentMethod === "bkash" ? "bg-pink-700/40 border-pink-500 text-pink-200" : "bg-gray-800 border-gray-700"
                }`}
              >
                bKash Personal
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("nagad")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${
                  paymentMethod === "nagad" ? "bg-orange-700/40 border-orange-500 text-orange-200" : "bg-gray-800 border-gray-700"
                }`}
              >
                Nagad Personal
              </button>
            </div>

            {/* নির্দেশিকা */}
            <div className="bg-[#0b101a] p-3 rounded-lg border border-gray-800 mb-4 text-xs text-gray-300 space-y-1">
              <p className="font-semibold text-gray-200">পেমেন্ট করার নিয়ম (Send Money):</p>
              <p className="text-yellow-400 font-mono text-sm py-1">নম্বর: 01689333000</p>
              <p className="text-gray-400">• এই নম্বরে নির্দিষ্ট টাকা Send Money করে নিচের বক্সে Transaction ID (TrxID) দিন।</p>
            </div>

            <form onSubmit={handleVerifyPayment} className="space-y-4">
              <input
                type="text"
                required
                placeholder="TRANSACTION ID (TRXID) লিখুন"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#080d1a] border border-gray-700 rounded-lg text-sm text-white uppercase focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm transition"
              >
                ভেরিফাই করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ৪. সফল সাবস্ক্রিপশন স্ক্রিন */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#121927] border border-emerald-500/40 w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">অভিনন্দন!</h3>
            <p className="text-xs text-gray-300 mt-1 mb-4">
              আপনার {showSuccess.name} সাবস্ক্রিপশন সফলভাবে অ্যাক্টিভ করা হয়েছে।
            </p>
            <div className="bg-[#0b101a] p-3 rounded-lg text-xs text-left mb-4 space-y-1">
              <p><span className="text-gray-400">প্যাকেজ:</span> {showSuccess.name}</p>
              <p><span className="text-gray-400">স্ট্যাটাস:</span> <span className="text-emerald-400">Active ●</span></p>
            </div>
            <button
              onClick={() => setShowSuccess(null)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      )}
    </main>
  );
}