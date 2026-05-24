// Ledger & Village Expenses Module

let complianceChartInstance = null;

// Global Render Functions
const renderComplianceChart = () => {
  const ctx = document.getElementById('complianceChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const today = new Date();
  const last3Months = [];
  for (let i = 2; i >= 0; i--) {
    let m = today.getMonth() - i;
    let y = today.getFullYear();
    if (m < 0) { m += 12; y -= 1; }
    last3Months.push(`${monthsName[m]} ${y}`);
  }

  const data = last3Months.map(monthStr => {
    const membersInMonth = ledgerMembers.filter(m => m.month === monthStr);
    if (membersInMonth.length === 0) return 0;
    const paidCount = membersInMonth.filter(m => m.status === 'Paid').length;
    return Math.round((paidCount / membersInMonth.length) * 100);
  });

  const isLightMode = document.body.classList.contains('light-mode');
  const gridColor = isLightMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)';
  const textColor = isLightMode ? '#475569' : '#94a3b8';

  if (complianceChartInstance) {
    complianceChartInstance.data.labels = last3Months;
    complianceChartInstance.data.datasets[0].data = data;
    complianceChartInstance.options.scales.x.grid.color = gridColor;
    complianceChartInstance.options.scales.y.grid.color = gridColor;
    complianceChartInstance.options.scales.x.ticks.color = textColor;
    complianceChartInstance.options.scales.y.ticks.color = textColor;
    complianceChartInstance.update();
  } else {
    complianceChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last3Months,
        datasets: [{ label: 'Compliance %', data: data, borderColor: '#0e4aaa', backgroundColor: 'rgba(14, 74, 170, 0.2)', borderWidth: 2, fill: true, tension: 0.4 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
          x: { ticks: { color: textColor }, grid: { color: gridColor } }
        },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.raw}% Paid` } } }
      }
    });
  }
};

const renderLedger = () => {
  const tbody = document.getElementById('ledger-members-tbody');
  if (!tbody) return;

  const selectedMonth = document.getElementById('ledger-month-filter')?.value || 'All';
  const searchQuery = document.getElementById('ledger-search')?.value.toLowerCase().trim() || '';
  const statusFilter = document.getElementById('ledger-status-filter')?.value || 'All';

  let statsMembers = selectedMonth !== 'All' ? ledgerMembers.filter(m => m.month === selectedMonth) : ledgerMembers;
  const paidMembersCount = statsMembers.filter(m => m.status === 'Paid').length;
  
  const totalCollectedValOverall = ledgerMembers.reduce((sum, member) => sum + (member.status === 'Paid' ? (member.amount || 200) : 0), 0);
  let displayedFunds = selectedMonth !== 'All' ? statsMembers.reduce((sum, member) => sum + (member.status === 'Paid' ? (member.amount || 200) : 0), 0) : (baseFunds + totalCollectedValOverall);

  // Render Stats Board
  if (document.getElementById('ledger-total-funds')) document.getElementById('ledger-total-funds').textContent = `₹${displayedFunds.toLocaleString('en-IN')}`;
  if (document.getElementById('ledger-member-count')) document.getElementById('ledger-member-count').textContent = `${statsMembers.length} Member${statsMembers.length === 1 ? '' : 's'}`;

  const compliancePct = statsMembers.length > 0 ? Math.round((paidMembersCount / statsMembers.length) * 100) : 0;
  if (document.getElementById('ledger-compliance-pct')) document.getElementById('ledger-compliance-pct').textContent = `${compliancePct}%`;
  if (document.getElementById('ledger-compliance-bar')) document.getElementById('ledger-compliance-bar').style.width = `${compliancePct}%`;

  // Bank Calculations
  const arrayPoojaSpent = poojas.reduce((sum, p) => sum + (p.status === 'Refunded' ? 0 : (p.spent || 0)), 0);
  const totalPoojaSpent = manualPoojaSpent + arrayPoojaSpent;
  let netBankBalance = (baseFunds + totalCollectedValOverall) - totalPoojaSpent;
  if (manualBankBalance !== null && manualBankBalance !== '') netBankBalance = parseInt(manualBankBalance);

  if (document.getElementById('ledger-festival-value')) document.getElementById('ledger-festival-value').textContent = `₹${netBankBalance.toLocaleString('en-IN')}`;
  if (document.getElementById('ledger-festival-subtitle')) document.getElementById('ledger-festival-subtitle').textContent = `Total Expenses: ₹${totalPoojaSpent.toLocaleString('en-IN')}`;

  // Table Rendering
  const filteredMembers = ledgerMembers.map((member, originalIdx) => ({ ...member, originalIdx })).filter(member => {
    return (selectedMonth === 'All' || member.month === selectedMonth) &&
           (statusFilter === 'All' || member.status === statusFilter) &&
           (member.name.toLowerCase().includes(searchQuery) || member.profession.toLowerCase().includes(searchQuery));
  });

  if (filteredMembers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 32px; color: var(--text-muted); font-weight: 600;">No matching records found</td></tr>`;
  } else {
    tbody.innerHTML = filteredMembers.map(member => `
      <tr>
        <td style="font-weight: 700;">${member.name}</td>
        <td style="color: var(--text-secondary);">${member.profession}</td>
        <td style="font-weight: 600;">${member.month}</td>
        <td>
          <span class="status-badge ${member.status === 'Paid' ? 'status-resolved' : 'status-pending'}">
            ${member.status} ${member.paymentMethod ? `via ${member.paymentMethod}` : ''}
          </span>
        </td>
        <td style="text-align: right; display: flex; gap: 8px; justify-content: flex-end; align-items: center; border-bottom: none;">
          ${member.status === 'Pending' ? `<button class="btn btn-primary pay-now-btn resident-only" data-index="${member.originalIdx}" data-amount="${member.amount || 200}" style="padding: 4px 8px; font-size: 11px;">Pay Online</button>` : ''}
          <button class="btn btn-secondary toggle-pay-btn admin-only" data-index="${member.originalIdx}" style="padding: 4px 8px; font-size: 11px;">Toggle Pay</button>
          <button class="delete-member-btn admin-only" data-index="${member.originalIdx}" title="Remove Member" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i></button>
        </td>
      </tr>
    `).join('');
  }

  // Table Action Listeners
  tbody.querySelectorAll('.toggle-pay-btn').forEach(btn => btn.addEventListener('click', () => requireAdmin(() => {
    const idx = parseInt(btn.getAttribute('data-index'));
    const member = ledgerMembers[idx];
    if (member.status === 'Paid') {
      member.status = 'Pending';
      member.paymentMethod = undefined;
      showToast(`Payment marked as Pending.`);
    } else {
      member.status = 'Paid';
      member.paymentMethod = 'Manual Entry';
      showToast(`Payment marked as Paid! Downloading receipt...`);
      if (typeof generatePDFReceipt === 'function') generatePDFReceipt(member);
    }
    saveStoredData('gs_ledger', ledgerMembers);
    renderLedger();
  })));

  tbody.querySelectorAll('.delete-member-btn').forEach(btn => btn.addEventListener('click', () => requireAdmin(() => {
    const idx = parseInt(btn.getAttribute('data-index'));
    if (confirm(`Remove "${ledgerMembers[idx].name}" from the ledger?`)) {
      ledgerMembers.splice(idx, 1);
      saveStoredData('gs_ledger', ledgerMembers);
      renderLedger();
    }
  })));

  tbody.querySelectorAll('.pay-now-btn').forEach(btn => btn.addEventListener('click', () => {
    const idx = parseInt(btn.getAttribute('data-index'));
    const amount = parseInt(btn.getAttribute('data-amount')) || 200;
    if (typeof openPaymentModal === 'function') openPaymentModal(idx, amount);
  }));

  if (window.lucide) window.lucide.createIcons();
  renderComplianceChart();
};

