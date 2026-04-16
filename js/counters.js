(function() {
  'use strict';

  var counters = document.querySelectorAll('.metrics__number');
  if (!counters.length) return;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';

    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var decimals = parseInt(el.dataset.decimals) || 0;
    var duration = 2000;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);
      var current = target * eased;

      if (decimals > 0) {
        el.textContent = current.toFixed(decimals) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var els = entry.target.querySelectorAll('.metrics__number');
        els.forEach(function(el, i) {
          // Stagger each counter
          setTimeout(function() {
            animateCounter(el);
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
  });

  var metricsSection = document.getElementById('metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
})();
