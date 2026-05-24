// Grievance & Complaints Module

let activeGrievanceFilter = 'all';

const renderComplaints = () => {
  const container = document.getElementById('complaints-list-container');
  if (!container) return;
  if (complaints.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-weight:600;">No active grievances logged. Grievance box is empty.</div>`;
    return;
  }

  // Search Queries
  const localQuery = document.getElementById('complaint-search')?.value.toLowerCase().trim() || '';
  const globalQuery = document.getElementById('global-search-input')?.value.toLowerCase().trim() || '';
  const searchQuery = localQuery || globalQuery;

  const filtered = complaints.filter(c => {
    const matchesStatus = activeGrievanceFilter === 'all' || c.status === activeGrievanceFilter;
    const matchesSearch = c.id.toLowerCase().includes(searchQuery) ||
                          c.username.toLowerCase().includes(searchQuery) ||
                          c.category.toLowerCase().includes(searchQuery) ||
                          c.ward.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-weight:600;">No grievances match the selected filter or search.</div>`;
    return;
  }

  const sorted = [...filtered].reverse();

  container.innerHTML = sorted.map(c => `
    <div class="complaint-item clickable animate-fade" style="cursor: pointer;">
      <button class="delete-complaint-btn admin-only" data-id="${c.id}" title="Delete Grievance">
        <i data-lucide="trash-2"></i>
      </button>
      <div class="complaint-item-header" style="padding-right: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <i data-lucide="chevron-down" class="accordion-chevron" style="transition: transform 0.3s ease; color: var(--text-muted); width: 18px; height: 18px;"></i>
          <span class="complaint-id">${c.id}</span>
        </div>
        <span class="status-badge status-${c.status}">
          ${c.status === 'pending' ? 'Pending Action' : c.status === 'progress' ? 'Investigation Started' : 'Grievance Resolved'}
        </span>
      </div>
      <div class="complaint-meta" style="border-top: none; padding-top: 0; padding-right: 24px;">
        <span>By: ${c.username} (Ward ${c.ward})</span>
        <span>Category: ${c.category} | ${c.date}</span>
      </div>
      
      <div class="complaint-body">
        <div class="complaint-body-inner">
          <p class="complaint-text">${c.desc}</p>
          ${c.resolutionNote ? `
            <div style="padding: 12px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid var(--primary); border-radius: 6px;">
              <span style="font-size: 11px; font-weight: 700; color: var(--primary); text-transform: uppercase;">Admin Resolution Note</span>
              <p style="font-size: 13px; color: var(--text-primary); margin-top: 4px;">${c.resolutionNote}</p>
            </div>
          ` : ''}
          ${c.status !== 'resolved' ? `
            <div class="complaint-admin-actions admin-only" style="display: flex; gap: 8px; margin-top: 4px;">
              ${c.status === 'pending' ? `<button class="btn btn-secondary admin-status-btn" data-id="${c.id}" data-status="progress" style="padding: 4px 8px; font-size: 10px;"><i data-lucide="play" style="width: 10px; height: 10px;"></i> Start Investigation</button>` : ''}
              ${c.status === 'progress' ? `<button class="btn btn-primary admin-status-btn" data-id="${c.id}" data-status="resolved" style="padding: 4px 8px; font-size: 10px;"><i data-lucide="check" style="width: 10px; height: 10px;"></i> Mark Resolved</button>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');

  // Expand / Collapse Handler
  container.querySelectorAll('.complaint-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // Ignore button clicks
      const body = item.querySelector('.complaint-body');
      const chevron = item.querySelector('.accordion-chevron');
      if (body && chevron) {
        const isOpen = body.classList.contains('open');
        if (isOpen) {
          body.classList.remove('open');
        } else {
          body.classList.add('open');
        }
        chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });

  // Admin Handlers
  container.querySelectorAll('.admin-status-btn').forEach(btn => {
    btn.addEventListener('click', (e) => requireAdmin(() => {
      e.stopPropagation();
      const ticket = complaints.find(c => c.id === btn.getAttribute('data-id'));
      if (ticket) {
        const nextStatus = btn.getAttribute('data-status');
        if (nextStatus === 'resolved') {
          const note = prompt("Enter a resolution note for this grievance (Optional):");
          if (note !== null) ticket.resolutionNote = note.trim();
          else return; // Cancelled by Admin
        }
        ticket.status = nextStatus;
        if (window.db) {
          window.db.collection('complaints').doc(ticket.id).update({ status: nextStatus, resolutionNote: ticket.resolutionNote || null });
        } else {
          saveStoredData('gs_complaints', complaints);
          renderComplaints();
        }
      }
    }));
  });

  container.querySelectorAll('.delete-complaint-btn').forEach(btn => {
    btn.addEventListener('click', (e) => requireAdmin(() => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete grievance ticket "${id}"?`)) {
        if (window.db) {
          window.db.collection('complaints').doc(id).delete();
        } else {
          complaints = complaints.filter(c => c.id !== id);
          saveStoredData('gs_complaints', complaints);
          renderComplaints();
        }
      }
    }));
  });

  if (window.lucide) window.lucide.createIcons();
};

// Attach Event Listeners safely AFTER HTML has loaded
document.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById('complaint-search')?.addEventListener('input', renderComplaints);

  const filterBtns = document.querySelectorAll('.filter-status-btn');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeGrievanceFilter = btn.getAttribute('data-status');
    renderComplaints();
  }));

  document.getElementById('grievance-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTicket = {
      id: `GRV-${Math.floor(1000 + Math.random() * 9000)}`,
      username: document.getElementById('complaint-username').value.trim(),
      ward: parseInt(document.getElementById('complaint-ward').value),
      category: document.getElementById('complaint-category').value,
      desc: document.getElementById('complaint-desc').value.trim(),
      status: 'pending',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    
    if (window.db) {
      window.db.collection('complaints').doc(newTicket.id).set(newTicket);
    } else {
      complaints.push(newTicket);
      saveStoredData('gs_complaints', complaints);
      renderComplaints();
    }
    e.target.reset();
    if (typeof showToast === 'function') showToast(`Grievance submitted successfully! Ticket ID: ${newTicket.id}`);
  });

  document.getElementById('export-complaints-btn')?.addEventListener('click', () => requireAdmin(() => {
    if (complaints.length === 0) return alert("No grievances to export.");
    const headers = ['Ticket ID', 'Resident Name', 'Ward', 'Category', 'Description', 'Status', 'Date Submitted'];
    const rows = complaints.map(c => {
      const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;
      return [
        escapeCSV(c.id), escapeCSV(c.username), c.ward, escapeCSV(c.category), escapeCSV(c.desc), escapeCSV(c.status), escapeCSV(c.date)
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gramseva_grievances_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }));

});