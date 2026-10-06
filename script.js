// Robina Mushtaq — site interactions
(function () {
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  const panel = document.getElementById('menuPanel');

  // Nav background after scrolling past the hero
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.75);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Full-screen menu
  const setMenu = (open) => {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!panel.classList.contains('open')));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // Graceful image fallback (keeps layout intact if a photo is missing)
  const labels = { hero: '', portrait: 'Add robina-portrait.jpg', studio: 'The Next Address', avatar: 'RM' };
  document.querySelectorAll('img').forEach((img) => {
    const fail = () => {
      const box = img.parentElement;
      box.classList.add('img-fallback');
      box.setAttribute('data-label', labels[img.dataset.fallback] || '');
    };
    if (img.complete && img.naturalWidth === 0 && img.src) fail();
    else img.addEventListener('error', fail, { once: true });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
    io.observe(el);
  });

  // Count-up stats
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const end = +el.dataset.count; const suf = el.dataset.suffix || '';
      const t0 = performance.now(); const dur = 1600;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1); const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => cio.observe(c));

  // Contact form (front-end only: validates, then opens the visitor's email app)
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['name', 'email'].forEach((n) => {
      const input = form.elements[n];
      const valid = input.value.trim() && (n !== 'email' || /\S+@\S+\.\S+/.test(input.value));
      input.closest('.field').classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;
    const f = form.elements;
    const body = `Name: ${f.name.value}\nEmail: ${f.email.value}\nInterested in: ${f.interest.value}\nBudget: ${f.budget.value}\n\n${f.message.value}`;
    window.location.href = `mailto:robina@niharproperties.com?subject=${encodeURIComponent('Website enquiry — ' + f.interest.value)}&body=${encodeURIComponent(body)}`;
    document.getElementById('formOk').hidden = false;
    form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
