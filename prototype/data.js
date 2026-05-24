// Database Schemas, Seeds, and Storage Helpers

const defaultNews = [
  { id: 1, title: "New Solar Water Pump Commissioned in Ward 4", desc: "Under the Gram Panchayat Solarization scheme, a new 5HP solar-powered water pump was successfully installed today.", date: "22 May 2026", category: "Infrastructure" },
  { id: 2, title: "Free Soil Testing & Crop Advisory Seminar", desc: "Agricultural officers from the Krishi Vigyan Kendra will organize a training camp tomorrow at the Panchayat Hall.", date: "21 May 2026", category: "Agriculture" },
  { id: 3, title: "Village Primary School Renovation Complete", desc: "Our primary school completed its infrastructural upgrade this week. Renovations include fresh exterior painting.", date: "19 May 2026", category: "Education" },
  { id: 4, title: "[GOVT] Mega Job Fair for Rural Youth", desc: "State Govt is organizing a massive employment drive for youth (18-35 yrs). Several IT and manufacturing companies will be hiring directly.", date: "Auto-Updated", category: "Youth/Jobs" },
  { id: 5, title: "[GOVT] Free Laptops for Merit Students", desc: "Applications are now open for the state student laptop distribution scheme for those securing 80%+ in board exams.", date: "Auto-Updated", category: "Education" },
  { id: 6, title: "[GOVT] Kisan Credit Card Limit Increased", desc: "The Ministry of Agriculture has officially increased the collateral-free KCC loan limit for farmers up to ₹2 Lakhs.", date: "Auto-Updated", category: "Agriculture" }
];

const defaultNotices = [
  { id: 1, title: "Children's Polio Immunization Camp", desc: "Special health desk for pediatric polio vaccination drops will be open at the Health Sub-Centre.", date: "22 May 2026", type: "high" },
  { id: 2, title: "Scheduled Grid Power Outage", desc: "Substation transformer maintenance work will take place on May 24. Expect power supply disruption.", date: "22 May 2026", type: "warning" },
  { id: 3, title: "Annual Gram Sabha General Assembly", desc: "Budget allocations discussion for solar street lamps and water pipeline extensions.", date: "20 May 2026", type: "info" }
];

