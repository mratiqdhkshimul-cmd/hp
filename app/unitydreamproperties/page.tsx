'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ===================== ১. টাইপ ডেফিনিশন ও মডেল =====================
export type UserRole = 
  | 'Super Admin'
  | 'Chairman'
  | 'Managing Director'
  | 'General Manager'
  | 'DGM'
  | 'AGM'
  | 'Team Leader'
  | 'Business Partner'
  | 'Agent'
  | 'Customer'
  | 'Accounts Head'
  | 'Accountant';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'Super Admin': 100,
  'Chairman': 95,
  'Managing Director': 90,
  'General Manager': 70,
  'DGM': 60,
  'AGM': 50,
  'Team Leader': 40,
  'Business Partner': 30,
  'Agent': 20,
  'Customer': 10,
  'Accounts Head': 65,
  'Accountant': 45
};

export interface PartnerSaleRecord {
  id: string;
  projectName: string;
  unitOrPlot: string;
  areaKathaOrSqFt: string;
  customerName: string;
  customerPhone: string;
  salePrice: number;
  commissionEarned: number;
  commissionPaid: number;
  commissionStatus: 'Paid' | 'Held' | 'Pending';
  saleDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  parentId?: string;
  salesKatha: number;
  totalEarnings: number;
  heldEarnings: number;
  teamSalesKatha: number;
  teamEarnings: number;
  isSuperAdmin: boolean;
  hasAccountsAccess: boolean;
  status: 'Active' | 'Blocked' | 'Pending';
  salesHistory?: PartnerSaleRecord[];
  customerPurchase?: {
    projectName: string;
    unitOrPlot: string;
    area: string;
    totalPrice: number;
    bookingMoney: number;
    paidAmount: number;
    dueAmount: number;
    installmentCount: number;
  };
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'Facebook Ad' | 'Reference' | 'Walk-in' | 'Telemarketing' | 'Website';
  interestedProject: string;
  score: 'Hot' | 'Warm' | 'Cold';
  stage: 'New Lead' | 'Contacted' | 'Site Visit Planned' | 'Negotiation' | 'Booked' | 'Lost';
  assignedTo: string;
  notes: string;
  createdDate: string;
}

export interface SiteVisitMeeting {
  id: string;
  clientName: string;
  clientPhone: string;
  type: 'Site Visit' | 'Office Meeting' | 'Online Call';
  projectName: string;
  dateTime: string;
  coordinator: string;
  status: 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';
  feedback: string;
}

export interface MaterialRequisition {
  id: string;
  projectName: string;
  itemType: 'রড (Rod 72G)' | 'সিমেন্ট (Cement)' | 'সিলেট বালু (Sand)' | 'ইট (Bricks)' | 'পাথর (Stone Chips)';
  requestedQty: number;
  unit: 'Ton' | 'Bags' | 'CFT' | 'Pcs';
  estimatedCost: number;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Rejected';
  requestedBy: string;
  requestDate: string;
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subType: string;
}

export interface ERPTransaction {
  id: string;
  voucherNo: string;
  date: string;
  projectId: string;
  projectName: string;
  accountCode: string;
  accountName: string;
  type: 'Debit' | 'Credit';
  category: 'Land Cost' | 'Material Construction' | 'Contractor RA Bill' | 'Plot Sales Revenue' | 'Customer Installment' | 'Staff Salary' | 'Office Overhead' | 'Commission Payout' | 'Tax VAT (TDS/VDS)';
  description: string;
  grossAmount: number;
  tdsAmount: number;
  vdsAmount: number;
  retentionAmount: number;
  netAmount: number;
  recordedBy: string;
}

export interface CustomerReceivable {
  id: string;
  customerName: string;
  phone: string;
  projectName: string;
  unitOrPlot: string;
  totalPrice: number;
  paidAmount: number;
  dueAmount: number;
  nextInstallmentDate: string;
  daysOverdue: number;
}

export interface ProjectCostReport {
  id: string;
  name: string;
  totalRevenue: number;
  landAndDirectCost: number;
  materialCost: number;
  contractorCost: number;
  overheadCost: number;
  wipValue: number;
  netProfitLoss: number;
}

const MASTER_PHONE = '+8801689333000';

const MASTER_SUPER_ADMIN: UserProfile = {
  id: 'UDP-SA-001',
  name: 'MOHAMMAD ATIQUL ISLAM',
  email: 'mr.atiq.dhk.shimul@gmail.com',
  phone: MASTER_PHONE,
  password: 'password123',
  role: 'Super Admin',
  salesKatha: 85,
  totalEarnings: 6150000,
  heldEarnings: 0,
  teamSalesKatha: 350,
  teamEarnings: 4200000,
  isSuperAdmin: true,
  hasAccountsAccess: true,
  status: 'Active',
  salesHistory: [
    {
      id: 'SL-01',
      projectName: 'Dhaka Western Valley',
      unitOrPlot: 'Plot # A-12',
      areaKathaOrSqFt: '5 Katha',
      customerName: 'Mr. Zahirul Haque',
      customerPhone: '+8801711111111',
      salePrice: 7250000,
      commissionEarned: 362500,
      commissionPaid: 362500,
      commissionStatus: 'Paid',
      saleDate: '2026-08-15'
    }
  ]
};

