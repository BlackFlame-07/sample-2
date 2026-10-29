/* Aveline Interactive Motion & State Engine */
(function() {
  'use strict';
  
  // 1. Restore settled styles on load
  function restoreSettled() {
    document.querySelectorAll('[data-settled-opacity]').forEach(function(el) {
      var op = el.getAttribute('data-settled-opacity');
      if (parseFloat(op) > 0) {
        el.style.opacity = op;
      }
    });
    document.querySelectorAll('[data-settled-transform]').forEach(function(el) {
      var tr = el.getAttribute('data-settled-transform');
      if (tr && tr !== 'none') {
        el.style.transform = tr;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreSettled);
  } else {
    restoreSettled();
  }

  // 2. IntersectionObserver for Entrance Animations
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.transition = 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });

  window.addEventListener('load', function() {
    document.querySelectorAll('[data-framer-appear-id], [style*="opacity: 0"], [style*="opacity:0"]').forEach(function(el) {
      if (el.classList.contains('framer-kqsc3p') || el.classList.contains('framer-15eukk7') || el.getAttribute('data-framer-name') === 'Scrim' || el.getAttribute('data-framer-name') === 'Dropdowns') {
        return;
      }
      var cs = window.getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.2) {
        observer.observe(el);
      }
    });

    // 3. 60fps Infinite Ticker / Marquee Engine
    var tickers = document.querySelectorAll('[data-framer-name*="Ticker"], [data-framer-name*="Marquee"], [data-framer-name*="ticker"], [data-framer-name*="marquee"]');
    tickers.forEach(function(ticker) {
      var track = ticker.firstElementChild;
      if (!track) return;
      var currentX = 0;
      var speed = 0.75; // px per frame
      track.style.display = 'flex';
      track.style.willChange = 'transform';
      
      // Clone track children once to ensure seamless loop
      if (track.children.length > 0 && !track.getAttribute('data-cloned')) {
        track.setAttribute('data-cloned', 'true');
        var originalChildren = Array.from(track.children);
        originalChildren.forEach(function(child) {
          track.appendChild(child.cloneNode(true));
        });
      }

      function step() {
        currentX -= speed;
        var halfWidth = track.scrollWidth / 2;
        if (Math.abs(currentX) >= halfWidth) {
          currentX = 0;
        }
        track.style.transform = 'translate3d(' + currentX + 'px, 0px, 0px)';
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });

    // 4. Replay Captured Framer Click Variants (FAQs, Pricing Toggles, Tabs)
    window.__AVELINE_CLICK_STATES__ = [{"triggerId": "fn-115", "containerId": "fn-114", "stateA": "<button class=\"framer-YskcA framer-10dl2bh framer-v-1kzdtc3\" data-border=\"true\" data-framer-name=\"Ghost\" data-highlight=\"true\" data-reset=\"button\" tabindex=\"0\" style=\"--border-bottom-width: 1px; --border-color: rgba(255, 255, 255, 0.3); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; background-color: rgba(0, 0, 0, 0); border-radius: 999px; opacity: 1;\" data-settled-opacity=\"1\" data-f-id=\"fn-115\"><svg class=\"framer-4rnSx framer-thf8b8\" role=\"presentation\" viewBox=\"0 0 24 24\" style=\"--1m973uw: rgb(255, 255, 255); --js9iwy: 1.6; opacity: 1;\" data-settled-opacity=\"1\" data-f-id=\"fn-116\"><use href=\"#3938257237\" data-settled-opacity=\"1\" data-f-id=\"fn-117\"></use></svg></button>", "stateB": "<button class=\"framer-YskcA framer-10dl2bh framer-v-1kzdtc3 hover\" data-border=\"true\" data-highlight=\"true\" data-reset=\"button\" tabindex=\"0\" style=\"--border-bottom-width: 1px; --border-color: rgb(255, 255, 255); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; background-color: rgba(255, 255, 255, 0.12); border-radius: 999px; opacity: 1; will-change: auto;\" data-settled-opacity=\"1\" data-f-id=\"fn-115\"><svg class=\"framer-4rnSx framer-thf8b8\" role=\"presentation\" viewBox=\"0 0 24 24\" style=\"--1m973uw: rgb(255, 255, 255); --js9iwy: 1.6; opacity: 1;\" data-settled-opacity=\"1\" data-f-id=\"fn-116\"><use href=\"#3938257237\" data-settled-opacity=\"1\" data-f-id=\"fn-117\"></use></svg></button>"}, {"triggerId": "fn-130", "containerId": "fn-129", "stateA": "<button class=\"framer-YskcA framer-10dl2bh framer-v-1kzdtc3\" data-border=\"true\" data-framer-name=\"Ghost\" data-highlight=\"true\" data-reset=\"button\" tabindex=\"0\" style=\"--border-bottom-width: 1px; --border-color: rgba(255, 255, 255, 0.3); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; background-color: rgba(0, 0, 0, 0); border-radius: 999px; opacity: 1;\" data-settled-opacity=\"1\" data-f-id=\"fn-130\"><svg class=\"framer-ab47M framer-thf8b8\" role=\"presentation\" viewBox=\"0 0 24 24\" style=\"--1m973uw: rgb(255, 255, 255); --js9iwy: 1.6; opacity: 1;\" data-settled-opacity=\"1\" data-f-id=\"fn-131\"><use href=\"#2903821725\" data-settled-opacity=\"1\" data-f-id=\"fn-132\"></use></svg></button>", "stateB": "<button class=\"framer-YskcA framer-10dl2bh framer-v-1kzdtc3 hover\" data-border=\"true\" data-highlight=\"true\" data-reset=\"button\" tabindex=\"0\" style=\"--border-bottom-width: 1px; --border-color: rgb(255, 255, 255); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; background-color: rgba(255, 255, 255, 0.12); border-radius: 999px; opacity: 1; will-change: auto;\" data-settled-opacity=\"1\" data-f-id=\"fn-130\"><svg class=\"framer-ab47M framer-thf8b8\" role=\"presentation\" viewBox=\"0 0 24 24\" style=\"--1m973uw: rgb(255, 255, 255); --js9iwy: 1.6; opacity: 1;\" data-settled-opacity=\"1\" data-f-id=\"fn-131\"><use href=\"#2903821725\" data-settled-opacity=\"1\" data-f-id=\"fn-132\"></use></svg></button>"}];
    if (window.__AVELINE_CLICK_STATES__ && window.__AVELINE_CLICK_STATES__.length > 0) {
      window.__AVELINE_CLICK_STATES__.forEach(function(item) {
        var toggled = false;
        document.addEventListener('click', function(e) {
          var trigger = e.target.closest('[data-f-id="' + item.triggerId + '"]');
          if (!trigger) return;
          var container = document.querySelector('[data-f-id="' + item.containerId + '"]');
          if (!container) return;

          e.preventDefault();
          toggled = !toggled;
          if (document.startViewTransition) {
            // Uses Chromium View Transitions API for silky layout morphing between states
            document.startViewTransition(function() {
              container.innerHTML = toggled ? item.stateB : item.stateA;
            });
          } else {
            container.innerHTML = toggled ? item.stateB : item.stateA;
          }
        });
      });
    }

    // 5. Rehydrate 3D Perspective Tilt & Magnetic Cards
    document.querySelectorAll('[style*="perspective"], [data-framer-name*="Card"], [data-perspective="true"]').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1000px) rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 8).toFixed(2) + 'deg) scale3d(1.01, 1.01, 1.01)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  });
})();
