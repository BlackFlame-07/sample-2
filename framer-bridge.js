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
      './assets/svs_doctor_umer.jpg',
      './assets/svs_interior_chair.jpg',
      './assets/svs_hero_surgery.jpg',
      './assets/svs_reception.jpg'
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
      'Check-up & cleaning': { name: 'Invisalign® Aligners', doctor: 'Dr. Umer (Diamond Apex)' },
      'Whitening consultation': { name: 'Dental Implants', doctor: 'Dr. Umer & Surgical Team' },
      'Aligner consultation': { name: 'Composite Bonding', doctor: 'Cosmetic Dental Team' },
      'Implant consultation': { name: 'Porcelain Veneers', doctor: 'Dr. Umer' },
      'Emergency appointment': { name: 'Emergency Dental Relief', doctor: 'Same-Day Dental Team' }
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
    modalCss.id = 'svs-modals-css';
    modalCss.textContent = `
      .svs-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(4, 8, 16, 0.86);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .svs-modal-backdrop.active {
        opacity: 1;
        pointer-events: auto;
      }
      .svs-modal-card {
        background: #0d121c;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.06);
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
      .svs-modal-backdrop.active .svs-modal-card {
        transform: scale(1) translateY(0);
      }
      .svs-modal-close {
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
      .svs-modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .svs-mode-tabs {
        display: flex;
        gap: 8px;
        margin: 20px 0 24px 0;
        background: rgba(255, 255, 255, 0.04);
        padding: 4px;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .svs-mode-btn {
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
      .svs-mode-btn.active {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .svs-doctor-select-row {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 8px;
        margin-bottom: 18px;
      }
      .svs-doc-pill {
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
      .svs-doc-pill:hover, .svs-doc-pill.active {
        background: rgba(56, 189, 248, 0.12);
        border-color: #38bdf8;
        color: #ffffff;
      }
      .svs-doc-pill .doc-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34d399;
      }

      .svs-track-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }
      .svs-track-item {
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
      .svs-track-item.active {
        border-color: #38bdf8;
        background: rgba(56, 189, 248, 0.08);
      }
      .svs-track-title {
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 2px;
      }
      .svs-track-sub {
        color: #94a3b8;
        font-size: 10px;
      }

      .svs-cal-box {
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        padding: 16px;
        margin-bottom: 18px;
      }
      .svs-cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .svs-cal-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: -0.01em;
      }
      .svs-cal-nav {
        display: flex;
        gap: 6px;
      }
      .svs-cal-nav-btn {
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
      .svs-cal-nav-btn:hover {
        background: rgba(255, 255, 255, 0.18);
      }
      .svs-cal-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-size: 11px;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .svs-cal-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }
      .svs-day-cell {
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
      .svs-day-cell:hover:not(.disabled) {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      }
      .svs-day-cell.active {
        background: #38bdf8 !important;
        color: #080c14 !important;
        font-weight: 700 !important;
        border-color: #38bdf8 !important;
      }
      .svs-day-cell.has-slots::after {
        content: '';
        position: absolute;
        bottom: 3px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #34d399;
      }
      .svs-day-cell.active::after {
        background: #080c14;
      }
      .svs-day-cell.disabled {
        opacity: 0.25;
        cursor: not-allowed;
      }

      .svs-slots-wrap {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .svs-slots-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
        margin-bottom: 8px;
        font-weight: 600;
      }
      .svs-slots-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .svs-slot-pill {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 11px;
        color: #e2e8f0;
        cursor: pointer;
        transition: all 0.15s;
      }
      .svs-slot-pill:hover, .svs-slot-pill.active {
        background: rgba(56, 189, 248, 0.15);
        border-color: #38bdf8;
        color: #ffffff;
      }

      .svs-form-group {
        margin-bottom: 14px;
      }
      .svs-form-group label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        color: #94a3b8;
        margin-bottom: 5px;
      }
      .svs-form-input, .svs-form-select, .svs-form-textarea {
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
      .svs-form-input:focus, .svs-form-select:focus, .svs-form-textarea:focus {
        border-color: #38bdf8;
        box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
      }
      .svs-submit-btn {
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
      .svs-submit-btn:hover {
        background: #f1f5f9;
        transform: translateY(-1px);
      }
      .svs-success-card {
        background: rgba(16, 185, 129, 0.08);
        border: 1px solid rgba(16, 185, 129, 0.25);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
      }
      .svs-voucher-box {
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 16px;
        margin: 16px 0;
        text-align: left;
        font-size: 13px;
        line-height: 1.6;
      }
      .svs-voucher-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }
      .svs-voucher-row:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      .svs-voucher-label {
        color: #94a3b8;
      }
      .svs-voucher-val {
        color: #ffffff;
        font-weight: 600;
      }
      
      .svs-tab-btn {
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
      .svs-tab-btn.active {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(modalCss);

    // Modal Markup
    var modalHtml = `
      <div id="nord-consultation-modal" class="svs-modal-backdrop">
        <div class="svs-modal-card">
          <button class="svs-modal-close" id="nord-close-consultation">&times;</button>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="./assets/svs_logo_navy.png" style="height: 24px; filter: brightness(0) invert(1);">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #38bdf8; font-weight: 700;">Finnieston, Glasgow G3 8LH</span>
            </div>
            <span style="font-size: 11px; color: #34d399; display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399; display: inline-block;"></span>
              Live Slots Available
            </span>
          </div>

          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.02em;">Book Appointment & Free 3D iTero Scan</h2>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.45; margin-bottom: 16px;">
            Schedule your free consultation with Dr. Umer (Diamond Apex Invisalign Provider) or our cosmetic & implant dental team in Glasgow.
          </p>

          <div class="svs-mode-tabs">
            <button class="svs-mode-btn active" id="mode-cal-btn">📅 Booking Calendar</button>
            <button class="svs-mode-btn" id="mode-calc-btn">💳 0% Finance Calculator</button>
            <button class="svs-mode-btn" id="mode-wa-btn">💬 WhatsApp Reception</button>
          </div>

          <!-- 1. CALENDAR VIEW -->
          <div id="view-calendar">
            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 6px;">Select Clinician / Dentist</label>
            <div class="svs-doctor-select-row" id="nord-doc-selector">
              <div class="svs-doc-pill active" data-doctor="Dr. Umer">
                <span class="doc-dot"></span>
                <span>Dr. Umer (Principal Dentist · Invisalign Diamond Apex)</span>
              </div>
              <div class="svs-doc-pill" data-doctor="Cosmetic Dental Team">
                <span class="doc-dot"></span>
                <span>Cosmetic Dental Team (Composite Bonding & Veneers)</span>
              </div>
              <div class="svs-doc-pill" data-doctor="Implant Specialist Team">
                <span class="doc-dot"></span>
                <span>Implant Specialist Team (Swiss Implants & All-on-4)</span>
              </div>
              <div class="svs-doc-pill" data-doctor="Dental Hygiene Team">
                <span class="doc-dot"></span>
                <span>Dental Hygiene Team (Airflow Polish)</span>
              </div>
            </div>

            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 6px;">Appointment / Consultation Type</label>
            <div class="svs-track-grid" id="nord-track-selector">
              <div class="svs-track-item active" data-track="Free Invisalign 3D iTero Consultation">
                <div class="svs-track-title">✨ Free Invisalign Scan</div>
                <div class="svs-track-sub">Diamond Apex · 3D iTero</div>
              </div>
              <div class="svs-track-item" data-track="Dental Implants & All-on-4 Assessment">
                <div class="svs-track-title">🦷 Dental Implants</div>
                <div class="svs-track-sub">3D CBCT Guided Exam</div>
              </div>
              <div class="svs-track-item" data-track="Artisan Composite Bonding Assessment">
                <div class="svs-track-title">💎 Composite Bonding</div>
                <div class="svs-track-sub">Same-Day Smile Makeover</div>
              </div>
            </div>

            <div class="svs-cal-box">
              <div class="svs-cal-header">
                <div class="svs-cal-title" id="nord-cal-month-year">November 2026</div>
                <div class="svs-cal-nav">
                  <button class="svs-cal-nav-btn" id="nord-cal-prev">&lsaquo;</button>
                  <button class="svs-cal-nav-btn" id="nord-cal-next">&rsaquo;</button>
                </div>
              </div>
              <div class="svs-cal-weekdays">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div class="svs-cal-days" id="nord-cal-days-grid"></div>

              <div class="svs-slots-wrap">
                <div class="svs-slots-title">Available Glasgow Slots for <span id="nord-selected-date-label">Thu, Nov 12</span></div>
                <div class="svs-slots-grid" id="nord-slots-grid">
                  <div class="svs-slot-pill active" data-slot="09:15 AM">09:15 AM</div>
                  <div class="svs-slot-pill" data-slot="10:30 AM">10:30 AM</div>
                  <div class="svs-slot-pill" data-slot="11:45 AM">11:45 AM</div>
                  <div class="svs-slot-pill" data-slot="14:15 PM">02:15 PM</div>
                  <div class="svs-slot-pill" data-slot="16:00 PM">04:00 PM</div>
                  <div class="svs-slot-pill" data-slot="17:30 PM (Late Evening)">05:30 PM (Late Evening)</div>
                </div>
              </div>
            </div>

            <form id="nord-consultation-form">
              <div class="svs-form-group">
                <label>Primary Treatment</label>
                <select id="nord-procedure-select" class="svs-form-select">
                  <option value="Invisalign® Clear Aligners (Diamond Apex)">Invisalign® Clear Aligners (Diamond Apex)</option>
                  <option value="Dental Implants & All-on-4">Dental Implants & All-on-4</option>
                  <option value="Artisan Composite Bonding">Artisan Composite Bonding</option>
                  <option value="Porcelain Veneers & Smile Makeovers">Porcelain Veneers & Smile Makeovers</option>
                  <option value="Airflow Dental Hygiene & Polish">Airflow Dental Hygiene & Polish</option>
                  <option value="Emergency Dental Pain Relief">Emergency Dental Pain Relief</option>
                </select>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="svs-form-group">
                  <label>Full Name *</label>
                  <input type="text" required class="svs-form-input" id="nord-name" placeholder="e.g. Fiona Campbell">
                </div>
                <div class="svs-form-group">
                  <label>Email Address *</label>
                  <input type="email" required class="svs-form-input" id="nord-email" placeholder="fiona.c@example.co.uk">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="svs-form-group">
                  <label>Phone / WhatsApp *</label>
                  <input type="tel" required class="svs-form-input" id="nord-phone" placeholder="07700 900555">
                </div>
                <div class="svs-form-group">
                  <label>Payment / Registration Preference</label>
                  <select class="svs-form-select" id="svs-plan-pref">
                    <option value="0% Chrysalis Finance">0% Chrysalis Finance (Spread over 12-36 mo)</option>
                    <option value="Private Pay-as-you-go">Private Pay-as-you-go</option>
                    <option value="NHS Registration / General Care">NHS Registration / General Care</option>
                  </select>
                </div>
              </div>

              <div class="svs-form-group">
                <label>Dental Notes or Questions</label>
                <textarea class="svs-form-textarea" id="nord-notes" rows="2" placeholder="Tell our team about your smile goals, concerns, or previous dental work..."></textarea>
              </div>

              <button type="submit" class="svs-submit-btn">
                <span>Confirm Appointment & Lock Date</span>
                <span style="font-size: 16px;">&rarr;</span>
              </button>
              <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 10px;">🔒 Regulated by GDC & Healthcare Improvement Scotland. Confidential clinical intake.</p>
            </form>
          </div>

          <!-- 2. FINANCE CALCULATOR VIEW -->
          <div id="view-calculator" style="display: none;">
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 8px;">Chrysalis 0% APR Dental Finance Calculator</h3>
            <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px; line-height: 1.5;">
              St Vincent Smile is an Appointed Representative of Chrysalis Finance Limited. Spread the cost of your smile transformation with 0% interest over 12 months, or up to 36 months with low monthly repayments.
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Invisalign Full</div>
                <div style="font-size: 20px; font-weight: 700; color: #38bdf8;">£208.33<span style="font-size: 11px; font-weight: 400; color: #94a3b8;">/mo</span></div>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">12 months @ 0% APR</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Total: £2,500 (Inc. Vivera)</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Implant & Crown</div>
                <div style="font-size: 20px; font-weight: 700; color: #38bdf8;">£231.25<span style="font-size: 11px; font-weight: 400; color: #94a3b8;">/mo</span></div>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">12 months @ 0% APR</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Total: £2,775 (Swiss Titanium)</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; text-align: center;">
                <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Bonding 6 Teeth</div>
                <div style="font-size: 20px; font-weight: 700; color: #38bdf8;">£150.00<span style="font-size: 11px; font-weight: 400; color: #94a3b8;">/mo</span></div>
                <div style="font-size: 11px; color: #34d399; margin-top: 4px;">12 months @ 0% APR</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Total: £1,800 (Same-Day)</div>
              </div>
            </div>

            <button class="svs-submit-btn" id="calc-back-to-booking" style="margin-top: 14px;">Return to Appointment Calendar &rarr;</button>
          </div>

          <!-- 3. WHATSAPP RECEPTION VIEW -->
          <div id="view-whatsapp" style="display: none; text-align: center; padding: 20px 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(37, 211, 102, 0.15); border: 1px solid rgba(37, 211, 102, 0.3); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px;">
              💬
            </div>
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Direct St Vincent Smile Reception</h3>
            <p style="font-size: 13px; color: #94a3b8; max-width: 440px; margin: 0 auto 20px; line-height: 1.5;">
              Chat directly with our Finnieston dental reception team for appointments, emergency slots, or quick questions. Average response within 10 minutes during clinic opening hours.
            </p>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; max-width: 380px; margin: 0 auto 24px; text-align: left; font-size: 13px;">
              <div style="color: #94a3b8; margin-bottom: 4px;">Direct WhatsApp Reception:</div>
              <div style="font-size: 16px; font-weight: 700; color: #ffffff;">+44 7761 066850</div>
              <div style="color: #94a3b8; margin-top: 8px; margin-bottom: 4px;">Clinic Telephone:</div>
              <div style="font-size: 16px; font-weight: 700; color: #ffffff;">0141 248 1183</div>
              <div style="color: #94a3b8; margin-top: 8px; margin-bottom: 4px;">Practice Address:</div>
              <div style="font-size: 13px; color: #ffffff;">23c St Vincent Crescent, Glasgow G3 8LH</div>
            </div>
            <a href="https://wa.me/447761066850" target="_blank" rel="noopener noreferrer" class="svs-submit-btn" style="text-decoration: none; max-width: 380px; margin: 0 auto; background: #25D366; color: #ffffff;">
              <span>Open WhatsApp Chat Now</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- SUCCESS VOUCHER VIEW -->
          <div id="nord-consultation-success" style="display: none;">
            <div class="svs-success-card">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(52, 211, 153, 0.2); border: 1px solid rgba(52, 211, 153, 0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; color: #34d399;">
                ✓
              </div>
              <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">Appointment Confirmed</h3>
              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 16px;">
                Your appointment at St Vincent Smile has been booked. A confirmation has been prepared for your records.
              </p>

              <div class="svs-voucher-box">
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Patient Name:</span>
                  <span class="svs-voucher-val" id="voucher-name">Fiona Campbell</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Treatment:</span>
                  <span class="svs-voucher-val" id="voucher-procedure">Invisalign® Clear Aligners</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Clinician:</span>
                  <span class="svs-voucher-val" id="voucher-doctor">Dr. Umer (Diamond Apex)</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Date & Time Slot:</span>
                  <span class="svs-voucher-val" id="voucher-slot">Thu, Nov 12 · 10:30 AM</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Location:</span>
                  <span class="svs-voucher-val">23c St Vincent Crescent, Finnieston, Glasgow G3 8LH</span>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
                <a id="nord-add-gcal" href="#" target="_blank" rel="noopener noreferrer" class="svs-submit-btn" style="margin-top: 0; font-size: 12px; text-decoration: none; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.15);">
                  📅 Add to Google Cal
                </a>
                <a id="nord-wa-confirm" href="https://wa.me/447761066850" target="_blank" rel="noopener noreferrer" class="svs-submit-btn" style="margin-top: 0; font-size: 12px; text-decoration: none; background: #25D366; color: #fff;">
                  💬 WhatsApp Reception
                </a>
              </div>

              <button class="svs-submit-btn" id="nord-success-done" style="margin-top: 12px; background: #ffffff; color: #000;">
                Done
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Legal & Privacy Modal -->
      <div id="nord-legal-modal" class="svs-modal-backdrop">
        <div class="svs-modal-card">
          <button class="svs-modal-close" id="nord-close-legal">&times;</button>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <img src="./assets/svs_logo_navy.png" style="height: 24px; filter: brightness(0) invert(1);">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8; font-weight: 700;">Scottish Healthcare & Clinical Governance</span>
          </div>
          
          <div class="svs-mode-tabs">
            <button class="svs-tab-btn active" data-tab="privacy">Privacy & UK GDPR</button>
            <button class="svs-tab-btn" data-tab="terms">Patient Charter</button>
            <button class="svs-tab-btn" data-tab="accessibility">Accessibility</button>
          </div>

          <div id="legal-content-privacy" class="svs-legal-tab-pane">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">UK Data Protection Act 2018 & Medical Privacy</h3>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              Saint Vincent Smile Centre Limited trading as St Vincent Smile (23c St Vincent Crescent, Finnieston, Glasgow G3 8LH) complies strictly with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018. All patient records, digital 3D iTero impressions, and CBCT radiographs are encrypted and stored in certified UK clinical systems.
            </p>
          </div>

          <div id="legal-content-terms" class="svs-legal-tab-pane" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">General Dental Council (GDC) & HIS Regulation</h3>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              All dental surgeons, therapists, and hygienists practicing at St Vincent Smile are fully registered with the General Dental Council (GDC). Our clinic operates under the clinical standards of Healthcare Improvement Scotland (HIS).
            </p>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              Finance Disclosure: Saint Vincent Smile Centre Limited is an Appointed Representative of Chrysalis Finance Limited, which is authorised and regulated by the Financial Conduct Authority (FCA).
            </p>
          </div>

          <div id="legal-content-accessibility" class="svs-legal-tab-pane" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Web Accessibility Standards (WCAG 2.1 AA)</h3>
            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 14px;">
              This digital clinic experience conforms with Level AA of the W3C Web Content Accessibility Guidelines 2.1. Designed with high color contrast, screen reader compatibility, and full keyboard navigation.
            </p>
          </div>
        </div>
      </div>
    `;

    var modalContainer = document.createElement('div');
    modalContainer.id = 'svs-modals-root';
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    var consultModal = document.getElementById('nord-consultation-modal');
    var legalModal = document.getElementById('nord-legal-modal');

    var calState = {
      doctor: 'Dr. Umer',
      track: 'Free Invisalign 3D iTero Consultation',
      procedure: 'Invisalign® Clear Aligners (Diamond Apex)',
      year: 2026,
      month: 10,
      selectedDay: 12,
      selectedSlot: '10:30 AM',
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
        blank.className = 'svs-day-cell disabled';
        grid.appendChild(blank);
      }

      for (var day = 1; day <= totalDays; day++) {
        var cell = document.createElement('div');
        cell.className = 'svs-day-cell';
        cell.textContent = day;

        var cellDate = new Date(calState.year, calState.month, day);
        var dayOfWeek = cellDate.getDay();
        if (dayOfWeek !== 0) { // Monday to Saturday
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

    document.querySelectorAll('.svs-slot-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.svs-slot-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        calState.selectedSlot = pill.getAttribute('data-slot');
      });
    });

    document.querySelectorAll('.svs-doc-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.svs-doc-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        calState.doctor = pill.getAttribute('data-doctor');
      });
    });

    document.querySelectorAll('.svs-track-item').forEach(function(item) {
      item.addEventListener('click', function() {
        document.querySelectorAll('.svs-track-item').forEach(function(it) { it.classList.remove('active'); });
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
      var modeTabs = document.querySelector('.svs-mode-tabs');
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
        document.querySelectorAll('.svs-doc-pill').forEach(function(pill) {
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
      calState.name = document.getElementById('nord-name').value || 'Fiona Campbell';
      calState.email = document.getElementById('nord-email').value || 'fiona.c@example.co.uk';
      calState.phone = document.getElementById('nord-phone').value || '07700 900555';
      calState.procedure = document.getElementById('nord-procedure-select').value;

      var d = new Date(calState.year, calState.month, calState.selectedDay);
      var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var fullDateStr = weekdayNames[d.getDay()] + ', ' + monthNames[calState.month] + ' ' + calState.selectedDay + ', ' + calState.year;

      document.getElementById('voucher-name').textContent = calState.name;
      document.getElementById('voucher-procedure').textContent = calState.procedure;
      document.getElementById('voucher-doctor').textContent = calState.doctor;
      document.getElementById('voucher-slot').textContent = fullDateStr + ' · ' + calState.selectedSlot;

      var gcalTitle = encodeURIComponent('St Vincent Smile Appointment: ' + calState.procedure + ' with ' + calState.doctor);
      var gcalDetails = encodeURIComponent('Appointment at St Vincent Smile Glasgow.\nPatient: ' + calState.name + '\nTreatment: ' + calState.procedure + '\nFormat: ' + calState.track + '\nContact: 0141 248 1183');
      var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + gcalTitle + '&details=' + gcalDetails + '&location=' + encodeURIComponent('St Vincent Smile, 23c St Vincent Crescent, Finnieston, Glasgow G3 8LH');
      document.getElementById('nord-add-gcal').setAttribute('href', gcalUrl);

      var waMsg = encodeURIComponent('Hello St Vincent Smile Reception, I have booked a ' + calState.track + ' on ' + fullDateStr + ' at ' + calState.selectedSlot + ' with ' + calState.doctor + ' for ' + calState.procedure + '. Patient Name: ' + calState.name + '.');
      document.getElementById('nord-wa-confirm').setAttribute('href', 'https://wa.me/447761066850?text=' + waMsg);

      document.getElementById('view-calendar').style.display = 'none';
      var modeTabs = document.querySelector('.svs-mode-tabs');
      if (modeTabs) modeTabs.style.display = 'none';
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
      document.querySelectorAll('.svs-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
      });
      document.querySelectorAll('.svs-legal-tab-pane').forEach(function(pane) {
        pane.style.display = pane.id === ('legal-content-' + tab) ? 'block' : 'none';
      });
    }

    document.getElementById('nord-close-legal').addEventListener('click', closeLegal);
    document.querySelectorAll('.svs-tab-btn').forEach(function(btn) {
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

      if (text.includes('Consultation') || text.includes('Request time') || text.includes('Book') || text.includes('Appointment') || text.includes('Live availability') || (href === '#contact' && !btn.closest('nav'))) {
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
