// Government Welfare Schemes Module

const renderSchemes = () => {
  const container = document.getElementById('schemes-accordion-container');
  if (!container) return;

  const localQuery = document.getElementById('scheme-search')?.value.toLowerCase().trim() || '';
  const globalQuery = document.getElementById('global-search-input')?.value.toLowerCase().trim() || '';
  const filterQuery = localQuery || globalQuery;

  const filtered = schemes.filter(s => 
    s.title.toLowerCase().includes(filterQuery) || 
    s.dept.toLowerCase().includes(filterQuery) ||
    s.benefit.toLowerCase().includes(filterQuery)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-weight:600;">No welfare schemes found matching "${filterQuery}"</div>`;
    return;
  }

  container.innerHTML = filtered.map((scheme, idx) => `
    <div class="scheme-card">
      <div class="scheme-header" data-index="${idx}" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div class="scheme-header-info">
          <span class="scheme-dept">${scheme.dept}</span>
          <span class="scheme-title">${scheme.title}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="delete-scheme-btn admin-only" data-id="${scheme.id}" title="Delete Scheme">
            <i data-lucide="trash-2"></i>
          </button>
          <i data-lucide="chevron-down" class="accordion-chevron"></i>
        </div>
      </div>
      <div class="scheme-body" id="scheme-body-${idx}">
        <div class="scheme-row">
          <span class="scheme-label">Financial & Social Benefits:</span>
          <p>${scheme.benefit}</p>
        </div>
        <div class="scheme-row">
          <span class="scheme-label">Eligibility Criteria:</span>
          <p>${scheme.eligibility}</p>
        </div>
        <div class="scheme-row">
          <span class="scheme-label">Required Documentation:</span>
          <p>${scheme.docs}</p>
        </div>
      </div>
    </div>
  `).join('');

  // Accordion Toggle Handlers
  container.querySelectorAll('.scheme-header').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.delete-scheme-btn')) return;
      const idx = header.getAttribute('data-index');
      const body = document.getElementById(`scheme-body-${idx}`);
      const chevron = header.querySelector('.accordion-chevron');
      const isOpen = body.classList.contains('active');
      
      container.querySelectorAll('.scheme-body').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.accordion-chevron').forEach(c => c.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        body.classList.add('active');
        chevron.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Delete Handlers
  container.querySelectorAll('.delete-scheme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => requireAdmin(() => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      const targetScheme = schemes.find(s => s.id === id);
      if (targetScheme && confirm(`Are you sure you want to delete scheme "${targetScheme.title}"?`)) {
        schemes = schemes.filter(s => s.id !== id);
        saveStoredData('gs_schemes', schemes);
        renderSchemes();
      }
    }));
  });

  if (window.lucide) window.lucide.createIcons();
};

// Automated Live Sync for Government Schemes
const checkForNewSchemes = async () => {
  try {
    // Poll the backend server for newly scraped government schemes
    const response = await fetch('http://localhost:3000/api/schemes/latest');
    const result = await response.json();

    if (result.success && result.data && result.data.length > 0) {
      let updated = false;
      result.data.forEach(newScheme => {
        const exists = schemes.find(s => s.title.toLowerCase() === newScheme.title.toLowerCase());
        if (!exists) {
          schemes.unshift({ ...newScheme, id: Date.now() + Math.floor(Math.random() * 1000) });
          updated = true;
        }
      });

      if (updated) {
        saveStoredData('gs_schemes', schemes);
        renderSchemes();
        if (typeof showToast === 'function') showToast("New Government Schemes automatically synced!", "info");
      }
    }
  } catch (e) {
    console.log("Live scheme sync skipped: Server unreachable.");
  }
};

// Attach Event Listeners safely AFTER HTML has loaded
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('scheme-search')?.addEventListener('keyup', renderSchemes);

  document.getElementById('add-scheme-btn')?.addEventListener('click', () => requireAdmin(() => {
    const form = document.getElementById('add-scheme-form-container');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }));

  document.getElementById('cancel-scheme-btn')?.addEventListener('click', () => {
    document.getElementById('add-scheme-form-container').style.display = 'none';
  });

  document.getElementById('scheme-addition-form')?.addEventListener('submit', (e) => requireAdmin(() => {
    e.preventDefault();
    const newScheme = { id: Date.now(), title: document.getElementById('scheme-title').value.trim(), dept: document.getElementById('scheme-dept').value.trim(), benefit: document.getElementById('scheme-benefit').value.trim(), eligibility: document.getElementById('scheme-eligibility').value.trim(), docs: document.getElementById('scheme-docs').value.trim() };
    schemes.unshift(newScheme);
    saveStoredData('gs_schemes', schemes);
    renderSchemes();
    e.target.reset();
    document.getElementById('add-scheme-form-container').style.display = 'none';
  }));

  // Start background auto-sync (Runs 5 seconds after load, then every 3 minutes)
  setTimeout(checkForNewSchemes, 5000);
  setInterval(checkForNewSchemes, 180000);
});