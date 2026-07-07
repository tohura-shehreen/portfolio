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
});
