/* ================================================================
   NEWTONS INTERNATIONAL SCHOOL — JAVASCRIPT
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- YEAR ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- BACK TO TOP ---- */
  const bttBtn = document.getElementById('btt');
  if (bttBtn) {
    bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- PRELOADER ---- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 1500);
    });
  }

  /* ---- NAVBAR ---- */
  const navbar    = document.getElementById('navbar');
  const navItems  = document.querySelectorAll('.nav-item');
  const sections  = document.querySelectorAll('section[id]');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  const updateNav = () => {
    // Scrolled style
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navbar.offsetHeight - 60) {
        current = sec.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---- HAMBURGER ---- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.hs-num[data-target]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1800;
      const step   = target / (dur / 16);
      let cur = 0;
      const tick = () => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur);
        if (cur < target) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => countObs.observe(el));

  /* ---- LIGHTBOX (Gallery Mosaic) ---- */
  const mosaicItems = document.querySelectorAll('.mosaic-item');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  let lbList = [], lbIdx = 0;

  if (lightbox) {
    const openLB = (idx) => {
      lbList = [...document.querySelectorAll('.mosaic-item')];
      lbIdx  = idx;
      setLB();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeLB = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    const setLB = () => {
      const item = lbList[lbIdx];
      lbImg.src  = item.querySelector('img').src;
      lbImg.alt  = item.querySelector('img').alt;
    };

    mosaicItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        const visible = [...document.querySelectorAll('.mosaic-item')];
        openLB(visible.indexOf(item));
      });
    });
    lbClose.addEventListener('click', closeLB);
    lbPrev.addEventListener('click', () => { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; setLB(); });
    lbNext.addEventListener('click', () => { lbIdx = (lbIdx + 1) % lbList.length; setLB(); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; setLB(); }
      if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbList.length; setLB(); }
    });
  }

  /* ---- ADMISSION FORM ---- */
  const admForm    = document.getElementById('admForm');
  const admSuccess = document.getElementById('admSuccess');
  const admSubmit  = document.getElementById('admSubmit');

  if (admForm) {
    admForm.addEventListener('submit', e => {
      e.preventDefault();
      const required = admForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
        }
      });
      if (!valid) {
        admForm.style.animation = 'shake 0.4s ease';
        setTimeout(() => admForm.style.animation = '', 400);
        return;
      }
      admSubmit.innerHTML = 'Submitting...';
      admSubmit.disabled  = true;
      setTimeout(() => {
        admForm.style.display = 'none';
        admSuccess.style.display = 'block';
      }, 1400);
    });
  }

  /* ---- INJECT KEYFRAMES ---- */
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
  `;
  document.head.appendChild(s);

});