const defaultSchemes = [
  { id: 1, title: "PM-KISAN Samman Nidhi Yojana", dept: "Ministry of Agriculture & Farmers Welfare", benefit: "Direct Income support of ₹6,000 per year transferred in three equal installments.", eligibility: "Small and marginal landholding farmer families.", docs: "Aadhaar Card, Land Registry Record, Bank Account." },
  { id: 2, title: "Pradhan Mantri Awas Yojana - Gramin", dept: "Ministry of Rural Development", benefit: "Financial housing grant of ₹1.2 Lakh for constructing a permanent masonry house.", eligibility: "Homeless households or families in Kutcha houses.", docs: "Aadhaar Card, BPL Card, MGNREGA Job Card." },
  { id: 3, title: "Ayushman Bharat PM-JAY Health Insurance", dept: "Ministry of Health & Family Welfare", benefit: "Cashless hospitalization cover up to ₹5 Lakh per family per year.", eligibility: "Low-income households listed under SECC database.", docs: "Aadhaar Card, Ration Card, Golden Card." },
  { id: 4, title: "MGNREGA Wage Job Card Scheme", dept: "Ministry of Rural Development", benefit: "Guaranteed 100 days of manual wage employment in a year for local village works.", eligibility: "Any adult member of a rural household willing to do manual labor.", docs: "Aadhaar Card, Bank Account Details, Address Proof." },
  { id: 5, title: "PM Kaushal Vikas Yojana (PMKVY)", dept: "Ministry of Skill Development", benefit: "Free short-term industry skill training and job placement assistance for unemployed youth.", eligibility: "Unemployed youth and school/college dropouts.", docs: "Aadhaar Card, Bank Account, 10th/12th Marksheet." },
  { id: 6, title: "National Means-cum-Merit Scholarship", dept: "Ministry of Education", benefit: "Financial assistance of ₹12,000 per annum to meritorious students.", eligibility: "Students studying in class 9 to 12 in Govt schools with parental income below ₹3.5 Lakh.", docs: "Income Certificate, Aadhaar Card, School ID." },
  { id: 7, title: "PM Fasal Bima Yojana (Crop Insurance)", dept: "Ministry of Agriculture", benefit: "Comprehensive insurance cover against failure of crops due to natural calamities.", eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops.", docs: "Land Details, Sowing Certificate, Bank Account." }
];

const defaultContacts = [
  { name: "Primary Health Sub-Center", role: "Medical Emergencies", phone: "+91 12345 67890" },
  { name: "Gram Panchayat Secretary", role: "Administrative Office", phone: "+91 98765 43210" },
  { name: "Kisan Call Center", role: "Agricultural Advisory", phone: "1800-180-1551" },
  { name: "Village Veterinary Clinic", role: "Livestock & Animal Care", phone: "+91 55566 77788" },
  { name: "Electricity Board Substation", role: "Power Cut complaints", phone: "1912" },
  { name: "Women & Child Helpline", role: "Social Safety Cell", phone: "1091" }
];

const defaultComplaints = [
  { id: "GRV-3841", username: "Devendra Patel", ward: 4, category: "Streetlights", desc: "The main street lamp near Ward 4 public well has been damaged.", status: "progress", date: "21 May 2026" },
  { id: "GRV-8422", username: "Sushma Sharma", ward: 2, category: "Water", desc: "Water leakage reported at the primary pipeline junction.", status: "resolved", date: "18 May 2026" }
];

const defaultLedgerMembers = [
  { name: "Amit Choudhary", profession: "Software Engineer", month: "May 2026", status: "Paid", amount: 200 },
  { name: "Sandeep Yadav", profession: "High School Teacher", month: "May 2026", status: "Paid", amount: 200 },
  { name: "Jyoti Maurya", profession: "Gramin Bank Associate", month: "May 2026", status: "Pending", amount: 200 },
  { name: "Rajat Tripathi", profession: "Railway Guard", month: "May 2026", status: "Paid", amount: 200 },
  { name: "Karan Johar", profession: "PHC Lab Assistant", month: "May 2026", status: "Pending", amount: 200 },
  { name: "Pooja Deshmukh", profession: "Post Office Inspector", month: "May 2026", status: "Paid", amount: 200 },
  { name: "Deepak Saini", profession: "Sub-Station Operator", month: "May 2026", status: "Paid", amount: 200 }
];

const defaultPoojas = [
  { id: 1, title: "Maha Shivratri Pooja 2026", category: "Festival/Pooja", spent: 18500, desc: "Decorations: ₹8,000, Prasadam distribution: ₹6,500, Audio/Light rental: ₹4,000.", status: "Active" },
  { id: 2, title: "Holi Color Carnival", category: "Festival/Pooja", spent: 6000, desc: "Natural organic colors purchase: ₹2,500, Sweets and refreshments: ₹3,500.", status: "Active" },
  { id: 3, title: "Ward 4 Water Pump Repair", category: "Utility Repair", spent: 4500, desc: "Replaced burnt motor coil and sealed broken PVC pipes.", status: "Active" }
];

// cSpell:disable
const defaultGallery = [
  { id: 1, title: "Maha Shivratri Temple decoration", tag: "Festival", src: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230f172a%22%2F%3E%3Cpath%20d%3D%22M200%2040%20L280%20180%20L120%20180%20Z%22%20fill%3D%22%23f59e0b%22%20opacity%3D%220.8%22%2F%3E%3Cpath%20d%3D%22M200%20180%20L200%20240%22%20stroke%3D%22%23f59e0b%22%20stroke-width%3D%2210%22%2F%3E%3Crect%20x%3D%22150%22%20y%3D%22210%22%20width%3D%22100%22%20height%3D%2240%22%20fill%3D%22%23d97706%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22110%22%20r%3D%2215%22%20fill%3D%22%23ef4444%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2290%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2394a3b8%22%3EMandir%20Pooja%20Celebration%3C%2Ftext%3E%3C%2Fsvg%3E" },
  { id: 2, title: "Paddy crop harvest in fields", tag: "Scenery", src: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23064e3b%22%2F%3E%3Ccircle%20cx%3D%22320%22%20cy%3D%2280%22%20r%3D%2230%22%20fill%3D%22%23fef08a%22%2F%3E%3Cpath%20d%3D%22M0%20200%20Q100%20150%20200%20200%20T400%20200%20L400%20300%20L0%20300%20Z%22%20fill%3D%22%23047857%22%2F%3E%3Cpath%20d%3D%22M0%20240%20Q120%20200%20240%20240%20T400%20240%20L400%20300%20L0%20300%20Z%22%20fill%3D%22%23059669%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2290%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23a7f3d0%22%3EVillage%20Farmlands%3C%2Ftext%3E%3C%2Fsvg%3E" },
  { id: 3, title: "Solar Water pump inauguration", tag: "Development", src: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%230f172a%22%2F%3E%3Crect%20x%3D%22140%22%20y%3D%2260%22%20width%3D%22120%22%20height%3D%22120%22%20rx%3D%228%22%20fill%3D%22%231e293b%22%20stroke%3D%22%2338bdf8%22%20stroke-width%3D%224%22%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%22100%22%20x2%3D%22260%22%20y2%3D%22100%22%20stroke%3D%22%2338bdf8%22%2F%3E%3Cline%20x1%3D%22140%22%20y1%3D%22140%22%20x2%3D%22260%22%20y2%3D%22140%22%20stroke%3D%22%2338bdf8%22%2F%3E%3Cline%20x1%3D%22200%22%20y1%3D%2260%22%20x2%3D%22200%22%20y2%3D%22180%22%20stroke%3D%22%2338bdf8%22%2F%3E%3Cpath%20d%3D%22M200%20180%20L200%20260%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%228%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2290%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2394a3b8%22%3ESolar%20Array%20Installation%3C%2Ftext%3E%3C%2Fsvg%3E" },
  { id: 4, title: "Organic colors holi gathering", tag: "Culture", src: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231e1b4b%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22130%22%20r%3D%2250%22%20fill%3D%22%23ec4899%22%20opacity%3D%220.7%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22150%22%20r%3D%2260%22%20fill%3D%22%233b82f6%22%20opacity%3D%220.7%22%2F%3E%3Ccircle%20cx%3D%22270%22%20cy%3D%22110%22%20r%3D%2245%22%20fill%3D%22%23eab308%22%20opacity%3D%220.7%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2290%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%23c7d2fe%22%3EPooja%20Festival%20Gathering%3C%2Ftext%3E%3C%2Fsvg%3E" }
];
// cSpell:enable

// LocalStorage Fetch Helpers
const getStoredData = (key, defaultValue) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') {
      try { localStorage.setItem(key, JSON.stringify(defaultValue)); } catch(e) {}
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Local storage parsing error for ${key}. Reverting to default.`);
    try { localStorage.setItem(key, JSON.stringify(defaultValue)); } catch(err) {}
    return defaultValue;
  }
};

const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save error:", e);
    alert("Browser Storage limit reached! Please delete some old gallery photos to free up space.");
  }
};

// Load datasets into application state
let news = getStoredData('gs_news', defaultNews);
let notices = getStoredData('gs_notices', defaultNotices);
let schemes = getStoredData('gs_schemes', defaultSchemes);
let contacts = getStoredData('gs_contacts', defaultContacts);
let complaints = getStoredData('gs_complaints', defaultComplaints);
let ledgerMembers = getStoredData('gs_ledger', defaultLedgerMembers);
let gallery = getStoredData('gs_gallery', defaultGallery);
let poojas = getStoredData('gs_poojas', defaultPoojas);
let baseFunds = parseInt(getStoredData('gs_base_funds', 36000)) || 0;
let manualPoojaSpent = parseInt(getStoredData('gs_manual_pooja', 0)) || 0;
let manualBankBalance = getStoredData('gs_manual_bank', null);
let showAllExpenses = false;
let villageUpiId = getStoredData('gs_upi_id', 'your_village_upi_id@bank');
let villageUpiName = getStoredData('gs_upi_name', 'GramSeva Village Fund');

// Fallback protections
news = (Array.isArray(news) ? news : defaultNews).filter(Boolean);
notices = (Array.isArray(notices) ? notices : defaultNotices).filter(Boolean);
schemes = (Array.isArray(schemes) ? schemes : defaultSchemes).filter(Boolean);
contacts = (Array.isArray(contacts) ? contacts : defaultContacts).filter(Boolean);
complaints = (Array.isArray(complaints) ? complaints : defaultComplaints).filter(Boolean);
ledgerMembers = (Array.isArray(ledgerMembers) ? ledgerMembers : defaultLedgerMembers).filter(Boolean);
gallery = (Array.isArray(gallery) ? gallery : defaultGallery).filter(Boolean);
poojas = (Array.isArray(poojas) ? poojas : defaultPoojas).filter(Boolean);

// Ensure unique IDs
news = news.map((item, idx) => ({ id: item.id || (Date.now() + idx), ...item }));
notices = notices.map((item, idx) => ({ id: item.id || (Date.now() + idx), ...item }));
schemes = schemes.map((item, idx) => ({ id: item.id || (Date.now() + idx), ...item }));
contacts = contacts.map((item, idx) => ({ id: item.id || (Date.now() + idx), ...item }));

saveStoredData('gs_news', news);
saveStoredData('gs_notices', notices);
saveStoredData('gs_schemes', schemes);
saveStoredData('gs_contacts', contacts);