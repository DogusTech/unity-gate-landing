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

      // SEO SAFE TEXT UPDATE (NO INNERHTML)
      if (key.startsWith("[content]")) {
        el.setAttribute("content", value);
      } else {
        el.textContent = value;
      }
    });
  };

  // ---------------------------
  // 2. PERFORMANCE OBSERVER
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
  // 3. MOBILE MENU (LIGHTWEIGHT)
  // ---------------------------
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
      }
    });
  };

  // ---------------------------
  // 4. EXPERT FORM ENGINE
  // ---------------------------
  const initExpertForm = () => {
    const form = document.getElementById("expert-registration-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const error = document.getElementById("form-error-message");
      const btn = document.getElementById("btn-submit-expert");

      const data = {
        name: form.expert_name.value.trim(),
        email: form.expert_email.value.trim(),
        password: form.expert_password.value,
        confirm: form.expert_confirm_password.value,
        country: form.expert_country.value,
        main: form.expert_main_category.value,
        sub: form.selected_subcats.value,
        terms: form.agree_terms.checked
      };

      error.classList.add("hidden");

      if (data.password !== data.confirm) {
        return showError("Passwords do not match");
      }

      if (data.password.length < 8) {
        return showError("Password too short");
      }

      if (!data.sub) {
        return showError("Select at least one specialization");
      }

      btn.disabled = true;

      try {
        sessionStorage.setItem(
          "expert_state",
          JSON.stringify({
            ...data,
            ts: Date.now()
          })
        );

        window.location.href = "/expert/finalize";
      } catch (e) {
        showError("Network error");
        btn.disabled = false;
      }

      function showError(msg) {
        error.textContent = i18next?.t(msg) || msg;
        error.classList.remove("hidden");
      }
    });
  };

  // ---------------------------
  // 5. BOOTSTRAP (SEO SAFE ORDER)
  // ---------------------------
  const bootstrap = async () => {
    initMenu();
    initObservers();
    initExpertForm();

    // 5. Expert Login Form to Flutter App Routing
    const expertLoginForm = document.getElementById('expert-login-form');
    
    if (expertLoginForm) {
        expertLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const errorMsg = document.getElementById('login-error-message');
            const btnSubmit = document.getElementById('btn-login-expert');
            const btnText = btnSubmit.querySelector('.btn-text');
            const spinner = btnSubmit.querySelector('.spinner');
            
            const email = document.getElementById('expert_login_email').value.trim();
            const rawPassword = document.getElementById('expert_login_password').value;
            const rememberMe = document.getElementById('remember_me').checked;

            errorMsg.classList.add('hidden');

            if (!email || !rawPassword) {
                errorMsg.textContent = typeof i18next !== 'undefined' && i18next.t('errEmptyFields') 
                    ? i18next.t('errEmptyFields') 
                    : 'Lütfen e-posta ve şifrenizi giriniz.';
                errorMsg.classList.remove('hidden');
                return;
            }

            // UX Loading Effect
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            btnSubmit.disabled = true;

            try {
                // Kısa bir bekleme (Animasyonun görünmesi için)
                await new Promise(resolve => setTimeout(resolve, 600));

                // SENİN İSTEDİĞİN GİBİ: Şifreyi maskele (Base64) ve URL'ye ekle
                const maskedPassword = btoa(unescape(encodeURIComponent(rawPassword)));

                const params = new URLSearchParams({
                    email: email,
                    token: maskedPassword,
                    remember: rememberMe
                });

                // FLUTTER UYGULAMANA YÖNLENDİR (Senin eski kodunla birebir aynı mantık)
                const targetUrl = `https://app.unity-gate.com/expert-login/auth?${params.toString()}`;
                window.location.href = targetUrl;
                
            } catch (err) {
                errorMsg.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
                errorMsg.classList.remove('hidden');
                btnText.classList.remove('hidden');
                spinner.classList.add('hidden');
                btnSubmit.disabled = false;
            }
        });
    }
    
    await initI18n();
  };

  // deterministic start
  bootstrap();
})();