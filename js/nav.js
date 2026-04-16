(function() {
  'use strict';

  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('.nav__links ol li a');
  const sections = document.querySelectorAll('main .section, #hero');

  let lastScrollY = 0;
  let ticking = false;

  // Hide/show nav on scroll
  function onScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 70) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  // Scroll spy
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(function(a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(function(section) {
    observer.observe(section);
  });

  // Smooth scroll for nav links
  navAnchors.forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, null, targetId);
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // Mobile hamburger menu
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  hamburger.addEventListener('click', function() {
    const isOpen = hamburger.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('active');
      document.body.classList.add('nav-open');
    }
  });

  // Close mobile menu on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Close mobile menu when clicking overlay
  document.addEventListener('click', function(e) {
    if (document.body.classList.contains('nav-open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });
})();
