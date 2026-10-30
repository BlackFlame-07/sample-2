/* Nordesthetics Bespoke Interactive Motion & State Engine */
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
      var speed = 0.75;
      track.style.display = 'flex';
      track.style.willChange = 'transform';
      
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

    // 4. Smooth Anchor Scrolling for ALL Internal Buttons & Links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var targetId = href.slice(1);
      var targetEl = document.getElementById(targetId) || document.querySelector('[data-framer-name="' + targetId + '"]');
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 5. Interactive FAQ Accordion Logic
    document.querySelectorAll('.framer-CNui5, [data-framer-name="Question"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var card = btn.closest('.framer-CNui5') || btn.parentElement;
        if (!card) return;
        e.preventDefault();
        var isOpen = card.classList.contains('framer-v-wtjozs');
        if (isOpen) {
          card.classList.remove('framer-v-wtjozs');
          card.classList.add('framer-v-1fsuiv0');
        } else {
          // Accordion toggle
          document.querySelectorAll('.framer-CNui5').forEach(function(c) {
            c.classList.remove('framer-v-wtjozs');
            c.classList.add('framer-v-1fsuiv0');
          });
          card.classList.remove('framer-v-1fsuiv0');
          card.classList.add('framer-v-wtjozs');
        }
      });
    });

    // 6. Interactive Specialists Tab Switching
    var doctorPhotos = [
      './assets/dr_tutkus_og.jpg',
      './assets/dr_kaupas_og.png',
      './assets/dr_tijunele_og.jpg',
      './assets/dr_bauzys_og.jpg'
    ];
    var specButtons = document.querySelectorAll('.framer-t9vo8c button, [data-framer-name="Specialists"] button');
    specButtons.forEach(function(btn, idx) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        specButtons.forEach(function(b) {
          b.classList.remove('framer-v-l7hn10');
          b.classList.add('framer-v-18yegsd');
          b.setAttribute('data-framer-name', 'Default');
        });
        btn.classList.remove('framer-v-18yegsd');
        btn.classList.add('framer-v-l7hn10');
        btn.setAttribute('data-framer-name', 'Active');

        var specImg = document.getElementById('specialist-main-img') || document.querySelector('.framer-t9vo8c img');
        if (specImg && doctorPhotos[idx]) {
          specImg.style.transition = 'opacity 0.25s ease';
          specImg.style.opacity = '0';
          setTimeout(function() {
            specImg.src = doctorPhotos[idx];
            specImg.style.objectPosition = 'center 15%';
            specImg.style.opacity = '1';
          }, 180);
        }
      });
    });

    // 7. Interactive Hero Carousel Next / Prev Controls
    var heroSlides = [
      { src: './assets/nord_hero_master.jpg', pos: 'center 30%' },
      { src: './assets/clinic_interior_og.jpg', pos: 'center center' },
      { src: './assets/nord_hero_clinic.png', pos: 'center 25%' }
    ];
    var currentHeroIdx = 0;
    var heroGhostButtons = document.querySelectorAll('.framer-59oil5 button, [data-framer-name="Ghost"]');
    if (heroGhostButtons.length >= 2) {
      var prevBtn = heroGhostButtons[0];
      var nextBtn = heroGhostButtons[1];
      
      function setHeroSlide(idx) {
        currentHeroIdx = (idx + heroSlides.length) % heroSlides.length;
        var heroImgs = document.querySelectorAll('.framer-59oil5 [data-framer-name*="Slide"] img, .framer-80y4h2 img');
        if (heroImgs.length > 0) {
          heroImgs[0].style.transition = 'opacity 0.3s ease';
          heroImgs[0].style.opacity = '0';
          setTimeout(function() {
            heroImgs[0].src = heroSlides[currentHeroIdx].src;
            heroImgs[0].style.objectPosition = heroSlides[currentHeroIdx].pos;
            heroImgs[0].style.opacity = '1';
          }, 200);
        }
      }
      
      prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        setHeroSlide(currentHeroIdx - 1);
      });
      nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        setHeroSlide(currentHeroIdx + 1);
      });
    }

    // 8. Interactive Reviews Carousel Controls
    var reviewButtons = document.querySelectorAll('.framer-t9hxwc button, [data-framer-name="Dark"]');
    var reviewRow = document.querySelector('.framer-t9hxwc [data-framer-name="Reviews row"], .framer-t9hxwc .framer-1a74d2');
    var rX = 0;
    if (reviewButtons.length >= 2 && reviewRow) {
      reviewButtons[0].addEventListener('click', function(e) {
        e.preventDefault();
        rX = Math.max(0, rX - 440);
        reviewRow.scrollTo({ left: rX, behavior: 'smooth' });
      });
      reviewButtons[1].addEventListener('click', function(e) {
        e.preventDefault();
        rX += 440;
        reviewRow.scrollTo({ left: rX, behavior: 'smooth' });
      });
    }

    // 9. Interactive 3D Tilt on Feature Cards
    document.querySelectorAll('[style*="perspective"], [data-framer-name*="Card"], [data-perspective="true"]').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1000px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) scale3d(1.01, 1.01, 1.01)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  });
})();
