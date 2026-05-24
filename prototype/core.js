// Core UI, Routing, Theme, Utilities and PDF Generation

const body = document.body;

const isTelugu = document.cookie.includes('googtrans=/en/te');

// Toast Notification System
const showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  
  toast.innerHTML = `<i data-lucide="${icon}"></i><span style="font-size: 13px; font-weight: 600;">${message}</span>`;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  requestAnimationFrame(() => toast.classList.add('show'));
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Authorization Helper
const requireAdmin = (action) => {
  if (localStorage.getItem('gs_role') !== 'admin') {
    alert("Unauthorized! Administrator privilege required.");
    return;
  }
  action();
};

// Theme Switching State and Setup
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const themeIcon = document.getElementById('theme-icon');
const themeIconMobile = document.getElementById('theme-icon-mobile');

const enableLightMode = () => {
  body.classList.add('light-mode');
  if (themeIcon) themeIcon.textContent = '🌙';
  if (themeIconMobile) themeIconMobile.textContent = '🌙';
  try { localStorage.setItem('theme', 'light'); } catch(e) {}
  if (window.lucide) window.lucide.createIcons();
};

const disableLightMode = () => {
  body.classList.remove('light-mode');
  if (themeIcon) themeIcon.textContent = '☀️';
  if (themeIconMobile) themeIconMobile.textContent = '☀️';
  try { localStorage.setItem('theme', 'dark'); } catch(e) {}
  if (window.lucide) window.lucide.createIcons();
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') enableLightMode();
else disableLightMode();

const toggleTheme = () => {
  if (body.classList.contains('light-mode')) disableLightMode();
  else enableLightMode();
  if (typeof renderComplianceChart === 'function') renderComplianceChart();
};

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// Single-Page Routing/View Switcher
const navItems = document.querySelectorAll('.nav-item');
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
const viewSections = document.querySelectorAll('.view-section');
const mainTitle = document.getElementById('main-view-title');
const mainSubtitle = document.getElementById('main-view-subtitle');

const viewTitles = {
  news: { title: "Village News & Notices", subtitle: "Announcements, newsletters, and general public notifications for villagers" },
  schemes: { title: "Government Welfare Schemes", subtitle: "Find details, eligibility requirements, and application procedures for state and central schemes" },
  utility: { title: "Water & Electricity Timings", subtitle: "Real-time updates on electrical supply grid status, voltage stabilization, and drinking water hours" },
  gallery: { title: "Village Gallery & Archives", subtitle: "Capture and browse cultural festivals, temple poojas, green landscapes, and development photos" },
  ledger: { title: "Youth Contribution Ledger", subtitle: "Transparency board tracking monthly ₹200 youth welfare funding and recent pooja expenditures" },
  payment: { title: "Payment Gateway", subtitle: "Securely pay your pending contributions via UPI, Cards, or Net Banking" },
  complaints: { title: "Village Grievance Box", subtitle: "Register local infrastructure issues or check statuses of previously submitted public complaints" },
  contacts: { title: "Emergency Directory Helpdesk", subtitle: "Quick access dialer to regional medical, electricity, administrative, and crop advisory helplines" }
};

const switchView = (targetViewId) => {
  navItems.forEach(item => item.classList.remove('active'));
  mobileNavItems.forEach(item => item.classList.remove('active'));
  document.querySelectorAll(`.nav-item[data-view="${targetViewId}"]`).forEach(el => el.classList.add('active'));
  document.querySelectorAll(`.mobile-nav-item[data-view="${targetViewId}"]`).forEach(el => el.classList.add('active'));

  viewSections.forEach(section => section.classList.remove('active'));
  const targetSection = document.getElementById(`${targetViewId}-view`);
  if (targetSection) targetSection.classList.add('active');

  if (viewTitles[targetViewId]) {
    mainTitle.textContent = viewTitles[targetViewId].title;
    mainSubtitle.textContent = viewTitles[targetViewId].subtitle;
  }

  document.querySelectorAll('.swipe-indicators .dot').forEach(dot => {
    if (dot.getAttribute('data-target') === targetViewId) dot.classList.add('active');
    else dot.classList.remove('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.lucide) window.lucide.createIcons();
};

navItems.forEach(item => item.addEventListener('click', () => switchView(item.getAttribute('data-view'))));

let lastMobileNavTap = 0;
mobileNavItems.forEach(item => item.addEventListener('click', () => {
  const viewId = item.getAttribute('data-view');
  if (viewId === 'news') {
    const now = new Date().getTime();
    if (now - lastMobileNavTap < 300) {
      if (confirm("Are you sure you want to leave the portal and return to the homepage?")) {
        window.location.href = 'index.html';
      }
      return;
    }
    lastMobileNavTap = now;
  }
  switchView(viewId);
}));
document.querySelectorAll('.swipe-indicators .dot').forEach(dot => dot.addEventListener('click', () => switchView(dot.getAttribute('data-target'))));

// Logo Branding Click Intercept
const logoBranding = document.querySelector('.logo-branding');
if (logoBranding) {
  logoBranding.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to leave the portal and return to the homepage?")) {
      window.location.href = logoBranding.getAttribute('href') || 'index.html';
    }
  });
}

// Sidebar Collapse Logic
const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (sidebarToggleBtn && sidebar && mainContent) {
  sidebarToggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
    if (window.innerWidth <= 1024 && sidebarOverlay) sidebarOverlay.classList.toggle('active', !sidebar.classList.contains('collapsed'));
  });
}
if (sidebarOverlay && sidebar && mainContent) {
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('sidebar-collapsed');
    sidebarOverlay.classList.remove('active');
  });
}

