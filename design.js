// Tohura Shehreen — Design page: auto-scrolling carousels + lightbox

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
     CAROUSELS
  ----------------------------------------------------- */
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.car-track');
    const prevBtn = carousel.querySelector('.car-btn.prev');
    const nextBtn = carousel.querySelector('.car-btn.next');
    if (!track) return;

    // duplicate the items once so the strip can loop seamlessly
    const originalItems = Array.from(track.children);
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    let paused = false;
    let resumeTimer = null;
    const speed = 0.5; // px per frame, slow drift

    function loopIfNeeded() {
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) {
        track.scrollLeft -= half;
      } else if (track.scrollLeft <= 0) {
        // safety for manual scroll past the start
        track.scrollLeft += half;
      }
    }

    function tick() {
      if (!paused) {
        track.scrollLeft += speed;
        loopIfNeeded();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    function pauseAwhile(ms) {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, ms);
    }

    // hovering (or focusing) the strip pauses autoplay and hands scrolling to the user
    track.addEventListener('mouseenter', () => { paused = true; clearTimeout(resumeTimer); });
    track.addEventListener('mouseleave', () => { paused = false; });
    track.addEventListener('focusin', () => { paused = true; clearTimeout(resumeTimer); });
    track.addEventListener('focusout', () => { paused = false; });

    // let a normal vertical mouse wheel scroll the strip horizontally while hovered
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        track.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    // click-and-drag scrolling for desktop mouse users
    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('dragging');
    });
    // listen on the window (not the track) so we never retarget/steal
    // the click event on the item itself — that would break tap-to-open
    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 5) dragged = true;
      track.scrollLeft = startScroll - delta;
    });
    function endDrag() {
      isDown = false;
      track.classList.remove('dragging');
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // prev / next buttons
    function step(dir) {
      const cardWidth = track.querySelector('.car-item')?.offsetWidth || 300;
      track.scrollLeft += dir * (cardWidth + 24);
      pauseAwhile(3000);
    }
    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => step(1));

    // clicking an item opens the lightbox (unless it was actually a drag)
    track.addEventListener('click', (e) => {
      if (dragged) { dragged = false; return; }
      const hit = e.target.closest('.car-item-hit');
      if (!hit) return;
      const item = hit.closest('.car-item');
      const full = item.getAttribute('data-full');
      const alt = item.getAttribute('data-alt') || '';
      if (full) openLightbox(full, alt);
    });
  });
});
