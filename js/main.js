(function() {
  'use strict';

  // All modules are self-initializing via their IIFEs.
  // This file serves as a verification point and handles
  // any cross-cutting concerns.

  // Log load time for performance monitoring
  window.addEventListener('load', function() {
    if (window.performance) {
      var timing = performance.getEntriesByType('navigation')[0];
      if (timing) {
        console.log(
          '%cdeepaksahu.dev %cloaded in %c' + Math.round(timing.loadEventEnd - timing.startTime) + 'ms',
          'color: #64ffda; font-weight: bold;',
          'color: #8892b0;',
          'color: #64ffda; font-weight: bold;'
        );
      }
    }

    // Easter egg in console
    console.log(
      '%c\n' +
      '    ____  _____\n' +
      '   / __ \\/ ___/\n' +
      '  / / / /\\__ \\ \n' +
      ' / /_/ /___/ / \n' +
      '/_____//____/  \n',
      'color: #64ffda; font-size: 14px;'
    );
    console.log(
      '%cHey there! Curious about how this site was built?\n' +
      '%cPure HTML, CSS & vanilla JS — no frameworks, no build tools.\n' +
      'Try pressing Ctrl+` to open the terminal!',
      'color: #ccd6f6; font-size: 14px;',
      'color: #8892b0; font-size: 12px;'
    );
  });
})();
