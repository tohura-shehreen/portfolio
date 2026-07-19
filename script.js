// Tohura Shehreen — portfolio shared behaviour

document.addEventListener('DOMContentLoaded', () => {
  // time-of-day cat companion — reading during the day, asleep after 7pm
  const orangeCat = document.getElementById('cat-orange');
  const bwCat = document.getElementById('cat-bw');
  const caption = document.getElementById('cat-caption');
  const timeBadge = document.getElementById('cat-time-badge');

  function updateCats() {
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;
    if (orangeCat) orangeCat.src = `assets/art/cat-orange-${isNight ? 'sleepy' : 'awake'}.gif`;
    if (bwCat) bwCat.src = `assets/art/cat-bw-${isNight ? 'sleepy' : 'awake'}.gif`;
    if (caption) caption.textContent = isNight ? 'shh, study session is over' : 'study buddy, pixel edition';
    if (timeBadge) timeBadge.textContent = isNight ? 'past 7pm — snoozing' : 'daytime — awake & reading';
  }
  if (orangeCat || bwCat) {
    updateCats();
    setInterval(updateCats, 10 * 60 * 1000); // recheck every 10 minutes
  }

  // mobile nav toggle
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach(el => io.observe(el));
    // safety net: never leave content permanently invisible
    setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 2500);
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // mark active nav link based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* -----------------------------------------------------
     CONTACT FALLBACK
     mailto:/tel: links don't always have an app to hand
     off to (no mail client on desktop, no SIM on a laptop,
     etc). We try the native link first; if the tab is
     still here a moment later, we show a small card with
     the info and a "copy" button instead.
  ----------------------------------------------------- */
  const NAME = 'Tohura Shehreen';
  const EMAIL = 'shehreentohura@gmail.com';
  const PHONE_DISPLAY = '+880 1741 300606';

  const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
  const telLinks = document.querySelectorAll('a[href^="tel:"]');

  if (mailtoLinks.length || telLinks.length) {

    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="contact-modal-backdrop"></div>' +
      '<div class="contact-modal-card" role="dialog" aria-modal="true" aria-label="Contact details">' +
        '<button type="button" class="contact-modal-close" aria-label="Close">&times;</button>' +
        '<p class="contact-modal-name">' + NAME + '</p>' +
        '<p class="contact-modal-role">Reach out any time —</p>' +
        '<p class="contact-modal-value"></p>' +
        '<button type="button" class="contact-modal-copy">Copy</button>' +
      '</div>';
    document.body.appendChild(modal);

    const valueEl = modal.querySelector('.contact-modal-value');
    const copyBtn = modal.querySelector('.contact-modal-copy');
    const closeBtn = modal.querySelector('.contact-modal-close');
    const backdrop = modal.querySelector('.contact-modal-backdrop');
    let copyText = '';

    function openContactModal(text) {
      copyText = text;
      valueEl.textContent = text;
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lb-lock');
    }
    function closeContactModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lb-lock');
    }
    closeBtn.addEventListener('click', closeContactModal);
    backdrop.addEventListener('click', closeContactModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeContactModal();
    });

    let toastEl = null;
    let toastTimer = null;
    function showToast(msg) {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'copy-toast';
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = msg;
      requestAnimationFrame(() => toastEl.classList.add('show'));
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    copyBtn.addEventListener('click', () => {
      if (!copyText) return;
      const done = () => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        showToast('Copied to clipboard!');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(done).catch(() => fallbackCopy(copyText, done));
      } else {
        fallbackCopy(copyText, done);
      }
    });

    function fallbackCopy(text, onDone) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        onDone();
      } catch (e) {
        showToast('Could not copy — please copy manually');
      }
      ta.remove();
    }

    // try the native app first; fall back to the modal if the
    // tab never lost focus (i.e. nothing opened to handle it)
    function tryNativeThenFallback(href, fallbackText) {
      let handedOff = false;
      function markHandedOff() { handedOff = true; cleanup(); }
      function onVisibilityChange() { if (document.hidden) markHandedOff(); }
      function cleanup() {
        window.removeEventListener('blur', markHandedOff);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      window.addEventListener('blur', markHandedOff);
      document.addEventListener('visibilitychange', onVisibilityChange);

      window.location.href = href;

      setTimeout(() => {
        cleanup();
        if (!handedOff) openContactModal(fallbackText);
      }, 600);
    }

    mailtoLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        tryNativeThenFallback(a.getAttribute('href'), EMAIL);
      });
    });
    telLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal(PHONE_DISPLAY);
      });
    });
  }

  // ---- project screenshot lightbox (pinned photo → scrollable gallery) ----
  const lightbox = document.getElementById('projLightbox');
  if (lightbox) {
    const scroller = document.getElementById('projLightboxScroller');
    const liveBtn = document.getElementById('projLightboxLive');
    const pins = document.querySelectorAll('.proj-photo-pin');
    let lastFocused = null;

    function openLightbox(pin) {
      const pairs = (pin.dataset.images || '').split(',').filter(Boolean);
      scroller.innerHTML = pairs.map((pair) => {
        const [src, caption] = pair.split('|');
        return `
          <figure class="proj-lightbox-slide">
            <img src="${src}" alt="${caption ? caption.replace(/"/g, '&quot;') : 'StudyCat screenshot'}">
            ${caption ? `<figcaption>${caption}</figcaption>` : ''}
          </figure>`;
      }).join('');

      const liveUrl = pin.dataset.live;
      if (liveUrl) {
        liveBtn.href = liveUrl;
        liveBtn.style.display = '';
      } else {
        liveBtn.style.display = 'none';
      }

      lastFocused = document.activeElement;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      scroller.scrollLeft = 0;
      lightbox.querySelector('.proj-lightbox-close').focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      scroller.innerHTML = '';
      if (lastFocused) lastFocused.focus();
    }

    pins.forEach((pin) => {
      pin.addEventListener('click', () => openLightbox(pin));
    });

    lightbox.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
});
