// 📂 js/main.js
(() => {
  "use strict";

  /******************************************************************
   * 1. ARAYÜZ (UI) ETKİLEŞİMLERİ VE ANİMASYONLAR (YENİ EKLENEN)
   ******************************************************************/
  document.addEventListener('DOMContentLoaded', () => {
    
    // Yumuşak Kaydırma (Smart Scroll)
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Kart Scroll Efekti (Yukarıdan Yavaşça Gelme Hissi İçin)
    const cards = document.querySelectorAll('.extended-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px' 
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        cardObserver.observe(card);
    });
  });

  /******************************************************************
   * 2. MATCHMAKING STATE MACHINE (SENİN MEVCUT KODUN - KORUNDU)
   ******************************************************************/

  const STATES = {
    IDLE: "idle",
    POSTING_INTENT: "posting_intent",
    MATCHING: "matching",
    APPLICANTS: "applicants",
    EXPERT_REVIEW: "expert_review",
    VIDEO_CALL: "video_call",
    EXPERT_APPROVED: "expert_approved",
    SAFE_ZONE: "safe_zone",
    COMPLETED: "completed",
    REJECTED: "rejected",
  };

  const EVENTS = {
    CREATE_POST: "CREATE_POST",
    APPLY: "APPLY",
    SELECT_APPLICANT: "SELECT_APPLICANT",
    START_EXPERT_REVIEW: "START_EXPERT_REVIEW",
    APPROVE_VIDEO: "APPROVE_VIDEO",
    REJECT_VIDEO: "REJECT_VIDEO",
    START_VIDEO: "START_VIDEO",
    EXPERT_CONFIRM: "EXPERT_CONFIRM",
    GENERATE_SAFE_ZONE: "GENERATE_SAFE_ZONE",
    COMPLETE: "COMPLETE",
  };

  const state = {
    current: STATES.IDLE,
    post: null,
    applicants: [],
    selectedApplicant: null,
    expertApproved: false,
    safeZone: null,
  };

  function transition(event, payload = {}) {
    switch (state.current) {
      case STATES.IDLE:
        if (event === EVENTS.CREATE_POST) {
          state.post = payload;
          state.current = STATES.POSTING_INTENT;
        }
        break;
      case STATES.POSTING_INTENT:
        if (event === EVENTS.APPLY) {
          state.applicants.push(payload);
          state.current = STATES.MATCHING;
        }
        break;
      case STATES.MATCHING:
        if (event === EVENTS.SELECT_APPLICANT) {
          state.selectedApplicant = payload;
          state.current = STATES.APPLICANTS;
        }
        break;
      case STATES.APPLICANTS:
        if (event === EVENTS.START_EXPERT_REVIEW) {
          state.current = STATES.EXPERT_REVIEW;
        }
        break;
      case STATES.EXPERT_REVIEW:
        if (event === EVENTS.APPROVE_VIDEO) {
          state.current = STATES.VIDEO_CALL;
        }
        if (event === EVENTS.REJECT_VIDEO) {
          state.current = STATES.REJECTED;
        }
        break;
      case STATES.VIDEO_CALL:
        if (event === EVENTS.EXPERT_CONFIRM) {
          state.expertApproved = true;
          state.current = STATES.EXPERT_APPROVED;
        }
        break;
      case STATES.EXPERT_APPROVED:
        if (event === EVENTS.GENERATE_SAFE_ZONE) {
          state.safeZone = generateSafeZone(payload.city);
          state.current = STATES.SAFE_ZONE;
        }
        break;
      case STATES.SAFE_ZONE:
        if (event === EVENTS.COMPLETE) {
          state.current = STATES.COMPLETED;
        }
        break;
    }
    renderDebug();
  }

  function generateSafeZone(city) {
    const code = Math.floor(1000 + Math.random() * 9000);
    const expiresAt = Date.now() + 1000 * 60 * 60 * 2; 
    return { city, tempNumber: `+90-5XX-${code}`, expiresAt, active: true };
  }

  function renderDebug() {
    console.log("STATE:", state.current);
    console.log("DATA:", state);
  }

  window.matchmaking = {
    createPost: (data) => transition(EVENTS.CREATE_POST, data),
    apply: (user) => transition(EVENTS.APPLY, user),
    selectApplicant: (user) => transition(EVENTS.SELECT_APPLICANT, user),
    startExpertReview: () => transition(EVENTS.START_EXPERT_REVIEW),
    approveVideo: () => transition(EVENTS.APPROVE_VIDEO),
    rejectVideo: () => transition(EVENTS.REJECT_VIDEO),
    startVideo: () => transition(EVENTS.START_VIDEO),
    expertConfirm: () => transition(EVENTS.EXPERT_CONFIRM),
    generateSafeZone: (city) => transition(EVENTS.GENERATE_SAFE_ZONE, { city }),
    complete: () => transition(EVENTS.COMPLETE),
    getState: () => state,
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      console.log("system reset to IDLE");
      state.current = STATES.IDLE;
      renderDebug();
    }
  });

})();