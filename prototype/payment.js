// Payment Gateway Logic

let activePaymentIndex = null;
let upiCountdownInterval = null;
const paymentModal = document.getElementById('payment-modal');
const paymentAmountDisplay = document.getElementById('payment-amount-display');
const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

// Copy UPI ID Handler
const copyUpiBtn = document.getElementById('copy-upi-btn');
if (copyUpiBtn) {
  copyUpiBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(villageUpiId).then(() => {
      showToast(`UPI ID copied to clipboard!`, 'success');
    }).catch(err => {
      showToast(`Failed to copy to clipboard.`, 'error');
    });
  });
}

// Edit UPI ID Handler
const editUpiBtn = document.getElementById('edit-upi-btn');
if (editUpiBtn) {
  editUpiBtn.addEventListener('click', () => requireAdmin(() => {
    const newUpiId = prompt("Enter the new Village/Panchayat UPI ID:", villageUpiId);
    if (newUpiId !== null && newUpiId.trim() !== '') {
      villageUpiId = newUpiId.trim();
      saveStoredData('gs_upi_id', villageUpiId);
      showToast("UPI ID updated successfully!");
      if (activePaymentIndex !== null) refreshQRCode();
    }
  }));
}

// Edit UPI Name Handler
const editUpiNameBtn = document.getElementById('edit-upi-name-btn');
if (editUpiNameBtn) {
  editUpiNameBtn.addEventListener('click', () => requireAdmin(() => {
    const newUpiName = prompt("Enter the new UPI Receiver Name:", villageUpiName);
    if (newUpiName !== null && newUpiName.trim() !== '') {
      villageUpiName = newUpiName.trim();
      saveStoredData('gs_upi_name', villageUpiName);
      showToast("UPI Receiver Name updated successfully!");
      if (activePaymentIndex !== null) refreshQRCode();
    }
  }));
}

const refreshQRCode = () => {
  const dynamicQr = document.getElementById('dynamic-upi-qr');
  const upiDeepLink = document.getElementById('upi-deep-link-btn');
  if (activePaymentIndex !== null) {
    const amount = parseInt(paymentAmountDisplay?.textContent.replace(/\D/g, '')) || 200;
    const upiString = `upi://pay?pa=${villageUpiId}&pn=${encodeURIComponent(villageUpiName)}&am=${amount}&cu=INR`;
    if (dynamicQr) dynamicQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiString)}`;
    if (upiDeepLink) upiDeepLink.href = upiString;
  }
};

// Tab Switch & Lock Logic
const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
const payDetailSections = {
  upi: document.getElementById('pay-upi-details'),
  card: document.getElementById('pay-card-details'),
  netbanking: document.getElementById('pay-netbanking-details')
};

if (paymentRadios.length > 0) {
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      Object.values(payDetailSections).forEach(section => { if (section) section.style.display = 'none'; });
      const selectedSection = payDetailSections[e.target.value];
      if (selectedSection) selectedSection.style.display = 'block';

      if (e.target.value === 'upi') {
        if (confirmPaymentBtn) {
          clearInterval(upiCountdownInterval);
          confirmPaymentBtn.disabled = true;
          let timeLeft = 5;
          const updateBtn = () => {
            if (timeLeft > 0) {
              confirmPaymentBtn.innerHTML = `<i data-lucide="lock"></i> Please Scan QR (${timeLeft}s)`;
              if (window.lucide) window.lucide.createIcons();
              timeLeft--;
            } else {
              clearInterval(upiCountdownInterval);
              confirmPaymentBtn.disabled = false;
              confirmPaymentBtn.innerHTML = `<i data-lucide="check-circle"></i> Confirm QR Payment`;
              if (window.lucide) window.lucide.createIcons();
            }
          };
          updateBtn();
          upiCountdownInterval = setInterval(updateBtn, 1000);
        }
      } else {
        clearInterval(upiCountdownInterval);
        if (confirmPaymentBtn) {
          confirmPaymentBtn.disabled = false;
          confirmPaymentBtn.innerHTML = `<i data-lucide="shield-check"></i> Proceed to Pay`;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  });
}

// Real-time Credit Card formatting
const cardNumInput = document.getElementById('card-number');
if (cardNumInput) {
  cardNumInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    val = val.replace(/(.{4})/g, '$1 ').trim(); 
    e.target.value = val.substring(0, 19);
  });
}

// Auto-format and Validate Card Expiry (MM/YY)
const cardExpInput = document.getElementById('card-expiry');
if (cardExpInput) {
  cardExpInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    
    if (val.length >= 2) {
      let month = parseInt(val.substring(0, 2), 10);
      if (month > 12) {
        if (typeof showToast === 'function') showToast("Invalid month! Auto-correcting to 12.", "info");
        val = '12' + val.substring(2);
      } else if (val.length >= 2 && month === 0) {
        val = '01' + val.substring(2);
      }
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
  });

  cardExpInput.addEventListener('keydown', (e) => { 
    if (e.key === 'Backspace' && e.target.value.endsWith('/')) e.target.value = e.target.value.slice(0, -1); 
  });

  // Check for expired cards on blur
  cardExpInput.addEventListener('blur', (e) => {
    const val = e.target.value;
    if (val.length === 5) {
      const [month, year] = val.split('/');
      const currentYear = parseInt(String(new Date().getFullYear()).slice(-2), 10);
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(year, 10) < currentYear || (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)) {
        if (typeof showToast === 'function') showToast("This card appears to have expired. Please use a valid card.", "error");
        e.target.value = '';
      }
    }
  });
}

const openPaymentModal = (idx, amount) => {
  activePaymentIndex = idx;
  if (paymentAmountDisplay) paymentAmountDisplay.textContent = `₹${amount}`;
  const member = ledgerMembers[idx];
  const personInfoDisplay = document.getElementById('payment-person-info');
  if (personInfoDisplay && member) {
    personInfoDisplay.innerHTML = `Paying for: <span style="color: var(--primary);">${member.name}</span> (${member.month})`;
  }
  refreshQRCode();
  
  const defaultRadio = document.querySelector('input[name="payment_method"][value="upi"]');
  if (defaultRadio) {
    defaultRadio.checked = true;
    defaultRadio.dispatchEvent(new Event('change'));
  }
  switchView('payment');
  if (window.lucide) window.lucide.createIcons();
};