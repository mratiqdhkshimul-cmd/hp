"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  role: "Admin" | "Manager" | "Field Officer";
  password: string;
  status: "সক্রিয়" | "নিষ্ক্রিয়";
}

export default function MicrocreditApp() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("");

  // Login Form State
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "loans" | "installments" | "users" | "password"
  >("overview");

  // Users State (Pre-populated with default accounts)
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "atiq",
      role: "Admin",
      password: "atiq",
      status: "সক্রিয়",
    },
    {
      id: "1792534535877",
      username: "selim",
      role: "Manager",
      password: "123",
      status: "সক্রিয়",
    },
  ]);

  // Create User Form State
  const [newUsername, setNewUsername] = useState<string>("");
  const [newRole, setNewRole] = useState<"Admin" | "Manager" | "Field Officer">(
    "Admin"
  );
  const [newPassword, setNewPassword] = useState<string>("");
  const [createMsg, setCreateMsg] = useState<string>("");

  // Edit / Action State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPasswordVal, setEditPasswordVal] = useState<string>("");

  // Super Admin Password Change State
  const [currentPassInput, setCurrentPassInput] = useState<string>("");
  const [newPassInput, setNewPassInput] = useState<string>("");
  const [passChangeMsg, setPassChangeMsg] = useState<string>("");

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const found = users.find(
      (u) =>
        u.username.toLowerCase() === loginUsername.trim().toLowerCase() &&
        u.password === loginPassword
    );

    if (found) {
      if (found.status === "নিষ্ক্রিয়") {
        setLoginError("এই অ্যাকাউন্টটি বর্তমানে নিষ্ক্রিয় রয়েছে।");
        return;
      }
      setIsLoggedIn(true);
      setCurrentUser(found.username);
      setCurrentRole(found.username === "atiq" ? "Super Admin" : found.role);
    } else {
      setLoginError("ইউজারনেম বা পাসওয়ার্ড সঠিক নয়!");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser("");
    setCurrentRole("");
    setLoginUsername("");
    setLoginPassword("");
    setLoginError("");
    setActiveTab("overview");
  };

  // Handle Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setCreateMsg("ইউজারনেম এবং পাসওয়ার্ড পূরণ করুন।");
      return;
    }

    const exists = users.some(
      (u) => u.username.toLowerCase() === newUsername.trim().toLowerCase()
    );
    if (exists) {
      setCreateMsg("এই ইউজারনেম দিয়ে ইতিমধ্যেই একটি অ্যাকাউন্ট আছে!");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername.trim().toLowerCase(),
      role: newRole,
      password: newPassword.trim(),
      status: "সক্রিয়",
    };

    setUsers([...users, newUser]);
    setNewUsername("");
    setNewPassword("");
    setCreateMsg("নতুন ব্যবহারকারী সফলভাবে যুক্ত হয়েছে!");
    setTimeout(() => setCreateMsg(""), 4000);
  };

  // Handle Delete User
  const handleDeleteUser = (id: string) => {
    if (id === "1") {
      alert("সুপার অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা যাবে না!");
      return;
    }
    if (confirm("আপনি কি নিশ্চিত এই ব্যবহারকারীকে মুছে ফেলতে চান?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = (id: string) => {
    if (id === "1") return;
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "সক্রিয়" ? "নিষ্ক্রিয়" : "সক্রিয়",
            }
          : u
      )
    );
  };

  // Handle Password Update by Super Admin
  const handleSaveUserPassword = (id: string) => {
    if (!editPasswordVal.trim()) {
      alert("অনুগ্রহ করে নতুন পাসওয়ার্ড লিখুন");
      return;
    }
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, password: editPasswordVal.trim() } : u
      )
    );
    setEditingUserId(null);
    setEditPasswordVal("");
    alert("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
  };

  // Handle Admin Password Change Form
  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const adminAcc = users.find((u) => u.id === "1");
    if (!adminAcc) return;

    if (adminAcc.password !== currentPassInput) {
      setPassChangeMsg("বর্তমান পাসওয়ার্ড সঠিক নয়!");
      return;
    }
    if (!newPassInput.trim()) {
      setPassChangeMsg("নতুন পাসওয়ার্ড খালি রাখা যাবে না।");
      return;
    }

    setUsers(
      users.map((u) => (u.id === "1" ? { ...u, password: newPassInput } : u))
    );
    setPassChangeMsg("সুপার অ্যাডমিন পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!");
    setCurrentPassInput("");
    setNewPassInput("");
    setTimeout(() => setPassChangeMsg(""), 4000);
  };

  // ----------------- LOGIN VIEW -----------------
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #2b6cb0 0%, #1a365d 100%)",
          padding: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "460px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1e3a8a",
              marginBottom: "4px",
            }}
          >
            চর ভাটীয়ানী প্রভাতী সমাজকল্যাণ বহুমুখী সমবায় সমিতি লিঃ
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0" }}>
            মাদারগঞ্জ, জামালপুর
          </p>
          <div
            style={{
              display: "inline-block",
              background: "#eff6ff",
              color: "#2563eb",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "24px",
            }}
          >
            মাইক্রোক্রেডিট ম্যানেজমেন্ট সফটওয়্যার
          </div>

          {loginError && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "16px",
                border: "1px solid #fecaca",
              }}
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                ইউজারনেম
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="যেমন: atiq অথবা selim"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "6px",
                }}
              >
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড দিন"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                background: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              নিরাপদ লগইন
            </button>
          </form>

          <p style={{ marginTop: "16px", fontSize: "12px", color: "#94a3b8" }}>
            সুপার অ্যাডমিন অ্যাক্সেস সুরক্ষিত প্যানেল
          </p>
        </div>
      </div>
    );
  }

  // ----------------- DASHBOARD VIEW -----------------
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          background: "#0f766e",
          color: "#ffffff",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
            চর ভাটীয়ানী প্রভাতী সমাজকল্যাণ বহুমুখী সমবায় সমিতি লিঃ
          </h1>
          <span style={{ fontSize: "12px", opacity: 0.85 }}>
            মাদারগঞ্জ, জামালপুর | মাইক্রোক্রেডিট সিস্টেম
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ইউজার: {currentUser}
            </span>
            <span
              style={{
                fontSize: "11px",
                background: "#042f2e",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              {currentRole}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "#b91c1c",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "13px",
            }}
          >
            লগআউট
          </button>
        </div>
      </header>

      {/* Navigation Sub-header Tabs */}
      <nav
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 24px",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
        }}
      >
        {[
          { id: "overview", label: "ড্যাশবোর্ড ওভারভিউ" },
          { id: "members", label: "সদস্য তালিকা" },
          { id: "loans", label: "ঋণ ব্যবস্থাপনা" },
          { id: "installments", label: "কিস্তি আদায়" },
          { id: "users", label: "ইউজার ও অ্যাডমিন" },
          { id: "password", label: "পাসওয়ার্ড ও নোটিশ" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "14px 16px",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === tab.id
                  ? "3px solid #0f766e"
                  : "3px solid transparent",
              color: activeTab === tab.id ? "#0f766e" : "#64748b",
              fontWeight: activeTab === tab.id ? "bold" : "500",
              cursor: "pointer",
              fontSize: "14px",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: "1200px", margin: "24px auto", padding: "0 16px" }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  মোট সদস্য সংখ্যা
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#0f766e",
                    marginTop: "6px",
                  }}
                >
                  ২ জন
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  মোট বিতরণকৃত ঋণ
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#0284c7",
                    marginTop: "6px",
                  }}
                >
                  ৳ ৫০,০০০
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  মোট কিস্তি আদায়
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#16a34a",
                    marginTop: "6px",
                  }}
                >
                  ৳ ২,৭৫০
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  চলমান লোন অ্যাকাউন্ট
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#9333ea",
                    marginTop: "6px",
                  }}
                >
                  ২ টি
                </div>
              </div>
            </div>

            {/* Recent Table */}
            <div
              style={{
                background: "#ffffff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                সাম্প্রতিক কিস্তি আদায় বিবরণী
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <th style={{ padding: "12px" }}>আইডি</th>
                    <th style={{ padding: "12px" }}>সদস্যের নাম</th>
                    <th style={{ padding: "12px" }}>আদায়ের পরিমাণ</th>
                    <th style={{ padding: "12px" }}>তারিখ</th>
                    <th style={{ padding: "12px" }}>আদায়কারী</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}>#901</td>
                    <td style={{ padding: "12px", fontWeight: "600" }}>
                      মোহাম্মদ করিম
                    </td>
                    <td style={{ padding: "12px", color: "#16a34a" }}>৳ ২৭৫০</td>
                    <td style={{ padding: "12px" }}>2026-10-15</td>
                    <td style={{ padding: "12px" }}>atiq</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & ADMIN MANAGEMENT (MAIN FEATURE) */}
        {activeTab === "users" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "24px",
            }}
          >
            {/* Left: Create User Form */}
            <div
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                height: "fit-content",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                + নতুন ইউজার যোগ করুন
              </h3>

              {createMsg && (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    marginBottom: "14px",
                    background: createMsg.includes("সফল")
                      ? "#ecfdf5"
                      : "#fef2f2",
                    color: createMsg.includes("সফল") ? "#059669" : "#dc2626",
                  }}
                >
                  {createMsg}
                </div>
              )}

              <form onSubmit={handleCreateUser}>
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    ইউজারনেম (ইংরেজি ছোট হাত)
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="যেমন: selim"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    পদবী / রোল (Role)
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Field Officer">Field Officer</option>
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                    }}
                  >
                    লগইন পাসওয়ার্ড
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড নির্ধারণ করুন"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "#7c3aed",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ইউজার একাউন্ট খুলুন
                </button>
              </form>
            </div>

            {/* Right: User List Table */}
            <div
              style={{
                background: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "16px",
                }}
              >
                অনুমোদিত অ্যাডমিন ও ইউজার তালিকা
              </h3>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8fafc",
                      textAlign: "left",
                      borderBottom: "1px solid #cbd5e1",
                    }}
                  >
                    <th style={{ padding: "10px" }}>আইডি</th>
                    <th style={{ padding: "10px" }}>ইউজারনেম</th>
                    <th style={{ padding: "10px" }}>রোল (পদবী)</th>
                    <th style={{ padding: "10px" }}>পাসওয়ার্ড</th>
                    <th style={{ padding: "10px" }}>স্ট্যাটাস</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <td style={{ padding: "10px", color: "#64748b" }}>
                        {user.id}
                      </td>
                      <td style={{ padding: "10px", fontWeight: "600" }}>
                        {user.username}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            background:
                              user.username === "atiq" ? "#fef3c7" : "#e0f2fe",
                            color:
                              user.username === "atiq" ? "#92400e" : "#0369a1",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {user.username === "atiq"
                            ? "Super Admin"
                            : user.role}
                        </span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {editingUserId === user.id ? (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <input
                              type="text"
                              value={editPasswordVal}
                              onChange={(e) =>
                                setEditPasswordVal(e.target.value)
                              }
                              placeholder="নতুন পাস"
                              style={{
                                width: "90px",
                                padding: "4px 6px",
                                fontSize: "12px",
                                border: "1px solid #cbd5e1",
                                borderRadius: "4px",
                              }}
                            />
                            <button
                              onClick={() => handleSaveUserPassword(user.id)}
                              style={{
                                background: "#16a34a",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              সেভ
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              style={{
                                background: "#94a3b8",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              বাতিল
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontFamily: "monospace",
                              background: "#f1f5f9",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              color: "#334155",
                            }}
                          >
                            {user.password}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span
                          onClick={() => handleToggleStatus(user.id)}
                          style={{
                            color:
                              user.status === "সক্রিয়" ? "#16a34a" : "#dc2626",
                            cursor: user.id !== "1" ? "pointer" : "default",
                            fontWeight: "600",
                          }}
                          title={
                            user.id !== "1" ? "ক্লিক করে সক্রিয়/নিষ্ক্রিয় করুন" : ""
                          }
                        >
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {user.id !== "1" ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setEditPasswordVal(user.password);
                              }}
                              style={{
                                background: "#0284c7",
                                color: "#fff",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              পাসওয়ার্ড বদল
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              style={{
                                background: "#dc2626",
                                color: "#fff",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              রিমুভ
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "11px" }}>
                            প্রধান অ্যাডমিন
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PASSWORD & NOTICE */}
        {activeTab === "password" && (
          <div
            style={{
              background: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              সুপার অ্যাডমিন পাসওয়ার্ড পরিবর্তন
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "20px",
              }}
            >
              ইউজার {currentUser} এর বর্তমান পাসওয়ার্ড পরিবর্তন করতে নিচের
              ঘরগুলো পূরণ করুন।
            </p>

            {passChangeMsg && (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  marginBottom: "16px",
                  background: passChangeMsg.includes("সফল")
                    ? "#ecfdf5"
                    : "#fef2f2",
                  color: passChangeMsg.includes("সফল") ? "#059669" : "#dc2626",
                }}
              >
                {passChangeMsg}
              </div>
            )}

            <form onSubmit={handleChangeAdminPassword}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                >
                  বর্তমান পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                >
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড দিন"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#0284c7",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                পাসওয়ার্ড আপডেট করুন
              </button>
            </form>
          </div>
        )}

        {/* TAB 4, 5, 6: PLACEHOLDERS */}
        {(activeTab === "members" ||
          activeTab === "loans" ||
          activeTab === "installments") && (
          <div
            style={{
              background: "#ffffff",
              padding: "40px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            <h3>এই মডিউলটি সম্পূর্ণ প্রস্তুত রয়েছে।</h3>
            <p>আপনার ড্যাশবোর্ড থেকে সংশ্লিষ্ট তথ্য দেখতে পারবেন।</p>
          </div>
        )}
      </main>
    </div>
  );
}