// Mobile Swipe Gestures
let touchStartX = 0; let touchEndX = 0; let touchStartY = 0; let touchEndY = 0;
const viewsOrder = ['news', 'schemes', 'utility', 'gallery', 'ledger', 'payment', 'complaints', 'contacts'];

if (mainContent) {
  mainContent.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  mainContent.addEventListener('touchend', (e) => {
    if (e.target.closest('.ledger-table-container') || e.target.closest('.mobile-nav')) return;
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    if (Math.abs(touchEndY - touchStartY) < 50) {
      const activeView = document.querySelector('.mobile-nav-item.active')?.getAttribute('data-view');
      const currentIndex = viewsOrder.indexOf(activeView);
      if (touchEndX < touchStartX - 75 && currentIndex > -1 && currentIndex < viewsOrder.length - 1) switchView(viewsOrder[currentIndex + 1]);
      else if (touchEndX > touchStartX + 75 && currentIndex > 0) switchView(viewsOrder[currentIndex - 1]);
    }
  }, { passive: true });
}

// Role Access Control Setup & Handlers
let currentRole = localStorage.getItem('gs_role') || 'resident';

// Firebase Configuration (Replace with your actual Firebase project config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase and Listen to Auth State
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  try {
    // Prevent crashing if placeholder keys are still present
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      throw new Error("Firebase config contains placeholder keys.");
    }

    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firestore
    window.db = firebase.firestore();

    // Real-time Firestore Sync for News & Complaints
    window.db.collection('news').onSnapshot((snapshot) => {
      news = snapshot.docs.map(doc => doc.data());
      news.sort((a, b) => b.id - a.id);
      if (typeof renderNewsAndNotices === 'function') renderNewsAndNotices();
    });

    window.db.collection('complaints').onSnapshot((snapshot) => {
      complaints = snapshot.docs.map(doc => doc.data());
      if (typeof renderComplaints === 'function') renderComplaints();
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        currentRole = 'admin';
        localStorage.setItem('gs_role', 'admin');
      } else {
        currentRole = 'resident';
        localStorage.setItem('gs_role', 'resident');
      }
      updateRoleUI();
      if (typeof renderGallery === 'function') renderGallery();
      if (typeof renderLedger === 'function') renderLedger();
      if (typeof renderPoojas === 'function') renderPoojas();
      if (typeof renderComplaints === 'function') renderComplaints();
    });
  } catch (error) {
    console.warn("Firebase is not connected properly. Running in Local Storage Fallback Mode.", error.message);
    window.db = null; // Ensure database is null so local storage triggers
  }
}