// ===================== ২. প্রাথমিক ডাটাবেজ =====================
const generateInitialUsers = (): UserProfile[] => {
  const users: UserProfile[] = [
    MASTER_SUPER_ADMIN,
    {
      id: 'UDP-CH-002',
      name: 'Engr. Md Mustafizur Rahman Rashid',
      email: 'chairman@unitydream.com',
      phone: MASTER_PHONE,
      password: 'pass123',
      role: 'Chairman',
      salesKatha: 60,
      totalEarnings: 4500000,
      heldEarnings: 0,
      teamSalesKatha: 280,
      teamEarnings: 3100000,
      isSuperAdmin: true,
      hasAccountsAccess: true,
      status: 'Active'
    },
    {
      id: 'UDP-MD-003',
      name: 'Mohammad Showkat Ali',
      email: 'md@unitydream.com',
      phone: MASTER_PHONE,
      password: 'pass123',
      role: 'Managing Director',
      salesKatha: 55,
      totalEarnings: 3950000,
      heldEarnings: 0,
      teamSalesKatha: 240,
      teamEarnings: 2900000,
      isSuperAdmin: true,
      hasAccountsAccess: true,
      status: 'Active'
    },
    {
      id: 'UDP-GM-004',
      name: 'Md. Mahmudur Rahman',
      email: 'gm@unitydream.com',
      phone: '+8801722222201',
      password: 'pass123',
      role: 'General Manager',
      salesKatha: 35,
      totalEarnings: 2100000,
      heldEarnings: 0,
      teamSalesKatha: 160,
      teamEarnings: 1450000,
      isSuperAdmin: false,
      hasAccountsAccess: true,
      status: 'Active'
    },
    {
      id: 'UDP-DGM-005',
      name: 'Rofiqul Kabir Saikat',
      email: 'dgm@unitydream.com',
      phone: '+8801722222202',
      password: 'pass123',
      role: 'DGM',
      salesKatha: 25,
      totalEarnings: 1550000,
      heldEarnings: 0,
      teamSalesKatha: 95,
      teamEarnings: 820000,
      isSuperAdmin: false,
      hasAccountsAccess: false,
      status: 'Active'
    },
    {
      id: 'UDP-AGM-006',
      name: 'Piyal Hasan Rubel',
      email: 'agm@unitydream.com',
      phone: '+8801722222203',
      password: 'pass123',
      role: 'AGM',
      salesKatha: 18,
      totalEarnings: 1120000,
      heldEarnings: 50000,
      teamSalesKatha: 60,
      teamEarnings: 510000,
      isSuperAdmin: false,
      hasAccountsAccess: false,
      status: 'Active'
    },
    {
      id: 'UDP-TL-007',
      name: 'Md. Tariqul Islam',
      email: 'accounts@unitydream.com',
      phone: MASTER_PHONE,
      password: 'pass123',
      role: 'Accounts Head',
      salesKatha: 0,
      totalEarnings: 0,
      heldEarnings: 0,
      teamSalesKatha: 0,
      teamEarnings: 0,
      isSuperAdmin: false,
      hasAccountsAccess: true,
      status: 'Active'
    },
    {
      id: 'UDP-BP-102',
      name: 'Samia Parvin Shanta',
      email: 'samia.parvin.shanta@gmail.com',
      phone: '+8801733333301',
      password: 'pass123',
      role: 'Business Partner',
      salesKatha: 12,
      totalEarnings: 870000,
      heldEarnings: 0,
      teamSalesKatha: 20,
      teamEarnings: 180000,
      isSuperAdmin: false,
      hasAccountsAccess: false,
      status: 'Active'
    },
    {
      id: 'UDP-CUST-301',
      name: 'Khandaker Rafiqul Alam',
      email: 'rafiqul.client@gmail.com',
      phone: '+8801712345678',
      password: 'pass123',
      role: 'Customer',
      salesKatha: 0,
      totalEarnings: 0,
      heldEarnings: 0,
      teamSalesKatha: 0,
      teamEarnings: 0,
      isSuperAdmin: false,
      hasAccountsAccess: false,
      status: 'Active',
      customerPurchase: {
        projectName: 'Dhaka Western Valley',
        unitOrPlot: 'Plot # 14, Block # A',
        area: '5 Katha',
        totalPrice: 1450000,
        bookingMoney: 145000,
        paidAmount: 500000,
        dueAmount: 950000,
        installmentCount: 60
      }
    }
  ];

  const rolesDistribution: UserRole[] = ['Business Partner', 'Agent', 'Customer'];
  for (let i = 11; i <= 100; i++) {
    const role = rolesDistribution[i % 3];
    users.push({
      id: `UDP-USR-${100 + i}`,
      name: `Partner/Member ${i}`,
      email: `user${i}@unitydreamproperties.com`,
      phone: `+8801700${100000 + i}`,
      password: 'pass123',
      role: role,
      salesKatha: role === 'Customer' ? 0 : (i % 8) * 2,
      totalEarnings: role === 'Customer' ? 0 : (i % 8) * 145000,
      heldEarnings: 0,
      teamSalesKatha: role === 'Business Partner' ? (i % 5) * 5 : 0,
      teamEarnings: role === 'Business Partner' ? (i % 5) * 45000 : 0,
      isSuperAdmin: false,
      hasAccountsAccess: false,
      status: 'Active'
    });
  }

  return users;
};

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'LD-101',
    name: 'Engr. Nazmul Huda',
    phone: '+8801715554433',
    email: 'nazmul.engr@gmail.com',
    source: 'Facebook Ad',
    interestedProject: 'Dhaka Western Valley',
    score: 'Hot',
    stage: 'Site Visit Planned',
    assignedTo: 'MOHAMMAD ATIQUL ISLAM',
    notes: 'সাভার সংলগ্ন ৫ কাঠার কর্নার প্লট খুঁজছেন, নগদ সাফ-কবলা কেনার আগ্রহ রয়েছে।',
    createdDate: '2026-10-02'
  },
  {
    id: 'LD-102',
    name: 'Dr. Sharmin Akter',
    phone: '+8801819991122',
    email: 'dr.sharmin@hospital.com',
    source: 'Reference',
    interestedProject: 'The Bay Icon International Hotel & Resort Ltd.',
    score: 'Hot',
    stage: 'Negotiation',
    assignedTo: 'Samia Parvin Shanta',
    notes: 'কক্সবাজার রিসোর্টে ৩০০ স্কয়ার ফিট ফ্র্যাকশনাল ওনারশিপ শেয়ারে বাৎসরিক ROI নিয়ে কথা চলছে।',
    createdDate: '2026-10-05'
  },
  {
    id: 'LD-103',
    name: 'Md. Golam Kibria',
    phone: '+8801912887766',
    email: 'kibria.biz@yahoo.com',
    source: 'Website',
    interestedProject: 'Padma Eco-City',
    score: 'Warm',
    stage: 'Contacted',
    assignedTo: 'Rofiqul Kabir Saikat',
    notes: 'পদ্মা সেতু সংলগ্ন ইকো-সিটির ৩৬ মাসের কিস্তি সুবিধার ব্রোশিওর চেয়েছেন।',
    createdDate: '2026-10-07'
  }
];

const INITIAL_VISITS: SiteVisitMeeting[] = [
  {
    id: 'SVM-01',
    clientName: 'Engr. Nazmul Huda',
    clientPhone: '+8801715554433',
    type: 'Site Visit',
    projectName: 'Dhaka Western Valley',
    dateTime: '2026-10-15 10:30 AM',
    coordinator: 'MOHAMMAD ATIQUL ISLAM',
    status: 'Scheduled',
    feedback: 'অফিস কার যোগে সাইট পরিদর্শন করানো হবে।'
  },
  {
    id: 'SVM-02',
    clientName: 'Dr. Sharmin Akter',
    clientPhone: '+8801819991122',
    type: 'Office Meeting',
    projectName: 'The Bay Icon International Hotel & Resort Ltd.',
    dateTime: '2026-10-12 04:00 PM',
    coordinator: 'Samia Parvin Shanta',
    status: 'Scheduled',
    feedback: 'হোসাফ টাওয়ার কর্পোরেট অফিসে মিটিং নির্ধারিত।'
  }
];

const INITIAL_REQUISITIONS: MaterialRequisition[] = [
  {
    id: 'REQ-01',
    projectName: 'Dhaka Western Valley',
    itemType: 'রড (Rod 72G)',
    requestedQty: 12,
    unit: 'Ton',
    estimatedCost: 1140000,
    status: 'Approved',
    requestedBy: 'Site Engineer Arif',
    requestDate: '2026-10-06'
  },
  {
    id: 'REQ-02',
    projectName: 'Dhaka Western Valley',
    itemType: 'সিমেন্ট (Cement)',
    requestedQty: 300,
    unit: 'Bags',
    estimatedCost: 165000,
    status: 'Pending',
    requestedBy: 'Site Engineer Arif',
    requestDate: '2026-10-08'
  }
];