const renderPoojas = () => {
  const container = document.getElementById('pooja-allocations-container');
  if (!container) return;
  if (poojas.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-weight:600;">No expenses logged yet.</div>`;
    return;
  }
  
  const itemsToDisplay = showAllExpenses ? poojas : [...poojas].reverse().slice(0, 3);
  container.innerHTML = itemsToDisplay.map(item => `
    <div class="notice-item animate-fade" style="border-left-color: var(--accent); position: relative; ${item.status === 'Refunded' ? 'opacity: 0.6; filter: grayscale(1);' : ''}">
      <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 8px; align-items: center;">
        <button class="delete-pooja-btn admin-only" data-id="${item.id}" title="Delete Expense" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0;"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i></button>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding-right: 110px;">
        <span class="notice-title" style="font-weight: 700; ${item.status === 'Refunded' ? 'text-decoration: line-through;' : ''}"><span style="font-size: 10px; background: var(--bg-card); border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; margin-right: 6px; font-weight: 600;">${item.category || 'Festival/Pooja'}</span>${item.title}</span>
        <span style="font-weight: 800; color: var(--accent); font-size:13px; ${item.status === 'Refunded' ? 'text-decoration: line-through;' : ''}">₹${(item.spent || 0).toLocaleString('en-IN')} spent</span>
      </div>
      <p class="notice-desc" style="margin-top: 4px; padding-right: 110px;">${item.desc}</p>
    </div>
  `).join('');

  container.querySelectorAll('.delete-pooja-btn').forEach(btn => btn.addEventListener('click', () => requireAdmin(() => {
    const id = parseInt(btn.getAttribute('data-id'));
    if (confirm(`Delete this expense?`)) {
      poojas = poojas.filter(p => p.id !== id);
      saveStoredData('gs_poojas', poojas); renderPoojas(); renderLedger();
    }
  })));

  const toggleBtn = document.getElementById('toggle-expenses-btn');
  if (toggleBtn) {
    if (poojas.length > 3) {
      toggleBtn.style.display = 'flex';
      toggleBtn.innerHTML = showAllExpenses ? `<i data-lucide="chevron-up" style="width:14px; height:14px;"></i> Show Less` : `<i data-lucide="chevron-down" style="width:14px; height:14px;"></i> View All Expenses (${poojas.length})`;
    } else {
      toggleBtn.style.display = 'none';
    }
  }
  if (window.lucide) window.lucide.createIcons();
};

