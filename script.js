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
        let scrollPos = window.scrollY + window.innerHeight / 2;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                updateActiveLink(section.id);
            }
        });
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
    const badgeContainers = document.querySelectorAll(".badges-container");

    badgeContainers.forEach(container => {
        const badgesWrapper = container.querySelector(".badges-wrapper");
        const badges = Array.from(badgesWrapper.querySelectorAll(".badge"));
        const readMoreBtn = container.querySelector(".read-more-badge_btn");

        const maxVisibleLines = 2;
        let isExpanded = false;
        let initialBadgesOnTwoLines = 0;

        const updateButtonText = () => {
            const hiddenCount = badges.length - (isExpanded ? badges.length : initialBadgesOnTwoLines);
            readMoreBtn.textContent = isExpanded ? "Voir moins" : `+ ${hiddenCount} autres`;
        };

        const toggleBadges = () => {
            isExpanded = !isExpanded;
            badgesWrapper.classList.toggle("expanded", isExpanded);
            badges.forEach((badge, index) => {
                badge.style.display = (!isExpanded && index >= initialBadgesOnTwoLines) ? "none" : "inline-block";
            });
            updateButtonText();
        };

        const calculateInitialVisibility = () => {
            badges.forEach(badge => (badge.style.display = "inline-block"));
            initialBadgesOnTwoLines = 0;
            let visibleLines = 0;
            let currentLineWidth = 0;
            const badgeStyle = getComputedStyle(badges[0]);
            const badgeMarginRight = parseFloat(badgeStyle.marginRight);

            for (let i = 0; i < badges.length; i++) {
                const badge = badges[i];
                const badgeWidth = badge.offsetWidth + badgeMarginRight;

                if (visibleLines < maxVisibleLines) {
                    if (currentLineWidth + badgeWidth <= badgesWrapper.offsetWidth || currentLineWidth === 0) {
                        currentLineWidth += badgeWidth;
                        initialBadgesOnTwoLines++;
                    } else {
                        visibleLines++;
                        currentLineWidth = badgeWidth;
                        if (visibleLines < maxVisibleLines) {
                            initialBadgesOnTwoLines++;
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }

            badges.forEach((badge, index) => {
                if (index >= initialBadgesOnTwoLines) {
                    badge.style.display = "none";
                }
            });

            if (badges.length > initialBadgesOnTwoLines) {
                readMoreBtn.style.display = "block";
                updateButtonText();
                readMoreBtn.addEventListener("click", toggleBadges);
            } else {
                readMoreBtn.style.display = "none";
            }
        };

        calculateInitialVisibility();
        window.addEventListener("resize", calculateInitialVisibility);
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
// ✅ 5. MAILTO ALTERNATIVE : copier automatiquement l'adresse mail dans le presse-papier
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