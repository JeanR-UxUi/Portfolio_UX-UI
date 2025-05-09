// ========================
// ✅ 1. NAVBAR : MENU HAMBURGER (Mobile)
// ========================
document.addEventListener("DOMContentLoaded", function () {
    const menuHamburger = document.querySelector(".menu-hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (menuHamburger) {
        menuHamburger.addEventListener("click", () => {
            navLinks.classList.toggle("mobile-menu");
        });
    
        // ✅ Fermer le menu après clic sur un lien
        const navMenuLinks = navLinks.querySelectorAll("a[href^='#']");
        navMenuLinks.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("mobile-menu");
            });
        });
    
    } else {
        console.error("❌ L'élément .menu-hamburger est introuvable !");
    }
});

// ========================
// ✅ 2. NAVBAR & ONGLET SIDE : Synchronisation active
// ========================
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar a[href^='#']");
    const sideLinks = document.querySelectorAll(".onglet-side a[href^='#']");

    function updateActiveLink(targetId) {
        navLinks.forEach(link => {
            link.parentElement.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
        });
        sideLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
        });
    }

    function onScroll() {
        // Position de "référence" : 30% du haut de la fenêtre
        let scrollPos = window.scrollY + window.innerHeight * 0.3;
    
        let currentId = null;
    
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.id;
            }
        });
    
        if (currentId) updateActiveLink(currentId);
    }

    // Met à jour l'état actif au scroll
    window.addEventListener("scroll", onScroll);

    // Applique la classe active au clic
    [...navLinks, ...sideLinks].forEach(link => {
        link.addEventListener("click", function () {
            const targetId = this.getAttribute("href").substring(1);
            updateActiveLink(targetId);
        });
    });

    // Défilement personnalisé pour onglet-side si data-scroll-target est présent
    document.querySelectorAll(".onglet-side a[data-scroll-target]").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.dataset.scrollTarget);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
                // Met à jour l’URL si besoin
                history.pushState(null, null, this.getAttribute("href"));
            }
        });
    });

    // Active l'état correct au chargement
    onScroll();
});



// ========================
// ✅ 3. BANNIÈRE : Effet Parallaxe au scroll
// ========================
window.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
        let scrollPosition = window.scrollY;
        const banner = document.querySelector(".banner");
        if (!banner) return;

        const h1 = banner.querySelector("h1");
        if (!h1) return;

        // Parallaxe
        banner.style.transform = `translateY(${scrollPosition * 0.3}px)`;

        // Réduction de taille + opacité
        let scaleValue = Math.max(0.55, 1 - scrollPosition / 1000);
        let opacityValue = Math.max(0.5, 1 - scrollPosition / 1000);

        h1.style.transform = `scale(${scaleValue})`;
        h1.style.opacity = opacityValue;
    });
});

// ========================
// ✅ 4. BADGES : Voir plus / Voir moins
// ========================
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.badges-container').forEach(container => {
      const wrapper = container.querySelector('.badges-wrapper');
      const badges = wrapper.querySelectorAll('.badge_secondary');
      const button = container.querySelector('.show-more');

      if (!button) return; // ← empêche l’erreur si le bouton n'existe pas
  
      if (badges.length > 0) {
        button.textContent = `+${badges.length} autres`;
        button.addEventListener('click', () => {
          badges.forEach(badge => badge.classList.toggle('visible'));
  
          const isExpanded = button.classList.toggle('expanded');
          button.textContent = isExpanded ? 'Voir moins' : `+${badges.length} autres`;
        });
      } else {
        button.style.display = 'none';
      }
    });
});


// ========================
// ✅ 5. MAILTO : Ouvre un mail dans un nouvel onglet
// ========================
function openMailInNewTab(event) {
    event.preventDefault();
    const mailtoLink = event.currentTarget.href;
    const newTab = window.open("about:blank", "_blank");
    setTimeout(() => {
        newTab.location.href = mailtoLink;
    }, 500);
}

// ========================
// ✅ 6. MAILTO ALTERNATIVE : copier automatiquement l'adresse mail dans le presse-papier
// ========================
function copyEmail() {
    const email = "jeanrouyer24@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      const feedback = document.getElementById("copy-feedback");
      feedback.innerText = "Adresse mail copiée dans le presse-papiers ✔️";
      feedback.classList.remove("sr-only");
      setTimeout(() => {
        feedback.classList.add("sr-only");
      }, 2000);
    });
  }