// Attach Event Listeners safely AFTER HTML has loaded
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ledger-search')?.addEventListener('input', renderLedger);
  document.getElementById('ledger-month-filter')?.addEventListener('change', renderLedger);
  document.getElementById('ledger-status-filter')?.addEventListener('change', renderLedger);
  
  // Add Member Form
  document.getElementById('add-ledger-member-btn')?.addEventListener('click', () => requireAdmin(() => {
    const form = document.getElementById('add-ledger-member-form-container');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }));
  document.getElementById('cancel-ledger-add-btn')?.addEventListener('click', () => {
    document.getElementById('add-ledger-member-form-container').style.display = 'none';
  });
  document.getElementById('ledger-quick-add-form')?.addEventListener('submit', (e) => requireAdmin(() => {
    e.preventDefault();
    const name = document.getElementById('ledger-add-name').value.trim();
    const profession = document.getElementById('ledger-add-profession').value.trim();
    const month = document.getElementById('ledger-add-month').value;
    const status = document.getElementById('ledger-add-status').value;
    
    if (ledgerMembers.some(m => m.name.toLowerCase() === name.toLowerCase() && m.month === month)) {
      return alert(`${name} already exists in the ledger for ${month}!`);
    }
    ledgerMembers.unshift({ name, profession, month, status, amount: 200 });
    saveStoredData('gs_ledger', ledgerMembers);
    renderLedger();
    e.target.reset();
    document.getElementById('add-ledger-member-form-container').style.display = 'none';
    showToast(`${name} added to the Ledger!`);
  }));

  document.getElementById('print-ledger-btn')?.addEventListener('click', () => window.print());
  
  // Expenses Toggle
  document.getElementById('toggle-expenses-btn')?.addEventListener('click', () => {
    showAllExpenses = !showAllExpenses;
    renderPoojas();
  });
});