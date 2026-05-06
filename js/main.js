// 📂 js/main.js
(() => {
  "use strict";

  /******************************************************************
   * MATCHMAKING STATE MACHINE
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

  /******************************************************************
   * CORE STATE
   ******************************************************************/

  const state = {
    current: STATES.IDLE,
    post: null,
    applicants: [],
    selectedApplicant: null,
    expertApproved: false,
    safeZone: null,
  };

  /******************************************************************
   * TRANSITION ENGINE
   ******************************************************************/

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

  /******************************************************************
   * SAFE ZONE GENERATOR (temporary anonymized contact logic)
   ******************************************************************/

  function generateSafeZone(city) {
    const code = Math.floor(1000 + Math.random() * 9000);
    const expiresAt = Date.now() + 1000 * 60 * 60 * 2; // 2 hours window

    return {
      city,
      tempNumber: `+90-5XX-${code}`,
      expiresAt,
      active: true,
    };
  }

  /******************************************************************
   * UI HELPERS (minimal but functional)
   ******************************************************************/

  function renderDebug() {
    console.log("STATE:", state.current);
    console.log("DATA:", state);
  }

  /******************************************************************
   * PUBLIC API (UI hooks)
   ******************************************************************/

  window.matchmaking = {
    createPost: (data) => transition(EVENTS.CREATE_POST, data),
    apply: (user) => transition(EVENTS.APPLY, user),
    selectApplicant: (user) => transition(EVENTS.SELECT_APPLICANT, user),
    startExpertReview: () => transition(EVENTS.START_EXPERT_REVIEW),
    approveVideo: () => transition(EVENTS.APPROVE_VIDEO),
    rejectVideo: () => transition(EVENTS.REJECT_VIDEO),
    startVideo: () => transition(EVENTS.START_VIDEO),
    expertConfirm: () => transition(EVENTS.EXPERT_CONFIRM),
    generateSafeZone: (city) =>
      transition(EVENTS.GENERATE_SAFE_ZONE, { city }),
    complete: () => transition(EVENTS.COMPLETE),

    getState: () => state,
  };

  /******************************************************************
   * UX INIT
   ******************************************************************/

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      console.log("system reset to IDLE");
      state.current = STATES.IDLE;
      renderDebug();
    }
  });

})();