'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, 
  DollarSign, 
  Wallet, 
  CheckCircle, 
  PlusCircle, 
  RefreshCw, 
  Lock, 
  UserCheck, 
  LogOut 
} from 'lucide-react';

// Supabase সংযোগ
const SUPABASE_URL = 'https://ktcdukbugpthzfustasz.supabase.co';
const SUPABASE_ANON_KEY = 'Sb_publishable_nc955gkwat0Es76dZcxe5A_STqRwiH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function MicroCreditPage() {
  // অথেন্টিকেশন স্টেট
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // ড্যাশবোর্ড ডেটা স্টেট
  const [members, setMembers] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // মেম্বার ফর্ম স্টেট
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');
  const [address, setAddress] = useState('');

  // ঋণ ফর্ম স্টেট
  const [selectedMember, setSelectedMember] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState(10);

  // কিস্তি আদায় স্টেট
  const [selectedLoan, setSelectedLoan] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');

  // লগইন যাচাই
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === '123456') {
      setIsAuthenticated(true);
      setLoginError('');
      fetchData();
    } else {
      setLoginError('ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
  };

  // ডেটা ফেচিং
  const fetchData = async () => {
    setLoading(true);
    const { data: memberData } = await supabase.from('members').select('*').order('id', { ascending: false });
    if (memberData) setMembers(memberData);

    const { data: loanData } = await supabase.from('loans').select('*, members(name, phone)').order('id', { ascending: false });
    if (loanData) setLoans(loanData);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // নতুন মেম্বার যুক্ত করা
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return alert('সদস্যের নাম ও ফোন নম্বর দিন');

    const { error } = await supabase.from('members').insert([{ name, phone, nid, address }]);
    if (error) {
      alert('ভুল হয়েছে: ' + error.message);
    } else {
      alert('সদস্য সফলভাবে নিবন্ধিত হয়েছে!');
      setName(''); setPhone(''); setNid(''); setAddress('');
      fetchData();
    }
  };

  // ঋণ ইস্যু করা
  const handleDisburseLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !loanAmount) return alert('সদস্য ও ঋণের পরিমাণ নির্বাচন করুন');

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate.toString());
    const total = principal + (principal * rate / 100);

    const { error } = await supabase.from('loans').insert([
      {
        member_id: selectedMember,
        loan_amount: principal,
        interest_rate: rate,
        total_payable: total,
        paid_amount: 0,
        status: 'active'
      }
    ]);

    if (error) {
      alert('সমস্যা হয়েছে: ' + error.message);
    } else {
      alert('ঋণ সফলভাবে মঞ্জুর হয়েছে!');
      setLoanAmount('');
      setSelectedMember('');
      fetchData();
    }
  };

  // কিস্তি আদায়
  const handleCollectInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan || !installmentAmount) return alert('ঋণগ্রহীতা এবং কিস্তির পরিমাণ দিন');

    const pay = parseFloat(installmentAmount);
    const targetLoan = loans.find(l => l.id.toString() === selectedLoan.toString());

    if (!targetLoan) return;

    const newPaid = Number(targetLoan.paid_amount) + pay;
    const isCompleted = newPaid >= Number(targetLoan.total_payable);

    await supabase.from('collections').insert([{ loan_id: selectedLoan, amount_paid: pay }]);

    const { error } = await supabase.from('loans').update({
      paid_amount: newPaid,
      status: isCompleted ? 'completed' : 'active'
    }).eq('id', selectedLoan);

    if (error) {
      alert('কিস্তি জমা নেওয়া যায়নি');
    } else {
      alert('কিস্তি সফলভাবে জমা হয়েছে!');
      setInstallmentAmount('');
      setSelectedLoan('');
      fetchData();
    }
  };

  // লগইন স্ক্রিন
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 p-3 rounded-full mb-3">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">অ্যাডমিন লগইন</h1>
            <p className="text-sm text-slate-500 mt-1">মাইক্রোক্রেডিট সিস্টেমে প্রবেশ করতে লগইন করুন</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ইউজারনেম</label>
              <input
                type="text"
                placeholder="ইউজারনেম লিখুন"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-emerald-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">পাসওয়ার্ড</label>
              <input
                type="password"
                placeholder="পাসওয়ার্ড লিখুন"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-emerald-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium text-sm transition"
            >
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  // হিসাব সারসংক্ষেপ
  const totalDisbursed = loans.reduce((acc, curr) => acc + Number(curr.loan_amount || 0), 0);
  const totalCollected = loans.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const totalReceivable = loans.reduce((acc, curr) => acc + Number(curr.total_payable || 0), 0);
  const totalOutstanding = totalReceivable - totalCollected;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* হেডার */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
              <Wallet className="h-7 w-7 text-emerald-600" />
              মাইক্রোক্রেডিট ও কিস্তি ব্যবস্থাপনা ড্যাশবোর্ড
            </h1>
            <p className="text-sm text-slate-500 mt-1">ক্লাউড ডাটাবেসের সাথে সংযুক্ত রিয়েলটাইম হিসাব খাতা</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData} 
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> রিফ্রেশ
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <LogOut className="h-4 w-4" /> লগআউট
            </button>
          </div>
        </div>

        {/* সামারি কার্ড */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users className="h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">মোট সদস্য</p>
              <h3 className="text-2xl font-bold">{members.length} জন</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><DollarSign className="h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">মোট বিতরণকৃত ঋণ</p>
              <h3 className="text-2xl font-bold">৳ {totalDisbursed.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><CheckCircle className="h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">মোট কিস্তি আদায়</p>
              <h3 className="text-2xl font-bold text-emerald-600">৳ {totalCollected.toLocaleString()}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><Wallet className="h-6 w-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">মোট বকেয়া পাওনা</p>
              <h3 className="text-2xl font-bold text-amber-600">৳ {totalOutstanding.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* ফর্ম সেকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* সদস্য নিবন্ধন */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-600" /> নতুন সদস্য নিবন্ধন
            </h2>
            <form onSubmit={handleAddMember} className="space-y-3">
              <input 
                type="text" placeholder="সদস্যের নাম" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-emerald-600" required 
              />
              <input 
                type="text" placeholder="মোবাইল নম্বর" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-emerald-600" required 
              />
              <input 
                type="text" placeholder="জাতীয় পরিচয়পত্র (NID)" value={nid} onChange={e => setNid(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-emerald-600" 
              />
              <input 
                type="text" placeholder="ঠিকানা" value={address} onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-emerald-600" 
              />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium transition">
                সদস্য সেভ করুন
              </button>
            </form>
          </div>

          {/* ঋণ বিতরণ */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" /> ঋণ বিতরণ (Loan)
            </h2>
            <form onSubmit={handleDisburseLoan} className="space-y-3">
              <select 
                value={selectedMember} onChange={e => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-600 bg-white" required
              >
                <option value="">সদস্য সিলেক্ট করুন</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                ))}
              </select>
              <input 
                type="number" placeholder="ঋণের পরিমাণ (টাকা)" value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-600" required 
              />
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-500 whitespace-nowrap">সার্ভিস চার্জ %:</span>
                <input 
                  type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-600" required 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition">
                ঋণ নিশ্চিত করুন
              </button>
            </form>
          </div>

          {/* কিস্তি সংগ্রহ */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-600" /> কিস্তি সংগ্রহ
            </h2>
            <form onSubmit={handleCollectInstallment} className="space-y-3">
              <select 
                value={selectedLoan} onChange={e => setSelectedLoan(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-600 bg-white" required
              >
                <option value="">অ্যাকাউন্ট নির্বাচন করুন</option>
                {loans.filter(l => l.status === 'active').map(l => (
                  <option key={l.id} value={l.id}>
                    {l.members?.name} - বাকি: ৳{(l.total_payable - l.paid_amount).toLocaleString()}
                  </option>
                ))}
              </select>
              <input 
                type="number" placeholder="কিস্তির পরিমাণ (টাকা)" value={installmentAmount} onChange={e => setInstallmentAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl text-sm outline-none focus:border-purple-600" required 
              />
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-medium transition">
                কিস্তি জমা নিন
              </button>
            </form>
          </div>
        </div>

        {/* হিসাবের টেবিল */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">চলমান কিস্তি ও ঋণের খাতা</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100/75 text-slate-600">
                  <th className="p-4">গ্রাহক</th>
                  <th className="p-4">ফোন</th>
                  <th className="p-4">ঋণের পরিমাণ</th>
                  <th className="p-4">মোট পরিশোধযোগ্য</th>
                  <th className="p-4">আদায়কৃত</th>
                  <th className="p-4">বকেয়া</th>
                  <th className="p-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map(loan => {
                  const due = loan.total_payable - loan.paid_amount;
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-medium">{loan.members?.name || 'অজ্ঞাত'}</td>
                      <td className="p-4 text-slate-500">{loan.members?.phone}</td>
                      <td className="p-4">৳ {Number(loan.loan_amount).toLocaleString()}</td>
                      <td className="p-4">৳ {Number(loan.total_payable).toLocaleString()}</td>
                      <td className="p-4 text-emerald-600 font-medium">৳ {Number(loan.paid_amount).toLocaleString()}</td>
                      <td className="p-4 text-amber-600 font-medium">৳ {due > 0 ? due.toLocaleString() : '0'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          loan.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {loan.status === 'completed' ? 'পরিশোধিত' : 'চলমান'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}