const INITIAL_COA: ChartOfAccount[] = [
  { code: '1010', name: 'Cash in Hand & Multi-Bank Accounts', type: 'Asset', subType: 'Current Asset' },
  { code: '1020', name: 'Accounts Receivable (Plot / Flat Installments)', type: 'Asset', subType: 'Current Asset' },
  { code: '1030', name: 'Work-In-Progress (WIP Construction)', type: 'Asset', subType: 'Inventory / WIP' },
  { code: '1040', name: 'Land & Project Property Inventory', type: 'Asset', subType: 'Fixed / Inventory' },
  { code: '2010', name: 'Accounts Payable (Suppliers & Vendors)', type: 'Liability', subType: 'Current Liability' },
  { code: '2020', name: 'Sub-contractor Retention Money Payable', type: 'Liability', subType: 'Current Liability' },
  { code: '2030', name: 'Govt. NBR TDS & VDS Payable', type: 'Liability', subType: 'Tax Liability' },
  { code: '3010', name: 'Paid Up Capital & Shareholder Equity', type: 'Equity', subType: 'Equity' },
  { code: '4010', name: 'Plot & Commercial Space Sales Revenue', type: 'Revenue', subType: 'Operating Revenue' },
  { code: '5010', name: 'Land Acquisition & Owner Sharing Cost', type: 'Expense', subType: 'Direct Cost' },
  { code: '5020', name: 'Raw Material Cost (Rod, Cement, Sand)', type: 'Expense', subType: 'Direct Cost' },
  { code: '5030', name: 'Contractor Civil Construction Expense', type: 'Expense', subType: 'Direct Cost' },
  { code: '5040', name: 'Partner Sales Commission & Marketing', type: 'Expense', subType: 'Selling Expense' },
  { code: '5050', name: 'Staff Salary & Office Admin Overhead', type: 'Expense', subType: 'Administrative' }
];

const INITIAL_TRANSACTIONS: ERPTransaction[] = [
  {
    id: 'TXN-001',
    voucherNo: 'VR-2026-101',
    date: '2026-10-01',
    projectId: '1',
    projectName: 'Dhaka Western Valley',
    accountCode: '4010',
    accountName: 'Plot Sales Revenue',
    type: 'Credit',
    category: 'Plot Sales Revenue',
    description: 'প্লট সেলস বুকিং ডাউনপেমেন্ট প্রাপ্তি (৫ কাঠা)',
    grossAmount: 1450000,
    tdsAmount: 0,
    vdsAmount: 0,
    retentionAmount: 0,
    netAmount: 1450000,
    recordedBy: 'MOHAMMAD ATIQUL ISLAM'
  },
  {
    id: 'TXN-002',
    voucherNo: 'VR-2026-102',
    date: '2026-10-02',
    projectId: '1',
    projectName: 'Dhaka Western Valley',
    accountCode: '5020',
    accountName: 'Raw Material Cost',
    type: 'Debit',
    category: 'Material Construction',
    description: 'প্রকল্পের সীমানা প্রাচীর ও বালু ভরাট মেটেরিয়াল ক্রয়',
    grossAmount: 320000,
    tdsAmount: 9600,
    vdsAmount: 16000,
    retentionAmount: 0,
    netAmount: 294400,
    recordedBy: 'Md. Tariqul Islam'
  }
];

const INITIAL_RECEIVABLES: CustomerReceivable[] = [
  {
    id: 'AR-01',
    customerName: 'Khandaker Rafiqul Alam',
    phone: '+8801712345678',
    projectName: 'Dhaka Western Valley',
    unitOrPlot: 'Plot # 14, Block # A (5 Katha)',
    totalPrice: 1450000,
    paidAmount: 500000,
    dueAmount: 950000,
    nextInstallmentDate: '2026-10-25',
    daysOverdue: 0
  }
];

const projectsData = [
  {
    id: '1',
    name: 'Dhaka Western Valley',
    developer: 'পুষ্পধারা প্রপার্টিজ লিমিটেড অনুমোদিত',
    location: 'ঢাকা ওয়েস্টার্ন জোন (সাভার সংলগ্ন)',
    tag: 'Residential Plots',
    badge: 'Ongoing Flagship',
    size: 'সর্বনিম্ন ৫ কাঠা (৫ ও ১০ কাঠা প্লট)',
    price: '১৪,৫০,০০০ ৳ / কাঠা',
    statusBadge: 'প্যাকেজ / রেট',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    terms: [
      'সর্বনিম্ন প্লট সাইজ ৫ কাঠা থেকে শুরু। ৩ কাঠার কোনো প্লট বরাদ্দযোগ্য নয়।',
      'এককালীন পরিশোধে বিশেষ মূল্যছাড় ও তাৎক্ষণিক সাফ-কবলা রেজিস্ট্রেশন সুবিধা।',
      'সর্বোচ্চ ৬০টি সহজ মাসিক কিস্তিতে মূল্য পরিশোধের সুবর্ণ সুযোগ।',
      'বুকিং মানি মোট মূল্যের ১০% প্রদান সাপেক্ষে সাময়িক প্লট বরাদ্দ নিশ্চিত করা হবে।'
    ]
  },
  {
    id: '2',
    name: 'The Bay Icon International Hotel & Resort Ltd.',
    developer: 'পুষ্পধারা প্রপার্টিজ লিমিটেড / Bay Icon Ltd.',
    location: 'কলাতলী মেরিন ড্রাইভ, কক্সবাজার',
    tag: '5-Star Luxury Hospitality & Commercial',
    badge: 'Under Construction',
    size: '১০০, ৩০০, ৫০০, ১,০০০, ২,০০০, ৩,০০০ ও ৫,০০০ Sq Ft / Fractional Share',
    price: '৫০,০০০ ৳ / প্রতি স্কয়ার ফিট',
    statusBadge: 'শেয়ার ও ওনারশিপ ইনভেস্টমেন্ট',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    terms: [
      'প্রতি স্কয়ার ফিটের কর্পোরেট মূল্য ৫০,০০০ টাকা নির্ধারিত।',
      '১০০ থেকে ৫০০০ স্কয়ার ফিট ফ্র্যাকশনাল ওনারশিপ শেয়ার বরাদ্দযোগ্য।',
      'আজীবন সাব-কবলা দলিল ও নিয়মিত লভ্যাংশ (ROI) পাওয়ার আইনি নিশ্চয়তা।'
    ]
  },
  {
    id: '3',
    name: 'Padma Eco-City',
    developer: 'পুষ্পধারা প্রপার্টিজ লিমিটেড',
    location: 'ঢাকা-মাওয়া এক্সপ্রেসওয়ে (পদ্মা সেতু সংলগ্ন)',
    tag: 'Township / Mega Plot Project',
    badge: 'Ongoing Flagship',
    size: 'সর্বনিম্ন ৫ কাঠা (৫, ১০ ও ২০ কাঠা প্লট)',
    price: '১০,৫০,০০০ ৳ / কাঠা থেকে শুরু',
    statusBadge: 'প্যাকেজ / রেট',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    terms: [
      'প্রকল্পে প্লট সাইজ সর্বনিম্ন ৫ কাঠা। ৩ কাঠার প্লট বরাদ্দ বন্ধ।',
      'পদ্মা সেতু সংলগ্ন আধুনিক ইকো-সিটি এবং সহজ ৩৬-৭২ মাসের কিস্তি সুবিধা।'
    ]
  }
];