const updateRoleUI = () => {
  const isAdmin = currentRole === 'admin';
  body.classList.toggle('role-admin', isAdmin);
  const sidebarRoleLabel = document.getElementById('sidebar-role-label');
  const sidebarRoleSwitchBtn = document.getElementById('sidebar-role-switch-btn');
  const sidebarRoleIcon = document.getElementById('sidebar-role-icon');
  if (sidebarRoleLabel) {
    sidebarRoleLabel.textContent = isAdmin ? 'Admin' : 'Resident';
    sidebarRoleLabel.style.cursor = (isAdmin && !window.db) ? 'pointer' : 'default';
    sidebarRoleLabel.title = (isAdmin && !window.db) ? 'Click to change local passcode' : '';
  }
  if (sidebarRoleSwitchBtn) sidebarRoleSwitchBtn.textContent = isAdmin ? 'Logout' : 'Login';
  if (sidebarRoleIcon) sidebarRoleIcon.setAttribute('data-lucide', isAdmin ? 'shield-alert' : 'shield');

  const headerRoleLabel = document.getElementById('header-role-label');
  const headerRoleIcon = document.getElementById('header-role-icon');
  if (headerRoleLabel) headerRoleLabel.textContent = isAdmin ? 'Admin' : 'Resident';
  if (headerRoleIcon) headerRoleIcon.setAttribute('data-lucide', isAdmin ? 'shield-alert' : 'shield');
  if (window.lucide) window.lucide.createIcons();
};

// Secure Hash Generator Utility
const hashPasscode = async (passcode) => {
  const msgUint8 = new TextEncoder().encode(passcode);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const handleRoleToggle = async () => {
  if (currentRole === 'admin') {
    if (typeof firebase !== 'undefined' && window.db) {
      firebase.auth().signOut().then(() => {
        if (typeof showToast === 'function') showToast("Logged out successfully.", "info");
      });
    } else {
      // Local Storage Fallback Logout
      currentRole = 'resident';
      localStorage.setItem('gs_role', 'resident');
      updateRoleUI();
      if (typeof renderGallery === 'function') renderGallery();
      if (typeof renderLedger === 'function') renderLedger();
      if (typeof renderPoojas === 'function') renderPoojas();
      if (typeof renderComplaints === 'function') renderComplaints();
    }
  } else {
    if (typeof firebase !== 'undefined' && window.db) {
      const loginModal = document.getElementById('admin-login-modal');
      if (loginModal) {
        loginModal.style.display = 'flex';
        document.getElementById('admin-email')?.focus();
      }
    } else {
      // Local Storage Fallback Login
      const passcode = prompt("Enter Administrator Passcode (Default: admin2026):");
      if (passcode !== null) {
        const inputHash = await hashPasscode(passcode);
        // Default hash is for 'admin2026'
        const savedHash = localStorage.getItem('gs_admin_hash') || 'a5d4ba1dcc2e88a08719b0ce208dfcefa94b79bca402c40c83a72661d9a2a7a4';
        
        if (inputHash === savedHash) {
          currentRole = 'admin';
          localStorage.setItem('gs_role', 'admin');
          updateRoleUI();
          if (typeof renderGallery === 'function') renderGallery();
          if (typeof renderLedger === 'function') renderLedger();
          if (typeof renderPoojas === 'function') renderPoojas();
          if (typeof renderComplaints === 'function') renderComplaints();
        } else {
          alert("Invalid passcode! Access denied.");
        }
      }
    }
  }
};

document.getElementById('sidebar-role-switch-btn')?.addEventListener('click', handleRoleToggle);
document.getElementById('header-role-btn')?.addEventListener('click', handleRoleToggle);

// Allow Admin to change local passcode by clicking the role label
const sidebarRoleLabelEl = document.getElementById('sidebar-role-label');
if (sidebarRoleLabelEl) {
  sidebarRoleLabelEl.addEventListener('click', async () => {
    if (currentRole === 'admin' && !window.db) {
      const newPass = prompt("Set a new Local Administrator Passcode:");
      if (newPass) {
        const newHash = await hashPasscode(newPass);
        localStorage.setItem('gs_admin_hash', newHash);
        if (typeof showToast === 'function') showToast("Local passcode updated securely!", "success");
      }
    }
  });
}

// Admin Login Modal Handlers
const adminLoginModal = document.getElementById('admin-login-modal');
const closeAdminLogin = document.getElementById('close-login-modal');
const adminLoginForm = document.getElementById('admin-login-form');

if (closeAdminLogin && adminLoginModal) {
  closeAdminLogin.addEventListener('click', () => adminLoginModal.style.display = 'none');
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (typeof firebase !== 'undefined') {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          if (adminLoginModal) adminLoginModal.style.display = 'none';
          adminLoginForm.reset();
          if (typeof showToast === 'function') showToast("Admin logged in successfully!", "success");
        })
        .catch((error) => {
          if (typeof showToast === 'function') showToast(error.message, "error");
          else alert(error.message);
        });
    }
  });
}

