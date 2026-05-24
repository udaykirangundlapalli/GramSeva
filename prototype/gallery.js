// Gallery & Cultural Archives Module
        
let activeGalleryFilter = 'All';

const renderGallery = () => {
  const container = document.getElementById('gallery-images-container');
  if (!container) return;

  const filteredGallery = activeGalleryFilter === 'All' 
    ? gallery 
    : gallery.filter(img => img.tag === activeGalleryFilter);

  if (filteredGallery.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding:30px; color:var(--text-muted); font-weight:600;">No photos found for this category.</div>`;
    return;
  }

  container.innerHTML = filteredGallery.map((img, idx) => `
    <div class="gallery-card animate-fade" data-index="${idx}" style="cursor: pointer;">
      <button class="delete-photo-btn admin-only" data-id="${img.id}" title="Delete Photo">
        <i data-lucide="trash-2"></i>
      </button>
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-tag">${img.tag}</span>
        <h4 class="gallery-title">${img.title}</h4>
      </div>
    </div>
  `).join('');

  // Attach click event handlers to delete buttons
  container.querySelectorAll('.delete-photo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => requireAdmin(() => {
      e.stopPropagation();
      const imgId = parseInt(btn.getAttribute('data-id'));
      if (confirm("Are you sure you want to delete this photo from the village gallery?")) {
        gallery = gallery.filter(img => img.id !== imgId);
        saveStoredData('gs_gallery', gallery);
        renderGallery();
      }
    }));
  });

  // Attach click handlers to cards for Lightbox
  container.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.delete-photo-btn')) return;
      const idx = parseInt(card.getAttribute('data-index'));
      // Map the filtered index back to the real object
      const targetImg = filteredGallery[idx];
      const realIndex = gallery.findIndex(img => img.id === targetImg.id);
      if (typeof openLightbox === 'function') openLightbox(realIndex);
    });
  });

  if (window.lucide) window.lucide.createIcons();
};

// Lightbox logic
let currentLightboxIndex = 0;
const openLightbox = (index) => {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxDownload = document.getElementById('lightbox-download-btn');
  
  if (!gallery[index] || !lightbox || !lightboxImg || !lightboxCaption) return;
  
  currentLightboxIndex = index;
  lightboxImg.src = gallery[index].src;
  lightboxCaption.textContent = gallery[index].title;
  if (lightboxDownload) {
    lightboxDownload.href = gallery[index].src;
    lightboxDownload.download = `${gallery[index].title.replace(/\s+/g, '_')}.jpg`;
  }
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();
};

const closeLightbox = () => {
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) lightbox.style.display = 'none';
  document.body.style.overflow = '';
};

const showPrevImage = () => {
  currentLightboxIndex = (currentLightboxIndex - 1 + gallery.length) % gallery.length;
  openLightbox(currentLightboxIndex);
};

const showNextImage = () => {
  currentLightboxIndex = (currentLightboxIndex + 1) % gallery.length;
  openLightbox(currentLightboxIndex);
};

// Ensure all listeners attach securely after HTML loads
document.addEventListener('DOMContentLoaded', () => {
  // Gallery Filter Listener
  const galleryFilter = document.getElementById('gallery-filter');
  if (galleryFilter) {
    galleryFilter.addEventListener('change', (e) => {
      activeGalleryFilter = e.target.value;
      renderGallery();
    });
  }

  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightbox = document.getElementById('gallery-lightbox');

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    }
  });

  // Mobile Swipe Gestures for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) {
        showNextImage(); // Swipe left
      } else if (touchEndX > touchStartX + 50) {
        showPrevImage(); // Swipe right
      }
    }, { passive: true });
  }

  // Safe Image Uploader with Compression
  const imageUploader = document.getElementById('gallery-image-uploader');
  if (imageUploader) {
    imageUploader.addEventListener('change', (e) => requireAdmin(() => {
      const files = e.target.files;
      if (files.length === 0) return;
      
      // Loop through all selected files for bulk upload
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            let width = img.width;
            let height = img.height;
            
            if (width > MAX_WIDTH) {
              height = Math.floor(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            // Only prompt for title/category on the first image if bulk uploading, or auto-generate
            let finalTitle = "Village Upload";
            let finalCategory = "Upload";
            
            if (files.length === 1) {
              const titleInput = prompt("Enter a description title for this village photo:", "Village Upload");
              if (titleInput === null) { e.target.value = ''; return; }
              const categoryInput = prompt("Enter a category tag (Festival, Scenery, Development, Culture, Upload):", "Upload");
              finalTitle = titleInput.trim() || "Village Photo";
              finalCategory = categoryInput ? categoryInput.trim() : "Upload";
            } else {
              finalTitle = `Village Photo ${Date.now().toString().slice(-4)}_${index}`;
            }
            
            gallery.unshift({ id: Date.now() + index, title: finalTitle, tag: finalCategory, src: compressedBase64 });
            
            try { 
              saveStoredData('gs_gallery', gallery); 
              renderGallery(); 
              if (index === files.length - 1 && typeof showToast === 'function') {
                showToast(`${files.length} Photo(s) compressed & uploaded!`);
              }
            } 
            catch (storageError) { 
              gallery.shift(); 
              if (typeof showToast === 'function') showToast("Browser Storage limit exceeded! Try clearing old photos.", "error"); 
            }
            e.target.value = '';
          };
        };
        reader.readAsDataURL(file);
      });
    }));
  }
});