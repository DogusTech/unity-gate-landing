// 📂 js/main.js
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
          backend: {
            loadPath: "/locales/{{lng}}.json"
          },
          initImmediate: false
        });

      document.documentElement.lang = LANG;
      applyTranslations();

    } catch (e) {
      console.warn("i18n fallback mode active");
    }
  };

  const applyTranslations = () => {
    const nodes = document.querySelectorAll("[data-i18n]");

    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const value = i18next.t(key);

      if (key.startsWith("[content]")) {
        el.setAttribute("content", value);
      } else {
        el.textContent = value;
      }
    });
  };

  // ---------------------------
  // 2. PERFORMANCE OBSERVER (SCROLL ANIMATIONS)
  // ---------------------------
  const initObservers = () => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    document.querySelectorAll(".fade-in-up").forEach((el) => {
      observer.observe(el);
    });
  };

  // ---------------------------
  // 3. UI STATE MANAGER (MOBILE MENU & MODALS)
  // ---------------------------
  // HTML dosyasından kolayca çağrılabilmesi için window objesine aktarıyoruz.
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
        // Ayrıca açık modal varsa onu da kapat
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });
  };

  // ---------------------------
  // 4. BOOTSTRAP (SEO SAFE ORDER)
  // ---------------------------
  const bootstrap = async () => {
    initMenu();
    initObservers();
    
    // Auth login yönlendirme scriptleri vs.. 
    // (Varsa bu kısıma expert-login işlemleri eklenebilir)
    
    await initI18n();
  };

  bootstrap();
})();