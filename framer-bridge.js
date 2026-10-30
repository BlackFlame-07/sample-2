/* Nordesthetics Fully Interactive Engine | Blackflame Agency */
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
    // Reveal all unrevealed elements
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

    // 4. Smooth Anchor Scrolling for Internal Links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      // If it's a consultation trigger, let the modal handler manage it
      var text = link.innerText.trim().toLowerCase();
      if (text.includes('consultation') || text.includes('request time') || text.includes('book with a specialist')) {
        return;
      }
      
      var targetId = href.slice(1);
      var targetEl = document.getElementById(targetId) || document.querySelector('[data-framer-name="' + targetId + '"]');
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 5. Hero Carousel Controls
    var heroSlides = [
      { src: './assets/nord_hero_clinic.png', pos: 'center bottom' },
      { src: './assets/clinic_interior_og.jpg', pos: 'center center' },
      { src: './assets/nord_hero_master.jpg', pos: 'center 30%' }
    ];
    var currentHeroIdx = 0;
    var heroButtons = document.querySelectorAll('#hero [data-framer-name="Ghost"], .framer-59oil5 button');
    if (heroButtons.length >= 2) {
      var prevHeroBtn = heroButtons[0];
      var nextHeroBtn = heroButtons[1];
      
      function setHeroSlide(idx) {
        currentHeroIdx = (idx + heroSlides.length) % heroSlides.length;
        var heroImg = document.querySelector('#hero [data-framer-name*="Slide"] img, .framer-80y4h2 img');
        if (heroImg) {
          heroImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          heroImg.style.opacity = '0.3';
          setTimeout(function() {
            heroImg.src = heroSlides[currentHeroIdx].src;
            heroImg.style.objectPosition = heroSlides[currentHeroIdx].pos;
            heroImg.style.opacity = '1';
          }, 180);
        }
      }
      
      prevHeroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        setHeroSlide(currentHeroIdx - 1);
      });
      nextHeroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        setHeroSlide(currentHeroIdx + 1);
      });
    }

    // 6. Treatments Carousel Controls
    var tButtons = document.querySelectorAll('#treatments button');
    var tRow = document.querySelector('#treatments .framer-1ygtwjr, [data-framer-name="Treatments row"]');
    if (tButtons.length >= 2 && tRow) {
      var prevTBtn = tButtons[0];
      var nextTBtn = tButtons[1];
      
      prevTBtn.addEventListener('click', function(e) {
        e.preventDefault();
        tRow.scrollBy({ left: -380, behavior: 'smooth' });
      });
      nextTBtn.addEventListener('click', function(e) {
        e.preventDefault();
        tRow.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }

    // 7. Reviews Carousel Controls (Stacked 4-Review Slideshow)
    var rButtons = document.querySelectorAll('#reviews button, .framer-t9hxwc button');
    var rSlides = document.querySelectorAll('#reviews [data-framer-name="Reviews row"] > div, .framer-t9hxwc .framer-1ykgbf5 > div');
    var currentRIdx = 0;

    function showReviewSlide(idx) {
      if (!rSlides.length) return;
      currentRIdx = (idx + rSlides.length) % rSlides.length;
      rSlides.forEach(function(s, i) {
        if (i === currentRIdx) {
          s.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          s.style.visibility = 'visible';
          s.style.opacity = '1';
          s.style.transform = 'none';
          s.style.pointerEvents = 'auto';
        } else {
          s.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          s.style.visibility = 'hidden';
          s.style.opacity = '0';
          s.style.transform = 'translateY(12px)';
          s.style.pointerEvents = 'none';
        }
      });
    }

    if (rButtons.length >= 2 && rSlides.length > 0) {
      var prevRBtn = rButtons[0];
      var nextRBtn = rButtons[1];
      
      prevRBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showReviewSlide(currentRIdx - 1);
      });
      nextRBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showReviewSlide(currentRIdx + 1);
      });
    }

    // 8. Specialists Doctor Tabs
    var doctorPhotos = [
      './assets/dr_tutkus_og.jpg',
      './assets/dr_kaupas_og.png',
      './assets/dr_tijunele_og.jpg',
      './assets/dr_bauzys_og.jpg'
    ];
    var specButtons = document.querySelectorAll('#specialists button, .framer-t9vo8c button');
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

        var specImg = document.getElementById('specialist-main-img') || document.querySelector('#specialists img');
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

    // 9. FAQ Accordions
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
          document.querySelectorAll('.framer-CNui5').forEach(function(c) {
            c.classList.remove('framer-v-wtjozs');
            c.classList.add('framer-v-1fsuiv0');
          });
          card.classList.remove('framer-v-1fsuiv0');
          card.classList.add('framer-v-wtjozs');
        }
      });
    });

    // 10. Wire Book Section & Treatments
    wireBookSection();

    // 11. Inject Official Booking Calendar & Modals
    injectModals();
  }); // Closes window.addEventListener('load')

  function wireBookSection() {
    var bookSec = document.getElementById('book');
    if (!bookSec) return;

    var optionCards = bookSec.querySelectorAll('[data-framer-name="Check-up & cleaning"], [data-framer-name="Whitening consultation"], [data-framer-name="Aligner consultation"], [data-framer-name="Implant consultation"], [data-framer-name="Emergency appointment"]');
    var yourVisitTitle = bookSec.querySelector('[data-framer-name="Your visit"] p, [data-framer-name="Your visit"]');

    var treatments = {
      'Check-up & cleaning': { name: 'Tummy Tuck', doctor: 'Dr. Jonas Tutkus' },
      'Whitening consultation': { name: 'Mommy Makeover', doctor: 'Dr. Jonas Tutkus' },
      'Aligner consultation': { name: 'Breast Augmentation & Lift', doctor: 'Dr. Simonas Kaupas' },
      'Implant consultation': { name: 'Deep Plane Facelift', doctor: 'Dr. Andrius Pajeda' },
      'Emergency appointment': { name: 'Urgent Consultation', doctor: 'Dr. Kamilė Tijūnėlė' }
    };

    optionCards.forEach(function(card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        e.preventDefault();
        var fname = card.getAttribute('data-framer-name');
        var data = treatments[fname];
        if (!data) return;

        optionCards.forEach(function(c) {
          c.style.opacity = '0.65';
          c.style.transform = 'scale(0.98)';
        });
        card.style.opacity = '1';
        card.style.transform = 'scale(1.02)';

        if (yourVisitTitle) {
          var tElem = yourVisitTitle.querySelector('span[style*="font-weight: 600"], strong, span') || yourVisitTitle;
          tElem.textContent = data.name + ' with ' + data.doctor;
        }

        if (window.openNordCalendar) {
          window.openNordCalendar({ procedure: data.name, doctor: data.doctor });
        }
      });
    });

    var reqTimeBtn = bookSec.querySelector('[data-framer-name="Request"] a, [data-framer-name="Accent"]');
    if (reqTimeBtn) {
      reqTimeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.openNordCalendar) {
          window.openNordCalendar();
        }
      });
    }
  }

  // Inject High-End Modals for Consultation, Legal & Articles
  function injectModals() {
    var modalCss = document.createElement('style');
    modalCss.id = 'nord-modals-css';
    modalCss.textContent = `
      .nord-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.82);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .nord-modal-backdrop.active {
        opacity: 1;
        pointer-events: auto;
      }
      .nord-modal-card {
        background: #101319;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05);
        max-width: 680px;
        width: 100%;
        max-height: 92vh;
        overflow-y: auto;
        padding: 32px;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Geist", "Segoe UI", Roboto, sans-serif;
        transform: scale(0.96) translateY(12px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
      }
      .nord-modal-backdrop.active .nord-modal-card {
        transform: scale(1) translateY(0);
      }
      .nord-modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.2s;
        z-index: 10;
      }
      .nord-modal-close:hover {
        background: rgba(255, 255, 255, 0.18);
      }
      
      .nord-mode-tabs {
        display: flex;
        gap: 8px;
        margin: 20px 0 24px 0;
        background: rgba(255, 255, 255, 0.04);
        padding: 4px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nord-mode-btn {
        flex: 1;
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 600;
        padding: 8px 12px;
        border-radius: 7px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s;
      }
      .nord-mode-btn.active {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .nord-doctor-select-row {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 8px;
        margin-bottom: 18px;
      }
      .nord-doc-pill {
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 12px;
        color: #cbd5e1;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
      }
      .nord-doc-pill:hover, .nord-doc-pill.active {
        background: rgba(56, 189, 248, 0.1);
        border-color: #38bdf8;
        color: #ffffff;
      }
      .nord-doc-pill .doc-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34d399;
      }

      .nord-track-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }
      .nord-track-item {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        font-size: 11px;
        line-height: 1.3;
        transition: all 0.2s;
        text-align: center;
      }
      .nord-track-item.active {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.08);
      }
      .nord-track-title {
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 2px;
      }
      .nord-track-sub {
        color: #94a3b8;
        font-size: 10px;
      }

      .nord-cal-box {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        padding: 16px;
        margin-bottom: 18px;
      }
      .nord-cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .nord-cal-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.01em;
      }
      .nord-cal-nav {
        display: flex;
        gap: 6px;
      }
      .nord-cal-nav-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #ffffff;
        border-radius: 6px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
      }
      .nord-cal-nav-btn:hover {
        background: rgba(255, 255, 255, 0.16);
      }
      .nord-cal-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-size: 11px;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .nord-cal-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }
      .nord-day-cell {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 500;
        border-radius: 8px;
        cursor: pointer;
        color: #cbd5e1;
        position: relative;
        transition: all 0.15s;
        border: 1px solid transparent;
      }
      .nord-day-cell:hover:not(.disabled) {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      }
      .nord-day-cell.active {
        background: #38bdf8 !important;
        color: #0b0d11 !important;
        font-weight: 700 !important;
        border-color: #38bdf8 !important;
      }
      .nord-day-cell.has-slots::after {
        content: '';
        position: absolute;
        bottom: 3px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #34d399;
      }
      .nord-day-cell.active::after {
        background: #0b0d11;
      }
      .nord-day-cell.disabled {
        opacity: 0.25;
        cursor: not-allowed;
      }

      .nord-slots-wrap {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nord-slots-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
        margin-bottom: 8px;
        font-weight: 600;
      }
      .nord-slots-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .nord-slot-pill {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 11px;
        color: #e2e8f0;
        cursor: pointer;
        transition: all 0.15s;
      }
      .nord-slot-pill:hover, .nord-slot-pill.active {
        background: rgba(56, 189, 248, 0.15);
        border-color: #38bdf8;
        color: #ffffff;
      }

      .nord-form-group {
        margin-bottom: 14px;
      }
      .nord-form-group label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        color: #94a3b8;
        margin-bottom: 5px;
      }
      .nord-form-input, .nord-form-select, .nord-form-textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 10px;
        padding: 10px 14px;
        color: #ffffff;
        font-size: 13px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .nord-form-input:focus, .nord-form-select:focus, .nord-form-textarea:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
      }
      .nord-submit-btn {
        width: 100%;
        background: #ffffff;
        color: #0b0d11;
        font-weight: 700;
        font-size: 14px;
        padding: 13px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 18px;
      }
      .nord-submit-btn:hover {
        background: #f1f5f9;
        transform: translateY(-1px);
      }
      .nord-success-card {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.25);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
      }
      .nord-voucher-box {
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 16px;
        margin: 16px 0;
        text-align: left;
        font-size: 13px;
        line-height: 1.6;
      }
      .nord-voucher-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .nord-voucher-row:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      .nord-voucher-label {
        color: #94a3b8;
      }
      .nord-voucher-val {
        color: #ffffff;
        font-weight: 600;
      }
      
      .nord-tab-btn {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 6px;
        transition: color 0.2s, background 0.2s;
      }
      .nord-tab-btn.active {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(modalCss);

    // Modal Markup
    var modalHtml = `
      <div id="nord-consultation-modal" class="nord-modal-backdrop">
        <div class="nord-modal-card">
          <button class="nord-modal-close" id="nord-close-consultation">&times;</button>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="./assets/nord_og_logo.png" style="height: 22px; filter: brightness(0) invert(1);">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #38bdf8; font-weight: 700;">Direct Clinic Reservation</span>
            </div>
            <span style="font-size: 11px; color: #34d399; display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399; display: inline-block;"></span>
              Live Slots Available
            </span>
          </div>

          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.02em;">Surgical Consultation & Booking Calendar</h2>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.45; margin-bottom: 16px;">
            Select your senior surgeon and preferred date for an initial 3D Crisalix simulation or reserve an upcoming Fast-Track surgery week in Kaunas, Lithuania.
          </p>

          <div class="nord-mode-tabs">
            <button class="nord-mode-btn active" id="mode-cal-btn">📅 Booking Calendar</button>
            <button class="nord-mode-btn" id="mode-calc-btn">🧮 2026 Price Calculator</button>
            <button class="nord-mode-btn" id="mode-wa-btn">💬 WhatsApp Coordinator</button>
          </div>

          <!-- 1. CALENDAR VIEW -->
          <div id="view-calendar">
            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 6px;">Select Senior Plastic Surgeon</label>
            <div class="nord-doctor-select-row" id="nord-doc-selector">
              <div class="nord-doc-pill active" data-doctor="Dr. Jonas Tutkus">
                <span class="doc-dot"></span>
                <span>Dr. Jonas Tutkus (Senior Plastic Surgeon)</span>
              </div>
              <div class="nord-doc-pill" data-doctor="Dr. Simonas Kaupas">
                <span class="doc-dot"></span>
                <span>Dr. Simonas Kaupas (Body Contouring)</span>
              </div>
              <div class="nord-doc-pill" data-doctor="Dr. Andrius Pajeda">
                <span class="doc-dot"></span>
                <span>Dr. Andrius Pajeda (Senior Surgeon)</span>
              </div>
              <div class="nord-doc-pill" data-doctor="Dr. Kamilė Tijūnėlė">
                <span class="doc-dot"></span>
                <span>Dr. Kamilė Tijūnėlė (Facial & Breast)</span>
              </div>
              <div class="nord-doc-pill" data-doctor="Dr. Karolis Baužys">
                <span class="doc-dot"></span>
                <span>Dr. Karolis Baužys (Reconstructive)</span>
              </div>
            </div>

            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 6px;">Consultation or Surgery Track</label>
            <div class="nord-track-grid" id="nord-track-selector">
              <div class="nord-track-item active" data-track="Free 3D Crisalix Video Consultation">
                <div class="nord-track-title">🎥 3D Consultation</div>
                <div class="nord-track-sub">Free Crisalix · Zoom/WhatsApp</div>
              </div>
              <div class="nord-track-item" data-track="Fast-Track Surgery Week (-5% Discount)">
                <div class="nord-track-title">⚡ Fast-Track Week</div>
                <div class="nord-track-sub">Save 5% · Next 30 Days</div>
              </div>
              <div class="nord-track-item" data-track="In-Person Kaunas Hospital Visit">
                <div class="nord-track-title">🏥 Kaunas Hospital</div>
                <div class="nord-track-sub">In-Person Pre-Op Exam</div>
              </div>
            </div>

            <div class="nord-cal-box">
              <div class="nord-cal-header">
                <div class="nord-cal-title" id="nord-cal-month-year">November 2026</div>
                <div class="nord-cal-nav">
                  <button class="nord-cal-nav-btn" id="nord-cal-prev">&lsaquo;</button>
                  <button class="nord-cal-nav-btn" id="nord-cal-next">&rsaquo;</button>
                </div>
              </div>
              <div class="nord-cal-weekdays">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div class="nord-cal-days" id="nord-cal-days-grid"></div>

              <div class="nord-slots-wrap">
                <div class="nord-slots-title">Available Slots for <span id="nord-selected-date-label">Thu, Nov 12</span></div>
                <div class="nord-slots-grid" id="nord-slots-grid">
                  <div class="nord-slot-pill active" data-slot="09:30 AM (GMT+2)">09:30 AM</div>
                  <div class="nord-slot-pill" data-slot="11:00 AM (GMT+2)">11:00 AM</div>
                  <div class="nord-slot-pill" data-slot="14:00 PM (GMT+2)">02:00 PM</div>
                  <div class="nord-slot-pill" data-slot="16:30 PM (GMT+2)">04:30 PM</div>
                  <div class="nord-slot-pill" data-slot="18:00 PM (GMT+2 / 16:00 UK)">06:00 PM (UK)</div>
                </div>
              </div>
            </div>

            <form id="nord-consultation-form">
              <div class="nord-form-group">
                <label>Procedure of Interest</label>
                <select id="nord-procedure-select" class="nord-form-select">
                  <option value="Tummy Tuck (Abdominoplasty)">Tummy Tuck (Abdominoplasty)</option>
                  <option value="Mommy Makeover (Combined Care)">Mommy Makeover (Combined Care)</option>
                  <option value="Breast Augmentation / Reduction & Lift">Breast Augmentation / Reduction & Lift</option>
                  <option value="Deep Plane Facelift & Neck Lift">Deep Plane Facelift & Neck Lift</option>
                  <option value="Rhinoplasty (Nose Surgery)">Rhinoplasty (Nose Surgery)</option>
                  <option value="Liposuction & Body Contouring">Liposuction & Body Contouring</option>
                </select>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="nord-form-group">
                  <label>Full Name *</label>
                  <input type="text" required class="nord-form-input" id="nord-name" placeholder="e.g. Victoria Smith">
                </div>
                <div class="nord-form-group">
                  <label>Email Address *</label>
                  <input type="email" required class="nord-form-input" id="nord-email" placeholder="v.smith@example.co.uk">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="nord-form-group">
                  <label>Phone / WhatsApp *</label>
                  <input type="tel" required class="nord-form-input" id="nord-phone" placeholder="+44 7700 900123">
                </div>
                <div class="nord-form-group">
                  <label>Height & Weight (Clinic Requirement)</label>
                  <input type="text" class="nord-form-input" id="nord-height-weight" placeholder="e.g. 170 cm / 65 kg">
                </div>
              </div>

              <div class="nord-form-group">
                <label>Medical Goals or Prior Surgeries</label>
                <textarea class="nord-form-textarea" id="nord-notes" rows="2" placeholder="Tell our surgeons about your cosmetic goals, questions, or target travel month..."></textarea>
              </div>

              <button type="submit" class="nord-submit-btn">
                <span>Confirm Consultation & Lock Date</span>
                <span style="font-size: 16px;">&rarr;</span>
              </button>
              <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 10px;">🔒 EU Patient Confidentiality (GDPR). Evaluated directly by Kaunas surgical coordinators.</p>
            </form>
          </div>

          <!-- 2. OFFICIAL CALCULATOR VIEW -->
          <div id="view-calculator" style="display: none;">
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 12px;">
              Nordesthetics' official 2026 combined surgery pricing calculator. Calculate multi-procedure bundle discounts and instant estimates.
            </p>
            <div style="position: relative; width: 100%; height: 500px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); background: #000;">
              <iframe src="https://calcnewplast.lovable.app/" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
            </div>
            <button class="nord-submit-btn" id="calc-back-to-booking" style="margin-top: 14px;">Return to Booking Calendar &rarr;</button>
          </div>

          <!-- 3. WHATSAPP FAST-TRACK VIEW -->
          <div id="view-whatsapp" style="display: none; text-align: center; padding: 20px 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(37, 211, 102, 0.15); border: 1px solid rgba(37, 211, 102, 0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px;">
              💬
            </div>
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Direct Clinic Coordinator Line</h3>
            <p style="font-size: 13px; color: #94a3b8; max-width: 420px; margin: 0 auto 20px; line-height: 1.5;">
              Connect immediately with a Nordesthetics patient coordinator at Kaunas Hospital. Average response time under 15 minutes during clinic hours (Mon–Fri 9:00–18:00 GMT+2).
            </p>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; max-width: 380px; margin: 0 auto 24px; text-align: left; font-size: 13px;">
              <div style="color: #94a3b8; margin-bottom: 4px;">Kaunas Hospital WhatsApp:</div>
              <div style="font-size: 16px; font-weight: 700; color: #ffffff;">+370 652 62092</div>
              <div style="color: #94a3b8; margin-top: 8px; margin-bottom: 4px;">UK Direct Inquiries:</div>
              <div style="font-size: 16px; font-weight: 700; color: #ffffff;">+44 203 949 5522</div>
            </div>
            <a href="https://api.whatsapp.com/send?phone=37065262092&text=Hello%20Nordesthetics%2C%20I%20would%20like%20to%20schedule%20a%20surgical%20consultation" target="_blank" rel="noopener noreferrer" class="nord-submit-btn" style="text-decoration: none; max-width: 380px; margin: 0 auto; background: #25D366; color: #ffffff;">
              <span>Open WhatsApp Chat Now</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- SUCCESS VOUCHER VIEW -->
          <div id="nord-consultation-success" style="display: none;">
            <div class="nord-success-card">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; color: #34d399;">
                ✓
              </div>
              <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">Consultation Slot Reserved</h3>
              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">
                Your request has been routed to Kaunas surgical coordination. You will receive an official confirmation via WhatsApp & Email.
              </p>

              <div class="nord-voucher-box">
                <div class="nord-voucher-row">
                  <span class="nord-voucher-label">Patient Name:</span>
                  <span class="nord-voucher-val" id="voucher-name">Victoria Smith</span>
                </div>
                <div class="nord-voucher-row">
                  <span class="nord-voucher-label">Procedure:</span>
                  <span class="nord-voucher-val" id="voucher-procedure">Tummy Tuck</span>
                </div>
                <div class="nord-voucher-row">
                  <span class="nord-voucher-label">Assigned Surgeon:</span>
                  <span class="nord-voucher-val" id="voucher-doctor">Dr. Jonas Tutkus</span>
                </div>
                <div class="nord-voucher-row">
                  <span class="nord-voucher-label">Reserved Date & Slot:</span>
                  <span class="nord-voucher-val" id="voucher-slot">Thu, Nov 12 · 11:00 AM (GMT+2)</span>
                </div>
                <div class="nord-voucher-row">
                  <span class="nord-voucher-label">Format:</span>
                  <span class="nord-voucher-val" id="voucher-track">Free 3D Crisalix Video Consultation</span>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
                <a id="nord-add-gcal" href="#" target="_blank" rel="noopener noreferrer" class="nord-submit-btn" style="margin-top: 0; font-size: 12px; text-decoration: none; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.15);">
                  📅 Add to Google Cal
                </a>
                <a id="nord-wa-confirm" href="https://api.whatsapp.com/send?phone=37065262092" target="_blank" rel="noopener noreferrer" class="nord-submit-btn" style="margin-top: 0; font-size: 12px; text-decoration: none; background: #25D366; color: #fff;">
                  💬 WhatsApp Notify
                </a>
              </div>

              <button class="nord-submit-btn" id="nord-success-done" style="margin-top: 12px; background: #ffffff; color: #000;">
                Done
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Legal & Privacy Modal -->
      <div id="nord-legal-modal" class="nord-modal-backdrop">
        <div class="nord-modal-card">
          <button class="nord-modal-close" id="nord-close-legal">&times;</button>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <img src="./assets/nord_og_logo.png" style="height: 24px; filter: brightness(0) invert(1);">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8; font-weight: 700;">Legal & Patient Governance</span>
          </div>
          
          <div class="nord-tabs">
            <button class="nord-tab-btn active" data-tab="privacy">Privacy & GDPR</button>
            <button class="nord-tab-btn" data-tab="terms">Patient Charter</button>
            <button class="nord-tab-btn" data-tab="accessibility">Accessibility</button>
          </div>

          <div id="legal-content-privacy" class="nord-legal-tab-pane">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">EU Medical Data & GDPR Protection</h3>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              Nordesthetics Clinic (Kaunakiemio str. 1a, Kaunas, Lithuania) complies fully with Regulation (EU) 2016/679 (General Data Protection Regulation) and Lithuanian healthcare privacy directives. All medical records, Crisalix 3D body scans, and surgeon consultation notes are encrypted with AES-256 standard.
            </p>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              We never share or commercialize patient information. Medical photos transmitted for preliminary surgical assessment are retained exclusively within our certified clinical coordination repository and can be deleted upon patient request.
            </p>
          </div>

          <div id="legal-content-terms" class="nord-legal-tab-pane" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">European Patient Charter & Treatment Terms</h3>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              All surgical procedures are performed in our licensed Kaunas surgical hospital in accordance with European Union healthcare standards. Full package prices include all surgeon fees, anesthesiology, post-operative hospital stay, 24/7 personal nursing care, medication, compression garments, and Kaunas/Vilnius airport transfers.
            </p>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              Revision policy: Nordesthetics provides guaranteed revision surgery coverage in accordance with our formal aftercare protocol for up to 12 months following primary surgery.
            </p>
          </div>

          <div id="legal-content-accessibility" class="nord-legal-tab-pane" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Web Accessibility Standards (WCAG 2.1 AA)</h3>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              This digital flagship is engineered to conform with Level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines 2.1. We enforce full keyboard navigability, high color contrast ratios, screen-reader friendly DOM hierarchies, and reduced motion preferences across all platforms.
            </p>
          </div>
        </div>
      </div>
    `;

    var modalContainer = document.createElement('div');
    modalContainer.id = 'nord-modals-root';
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    var consultModal = document.getElementById('nord-consultation-modal');
    var legalModal = document.getElementById('nord-legal-modal');

    var calState = {
      doctor: 'Dr. Jonas Tutkus',
      track: 'Free 3D Crisalix Video Consultation',
      procedure: 'Tummy Tuck (Abdominoplasty)',
      year: 2026,
      month: 10,
      selectedDay: 12,
      selectedSlot: '11:00 AM (GMT+2)',
      name: '',
      email: '',
      phone: ''
    };

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function renderCalendar() {
      var monthYearLabel = document.getElementById('nord-cal-month-year');
      if (monthYearLabel) {
        monthYearLabel.textContent = monthNames[calState.month] + ' ' + calState.year;
      }

      var grid = document.getElementById('nord-cal-days-grid');
      if (!grid) return;
      grid.innerHTML = '';

      var firstDayIndex = new Date(calState.year, calState.month, 1).getDay();
      firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

      var totalDays = new Date(calState.year, calState.month + 1, 0).getDate();

      for (var i = 0; i < firstDayIndex; i++) {
        var blank = document.createElement('div');
        blank.className = 'nord-day-cell disabled';
        grid.appendChild(blank);
      }

      for (var day = 1; day <= totalDays; day++) {
        var cell = document.createElement('div');
        cell.className = 'nord-day-cell';
        cell.textContent = day;

        var cellDate = new Date(calState.year, calState.month, day);
        var dayOfWeek = cellDate.getDay();
        if (dayOfWeek !== 0) {
          cell.classList.add('has-slots');
        } else {
          cell.classList.add('disabled');
        }

        if (day === calState.selectedDay) {
          cell.classList.add('active');
        }

        (function(d) {
          cell.addEventListener('click', function() {
            calState.selectedDay = d;
            renderCalendar();
            updateSelectedDateLabel();
          });
        })(day);

        grid.appendChild(cell);
      }

      updateSelectedDateLabel();
    }

    function updateSelectedDateLabel() {
      var lbl = document.getElementById('nord-selected-date-label');
      if (lbl) {
        var d = new Date(calState.year, calState.month, calState.selectedDay);
        var weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        lbl.textContent = weekdayNames[d.getDay()] + ', ' + monthNames[calState.month].slice(0,3) + ' ' + calState.selectedDay;
      }
    }

    document.getElementById('nord-cal-prev').addEventListener('click', function(e) {
      e.preventDefault();
      calState.month--;
      if (calState.month < 0) {
        calState.month = 11;
        calState.year--;
      }
      calState.selectedDay = 10;
      renderCalendar();
    });

    document.getElementById('nord-cal-next').addEventListener('click', function(e) {
      e.preventDefault();
      calState.month++;
      if (calState.month > 11) {
        calState.month = 0;
        calState.year++;
      }
      calState.selectedDay = 10;
      renderCalendar();
    });

    document.querySelectorAll('.nord-slot-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.nord-slot-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        calState.selectedSlot = pill.getAttribute('data-slot');
      });
    });

    document.querySelectorAll('.nord-doc-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.nord-doc-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        calState.doctor = pill.getAttribute('data-doctor');
      });
    });

    document.querySelectorAll('.nord-track-item').forEach(function(item) {
      item.addEventListener('click', function() {
        document.querySelectorAll('.nord-track-item').forEach(function(it) { it.classList.remove('active'); });
        item.classList.add('active');
        calState.track = item.getAttribute('data-track');
      });
    });

    var vCal = document.getElementById('view-calendar');
    var vCalc = document.getElementById('view-calculator');
    var vWa = document.getElementById('view-whatsapp');
    var mCalBtn = document.getElementById('mode-cal-btn');
    var mCalcBtn = document.getElementById('mode-calc-btn');
    var mWaBtn = document.getElementById('mode-wa-btn');

    function switchMode(mode) {
      mCalBtn.classList.remove('active');
      mCalcBtn.classList.remove('active');
      mWaBtn.classList.remove('active');
      vCal.style.display = 'none';
      vCalc.style.display = 'none';
      vWa.style.display = 'none';

      if (mode === 'calculator') {
        mCalcBtn.classList.add('active');
        vCalc.style.display = 'block';
      } else if (mode === 'whatsapp') {
        mWaBtn.classList.add('active');
        vWa.style.display = 'block';
      } else {
        mCalBtn.classList.add('active');
        vCal.style.display = 'block';
      }
    }

    mCalBtn.addEventListener('click', function() { switchMode('calendar'); });
    mCalcBtn.addEventListener('click', function() { switchMode('calculator'); });
    mWaBtn.addEventListener('click', function() { switchMode('whatsapp'); });
    document.getElementById('calc-back-to-booking').addEventListener('click', function() { switchMode('calendar'); });

    function openConsultation(preset) {
      consultModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      var modeTabs = document.querySelector('.nord-mode-tabs');
      if (modeTabs) modeTabs.style.display = 'flex';
      switchMode('calendar');
      renderCalendar();

      document.getElementById('view-calendar').style.display = 'block';
      document.getElementById('nord-consultation-form').style.display = 'block';
      document.getElementById('nord-consultation-success').style.display = 'none';

      if (preset && preset.procedure) {
        var procSelect = document.getElementById('nord-procedure-select');
        for (var i = 0; i < procSelect.options.length; i++) {
          if (procSelect.options[i].value.toLowerCase().includes(preset.procedure.toLowerCase())) {
            procSelect.selectedIndex = i;
            calState.procedure = procSelect.options[i].value;
            break;
          }
        }
      }
      if (preset && preset.doctor) {
        document.querySelectorAll('.nord-doc-pill').forEach(function(pill) {
          if (pill.getAttribute('data-doctor').toLowerCase().includes(preset.doctor.toLowerCase())) {
            pill.click();
          }
        });
      }
    }
    window.openNordCalendar = openConsultation;

    function closeConsultation() {
      consultModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.getElementById('nord-close-consultation').addEventListener('click', closeConsultation);

    document.getElementById('nord-consultation-form').addEventListener('submit', function(e) {
      e.preventDefault();
      calState.name = document.getElementById('nord-name').value || 'Victoria Smith';
      calState.email = document.getElementById('nord-email').value || 'v.smith@example.co.uk';
      calState.phone = document.getElementById('nord-phone').value || '+44 7700 900123';
      calState.procedure = document.getElementById('nord-procedure-select').value;

      var d = new Date(calState.year, calState.month, calState.selectedDay);
      var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var fullDateStr = weekdayNames[d.getDay()] + ', ' + monthNames[calState.month] + ' ' + calState.selectedDay + ', ' + calState.year;

      document.getElementById('voucher-name').textContent = calState.name;
      document.getElementById('voucher-procedure').textContent = calState.procedure;
      document.getElementById('voucher-doctor').textContent = calState.doctor;
      document.getElementById('voucher-slot').textContent = fullDateStr + ' · ' + calState.selectedSlot;
      document.getElementById('voucher-track').textContent = calState.track;

      var gcalTitle = encodeURIComponent('Nordesthetics Surgical Consultation: ' + calState.procedure + ' with ' + calState.doctor);
      var gcalDetails = encodeURIComponent('Consultation with ' + calState.doctor + ' at Nordesthetics Clinic.\nPatient: ' + calState.name + '\nProcedure: ' + calState.procedure + '\nFormat: ' + calState.track + '\nContact: +370 652 62092');
      var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + gcalTitle + '&details=' + gcalDetails + '&location=' + encodeURIComponent('Nordesthetics Clinic, Kaunakiemio str. 1a, Kaunas, Lithuania');
      document.getElementById('nord-add-gcal').setAttribute('href', gcalUrl);

      var waMsg = encodeURIComponent('Hello Nordesthetics Coordinator, I have booked a ' + calState.track + ' on ' + fullDateStr + ' at ' + calState.selectedSlot + ' with ' + calState.doctor + ' for ' + calState.procedure + '. Patient Name: ' + calState.name + '.');
      document.getElementById('nord-wa-confirm').setAttribute('href', 'https://api.whatsapp.com/send?phone=37065262092&text=' + waMsg);

      document.getElementById('view-calendar').style.display = 'none';
      document.querySelector('.nord-mode-tabs').style.display = 'none';
      document.getElementById('nord-consultation-success').style.display = 'block';
    });

    document.getElementById('nord-success-done').addEventListener('click', closeConsultation);

    function openLegal(tabName) {
      legalModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      switchLegalTab(tabName || 'privacy');
    }

    function closeLegal() {
      legalModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function switchLegalTab(tab) {
      document.querySelectorAll('.nord-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
      });
      document.querySelectorAll('.nord-legal-tab-pane').forEach(function(pane) {
        pane.style.display = pane.id === ('legal-content-' + tab) ? 'block' : 'none';
      });
    }

    document.getElementById('nord-close-legal').addEventListener('click', closeLegal);
    document.querySelectorAll('.nord-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchLegalTab(btn.getAttribute('data-tab'));
      });
    });

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('a, button');
      if (!btn) return;
      if (btn.closest('#nord-consultation-modal') || btn.closest('#nord-legal-modal')) return;
      var text = btn.innerText.trim();
      var href = btn.getAttribute('href') || '';

      if (text.includes('Consultation') || text.includes('Request time') || text.includes('Book with a specialist') || text.includes('Live availability') || (href === '#contact' && !btn.closest('nav'))) {
        e.preventDefault();
        openConsultation();
        return;
      }

      if (href.includes('privacy') || text === 'Privacy') {
        e.preventDefault();
        openLegal('privacy');
        return;
      }
      if (href.includes('terms') || text === 'Terms') {
        e.preventDefault();
        openLegal('terms');
        return;
      }
      if (href.includes('accessibility') || text === 'Accessibility') {
        e.preventDefault();
        openLegal('accessibility');
        return;
      }
    });

    consultModal.addEventListener('click', function(e) {
      if (e.target === consultModal) closeConsultation();
    });
    legalModal.addEventListener('click', function(e) {
      if (e.target === legalModal) closeLegal();
    });

    var newsForm = document.querySelector('form[data-framer-name*="Newsletter"], form');
    if (newsForm) {
      newsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var subBtn = newsForm.querySelector('button[type="submit"], button');
        var input = newsForm.querySelector('input[type="email"]');
        if (subBtn) {
          subBtn.textContent = '✓ Subscribed';
          subBtn.style.background = '#10b981';
          subBtn.style.color = '#ffffff';
          if (input) input.value = '';
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeConsultation();
        closeLegal();
      }
    });
  }
})();
