// GramSeva Portal Initialization

// Month Generator Utility
const populateMonthDropdowns = () => {
  const contribMonthSelect = document.getElementById('contrib-month');
  const ledgerAddMonthSelect = document.getElementById('ledger-add-month');
  const ledgerMonthFilterSelect = document.getElementById('ledger-month-filter');
  if (!contribMonthSelect || !ledgerAddMonthSelect || !ledgerMonthFilterSelect) return;
  
  const monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthYearString = `${monthsName[today.getMonth()]} ${currentYear}`;
  
  const optionsHTML = [];
  const filterOptionsHTML = [`<option value="All" selected>All Months</option>`];
  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let m = 0; m < 12; m++) {
      const value = `${monthsName[m]} ${year}`;
      const isSelected = (value === currentMonthYearString) ? 'selected' : '';
      optionsHTML.push(`<option value="${value}" ${isSelected}>${value}</option>`);
      filterOptionsHTML.push(`<option value="${value}">${value}</option>`);
    }
  }
  if(contribMonthSelect) contribMonthSelect.innerHTML = optionsHTML.join('');
  if(ledgerAddMonthSelect) ledgerAddMonthSelect.innerHTML = optionsHTML.join('');
  if(ledgerMonthFilterSelect) ledgerMonthFilterSelect.innerHTML = filterOptionsHTML.join('');
};

// Run Initialization sequence on load
document.addEventListener('DOMContentLoaded', () => {
  
  // Hide Global Skeleton Loader so the page is always visible
  const globalLoader = document.getElementById('global-loader');
  if (globalLoader) {
    setTimeout(() => {
      globalLoader.classList.add('hidden');
    }, 350); 
  }

  // Setup Environment
  if (typeof populateMonthDropdowns === 'function') populateMonthDropdowns();
  if (typeof updateLanguageUI === 'function') updateLanguageUI();
  else if (typeof updateRoleUI === 'function') updateRoleUI();

  // Initialize Sub-View render cycles
  if (typeof renderNewsAndNotices === 'function') renderNewsAndNotices();
  if (typeof renderSchemes === 'function') renderSchemes();
  if (typeof renderContacts === 'function') renderContacts();
  if (typeof renderComplaints === 'function') renderComplaints();
  if (typeof renderGallery === 'function') renderGallery();
  if (typeof renderLedger === 'function') renderLedger();
  if (typeof renderPoojas === 'function') renderPoojas();
  
  // Global Search Filter Engine
  const globalSearchInput = document.getElementById('global-search-input');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      if (typeof renderNewsAndNotices === 'function') renderNewsAndNotices();
      if (typeof renderSchemes === 'function') renderSchemes();
      if (typeof renderComplaints === 'function') renderComplaints();
    });
  }

  // Start Payment modal success processor
  const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
  if (confirmPaymentBtn && typeof activePaymentIndex !== 'undefined') {
    confirmPaymentBtn.addEventListener('click', () => {
      if (activePaymentIndex === null) {
        if (typeof showToast === 'function') showToast("Please initiate a payment from the Youth Contribution Ledger.", "error");
        if (typeof switchView === 'function') switchView('ledger');
        return;
      }

      const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value;
      confirmPaymentBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> Processing...`;
      if (window.lucide) window.lucide.createIcons();
      
      setTimeout(() => {
        const formContent = document.getElementById('payment-form-content');
        const successAnim = document.getElementById('payment-success-animation');
        if (formContent && successAnim) {
          formContent.style.display = 'none';
          successAnim.style.display = 'flex';
          if (window.lucide) window.lucide.createIcons();
          
          setTimeout(() => {
            if (typeof ledgerMembers !== 'undefined') {
              ledgerMembers[activePaymentIndex].status = 'Paid';
              const methodNames = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking' };
              ledgerMembers[activePaymentIndex].paymentMethod = methodNames[selectedMethod] || 'Online';
              if (typeof saveStoredData === 'function') saveStoredData('gs_ledger', ledgerMembers);
              if (typeof renderLedger === 'function') renderLedger();
              if (typeof showToast === 'function') showToast(`Payment successful! Downloading PDF receipt...`);
              if (typeof generatePDFReceipt === 'function') generatePDFReceipt(ledgerMembers[activePaymentIndex]);
            }
            if (typeof closePaymentModal === 'function') closePaymentModal();
            setTimeout(() => { formContent.style.display = 'block'; successAnim.style.display = 'none'; }, 400);
          }, 1800);
        }
      }, 1200);
    });
  }

  // Render final SVG icons
  if (window.lucide) window.lucide.createIcons();
});
