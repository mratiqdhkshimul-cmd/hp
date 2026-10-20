"use client";

import React, { useState } from "react";

export default function MicrocreditFullApp() {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation State
  const [currentTab, setCurrentTab] = useState("dashboard");

  // App Data States
  const [members, setMembers] = useState([
    { id: "M-101", name: "রহিম মিয়া", phone: "01711000000", nid: "1988273645", shareCapital: 5000, savings: 12000, status: "Active" },
    { id: "M-102", name: "করিম শেখ", phone: "01811000000", nid: "1990283746", shareCapital: 5000, savings: 8500, status: "Active" }
  ]);

  const [loans, setLoans] = useState([
    { id: "L-201", memberId: "M-101", memberName: "রহিম মিয়া", amount: 50000, interestRate: 10, totalPayable: 55000, paid: 22000, remaining: 33000, status: "Running" },
    { id: "L-202", memberId: "M-102", memberName: "করিম শেখ", amount: 30000, interestRate: 10, totalPayable: 33000, paid: 33000, remaining: 0, status: "Completed" }
  ]);

  const [collections, setCollections] = useState([
    { id: "C-01", date: "2026-10-20", memberName: "রহিম মিয়া", type: "কিস্তি (Installment)", amount: 2000 },
    { id: "C-02", date: "2026-10-20", memberName: "করিম শেখ", type: "সঞ্চয় (Savings)", amount: 500 }
  ]);

  // Form States
  const [newMember, setNewMember] = useState({ name: "", phone: "", nid: "", shareCapital: 0, savings: 0 });
  const [newLoan, setNewLoan] = useState({ memberId: "", amount: "", interestRate: 10 });
  const [newCollection, setNewCollection] = useState({ memberId: "", type: "Installment", amount: "" });

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ডিফল্ট সুপার অ্যাডমিন ক্রেডেনশিয়ালস
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("ভুল ইউজারনেম অথবা পাসওয়ার্ড!");
    }
  };

  // Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;
    const memberObj = {
      id: `M-${members.length + 101}`,
      name: newMember.name,
      phone: newMember.phone,
      nid: newMember.nid,
      shareCapital: Number(newMember.shareCapital) || 0,
      savings: Number(newMember.savings) || 0,
      status: "Active"
    };
    setMembers([...members, memberObj]);
    setNewMember({ name: "", phone: "", nid: "", shareCapital: 0, savings: 0 });
    alert("নতুন সদস্য সফলভাবে যুক্ত হয়েছে!");
  };

  // Disburse Loan
  const handleDisburseLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === newLoan.memberId);
    if (!member || !newLoan.amount) return;

    const principal = Number(newLoan.amount);
    const interest = (principal * Number(newLoan.interestRate)) / 100;
    const total = principal + interest;

    const loanObj = {
      id: `L-${loans.length + 201}`,
      memberId: member.id,
      memberName: member.name,
      amount: principal,
      interestRate: Number(newLoan.interestRate),
      totalPayable: total,
      paid: 0,
      remaining: total,
      status: "Running"
    };
    setLoans([...loans, loanObj]);
    setNewLoan({ memberId: "", amount: "", interestRate: 10 });
    alert("ঋণ বিতরণ সফল হয়েছে!");
  };

  // Collect Cash
  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find((m) => m.id === newCollection.memberId);
    if (!member || !newCollection.amount) return;

    const collAmount = Number(newCollection.amount);
    setCollections([
      {
        id: `C-${collections.length + 1}`,
        date: new Date().toISOString().split("T")[0],
        memberName: member.name,
        type: newCollection.type === "Installment" ? "কিস্তি (Installment)" : "সঞ্চয় (Savings)",
        amount: collAmount
      },
      ...collections
    ]);

    // Update member balance or loan balance
    if (newCollection.type === "Installment") {
      setLoans(
        loans.map((ln) => {
          if (ln.memberId === member.id && ln.status === "Running") {
            const updatedPaid = ln.paid + collAmount;
            const updatedRem = Math.max(0, ln.totalPayable - updatedPaid);
            return {
              ...ln,
              paid: updatedPaid,
              remaining: updatedRem,
              status: updatedRem === 0 ? "Completed" : "Running"
            };
          }
          return ln;
        })
      );
    } else {
      setMembers(
        members.map((m) =>
          m.id === member.id ? { ...m, savings: m.savings + collAmount } : m
        )
      );
    }

    setNewCollection({ memberId: "", type: "Installment", amount: "" });
    alert("কালেকশন সফলভাবে রেকর্ড হয়েছে!");
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", fontFamily: "sans-serif" }}>
        <div style={{ background: "#fff", padding: "35px", borderRadius: "10px", width: "100%", maxWidth: "380px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", color: "#1a365d", marginBottom: "8px" }}>Microcredit System</h2>
          <p style={{ textAlign: "center", color: "#718096", fontSize: "14px", marginBottom: "25px" }}>সুপার অ্যাডমিন লগইন</p>

          {loginError && (
            <div style={{ background: "#fed7d7", color: "#c53030", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "13px" }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#4a5568", marginBottom: "5px" }}>ইউজারনেম</label>
              <input
                type="text"
                value={username}
                placeholder="admin"
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e0", borderRadius: "5px", boxSizing: "border-box" }}
                required
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#4a5568", marginBottom: "5px" }}>পাসওয়ার্ড</label>
              <input
                type="password"
                value={password}
                placeholder="admin123"
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "10px", border: "1px solid #cbd5e0", borderRadius: "5px", boxSizing: "border-box" }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ width: "100%", padding: "11px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "5px", fontSize: "15px", cursor: "pointer", fontWeight: "bold" }}
            >
              প্রবেশ করুন (Login)
            </button>
          </form>
          <div style={{ marginTop: "15px", textAlign: "center", fontSize: "12px", color: "#a0aec0" }}>
            ডিফল্ট: admin / admin123
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD / PORTAL ---
  const totalSavings = members.reduce((acc, m) => acc + m.savings, 0);
  const totalLoanOut = loans.reduce((acc, l) => acc + l.amount, 0);
  const totalRemaining = loans.reduce((acc, l) => acc + l.remaining, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#0f172a", color: "#fff", padding: "20px", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: "18px", color: "#38bdf8", marginBottom: "25px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
          Microcredit SuperAdmin
        </h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <button
            onClick={() => setCurrentTab("dashboard")}
            style={{ textAlign: "left", padding: "10px 14px", background: currentTab === "dashboard" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            📊 ড্যাশবোর্ড
          </button>
          <button
            onClick={() => setCurrentTab("members")}
            style={{ textAlign: "left", padding: "10px 14px", background: currentTab === "members" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            👥 সদস্য তালিকা ও নিবন্ধন
          </button>
          <button
            onClick={() => setCurrentTab("loans")}
            style={{ textAlign: "left", padding: "10px 14px", background: currentTab === "loans" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            💰 ঋণ বিতরণ ও তালিকা
          </button>
          <button
            onClick={() => setCurrentTab("collections")}
            style={{ textAlign: "left", padding: "10px 14px", background: currentTab === "collections" ? "#0284c7" : "transparent", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            📥 কিস্তি ও সঞ্চয় কালেকশন
          </button>
        </nav>
        <button
          onClick={() => setIsLoggedIn(false)}
          style={{ padding: "10px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          লগআউট (Logout)
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
          <h2 style={{ color: "#1e293b", margin: 0 }}>
            {currentTab === "dashboard" && "ড্যাশবোর্ড ওভারভিউ"}
            {currentTab === "members" && "সদস্য ব্যবস্থাপনা"}
            {currentTab === "loans" && "ঋণ ব্যবস্থাপনা"}
            {currentTab === "collections" && "কালেকশন ও রিসিট"}
          </h2>
          <span style={{ background: "#dcfce7", color: "#166534", padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" }}>
            সুপার অ্যাডমিন সক্রিয়
          </span>
        </div>

        {/* TAB 1: DASHBOARD */}
        {currentTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
              <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>মোট সদস্য</p>
                <h3 style={{ margin: "10px 0 0 0", color: "#0f172a", fontSize: "24px" }}>{members.length} জন</h3>
              </div>
              <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>মোট সঞ্চয় আমানত</p>
                <h3 style={{ margin: "10px 0 0 0", color: "#16a34a", fontSize: "24px" }}>৳ {totalSavings.toLocaleString()}</h3>
              </div>
              <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>বিতরণকৃত ঋণ</p>
                <h3 style={{ margin: "10px 0 0 0", color: "#2563eb", fontSize: "24px" }}>৳ {totalLoanOut.toLocaleString()}</h3>
              </div>
              <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>বকেয়া ঋণ আদায়যোগ্য</p>
                <h3 style={{ margin: "10px 0 0 0", color: "#dc2626", fontSize: "24px" }}>৳ {totalRemaining.toLocaleString()}</h3>
              </div>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#334155" }}>সর্বশেষ কালেকশন হিস্ট্রি</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>তারিখ</th>
                    <th style={{ padding: "10px" }}>সদস্য</th>
                    <th style={{ padding: "10px" }}>ধরণ</th>
                    <th style={{ padding: "10px" }}>পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.slice(0, 5).map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px" }}>{c.date}</td>
                      <td style={{ padding: "10px" }}>{c.memberName}</td>
                      <td style={{ padding: "10px" }}>{c.type}</td>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>৳ {c.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS */}
        {currentTab === "members" && (
          <div>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "25px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>নতুন সদস্য যুক্ত করুন</h4>
              <form onSubmit={handleAddMember} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
                <input
                  placeholder="সদস্যের নাম"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                />
                <input
                  placeholder="মোবাইল নম্বর"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                />
                <input
                  placeholder="জাতীয় পরিচয়পত্র নম্বর"
                  value={newMember.nid}
                  onChange={(e) => setNewMember({ ...newMember, nid: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                />
                <input
                  type="number"
                  placeholder="শেয়ার মূলধন (৳)"
                  value={newMember.shareCapital || ""}
                  onChange={(e) => setNewMember({ ...newMember, shareCapital: Number(e.target.value) })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                />
                <button type="submit" style={{ padding: "9px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                  + সদস্য যোগ করুন
                </button>
              </form>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>সকল সদস্যের তালিকা</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>আইডি</th>
                    <th style={{ padding: "10px" }}>নাম</th>
                    <th style={{ padding: "10px" }}>ফোন</th>
                    <th style={{ padding: "10px" }}>সঞ্চয় স্থিতি</th>
                    <th style={{ padding: "10px" }}>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px" }}>{m.id}</td>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{m.name}</td>
                      <td style={{ padding: "10px" }}>{m.phone}</td>
                      <td style={{ padding: "10px", color: "#16a34a", fontWeight: "bold" }}>৳ {m.savings}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ background: "#dcfce7", color: "#15803d", padding: "3px 8px", borderRadius: "12px", fontSize: "12px" }}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LOANS */}
        {currentTab === "loans" && (
          <div>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "25px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>নতুন ঋণ বিতরণ করুন</h4>
              <form onSubmit={handleDisburseLoan} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
                <select
                  value={newLoan.memberId}
                  onChange={(e) => setNewLoan({ ...newLoan, memberId: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                >
                  <option value="">সদস্য নির্বাচন করুন</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="ঋণের পরিমাণ (৳)"
                  value={newLoan.amount}
                  onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                />
                <input
                  type="number"
                  placeholder="মুনাফার হার % (Interest)"
                  value={newLoan.interestRate}
                  onChange={(e) => setNewLoan({ ...newLoan, interestRate: Number(e.target.value) })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                />
                <button type="submit" style={{ padding: "9px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                  ঋণ প্রদান করুন
                </button>
              </form>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>চলতি ও সমাপ্ত ঋণসমূহ</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>লোন আইডি</th>
                    <th style={{ padding: "10px" }}>সদস্য</th>
                    <th style={{ padding: "10px" }}>মূল টাকা</th>
                    <th style={{ padding: "10px" }}>মোট পরিশোধযোগ্য</th>
                    <th style={{ padding: "10px" }}>বকেয়া</th>
                    <th style={{ padding: "10px" }}>স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px" }}>{l.id}</td>
                      <td style={{ padding: "10px" }}>{l.memberName}</td>
                      <td style={{ padding: "10px" }}>৳ {l.amount}</td>
                      <td style={{ padding: "10px" }}>৳ {l.totalPayable}</td>
                      <td style={{ padding: "10px", color: l.remaining > 0 ? "#dc2626" : "#16a34a", fontWeight: "bold" }}>
                        ৳ {l.remaining}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ background: l.status === "Running" ? "#fef3c7" : "#dcfce7", color: l.status === "Running" ? "#b45309" : "#15803d", padding: "3px 8px", borderRadius: "12px", fontSize: "12px" }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COLLECTIONS */}
        {currentTab === "collections" && (
          <div>
            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", marginBottom: "25px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>কালেকশন এন্ট্রি</h4>
              <form onSubmit={handleCollect} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px" }}>
                <select
                  value={newCollection.memberId}
                  onChange={(e) => setNewCollection({ ...newCollection, memberId: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                >
                  <option value="">সদস্য নির্বাচন করুন</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                  ))}
                </select>
                <select
                  value={newCollection.type}
                  onChange={(e) => setNewCollection({ ...newCollection, type: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                >
                  <option value="Installment">লোন কিস্তি</option>
                  <option value="Savings">সঞ্চয় জমা</option>
                </select>
                <input
                  type="number"
                  placeholder="টাকার পরিমাণ"
                  value={newCollection.amount}
                  onChange={(e) => setNewCollection({ ...newCollection, amount: e.target.value })}
                  style={{ padding: "9px", border: "1px solid #cbd5e0", borderRadius: "5px" }}
                  required
                />
                <button type="submit" style={{ padding: "9px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                  কালেকশন গ্রহণ করুন
                </button>
              </form>
            </div>

            <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h4 style={{ margin: "0 0 15px 0" }}>সকল ট্রানজেকশন তালিকা</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>ট্রানজেকশন আইডি</th>
                    <th style={{ padding: "10px" }}>তারিখ</th>
                    <th style={{ padding: "10px" }}>সদস্য</th>
                    <th style={{ padding: "10px" }}>ধরণ</th>
                    <th style={{ padding: "10px" }}>পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "10px" }}>{c.id}</td>
                      <td style={{ padding: "10px" }}>{c.date}</td>
                      <td style={{ padding: "10px" }}>{c.memberName}</td>
                      <td style={{ padding: "10px" }}>{c.type}</td>
                      <td style={{ padding: "10px", fontWeight: "bold", color: "#15803d" }}>৳ {c.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}