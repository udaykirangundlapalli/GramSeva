// News & Public Notices Module

// Global Render Function
const renderNewsAndNotices = () => {
  const newsContainer = document.getElementById('news-feed-container');
  const noticesContainer = document.getElementById('notices-board-container');
  
  // Global Search
  const globalQuery = document.getElementById('global-search-input')?.value.toLowerCase().trim() || '';
  const filteredNews = news.filter(n => n.title.toLowerCase().includes(globalQuery) || n.desc.toLowerCase().includes(globalQuery) || n.category.toLowerCase().includes(globalQuery));
  const filteredNotices = notices.filter(n => n.title.toLowerCase().includes(globalQuery) || n.desc.toLowerCase().includes(globalQuery));

  // Update quick stat badges
  if (document.getElementById('stat-news-count')) {
    document.getElementById('stat-news-count').textContent = `${filteredNews.length} Active`;
  }
  if (document.getElementById('stat-alerts-count')) {
    document.getElementById('stat-alerts-count').textContent = `${filteredNotices.filter(n => n.type === 'high').length} High`;
  }

  // Render News
  if (newsContainer) {
    if (filteredNews.length === 0) {
      newsContainer.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-weight:600;">No news found matching your search.</div>`;
    } else {
      newsContainer.innerHTML = filteredNews.map(item => `
        <article class="news-card">
          <button class="delete-news-btn admin-only" data-id="${item.id}" title="Delete News">
            <i data-lucide="trash-2"></i>
          </button>
          <div class="news-card-meta" style="padding-right: 24px;">
            <span class="badge theme-primary">${item.category}</span>
            <span>${item.date}</span>
          </div>
          <h3 class="news-card-title" style="padding-right: 24px;">${item.title}</h3>
          <p class="news-card-desc">${item.desc}</p>
        </article>
      `).join('');
    }

    // Inline Delete Listeners
    newsContainer.querySelectorAll('.delete-news-btn').forEach(btn => {
      btn.addEventListener('click', () => requireAdmin(() => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this news article?')) {
          if (window.db) {
            window.db.collection('news').doc(id.toString()).delete();
          } else {
            news = news.filter(n => n.id !== id);
            saveStoredData('gs_news', news);
            renderNewsAndNotices();
          }
          showToast('News deleted successfully.');
        }
      }));
    });
  }

  // Render Notices
  if (noticesContainer) {
    if (filteredNotices.length === 0) {
      noticesContainer.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-weight:600;">No notices found matching your search.</div>`;
    } else {
      noticesContainer.innerHTML = filteredNotices.map(item => `
        <div class="notice-item ${item.type === 'high' ? 'notice-high' : item.type === 'warning' ? 'notice-warning' : ''}">
          <button class="delete-notice-btn admin-only" data-id="${item.id}" title="Delete Notice">
            <i data-lucide="trash-2"></i>
          </button>
          <div class="notice-date" style="padding-right: 24px;">${item.date}</div>
          <h4 class="notice-title" style="padding-right: 24px;">${item.title}</h4>
          <p class="notice-desc">${item.desc}</p>
        </div>
      `).join('');
    }

    // Inline Delete Listeners
    noticesContainer.querySelectorAll('.delete-notice-btn').forEach(btn => {
      btn.addEventListener('click', () => requireAdmin(() => {
        const id = parseInt(btn.getAttribute('data-id'));
        if (confirm('Are you sure you want to delete this notice?')) {
          notices = notices.filter(n => n.id !== id);
          saveStoredData('gs_notices', notices);
          renderNewsAndNotices();
          showToast('Notice deleted successfully.');
        }
      }));
    });
  }

  if (window.lucide) window.lucide.createIcons();
};

// Attach Event Listeners safely AFTER HTML has loaded
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. News Form Handlers
  document.getElementById('add-news-btn')?.addEventListener('click', () => requireAdmin(() => {
    const container = document.getElementById('add-news-form-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }));
  
  document.getElementById('cancel-news-btn')?.addEventListener('click', () => {
    document.getElementById('add-news-form-container').style.display = 'none';
    document.getElementById('news-addition-form')?.reset();
  });
  
  document.getElementById('news-addition-form')?.addEventListener('submit', (e) => requireAdmin(() => {
    e.preventDefault();
    const title = document.getElementById('news-title').value.trim();
    const category = document.getElementById('news-category').value;
    const desc = document.getElementById('news-desc').value.trim();
    const newArticle = { id: Date.now(), title, desc, category, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
    
    if (window.db) {
      window.db.collection('news').doc(newArticle.id.toString()).set(newArticle);
    } else {
      news.unshift(newArticle);
      saveStoredData('gs_news', news);
      renderNewsAndNotices();
    }
    e.target.reset();
    document.getElementById('add-news-form-container').style.display = 'none';
    showToast('News article published!');
  }));

  // 2. Notices Form Handlers
  document.getElementById('add-notice-btn')?.addEventListener('click', () => requireAdmin(() => {
    const container = document.getElementById('add-notice-form-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }));
  
  document.getElementById('cancel-notice-btn')?.addEventListener('click', () => {
    document.getElementById('add-notice-form-container').style.display = 'none';
    document.getElementById('notice-addition-form')?.reset();
  });
  
  document.getElementById('notice-addition-form')?.addEventListener('submit', (e) => requireAdmin(() => {
    e.preventDefault();
    const title = document.getElementById('notice-title').value.trim();
    const type = document.getElementById('notice-type').value;
    const desc = document.getElementById('notice-desc').value.trim();
    notices.unshift({ id: Date.now(), title, desc, type, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) });
    saveStoredData('gs_notices', notices);
    renderNewsAndNotices();
    e.target.reset();
    document.getElementById('add-notice-form-container').style.display = 'none';
    showToast('Public notice published!');
  }));

});