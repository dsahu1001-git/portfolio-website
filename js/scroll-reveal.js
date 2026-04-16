(function() {
  'use strict';

  var revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Stagger children if they have .reveal-child class
        var children = entry.target.querySelectorAll('.reveal-child');
        children.forEach(function(child, i) {
          child.style.transitionDelay = (i * 100) + 'ms';
          child.classList.add('revealed');
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  });

  revealElements.forEach(function(el) {
    observer.observe(el);
  });
})();
