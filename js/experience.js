(function() {
  'use strict';

  var tabs = document.querySelectorAll('.experience__tab');
  var panels = document.querySelectorAll('.experience__panel');
  var indicator = document.querySelector('.experience__indicator');
  if (!tabs.length || !indicator) return;

  function activateTab(tab) {
    var targetId = tab.getAttribute('aria-controls');

    // Update tabs
    tabs.forEach(function(t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Update panels
    panels.forEach(function(p) {
      p.classList.remove('active');
      p.hidden = true;
    });
    var activePanel = document.getElementById(targetId);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.hidden = false;
    }

    // Move indicator
    moveIndicator(tab);
  }

  function moveIndicator(tab) {
    var isMobile = window.innerWidth < 768;
    if (isMobile) {
      indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
      indicator.style.width = tab.offsetWidth + 'px';
    } else {
      indicator.style.transform = 'translateY(' + tab.offsetTop + 'px)';
      indicator.style.width = '';
    }
  }

  // Click handlers
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      activateTab(tab);
    });
  });

  // Keyboard navigation
  var tabList = document.querySelector('.experience__tabs');
  tabList.addEventListener('keydown', function(e) {
    var isMobile = window.innerWidth < 768;
    var prevKey = isMobile ? 'ArrowLeft' : 'ArrowUp';
    var nextKey = isMobile ? 'ArrowRight' : 'ArrowDown';

    if (e.key === prevKey || e.key === nextKey) {
      e.preventDefault();
      var currentIndex = Array.from(tabs).indexOf(document.activeElement);
      var nextIndex;

      if (e.key === nextKey) {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }

      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    }

    if (e.key === 'Home') {
      e.preventDefault();
      tabs[0].focus();
      activateTab(tabs[0]);
    }

    if (e.key === 'End') {
      e.preventDefault();
      tabs[tabs.length - 1].focus();
      activateTab(tabs[tabs.length - 1]);
    }
  });

  // Recalculate indicator on resize
  window.addEventListener('resize', function() {
    var activeTab = document.querySelector('.experience__tab.active');
    if (activeTab) moveIndicator(activeTab);
  });

  // Initialize indicator position
  moveIndicator(tabs[0]);
})();
