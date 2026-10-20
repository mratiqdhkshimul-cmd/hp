"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/supabaseClient"; // নিশ্চিত করুন supabaseClient এর পাথ সঠিক আছে

interface LoanRecord {
  id?: number | string;
  name: string;
  amount: number;
  installments: number;
  paid: number;
  status?: string;
  [key: string]: any;
}

export default function MicroCreditPage() {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Microcredit Data State
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [installments, setInstallments] = useState<number | string>("");
  const [paid, setPaid] = useState<number | string>("");

  // Check login session on load
  useEffect(() => {
    const session = localStorage.getItem("microcredit_auth");
    if (session === "true") {
      setIsAuthenticated(true);
      fetchLoans();
    }
  }, []);

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      setIsAuthenticated(true);
      localStorage.setItem("microcredit_auth", "true");
      setLoginError("");
      fetchLoans();
    } else {
      setLoginError("ভুল ইউজারনেম অথবা পাসওয়ার্ড!");
    }
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("microcredit_auth");
  };

  // Fetch loans from Supabase
  const fetchLoans = async () => {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase.from("microcredit").select("*");
      if (error) throw error;
      if (data) setLoans(data);
    } catch (err: any) {
      console.error("ডেটা লোড করতে সমস্যা:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new loan record
  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newRecord = {
      name,
      amount: Number(amount),
      installments: Number(installments) || 0,
      paid: Number(paid) || 0,
    };

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("microcredit")
          .insert([newRecord])
          .select();
        if (error) throw error;
        if (data) setLoans([...loans, ...data]);
      } else {
        setLoans([...loans, { ...newRecord, id: Date.now() }]);
      }

      setName("");
      setAmount("");
      setInstallments("");
      setPaid("");
    } catch (err: any) {
      console.error("যোগ করতে ব্যর্থ:", err.message);
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Microcredit Login
          </h2>

          {loginError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ইউজারনেম লিখুন"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
            >
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD / TABLE SCREEN ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              মাইক্রোক্রেডিট ম্যানেজমেন্ট সিস্টেম
            </h1>
            <p className="text-sm text-gray-500">
              ঋণ ও কিস্তি আদায় তালিকা
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
          >
            লগআউট
          </button>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleAddLoan}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <input
            type="text"
            placeholder="গ্রাহকের নাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded text-sm text-gray-800 outline-none"
            required
          />
          <input
            type="number"
            placeholder="ঋণের পরিমাণ"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="px-3 py-2 border rounded text-sm text-gray-800 outline-none"
            required
          />
          <input
            type="number"
            placeholder="মোট কিস্তি"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            className="px-3 py-2 border rounded text-sm text-gray-800 outline-none"
          />
          <input
            type="number"
            placeholder="পরিশোধের পরিমাণ"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="px-3 py-2 border rounded text-sm text-gray-800 outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded text-sm transition"
          >
            যুক্ত করুন
          </button>
        </form>

        {/* Loan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="p-3 border">ক্রমিক</th>
                <th className="p-3 border">গ্রাহকের নাম</th>
                <th className="p-3 border">ঋণের পরিমাণ</th>
                <th className="p-3 border">কিস্তি সংখ্যা</th>
                <th className="p-3 border">পরিশোধিত</th>
                <th className="p-3 border">বাকি</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    কোনো তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                loans.map((loan, index) => {
                  const remaining = (loan.amount || 0) - (loan.paid || 0);
                  return (
                    <tr key={loan.id || index} className="hover:bg-gray-50">
                      <td className="p-3 border text-gray-600">{index + 1}</td>
                      <td className="p-3 border font-medium text-gray-800">
                        {loan.name}
                      </td>
                      <td className="p-3 border text-gray-700">
                        ৳{Number(loan.amount).toLocaleString()}
                      </td>
                      <td className="p-3 border text-gray-700">
                        {loan.installments || 0}
                      </td>
                      <td className="p-3 border text-green-600 font-medium">
                        ৳{Number(loan.paid || 0).toLocaleString()}
                      </td>
                      <td className="p-3 border text-red-500 font-medium">
                        ৳{remaining.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}