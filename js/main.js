// 📂 js/main.js - 2026 Native Engine
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. İleri Görüşlü i18n Motoru
    const initI18n = async () => {
        const urlLang = window.location.pathname.split('/')[1];
        const lang = ['en', 'tr', 'ja'].includes(urlLang) ? urlLang : 'tr';

        try {
            await i18next
                .use(i18nextHttpBackend)
                .init({
                    lng: lang,
                    fallbackLng: 'en',
                    backend: { loadPath: './locales/{{lng}}/translation.json' }
                });
            updateDOM();
            document.documentElement.lang = i18next.language;
        } catch (err) {
            console.error("SEO-i18n Hatası:", err);
        }
    };

    function updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key.startsWith('[content]')) {
                el.setAttribute('content', i18next.t(key.replace('[content]', '')));
            } else {
                el.innerHTML = i18next.t(key);
            }
        });
    }

    // 2. Native Scroll Observer (Apple-style)
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Google botları için performansı korumak adına observer'ı durdur
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(el => fadeObserver.observe(el));

    // 3. Manyetik Buton Etkileşimi (Premium Feel)
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // 4. Mobil Menü Native UX
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    
    menuToggle?.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    initI18n();
});