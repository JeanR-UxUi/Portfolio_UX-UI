// Déplace la bannière "bienvenue" au scroll
window.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
        let scrollPosition = window.scrollY;
        let banner = document.querySelector(".banner");
        let h1 = banner.querySelector("h1");

        // Effet parallaxe (déplacement du texte vers le bas)
        banner.style.transform = `translateY(${scrollPosition * 0.3}px)`;

        // Effet de réduction de la taille et diminution de l'opacité
        let scaleValue = Math.max(0.55, 1 - (scrollPosition / 1000));  // Réduit la taille du texte
        let opacityValue = Math.max(0.5,1 - (scrollPosition / 1000));  // Diminue l'opacité

        // Applique les effets à l'élément texte
        h1.style.transform = `scale(${scaleValue})`;
        h1.style.opacity = opacityValue;
    });
});



// "Read more" [badge] label
//*** document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner toutes les divs contenant les badges
    //*** const badgeContainers = document.querySelectorAll(".badge-container");

    //*** badgeContainers.forEach(function (badgeContainer) {
    //***     const badgesContainer = badgeContainer.querySelector(".badges");
    //***     const button = badgeContainer.querySelector(".read-more-badge_btn");

    //***      let isExpanded = false;

    //***     function updateButton() {
    //***         const allBadges = badgesContainer.querySelectorAll(".badge");
    //***         const containerHeight = badgesContainer.clientHeight; // Hauteur réelle affichée
    //***         let lastVisibleRow = 0;

    //***         allBadges.forEach(badge => {
    //***             if (badge.offsetTop < containerHeight) {
    //***                 lastVisibleRow = badge.offsetTop; // Met à jour la dernière ligne visible
    //***             }
    //***         });

            // Compter les badges qui sont après la dernière ligne visible
    //***        const hiddenBadges = Array.from(allBadges).filter(badge => badge.offsetTop > lastVisibleRow).length;

    //***        if (hiddenBadges > 0) {
    //***            button.textContent = `+ ${hiddenBadges} autres`;
    //***            button.style.display = "block";
    //***        } else {
    //***            button.style.display = "none";
    //***        }
    //***    }

    //***    button.addEventListener("click", function () {
    //***        isExpanded = !isExpanded;
    //***        if (isExpanded) {
    //***            badgesContainer.style.maxHeight = badgesContainer.scrollHeight + "px"; // Afficher tout
    //***            button.textContent = "Voir moins";
    //***        } else {
    //***            badgesContainer.style.maxHeight = "5em"; // Replier
    //***            updateButton();
    //***        }
    //***    });

    //***    updateButton(); // Met à jour le bouton au chargement
    //***});
//***});


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



function openMailInNewTab(event) {
  event.preventDefault(); // Empêche le navigateur de suivre immédiatement le lien mailto
  const mailtoLink = event.currentTarget.href; // Récupère l'URL mailto
  const newTab = window.open('about:blank', '_blank'); // Ouvre un nouvel onglet vide
  setTimeout(() => { newTab.location.href = mailtoLink; }, 500); // Charge mailto après un court délai
}