document.addEventListener('DOMContentLoaded', () => {
    
    // 1. i18next Dil Yönetimi
    const pathSegments = window.location.pathname.split('/');
    let urlLang = pathSegments[1]; 
    if(!['en', 'tr', 'de', 'fr', 'es', 'ja'].includes(urlLang)) {
        urlLang = 'tr'; 
    }

    i18next
        .use(i18nextHttpBackend) 
        .init({
            lng: urlLang,
            fallbackLng: 'en',
            backend: {
                loadPath: './locales/{{lng}}/translation.json' 
            }
        }).then(function() {
            updateContent();
            document.getElementById('html-tag').setAttribute('lang', i18next.language);
        }).catch(function(error) {
            console.error("i18next yüklenirken bir hata oluştu: ", error);
        });

    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key.startsWith('[content]')) {
                element.setAttribute('content', i18next.t(key.replace('[content]', '')));
            } else {
                element.innerHTML = i18next.t(key);
            }
        });
    }

    // 2. Mobil Hamburger Menü (Native Feel UX)
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if(mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
});