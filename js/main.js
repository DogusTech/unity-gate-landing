// 📂 /dashboard/main.js - Production Ready Vanilla JS

(() => {
  "use strict";

  const app = {
    
    // Modal Yönetimi
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

    // Başvuruları İncele Panelini Aç/Kapat
    toggleApplicants: (panelId) => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      
      const isExpanded = panel.classList.contains('expanded');
      
      if (isExpanded) {
        panel.classList.remove('expanded');
      } else {
        // İsteğe bağlı: Diğer açık panelleri kapatmak için
        document.querySelectorAll('.applicants-panel.expanded').forEach(p => {
          if (p.id !== panelId) p.classList.remove('expanded');
        });
        panel.classList.add('expanded');
      }
    },

    // Event Listener'ları Başlat
    initEvents: () => {
      // ESC tuşu ile modalları kapat
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            app.closeModal(modal.id);
          });
        }
      });
    }
  };

  // Global erişim için window objesine bağla
  window.app = app;

  // DOM yüklendiğinde başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', app.initEvents);
  } else {
    app.initEvents();
  }
})();