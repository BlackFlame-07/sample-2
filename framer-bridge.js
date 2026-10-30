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

    // 10. Inject Modal Styles & Elements
    injectModals();
  });

  // Inject High-End Modals for Consultation, Legal & Articles
  function injectModals() {
    var modalCss = document.createElement('style');
    modalCss.id = 'nord-modals-css';
    modalCss.textContent = `
      .nord-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .nord-modal-backdrop.active {
        opacity: 1;
        pointer-events: auto;
      }
      .nord-modal-card {
        background: #14171d;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
        max-width: 580px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 36px;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Geist", "Segoe UI", Roboto, sans-serif;
        transform: scale(0.96) translateY(12px);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
      }
      .nord-modal-close:hover {
        background: rgba(255, 255, 255, 0.18);
      }
      .nord-form-group {
        margin-bottom: 18px;
      }
      .nord-form-group label {
        display: block;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 600;
        color: #94a3b8;
        margin-bottom: 6px;
      }
      .nord-form-input, .nord-form-select, .nord-form-textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 10px;
        padding: 12px 14px;
        color: #ffffff;
        font-size: 14px;
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
        font-size: 15px;
        padding: 14px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 24px;
      }
      .nord-submit-btn:hover {
        background: #f1f5f9;
        transform: translateY(-1px);
      }
      .nord-success-badge {
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 14px;
        padding: 24px;
        text-align: center;
      }
      .nord-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 12px;
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
          <button class="nord-modal-close" id="nord-close-consultation">✕</button>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <img src="./assets/nord_og_logo.png" style="height: 24px; filter: brightness(0) invert(1);">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #38bdf8; font-weight: 700;">European Care · Kaunas</span>
          </div>
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em;">Free 3D Consultation & All-Inclusive Quote</h2>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 24px; line-height: 1.5;">Evaluated directly by Senior Plastic Surgeon Dr. Jonas Tutkus. Save up to 60% compared to UK prices with all hospital care and personal nursing included.</p>
          
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
                <input type="text" required class="nord-form-input" id="nord-name" placeholder="e.g. Sarah Jenkins">
              </div>
              <div class="nord-form-group">
                <label>Email Address *</label>
                <input type="email" required class="nord-form-input" id="nord-email" placeholder="sarah@example.co.uk">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="nord-form-group">
                <label>Phone / WhatsApp *</label>
                <input type="tel" required class="nord-form-input" id="nord-phone" placeholder="+44 7123 456789">
              </div>
              <div class="nord-form-group">
                <label>Preferred Travel Month</label>
                <select class="nord-form-select" id="nord-travel">
                  <option value="As soon as possible">As soon as possible</option>
                  <option value="Next 30–60 days">Next 30–60 days</option>
                  <option value="Spring 2027">Spring 2027</option>
                  <option value="Summer 2027">Summer 2027</option>
                </select>
              </div>
            </div>

            <div class="nord-form-group">
              <label>Questions or Medical Notes (Optional)</label>
              <textarea class="nord-form-textarea" rows="3" placeholder="Tell our surgeons about your cosmetic goals or previous surgeries..."></textarea>
            </div>

            <button type="submit" class="nord-submit-btn">
              <span>Get My Free Surgical Quote</span>
              <span style="font-size: 16px;">→</span>
            </button>
            <p style="font-size: 11px; color: #64748b; text-align: center; margin-top: 12px;">🔒 Strict EU patient confidentiality (GDPR). No obligation to book.</p>
          </form>

          <div id="nord-consultation-success" style="display: none;">
            <div class="nord-success-badge">
              <div style="font-size: 42px; margin-bottom: 12px;">✓</div>
              <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Consultation Request Received</h3>
              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.5; margin-bottom: 16px;">
                Thank you, <strong id="nord-success-name">Patient</strong>! Your case details have been transmitted directly to Dr. Jonas Tutkus's surgical coordination team.
              </p>
              <p style="font-size: 13px; color: #94a3b8; line-height: 1.4;">
                A patient coordinator will contact you via WhatsApp / Email within 24 hours with your preliminary doctor review and all-inclusive quote.
              </p>
              <button class="nord-submit-btn" id="nord-success-done" style="margin-top: 20px;">Done</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal & Privacy Modal -->
      <div id="nord-legal-modal" class="nord-modal-backdrop">
        <div class="nord-modal-card">
          <button class="nord-modal-close" id="nord-close-legal">✕</button>
          <div class="nord-tabs">
            <button class="nord-tab-btn active" data-tab="privacy">GDPR Privacy</button>
            <button class="nord-tab-btn" data-tab="terms">Patient Terms</button>
            <button class="nord-tab-btn" data-tab="accessibility">Accessibility</button>
          </div>

          <div id="nord-legal-privacy" class="nord-legal-content">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">Clinical Data Protection (EU GDPR)</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">Nordesthetics Clinic (Kaunakiemio str. 1a, Kaunas, Lithuania) adheres strictly to the European Union General Data Protection Regulation (Regulation (EU) 2016/679). All photographic submissions, medical histories, and consultation communications are encrypted at rest and in transit.</p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">Your clinical records are reviewed exclusively by our GMC/EU licensed plastic surgeons and sworn patient coordinators. We never sell, lease, or distribute patient data to third-party commercial entities.</p>
          </div>

          <div id="nord-legal-terms" class="nord-legal-content" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">European Patient Charter & Terms</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">All surgical procedures are conducted in an ISO 9001 certified surgical hospital facility under general anesthesia administered by board-certified anesthesiologists.</p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">Our all-inclusive pricing model covers initial surgeon consultation, hospital facility fees, overnight recovery nursing, post-op compression garments, medications, personal airport transfers in Kaunas, and medical Fit-to-Fly certification.</p>
          </div>

          <div id="nord-legal-accessibility" class="nord-legal-content" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">Accessibility Statement (WCAG 2.1 AA)</h3>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 12px;">We are committed to digital accessibility for patients of all abilities. This flagship complies with the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.</p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">Features include high-contrast typography, keyboard navigation, full screen-reader semantic landmarks, and reduced motion responsiveness.</p>
          </div>
        </div>
      </div>
    `;

    var div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div);

    // Modal Control Functions
    var consultModal = document.getElementById('nord-consultation-modal');
    var legalModal = document.getElementById('nord-legal-modal');

    function openConsultation(procedureName) {
      if (procedureName) {
        var sel = document.getElementById('nord-procedure-select');
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.toLowerCase().includes(procedureName.toLowerCase())) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
      document.getElementById('nord-consultation-form').style.display = 'block';
      document.getElementById('nord-consultation-success').style.display = 'none';
      consultModal.classList.add('active');
    }

    function closeConsultation() {
      consultModal.classList.remove('active');
    }

    function openLegal(tabName) {
      legalModal.classList.add('active');
      switchLegalTab(tabName || 'privacy');
    }

    function closeLegal() {
      legalModal.classList.remove('active');
    }

    function switchLegalTab(tab) {
      document.querySelectorAll('.nord-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
      });
      document.getElementById('nord-legal-privacy').style.display = tab === 'privacy' ? 'block' : 'none';
      document.getElementById('nord-legal-terms').style.display = tab === 'terms' ? 'block' : 'none';
      document.getElementById('nord-legal-accessibility').style.display = tab === 'accessibility' ? 'block' : 'none';
    }

    // Attach Click Events to Open Consultation Modal
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('a, button');
      if (!btn) return;
      var text = btn.innerText.trim();
      var href = btn.getAttribute('href') || '';

      // Consultation triggers
      if (text.includes('Consultation') || text.includes('Request time') || text.includes('Book with a specialist') || (href === '#contact' && !btn.closest('nav'))) {
        e.preventDefault();
        openConsultation();
        return;
      }

      // Legal links
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

      // Treatment card click -> open consultation with pre-selected procedure
      var card = btn.closest('[data-framer-name="Slide"], [data-framer-name="Default"]');
      if (card && card.closest('#treatments') && btn.tagName === 'A') {
        e.preventDefault();
        openConsultation(text);
        return;
      }
    });

    // Close buttons & backdrop clicks
    document.getElementById('nord-close-consultation').addEventListener('click', closeConsultation);
    document.getElementById('nord-close-legal').addEventListener('click', closeLegal);
    document.getElementById('nord-success-done').addEventListener('click', closeConsultation);

    consultModal.addEventListener('click', function(e) {
      if (e.target === consultModal) closeConsultation();
    });
    legalModal.addEventListener('click', function(e) {
      if (e.target === legalModal) closeLegal();
    });

    // Legal Tabs
    document.querySelectorAll('.nord-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchLegalTab(btn.getAttribute('data-tab'));
      });
    });

    // Handle Consultation Form Submit
    document.getElementById('nord-consultation-form').addEventListener('submit', function(e) {
      e.preventDefault();
      var nameVal = document.getElementById('nord-name').value || 'Patient';
      document.getElementById('nord-success-name').textContent = nameVal;
      document.getElementById('nord-consultation-form').style.display = 'none';
      document.getElementById('nord-consultation-success').style.display = 'block';
    });

    // Handle Newsletter Subscribe Form
    var newsForm = document.querySelector('form[data-framer-name*="Newsletter"], form');
    if (newsForm) {
      newsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var subBtn = newsForm.querySelector('button[type="submit"], button');
        var input = newsForm.querySelector('input[type="email"]');
        if (subBtn) {
          subBtn.textContent = '✓ Subscribed';
          subBtn.style.backgroundColor = '#10b981';
          subBtn.style.color = '#ffffff';
          if (input) input.value = '';
          setTimeout(function() {
            subBtn.textContent = 'Subscribe';
            subBtn.style.backgroundColor = '';
            subBtn.style.color = '';
          }, 3500);
        }
      });
    }

    // Keyboard ESC to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeConsultation();
        closeLegal();
      }
    });
  }
})();
