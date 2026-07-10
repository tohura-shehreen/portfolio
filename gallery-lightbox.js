// Tohura Shehreen — Digital art page: gallery lightbox + basic download deterrents

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     LIGHTBOX
  ----------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lb-lock');
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lb-lock');
    lightboxImg.src = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* -----------------------------------------------------
     GALLERY — click a tile to open it full size
  ----------------------------------------------------- */
  document.querySelectorAll('.gallery-grid').forEach((grid) => {
    grid.addEventListener('click', (e) => {
      const hit = e.target.closest('.gallery-item-hit');
      if (!hit) return;
      const item = hit.closest('.gallery-item');
      const full = item.getAttribute('data-full');
      const alt = item.getAttribute('data-alt') || '';
      if (full) openLightbox(full, alt);
    });
  });

  /* -----------------------------------------------------
     BASIC DOWNLOAD DETERRENTS
     (no client-side technique fully blocks saving an image —
     this just removes the easy right-click / drag paths)
  ----------------------------------------------------- */
  document.querySelectorAll('.gallery-item img, .lightbox-card img').forEach((img) => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', (e) => e.preventDefault());
    img.addEventListener('contextmenu', (e) => e.preventDefault());
  });
});