export default function UnityDreamPortal() {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<ERPTransaction[]>(INITIAL_TRANSACTIONS);
  const [receivables, setReceivables] = useState<CustomerReceivable[]>(INITIAL_RECEIVABLES);
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [visits, setVisits] = useState<SiteVisitMeeting[]>(INITIAL_VISITS);
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(INITIAL_REQUISITIONS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Responsive & Modal States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'forgot' | null>(null);
  const [showERP, setShowERP] = useState(false);
  
  // ট্যাব নেভিগেশন (CRM ও অপারেশন সহ পূর্ণাঙ্গ মেনু)
  const [activeTab, setActiveTab] = useState<
    'partner_list' | 'crm_leads' | 'visits_scheduling' | 'materials_req' | 'journal_ledger' | 'project_costing' | 'ar_installments' | 'tax_vat' | 'balance_sheet' | 'admin_users'
  >('partner_list');

  const [selectedProjectForTerms, setSelectedProjectForTerms] = useState<typeof projectsData[0] | null>(null);
  const [viewDetailsUser, setViewDetailsUser] = useState<UserProfile | null>(null);
  const [editUserModal, setEditUserModal] = useState<UserProfile | null>(null);

  // CRM নতুন লিড ইনপুট
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSource, setLeadSource] = useState<LeadItem['source']>('Facebook Ad');
  const [leadProject, setLeadProject] = useState('Dhaka Western Valley');
  const [leadScore, setLeadScore] = useState<LeadItem['score']>('Hot');
  const [leadNotes, setLeadNotes] = useState('');

  // শিডিউল নতুন ভিজিট ইনপুট
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [visitClient, setVisitClient] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitType, setVisitType] = useState<SiteVisitMeeting['type']>('Site Visit');
  const [visitProject, setVisitProject] = useState('Dhaka Western Valley');
  const [visitDateTime, setVisitDateTime] = useState('');
  const [visitFeedback, setVisitFeedback] = useState('');

  // মেটেরিয়াল নতুন রিকুইজিশন ইনপুট
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [reqProject, setReqProject] = useState('Dhaka Western Valley');
  const [reqItem, setReqItem] = useState<MaterialRequisition['itemType']>('রড (Rod 72G)');
  const [reqQty, setReqQty] = useState<number>(1);
  const [reqUnit, setReqUnit] = useState<MaterialRequisition['unit']>('Ton');
  const [reqCost, setReqCost] = useState<number>(0);

  // Auth Inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  // ভাউচার ইনপুটস
  const [voucherProjectId, setVoucherProjectId] = useState('1');
  const [voucherAccountCode, setVoucherAccountCode] = useState('4010');
  const [voucherType, setVoucherType] = useState<'Debit' | 'Credit'>('Credit');
  const [voucherCategory, setVoucherCategory] = useState<ERPTransaction['category']>('Plot Sales Revenue');
  const [voucherDesc, setVoucherDesc] = useState('');
  const [voucherGross, setVoucherGross] = useState<number>(0);
  const [voucherTdsRate, setVoucherTdsRate] = useState<number>(0);
  const [voucherVdsRate, setVoucherVdsRate] = useState<number>(0);
  const [voucherRetentionRate, setVoucherRetentionRate] = useState<number>(0);

  // ইউজার অ্যাড মোডাল
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Business Partner');
  const [newUserPassword, setNewUserPassword] = useState('pass123');
  const [newUserAccountsAccess, setNewUserAccountsAccess] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('udp_erp_users_v3');
    if (savedUsers) {
      try { setUsersList(JSON.parse(savedUsers)); } catch (e) { console.error(e); }
    } else {
      const initial = generateInitialUsers();
      setUsersList(initial);
      localStorage.setItem('udp_erp_users_v3', JSON.stringify(initial));
    }

    const savedLeads = localStorage.getItem('udp_crm_leads');
    if (savedLeads) {
      try { setLeads(JSON.parse(savedLeads)); } catch (e) { console.error(e); }
    }

    const savedVisits = localStorage.getItem('udp_crm_visits');
    if (savedVisits) {
      try { setVisits(JSON.parse(savedVisits)); } catch (e) { console.error(e); }
    }

    const savedReqs = localStorage.getItem('udp_materials_req');
    if (savedReqs) {
      try { setRequisitions(JSON.parse(savedReqs)); } catch (e) { console.error(e); }
    }

    const savedTxns = localStorage.getItem('udp_erp_txns');
    if (savedTxns) {
      try { setTransactions(JSON.parse(savedTxns)); } catch (e) { console.error(e); }
    }

    const activeSession = localStorage.getItem('udp_active_session');
    if (activeSession) {
      try { setCurrentUser(JSON.parse(activeSession)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveUsers = (list: UserProfile[]) => {
    setUsersList(list);
    localStorage.setItem('udp_erp_users_v3', JSON.stringify(list));
  };

  const saveLeads = (list: LeadItem[]) => {
    setLeads(list);
    localStorage.setItem('udp_crm_leads', JSON.stringify(list));
  };

  const saveVisits = (list: SiteVisitMeeting[]) => {
    setVisits(list);
    localStorage.setItem('udp_crm_visits', JSON.stringify(list));
  };

  const saveRequisitions = (list: MaterialRequisition[]) => {
    setRequisitions(list);
    localStorage.setItem('udp_materials_req', JSON.stringify(list));
  };

  const triggerWhatsApp = (phone: string, text: string) => {
    const formatted = phone.replace(/[^0-9]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const visiblePartners = useMemo(() => {
    if (!currentUser) return [];
    const userWeight = ROLE_HIERARCHY[currentUser.role] || 0;
    if (['Super Admin', 'Chairman', 'Managing Director'].includes(currentUser.role)) return usersList;
    if (currentUser.role === 'General Manager') {
      return usersList.filter(u => !['Super Admin', 'Chairman', 'Managing Director'].includes(u.role));
    }
    if (['DGM', 'AGM', 'Team Leader', 'Business Partner'].includes(currentUser.role)) {
      return usersList.filter(u => ROLE_HIERARCHY[u.role] < userWeight || u.id === currentUser.id);
    }
    if (currentUser.role === 'Agent') return usersList.filter(u => u.role === 'Agent' || u.id === currentUser.id);
    if (currentUser.role === 'Customer') return usersList.filter(u => u.id === currentUser.id);
    return usersList.filter(u => u.id === currentUser.id);
  }, [currentUser, usersList]);

  // নতুন লিড যোগ করা
  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: LeadItem = {
      id: `LD-${Math.floor(100 + Math.random() * 900)}`,
      name: leadName.trim(),
      phone: leadPhone.trim(),
      email: leadEmail.trim(),
      source: leadSource,
      interestedProject: leadProject,
      score: leadScore,
      stage: 'New Lead',
      assignedTo: currentUser?.name || 'MOHAMMAD ATIQUL ISLAM',
      notes: leadNotes.trim(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newL, ...leads];
    saveLeads(updated);
    triggerWhatsApp(
      MASTER_PHONE,
      `*New CRM Lead Added*\nName: ${newL.name}\nPhone: ${newL.phone}\nProject: ${newL.interestedProject}\nScore: ${newL.score}\nAssigned: ${newL.assignedTo}`
    );
    setLeadName(''); setLeadPhone(''); setLeadEmail(''); setLeadNotes('');
    setShowAddLeadModal(false);
    alert('নতুন লিড সফলভাবে ডাটাবেজে যুক্ত হয়েছে!');
  };

  // নতুন সাইট ভিজিট শিডিউল
  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const newV: SiteVisitMeeting = {
      id: `SVM-${Math.floor(100 + Math.random() * 900)}`,
      clientName: visitClient.trim(),
      clientPhone: visitPhone.trim(),
      type: visitType,
      projectName: visitProject,
      dateTime: visitDateTime,
      coordinator: currentUser?.name || 'MOHAMMAD ATIQUL ISLAM',
      status: 'Scheduled',
      feedback: visitFeedback.trim()
    };
    const updated = [newV, ...visits];
    saveVisits(updated);
    triggerWhatsApp(
      newV.clientPhone,
      `*UNITY DREAM PROPERTIES LTD. Invitation*\nসম্মানিত ${newV.clientName},\nআপনার ${newV.type} নির্ধারিত হয়েছে:\nপ্রকল্প: ${newV.projectName}\nতারিখ ও সময়: ${newV.dateTime}\nসমন্বয়কারী: ${newV.coordinator}\nহেল্পলাইন: ${MASTER_PHONE}`
    );
    setVisitClient(''); setVisitPhone(''); setVisitDateTime(''); setVisitFeedback('');
    setShowAddVisitModal(false);
    alert('ভিজিট / মিটিং শিডিউল সফলভাবে সম্পন্ন হয়েছে!');
  };

  // নতুন মেটেরিয়াল রিকুইজিশন
  const handleAddRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const newR: MaterialRequisition = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      projectName: reqProject,
      itemType: reqItem,
      requestedQty: reqQty,
      unit: reqUnit,
      estimatedCost: reqCost,
      status: 'Pending',
      requestedBy: currentUser?.name || 'Site Engineer',
      requestDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newR, ...requisitions];
    saveRequisitions(updated);
    triggerWhatsApp(
      MASTER_PHONE,
      `*Site Material Requisition Alert*\nProject: ${newR.projectName}\nItem: ${newR.itemType} (${newR.requestedQty} ${newR.unit})\nEst. Cost: ${newR.estimatedCost.toLocaleString('bn-BD')} BDT\nBy: ${newR.requestedBy}`
    );
    setReqQty(1); setReqCost(0);
    setShowAddReqModal(false);
    alert('মেটেরিয়াল রিকুইজিশন সাবমিট করা হয়েছে এবং অ্যাডমিনকে অ্যালার্ট পাঠানো হয়েছে!');
  };

  // লিড স্টেজ আপডেট
  const updateLeadStage = (id: string, stage: LeadItem['stage']) => {
    const updated = leads.map(l => l.id === id ? { ...l, stage } : l);
    saveLeads(updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usersList.find(u => u.email.trim().toLowerCase() === loginEmail.trim().toLowerCase());
    if (!user) { alert('ইমেইলটি সঠিক নয় অথবা অ্যাকাউন্ট পাওয়া যায়নি!'); return; }
    if (user.password && user.password !== loginPassword) { alert('পাসওয়ার্ড ভুল হয়েছে!'); return; }
    if (user.status === 'Blocked') { alert('আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে!'); return; }
    setCurrentUser(user);
    localStorage.setItem('udp_active_session', JSON.stringify(user));
    setAuthModal(null); setLoginEmail(''); setLoginPassword('');
    alert(`স্বাগতম ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('udp_active_session');
    setShowERP(false);
    setAccountMenuOpen(false);
    alert('লগআউট সম্পন্ন হয়েছে।');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* ১. হেডার ও মেনুবার */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            <div className="flex items-center gap-3 shrink-0 mr-4">
              <img 
                src="/logo.jpg" 
                alt="Unity Dream Properties" 
                className="h-11 sm:h-12 w-auto object-contain rounded"
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
              />
              <div className="flex flex-col justify-center">
                <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap">
                  UNITY DREAM PROPERTIES
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 tracking-wide">
                  <span className="hidden sm:inline">BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি:</span>
                  <span className="sm:hidden">বিটিএম পার্টনার অফ PPL</span>
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-700 ml-4">
              <a href="#home" className="hover:text-emerald-600 transition-colors">Home</a>
              <a href="#management" className="hover:text-emerald-600 transition-colors">Management</a>
              <a href="#for-sale" className="hover:text-emerald-600 transition-colors whitespace-nowrap">For Sale</a>
              <a href="#roommates" className="hover:text-emerald-600 transition-colors">Roommates</a>
              <a href="#jobs" className="hover:text-emerald-600 transition-colors">Jobs</a>
              <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button 
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 sm:px-4 py-2 rounded-lg border border-emerald-200 text-xs font-bold transition-all whitespace-nowrap"
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
                          <span>📊</span> রিয়েল এস্টেট ERP ড্যাশবোর্ড
                        </button>
                        <button 
                          onClick={handleLogout}
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
                          <span>🔑</span> Login (লগইন)
                        </button>
                        <button 
                          onClick={() => { setAuthModal('register'); setAccountMenuOpen(false); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-800 flex items-center gap-2 font-bold"
                        >
                          <span>📝</span> Create Account (নতুন অ্যাকাউন্ট)
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ২. কেন্দ্রীয় ক্লাউড ERP ব্যানার */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                সেন্ট্রাল ক্লাউড ডাটাবেজ সংযুক্ত (অনলাইন সিংকিং সক্রিয়)
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Unity Dream Properties — সেন্ট্রাল একাউন্টিং, CRM, প্রজেক্ট ও রিয়েল এস্টেট ERP
              </h2>
            </div>
            
            <div>
              <button 
                onClick={() => {
                  if (!currentUser) {
                    alert('অনুগ্রহ করে আগে লগইন করুন!');
                    setAuthModal('login');
                    return;
                  }
                  setShowERP(!showERP);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>{showERP ? 'ERP বন্ধ করুন' : 'সেন্ট্রাল ERP ও একাউন্টিং খুলুন'}</span>
              </button>
            </div>
          </div>

          {/* ২.১ কোর একাউন্টস ও CRM ইআরপি */}
          {showERP && currentUser && (
            <div className="mt-6 pt-6 border-t border-slate-700/80 bg-slate-950/95 p-5 rounded-xl">
              
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 mb-5">
                <button 
                  onClick={() => setActiveTab('partner_list')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'partner_list' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  ⭐ পার্টনার লিস্ট
                </button>

                <button 
                  onClick={() => setActiveTab('crm_leads')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'crm_leads' ? 'bg-sky-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 CRM ও লিড পাইপলাইন
                </button>

                <button 
                  onClick={() => setActiveTab('visits_scheduling')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'visits_scheduling' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  🗓️ সাইট ভিজিট ও মিটিং শিডিউলার
                </button>

                <button 
                  onClick={() => setActiveTab('materials_req')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'materials_req' ? 'bg-amber-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  📦 র মেটেরিয়ালস ও সাইট রিকুইজিশন
                </button>

                {(currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                  <>
                    <button 
                      onClick={() => setActiveTab('journal_ledger')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'journal_ledger' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      📒 জেনারেল জার্নাল (GL)
                    </button>

                    <button 
                      onClick={() => setActiveTab('project_costing')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'project_costing' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      🏗️ প্রজেক্ট কস্টিং ও WIP
                    </button>

                    <button 
                      onClick={() => setActiveTab('ar_installments')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'ar_installments' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      👥 কাস্টমার কিস্তি (AR)
                    </button>

                    <button 
                      onClick={() => setActiveTab('balance_sheet')}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeTab === 'balance_sheet' ? 'bg-emerald-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      📈 ব্যালেন্স শীট ও ক্যাশফ্লো
                    </button>
                  </>
                )}

                {currentUser.isSuperAdmin && (
                  <button 
                    onClick={() => setActiveTab('admin_users')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'admin_users' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    👑 ইউজার ডাটাবেজ ও পারমিশন
                  </button>
                )}
              </div>

              {/* TAB 1: পার্টনার লিস্ট */}
              {activeTab === 'partner_list' && (
                <div className="text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400">⭐ পার্টনার ও টিম পারফরম্যান্স নেটওয়ার্ক</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">আপনার পদবী: <strong className="text-white">{currentUser.role}</strong></p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">আইডি ও নাম</th>
                          <th className="py-2.5 px-3">পদবী (Role)</th>
                          <th className="py-2.5 px-3">মোবাইল</th>
                          <th className="py-2.5 px-3 text-right">ব্যক্তিগত সেলস</th>
                          <th className="py-2.5 px-3 text-right">কমিশন</th>
                          <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                          <th className="py-2.5 px-3 text-center">ডিটেইলস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {visiblePartners.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-900/60">
                            <td className="py-3 px-3">
                              <span className="font-bold text-white block">{user.name}</span>
                              <span className="font-mono text-emerald-400 text-[10px]">{user.id}</span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-200">{user.role}</td>
                            <td className="py-3 px-3 font-mono">{user.phone}</td>
                            <td className="py-3 px-3 text-right font-bold text-emerald-400">{user.salesKatha} কাঠা</td>
                            <td className="py-3 px-3 text-right font-bold text-amber-400">{user.totalEarnings.toLocaleString('bn-BD')} ৳</td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                user.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button 
                                onClick={() => setViewDetailsUser(user)}
                                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-2.5 py-1 rounded border border-slate-700 text-[11px]"
                              >
                                বিস্তারিত
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: CRM ও লিড পাইপলাইন */}
              {activeTab === 'crm_leads' && (
                <div className="text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-sky-400">🎯 লিড ম্যানেজমেন্ট, স্কোরিং ও সেলস পাইপলাইন</h4>
                      <p className="text-slate-400 text-[11px]">সম্ভাব্য ক্রেতাদের ফলোআপ, লিড স্কোরিং (Hot/Warm/Cold) এবং স্টেজ ট্র্যাকিং।</p>
                    </div>
                    <button 
                      onClick={() => setShowAddLeadModal(true)}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded shadow text-xs flex items-center gap-1.5"
                    >
                      <span>➕</span> নতুন লিড যুক্ত করুন
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">নাম ও ফোন</th>
                          <th className="py-2.5 px-3">উৎস</th>
                          <th className="py-2.5 px-3">আগ্রহের প্রকল্প</th>
                          <th className="py-2.5 px-3 text-center">লিড স্কোর</th>
                          <th className="py-2.5 px-3">বর্তমান পর্যায় (Stage)</th>
                          <th className="py-2.5 px-3">দায়িত্বপ্রাপ্ত</th>
                          <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {leads.map((ld) => (
                          <tr key={ld.id} className="hover:bg-slate-900/50">
                            <td className="py-3 px-3">
                              <span className="font-bold text-white block">{ld.name}</span>
                              <span className="font-mono text-slate-400 text-[10px]">{ld.phone}</span>
                            </td>
                            <td className="py-3 px-3">{ld.source}</td>
                            <td className="py-3 px-3 text-emerald-400 font-semibold">{ld.interestedProject}</td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                ld.score === 'Hot' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                                ld.score === 'Warm' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {ld.score}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <select 
                                value={ld.stage}
                                onChange={(e) => updateLeadStage(ld.id, e.target.value as LeadItem['stage'])}
                                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                              >
                                <option value="New Lead">New Lead</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Site Visit Planned">Site Visit Planned</option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Booked">Booked (বিক্রয় নিশ্চিত)</option>
                                <option value="Lost">Lost</option>
                              </select>
                            </td>
                            <td className="py-3 px-3 text-slate-400">{ld.assignedTo}</td>
                            <td className="py-3 px-3 text-center">
                              <button 
                                onClick={() => triggerWhatsApp(ld.phone, `আসসালামু আলাইকুম ${ld.name}! ইউনিটি ড্রিম প্রপার্টিজ থেকে যোগাযোগ করা হচ্ছে।`)}
                                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2 py-1 rounded text-[11px] font-bold"
                              >
                                WhatsApp
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: সাইট ভিজিট ও মিটিং শিডিউলার */}
              {activeTab === 'visits_scheduling' && (
                <div className="text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-purple-400">🗓️ প্রজেক্ট সাইট ভিজিট ও অফিস মিটিং শিডিউলার</h4>
                      <p className="text-slate-400 text-[11px]">ক্লায়েন্টদের সাথে সাইট পরিদর্শন এবং আলোচনা সেশনের ক্যালেন্ডার লগ।</p>
                    </div>
                    <button 
                      onClick={() => setShowAddVisitModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded shadow text-xs flex items-center gap-1.5"
                    >
                      <span>➕</span> নতুন শিডিউল যোগ করুন
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">ক্লায়েন্টের নাম ও মোবাইল</th>
                          <th className="py-2.5 px-3">ধরন</th>
                          <th className="py-2.5 px-3">প্রকল্প</th>
                          <th className="py-2.5 px-3">তারিখ ও সময়</th>
                          <th className="py-2.5 px-3">সমন্বয়কারী</th>
                          <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                          <th className="py-2.5 px-3 text-center">রিমাইন্ডার</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {visits.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-900/50">
                            <td className="py-3 px-3">
                              <span className="font-bold text-white block">{v.clientName}</span>
                              <span className="font-mono text-slate-400 text-[10px]">{v.clientPhone}</span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-purple-400">{v.type}</td>
                            <td className="py-3 px-3">{v.projectName}</td>
                            <td className="py-3 px-3 font-mono text-amber-400">{v.dateTime}</td>
                            <td className="py-3 px-3 text-slate-400">{v.coordinator}</td>
                            <td className="py-3 px-3 text-center">
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                {v.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button 
                                onClick={() => triggerWhatsApp(v.clientPhone, `*UNITY DREAM PROPERTIES Reminder*\nসম্মানিত ${v.clientName}, আপনার ${v.type} সিডিউল: ${v.dateTime} (${v.projectName})।`)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-[11px] font-bold"
                              >
                                রিমাইন্ডার পাঠান
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: র মেটেরিয়ালস ও সাইট রিকুইজিশন */}
              {activeTab === 'materials_req' && (
                <div className="text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-amber-400">📦 র মেটেরিয়ালস স্টক ও কনস্ট্রাকশন সাইট রিকুইজিশন</h4>
                      <p className="text-slate-400 text-[11px]">সাইট ইঞ্জিনিয়ারদের মালামালের চাহিদা অনুমোদন ও স্টক ট্র্যাকিং।</p>
                    </div>
                    <button 
                      onClick={() => setShowAddReqModal(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded shadow text-xs flex items-center gap-1.5"
                    >
                      <span>➕</span> নতুন রিকুইজিশন পাঠান
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/80">
                          <th className="py-2.5 px-3">প্রকল্পের নাম</th>
                          <th className="py-2.5 px-3">মালামালের আইটেম</th>
                          <th className="py-2.5 px-3 text-right">পরিমাণ</th>
                          <th className="py-2.5 px-3 text-right">আনুমানিক খরচ</th>
                          <th className="py-2.5 px-3">রিকুইজিশনকারী</th>
                          <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {requisitions.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-900/50">
                            <td className="py-3 px-3 font-bold text-white">{r.projectName}</td>
                            <td className="py-3 px-3 text-amber-300 font-semibold">{r.itemType}</td>
                            <td className="py-3 px-3 text-right font-bold text-white">{r.requestedQty} {r.unit}</td>
                            <td className="py-3 px-3 text-right font-bold text-emerald-400">{r.estimatedCost.toLocaleString('bn-BD')} ৳</td>
                            <td className="py-3 px-3 text-slate-400">{r.requestedBy} ({r.requestDate})</td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                r.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: জেনারেল জার্নাল */}
              {activeTab === 'journal_ledger' && (currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                <div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (voucherGross <= 0) return;
                    const matchedProject = projectsData.find(p => p.id === voucherProjectId);
                    const matchedAccount = INITIAL_COA.find(c => c.code === voucherAccountCode);
                    const tds = (voucherGross * voucherTdsRate) / 100;
                    const vds = (voucherGross * voucherVdsRate) / 100;
                    const retention = (voucherGross * voucherRetentionRate) / 100;
                    const net = voucherType === 'Debit' ? voucherGross - (tds + vds + retention) : voucherGross;

                    const newTxn: ERPTransaction = {
                      id: `TXN-${Date.now().toString().slice(-4)}`,
                      voucherNo: `VR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                      date: new Date().toISOString().split('T')[0],
                      projectId: voucherProjectId,
                      projectName: matchedProject?.name || 'General Project',
                      accountCode: voucherAccountCode,
                      accountName: matchedAccount?.name || 'General Expense',
                      type: voucherType,
                      category: voucherCategory,
                      description: voucherDesc.trim() || `${voucherCategory} Transaction`,
                      grossAmount: voucherGross,
                      tdsAmount: tds,
                      vdsAmount: vds,
                      retentionAmount: retention,
                      netAmount: net,
                      recordedBy: currentUser.name
                    };

                    const updated = [newTxn, ...transactions];
                    setTransactions(updated);
                    localStorage.setItem('udp_erp_txns', JSON.stringify(updated));
                    triggerWhatsApp(MASTER_PHONE, `*New Voucher Alert*\nNo: ${newTxn.voucherNo}\nNet: ${newTxn.netAmount} BDT`);
                    setVoucherDesc(''); setVoucherGross(0);
                    alert('ভাউচার সফলভাবে যুক্ত হয়েছে!');
                  }} className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 text-xs">
                    <h4 className="text-sm font-bold text-amber-400 mb-3">✍️ ভাউচার এন্ট্রি (জার্নাল ও লেজার)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">প্রকল্প</label>
                        <select value={voucherProjectId} onChange={(e) => setVoucherProjectId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white">
                          {projectsData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">ধরন</label>
                        <select value={voucherType} onChange={(e) => setVoucherType(e.target.value as 'Debit' | 'Credit')} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold">
                          <option value="Credit">Credit (আয়)</option>
                          <option value="Debit">Debit (ব্যয়)</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-slate-400 block mb-1">মোট বিল (Gross ৳)</label>
                        <input type="number" required min="1" value={voucherGross || ''} onChange={(e) => setVoucherGross(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-bold text-amber-400" />
                      </div>
                    </div>
                    <div className="mt-3 text-right">
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded text-xs shadow">ভাউচার সেভ করুন</button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: ব্যালেন্স শীট ও ট্রেজারি */}
              {activeTab === 'balance_sheet' && (currentUser.hasAccountsAccess || currentUser.isSuperAdmin) && (
                <div className="text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block font-semibold">ক্যাশ ব্যালেন্স ও লিকুইড এসেট</span>
                      <span className="text-2xl font-black text-teal-400 mt-1 block">
                        {(transactions.filter(t => t.type === 'Credit').reduce((a, b) => a + b.netAmount, 0) - transactions.filter(t => t.type === 'Debit').reduce((a, b) => a + b.netAmount, 0)).toLocaleString('bn-BD')} ৳
                      </span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block font-semibold">গ্রাহকদের মোট কিস্তি বকেয়া</span>
                      <span className="text-2xl font-black text-sky-400 mt-1 block">
                        {receivables.reduce((acc, r) => acc + r.dueAmount, 0).toLocaleString('bn-BD')} ৳
                      </span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block font-semibold">মোট বিক্রয় রেভিনিউ</span>
                      <span className="text-2xl font-black text-amber-400 mt-1 block">
                        {transactions.filter(t => t.type === 'Credit').reduce((acc, t) => acc + t.grossAmount, 0).toLocaleString('bn-BD')} ৳
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: সুপার এডমিন ইউজার ডাটাবেজ কন্ট্রোল */}
              {activeTab === 'admin_users' && currentUser.isSuperAdmin && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-red-400">👑 ইউজার ডাটাবেজ ও পারমিশন কন্ট্রোল</h4>
                    <button onClick={() => setShowAddUserModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded shadow text-xs">➕ নতুন ইউজার</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-3">নাম</th>
                          <th className="py-2.5 px-3">পদবী</th>
                          <th className="py-2.5 px-3">মোবাইল</th>
                          <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                          <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {usersList.map((user) => (
                          <tr key={user.id}>
                            <td className="py-2.5 px-3 font-bold text-white">{user.name}</td>
                            <td className="py-2.5 px-3">{user.role}</td>
                            <td className="py-2.5 px-3 font-mono">{user.phone}</td>
                            <td className="py-2.5 px-3 text-center">{user.status}</td>
                            <td className="py-2.5 px-3 text-center">
                              <button onClick={() => setEditUserModal(user)} className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] mr-1">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </section>

      {/* ৩. প্রজেক্টস শোকেস */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-1.5 bg-emerald-600 rounded"></span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">আমাদের অনুমোদিত ও পার্টনার প্রজেক্টসমূহ</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project) => (
            <div key={project.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <img src={project.image} alt={project.name} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs text-slate-500 font-semibold">{project.developer}</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{project.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">📍 {project.location}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
                    <span className="font-bold text-xs text-slate-800">{project.size}</span>
                    <span className="font-extrabold text-sm text-emerald-700">{project.price}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button onClick={() => setSelectedProjectForTerms(project)} className="w-full text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200">
                  বিস্তারিত ও বুকিং শর্তাবলী
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ৪. CRM লিড তৈরি মোডাল */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">🎯 নতুন লিড যুক্ত করুন (CRM)</h3>
            <form onSubmit={handleAddLead} className="space-y-3">
              <input type="text" required placeholder="কাস্টমারের পূর্ণ নাম *" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full border rounded p-2" />
              <input type="tel" required placeholder="মোবাইল নম্বর *" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} className="w-full border rounded p-2" />
              <input type="email" placeholder="ইমেইল (ঐচ্ছিক)" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="w-full border rounded p-2" />
              <div className="grid grid-cols-2 gap-2">
                <select value={leadSource} onChange={(e) => setLeadSource(e.target.value as LeadItem['source'])} className="border rounded p-2">
                  <option value="Facebook Ad">Facebook Ad</option>
                  <option value="Reference">Reference</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Website">Website</option>
                </select>
                <select value={leadScore} onChange={(e) => setLeadScore(e.target.value as LeadItem['score'])} className="border rounded p-2 font-bold text-rose-600">
                  <option value="Hot">Hot (জরুরী/ক্রয়প্রত্যাশী)</option>
                  <option value="Warm">Warm (আগ্রহী)</option>
                  <option value="Cold">Cold (তথ্য অনুসন্ধান)</option>
                </select>
              </div>
              <textarea placeholder="কাস্টমারের চাহিদা ও নোট..." value={leadNotes} onChange={(e) => setLeadNotes(e.target.value)} className="w-full border rounded p-2"></textarea>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="px-3 py-1.5 border rounded">বাতিল</button>
                <button type="submit" className="bg-sky-600 text-white font-bold px-4 py-1.5 rounded">লিড সেভ করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ৫. সাইট ভিজিট শিডিউল মোডাল */}
      {showAddVisitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">🗓️ সাইট ভিজিট / মিটিং শিডিউলার</h3>
            <form onSubmit={handleAddVisit} className="space-y-3">
              <input type="text" required placeholder="ক্লায়েন্টের নাম *" value={visitClient} onChange={(e) => setVisitClient(e.target.value)} className="w-full border rounded p-2" />
              <input type="tel" required placeholder="মোবাইল নম্বর *" value={visitPhone} onChange={(e) => setVisitPhone(e.target.value)} className="w-full border rounded p-2" />
              <select value={visitType} onChange={(e) => setVisitType(e.target.value as SiteVisitMeeting['type'])} className="w-full border rounded p-2 font-bold">
                <option value="Site Visit">Site Visit (প্রকল্প এলাকা পরিদর্শন)</option>
                <option value="Office Meeting">Office Meeting (কর্পোরেট অফিসে মিটিং)</option>
                <option value="Online Call">Online Call</option>
              </select>
              <input type="text" required placeholder="তারিখ ও সময় (যেমন: 15 Oct 11:00 AM) *" value={visitDateTime} onChange={(e) => setVisitDateTime(e.target.value)} className="w-full border rounded p-2" />
              <input type="text" placeholder="বিশেষ নোট (গাড়ির ব্যবস্থা, পিকআপ ইত্যাদি)" value={visitFeedback} onChange={(e) => setVisitFeedback(e.target.value)} className="w-full border rounded p-2" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddVisitModal(false)} className="px-3 py-1.5 border rounded">বাতিল</button>
                <button type="submit" className="bg-purple-600 text-white font-bold px-4 py-1.5 rounded">শিডিউল কনফার্ম</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ৬. র মেটেরিয়াল রিকুইজিশন মোডাল */}
      {showAddReqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">📦 কনস্ট্রাকশন মেটেরিয়াল রিকুইজিশন</h3>
            <form onSubmit={handleAddRequisition} className="space-y-3">
              <select value={reqProject} onChange={(e) => setReqProject(e.target.value)} className="w-full border rounded p-2">
                {projectsData.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <select value={reqItem} onChange={(e) => setReqItem(e.target.value as MaterialRequisition['itemType'])} className="w-full border rounded p-2 font-bold">
                <option value="রড (Rod 72G)">রড (Rod 72G)</option>
                <option value="সিমেন্ট (Cement)">সিমেন্ট (Cement)</option>
                <option value="সিলেট বালু (Sand)">সিলেট বালু (Sand)</option>
                <option value="ইট (Bricks)">ইট (Bricks)</option>
                <option value="পাথর (Stone Chips)">পাথর (Stone Chips)</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" min="1" required placeholder="পরিমাণ" value={reqQty} onChange={(e) => setReqQty(Number(e.target.value))} className="border rounded p-2" />
                <select value={reqUnit} onChange={(e) => setReqUnit(e.target.value as MaterialRequisition['unit'])} className="border rounded p-2">
                  <option value="Ton">Ton</option>
                  <option value="Bags">Bags</option>
                  <option value="CFT">CFT</option>
                  <option value="Pcs">Pcs</option>
                </select>
              </div>
              <input type="number" required placeholder="আনুমানিক বাজেট/খরচ (৳)" value={reqCost || ''} onChange={(e) => setReqCost(Number(e.target.value))} className="w-full border rounded p-2 font-bold text-emerald-700" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddReqModal(false)} className="px-3 py-1.5 border rounded">বাতিল</button>
                <button type="submit" className="bg-amber-600 text-white font-bold px-4 py-1.5 rounded">রিকুইজিশন পাঠান</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ৭. ফুটার */}
      <footer id="contact" className="w-full bg-slate-900 border-t border-slate-800 py-10 text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-center">
          <p>© 2026 Unity Dream Properties | BTM পার্টনার অফ পুষ্পধারা প্রপার্টিজ লি: | হেল্পলাইন: {MASTER_PHONE}</p>
        </div>
      </footer>

      {/* ৮. লগইন মোডাল */}
      {authModal === 'login' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-xs">
            <h3 className="font-bold text-base text-slate-900 mb-4">LOGIN TO PORTAL</h3>
            <form onSubmit={handleLogin} className="space-y-3">
              <input type="email" required placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full border rounded p-2" />
              <input type="password" required placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full border rounded p-2" />
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded">Login</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}