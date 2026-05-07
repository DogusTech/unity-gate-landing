// main.js - Sıfırdan Premium Etkileşimler Ve Smart Scroll

document.addEventListener('DOMContentLoaded', () => {
    // 1. Yumuşak Kaydırma (Smart Scroll)
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Header yüksekliğini dikkate al (fixed header)
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Scroll Efekti - Header Küçülmesi
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = '#090e11'; // Biraz daha koyu bir zemin
            header.querySelector('.site-nav').style.paddingTop = '10px';
            header.querySelector('.site-nav').style.paddingBottom = '10px';
        } else {
            header.style.background = '#0d151a';
            header.querySelector('.site-nav').style.paddingTop = ''; 
            header.querySelector('.site-nav').style.paddingBottom = '';
        }
    });

    // 3. Kart Scroll Efekti (Subtle Fade-in Ve Premium Hissi İçin)
    const cards = document.querySelectorAll('.extended-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Görünmeden biraz önce başla
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target); // Sadece bir kez çalışması için
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        // Başlangıç stilleri (görünmez)
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        
        cardObserver.observe(card);
    });
});