// Forgot Password Handler
const forgotPasswordBtn = document.getElementById('forgot-password-btn');
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    if (!email) {
      if (typeof showToast === 'function') showToast("Please enter your Admin email address first.", "info");
      else alert("Please enter your Admin email address first.");
      return;
    }
    if (typeof firebase !== 'undefined' && window.db) {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => { if (typeof showToast === 'function') showToast("Password reset link sent to your email!", "success"); })
        .catch((error) => { if (typeof showToast === 'function') showToast(error.message, "error"); else alert(error.message); });
    }
  });
}

// Language Toggle Logic (Google Translate Integration)
const langToggleBtn = document.getElementById('lang-toggle-btn');
const langLabel = document.getElementById('lang-label');

if (isTelugu) {
  if (langLabel) langLabel.textContent = 'తెలుగు';
  document.documentElement.lang = 'te';
} else {
  if (langLabel) langLabel.textContent = 'EN';
  document.documentElement.lang = 'en';
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    if (document.cookie.includes('googtrans=/en/te')) {
      document.cookie = 'googtrans=/en/en; path=/';
    } else {
      document.cookie = 'googtrans=/en/te; path=/';
    }
    window.location.reload();
  });
}

// PDF Receipt Generation Helper
const generatePDFReceipt = (member) => {
  if (!window.jspdf) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(22); doc.setTextColor(14, 74, 170); doc.text("GramSeva Village Portal", 105, 20, { align: "center" });
  doc.setFontSize(14); doc.setTextColor(0, 0, 0); doc.text("Official Payment Receipt", 105, 30, { align: "center" });
  doc.setLineWidth(0.5); doc.setDrawColor(200, 200, 200); doc.line(20, 36, 190, 36);
  doc.setFontSize(12); doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 20, 48); doc.text(`Receipt ID: TXN-${Date.now().toString().slice(-6)}`, 130, 48);
  doc.setFont(undefined, 'bold'); doc.text("Transaction Details", 20, 65); doc.setFont(undefined, 'normal');
  doc.text(`Resident Name:`, 20, 75); doc.text(`${member.name}`, 70, 75); doc.text(`Payment Month:`, 20, 85); doc.text(`${member.month}`, 70, 85);
  doc.text(`Payment Method:`, 20, 95); doc.text(`${member.paymentMethod || 'Online Gateway'}`, 70, 95); doc.text(`Amount Paid:`, 20, 105);
  doc.setFont(undefined, 'bold'); doc.text(`INR ${member.amount || 200}/-`, 70, 105); doc.setFont(undefined, 'normal');
  doc.line(20, 115, 190, 115); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
  doc.text("This is a computer-generated receipt. Thank you for supporting village development.", 105, 125, { align: "center" });
  doc.save(`GramSeva_Receipt_${member.name.replace(/\s+/g, '_')}_${member.month.replace(/\s+/g, '_')}.pdf`);
};

// Back to Top Logic
const backToTopBtn = document.getElementById('back-to-top-btn');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}