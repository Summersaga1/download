/* ============================================================
   SummerSagaMods — Global Script
   download.summersagamods.com
   ============================================================ */

(function () {
  'use strict';

  /* ── FOOTER YEAR ─────────────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── STICKY HEADER SHADOW ────────────────────────────────── */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE NAV TOGGLE ───────────────────────────────────── */
  var toggle = document.getElementById('nav-toggle');
  var nav    = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ── ACTIVE NAV LINK ─────────────────────────────────────── */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    var href = link.getAttribute('href');
    if (!href) return;
    // Exact match OR sub-path match (not root)
    if (
      (href === '/' && currentPath === '/') ||
      (href !== '/' && currentPath.startsWith(href))
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ── FAQ ACCORDION ───────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var btn    = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          var otherBtn = other.querySelector('.faq-question');
          var otherAns = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAns) {
            otherAns.hidden = true;
            otherAns.style.maxHeight = '';
          }
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
        answer.style.maxHeight = '';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        // Animate open
        var height = answer.scrollHeight + 'px';
        answer.style.maxHeight = '0';
        answer.style.overflow  = 'hidden';
        answer.style.transition = 'max-height 300ms cubic-bezier(0.22,1,0.36,1)';
        requestAnimationFrame(function () {
          answer.style.maxHeight = height;
        });
        answer.addEventListener('transitionend', function cleanup() {
          answer.style.maxHeight  = '';
          answer.style.overflow   = '';
          answer.style.transition = '';
          answer.removeEventListener('transitionend', cleanup);
        });
      }
    });
  });

  /* ── SCROLL-REVEAL (Intersection Observer) ───────────────── */
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll(
      '.platform-card, .feature-item, .faq-item, .version-badge-item, .version-text'
    );

    var style = document.createElement('style');
    style.textContent = [
      '.reveal-ready{opacity:0;transform:translateY(24px);transition:opacity 0.5s cubic-bezier(0.22,1,0.36,1),transform 0.5s cubic-bezier(0.22,1,0.36,1);}',
      '.reveal-ready.revealed{opacity:1;transform:none;}'
    ].join('');
    document.head.appendChild(style);

    revealEls.forEach(function (el, i) {
      el.classList.add('reveal-ready');
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerH  = header ? header.offsetHeight : 0;
      var top      = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
