// ========================
// 1️⃣ NAVBAR : MENU HAMBURGER (Mobile)
// ========================
document.addEventListener("DOMContentLoaded", function () {
  const menuHamburger = document.querySelector(".menu-hamburger");
  const navLinks = document.querySelector(".nav-links");

  console.log(menuHamburger); // Vérifie si l'élément est bien trouvé

  if (menuHamburger) { 
      menuHamburger.addEventListener("click", () => {
          console.log("Menu hamburger cliqué !");
          navLinks.classList.toggle("mobile-menu");
          console.log(navLinks.classList); // Vérifie si la classe est bien ajoutée
      });
  } else {
      console.error("❌ L'élément .menu-hamburger est introuvable !");
  }
});

// ========================
// 2️⃣ ONGLET SIDE : Gestion des onglets latéraux
// ========================
$(document).on("click", ".onglet-side a", function() {
  $(this).addClass("active").siblings().removeClass("active");
});

// ========================
// 3️⃣ SCROLL : Déplacement de la bannière au scroll
// ========================
window.addEventListener("scroll", () => {
  window.requestAnimationFrame(() => {
      let scrollPosition = window.scrollY;
      let banner = document.querySelector(".banner");
      let h1 = banner.querySelector("h1");

      // Effet parallaxe (déplacement du texte vers le bas)
      banner.style.transform = `translateY(${scrollPosition * 0.3}px)`;

      // Effet de réduction de la taille et diminution de l'opacité
      let scaleValue = Math.max(0.55, 1 - (scrollPosition / 1000));  
      let opacityValue = Math.max(0.5, 1 - (scrollPosition / 1000));  

      // Applique les effets à l'élément texte
      h1.style.transform = `scale(${scaleValue})`;
      h1.style.opacity = opacityValue;
  });
});

// ========================
// 4️⃣ BADGES : Affichage dynamique des badges avec "Voir plus/moins"
// ========================
document.addEventListener('DOMContentLoaded', function() {
  const badgeContainers = document.querySelectorAll('.badges-container');

  badgeContainers.forEach(container => {
      const badgesWrapper = container.querySelector('.badges-wrapper');
      const badges = Array.from(badgesWrapper.querySelectorAll('.badge'));
      const readMoreBtn = container.querySelector('.read-more-badge_btn');

      const maxVisibleLines = 2;
      let isExpanded = false;
      let initialBadgesOnTwoLines = 0;

      const updateButtonText = () => {
          const hiddenCount = badges.length - (isExpanded ? badges.length : initialBadgesOnTwoLines);
          readMoreBtn.textContent = isExpanded ? 'Voir moins' : `+ ${hiddenCount} autres`;
      };

      const toggleBadges = () => {
          isExpanded = !isExpanded;
          badgesWrapper.classList.toggle('expanded', isExpanded);
          badges.forEach((badge, index) => {
              if (!isExpanded && index >= initialBadgesOnTwoLines) {
                  badge.style.display = 'none';
              } else {
                  badge.style.display = 'inline-block';
              }
          });
          updateButtonText();
      };

      const calculateInitialVisibility = () => {
          badges.forEach(badge => badge.style.display = 'inline-block');
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
                  badge.style.display = 'none';
              }
          });

          if (badges.length > initialBadgesOnTwoLines) {
              readMoreBtn.style.display = 'block';
              updateButtonText();
              readMoreBtn.addEventListener('click', toggleBadges);
          } else {
              readMoreBtn.style.display = 'none';
          }
      };

      calculateInitialVisibility();
      window.addEventListener('resize', calculateInitialVisibility);
  });
});

// ========================
// 5️⃣ MAILTO : Ouvrir un mail dans un nouvel onglet
// ========================
function openMailInNewTab(event) {
  event.preventDefault(); // Empêche le navigateur de suivre immédiatement le lien mailto
  const mailtoLink = event.currentTarget.href; // Récupère l'URL mailto
  const newTab = window.open('about:blank', '_blank'); // Ouvre un nouvel onglet vide
  setTimeout(() => { newTab.location.href = mailtoLink; }, 500); // Charge mailto après un court délai
}
