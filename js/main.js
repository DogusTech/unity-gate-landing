// 📂 js/main.js - High Performance V20.0 (Zero CLS & Core Web Vitals Optimized)
(() => {
  "use strict";

  const SUPPORTED_LANGS = ["en", "tr", "ja", "fr", "de", "es"];

  const getLang = () => {
    const path = window.location.pathname.split("/")[1];
    return SUPPORTED_LANGS.includes(path) ? path : "en";
  };

  const LANG = getLang();

  // ---------------------------
  // 1. i18n (SEO SAFE INIT)
  // ---------------------------
  const initI18n = async () => {
    if (!window.i18next) return;
    try {
      await i18next
        .use(i18nextHttpBackend)
        .init({
          lng: LANG,
          fallbackLng: "en",
          backend: { loadPath: "/locales/{{lng}}.json" },
          initImmediate: false
        });
      document.documentElement.lang = LANG;
      applyTranslations();
    } catch (e) {
      console.warn("i18n fallback mode active");
    }
  };

  const applyTranslations = () => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = i18next.t(key);
      if (key.startsWith("[content]")) el.setAttribute("content", value);
      else el.textContent = value;
    });
  };

  // ---------------------------
  // 2. PREMIUM UX: Spotlight Effect & Navbar Scroll
  // ---------------------------
  const initPremiumUX = () => {
    // A. Dynamic Navbar
    const navbar = document.getElementById('main-nav');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('is-scrolled');
        } else {
          navbar.classList.remove('is-scrolled');
        }
      }, { passive: true }); // passive: true for scroll performance
    }

    // B. Spotlight/Glow Effect for Bento Cards (Apple/Vercel Trend)
    const cards = document.querySelectorAll('.bento-card, .process-box, .article-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };

  // ---------------------------
  // 3. PERFORMANCE OBSERVER (SCROLL ANIMATIONS)
  // ---------------------------
  const initObservers = () => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll(".fade-in-up").forEach(el => observer.observe(el));
  };

  // ---------------------------
  // 4. UI STATE MANAGER (MOBILE MENU & MODALS)
  // ---------------------------
  window.uiState = {
    openModal: (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },
    closeModal: (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    },
    closeMobileMenu: () => {
      const menu = document.getElementById("mobile-menu");
      const btn = document.getElementById("mobile-menu-toggle");
      if(menu) {
        menu.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
      }
    }
  };

  const initMenu = () => {
    const btn = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");

    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("active");
      btn.setAttribute("aria-expanded", open);
      menu.setAttribute("aria-hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        menu.classList.remove("active");
        document.body.style.overflow = "";
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  };

  // ---------------------------
  // 5. BOOTSTRAP (SEO SAFE ORDER)
  // ---------------------------
  const bootstrap = async () => {
    initMenu();
    initPremiumUX();
    initObservers();
    await initI18n();
  };

  // Start execution when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();