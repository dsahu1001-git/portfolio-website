(function() {
  'use strict';

  var typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  var phrases = [
    'build platforms that scale.',
    'lead high-performing engineering teams.',
    'architect cloud-native infrastructure.',
    'drive DevOps transformations.',
    'manage 60+ Kubernetes clusters.',
  ];

  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 50;
  var deleteSpeed = 30;
  var pauseEnd = 2000;
  var pauseBetween = 500;

  function tick() {
    var currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typedEl.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, pauseBetween);
        return;
      }
      setTimeout(tick, deleteSpeed);
    } else {
      charIndex++;
      typedEl.textContent = currentPhrase.substring(0, charIndex);

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tick, pauseEnd);
        return;
      }
      setTimeout(tick, typeSpeed);
    }
  }

  // Start after hero animations
  setTimeout(tick, 1200);
})();
