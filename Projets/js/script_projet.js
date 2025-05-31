// ========================
// ✅ 1. PADDING TOP : CENTRER VERTICALEMENT L'IMAGE DU PROJET
// ========================
function centerCard() {
    const card = document.querySelector('.banner_projets');
    const hero = document.querySelector('.header');
    if (!card || !hero) return;
  
    const cardHeight = card.offsetHeight;
    const viewportHeight = window.innerHeight;
    const offset = (viewportHeight - cardHeight) / 2;
  
    hero.style.paddingTop = `${Math.max(offset, 0)}px`;
  }
  
  window.addEventListener('load', () => {
    setTimeout(centerCard, 100); // léger délai
  });
  window.addEventListener('resize', centerCard);



// ========================
// ✅ 2. ANIMATION TIME GRAPH
// ========================
document.addEventListener("DOMContentLoaded", () => {
    const barsSection = document.querySelector(".time-bars");
    const bars = barsSection.querySelectorAll(".bar-fill");
    const max = barsSection.getAttribute("data-max") || 15;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bars.forEach((bar) => {
              const value = bar.getAttribute("data-value");
              const percentage = (value / max) * 100;
              bar.style.width = percentage + "%";
            });
          } else {
            bars.forEach((bar) => {
              bar.style.width = "0%";
            });
          }
        });
      },
      { threshold: 0.8 }
    );
  
    if (barsSection) {
      observer.observe(barsSection);
    }
});



// ========================
// ✅ 3. DESCRIPTION DEROULANTE : PAIN POINT CARD
// ========================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('#pain_points .card');
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('active');
      });
  
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('active');
        }
      });
    });
});


// ========================
// ✅ 4. ZOOM SCHEMA MODALE (centrée, avec mini-map)
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const zoomContainer = document.getElementById("zoomContainer");
  const zoomImg = document.getElementById("zoomImg");
  const miniMap = document.getElementById("miniMap");
  const miniMapImg = document.getElementById("miniMapImg");
  const viewRectangle = document.getElementById("viewRectangle");

  let scale = 1;
  let translate = { x: 0, y: 0 };
  let isDragging = false;
  let start = { x: 0, y: 0 };
  let naturalWidth, naturalHeight;
  let currentZoomIndex = 0;

  let currentGalleryImages = []; // images de la galerie actuellement ouverte;

  // 🔁 Fonction centralisée pour charger une image dans la modale
  function loadZoomedImage(src) {
    zoomImg.src = src;
    miniMapImg.src = src;

    zoomImg.onload = () => {
      naturalWidth = zoomImg.naturalWidth;
      naturalHeight = zoomImg.naturalHeight;

      const aspectRatio = naturalWidth / naturalHeight;
      miniMap.style.width = "200px";
      miniMap.style.height = `${200 / aspectRatio}px`;

      scale = 1;

      // Centrage initial par rapport au container
      const containerRect = zoomContainer.getBoundingClientRect();
      const imgWidth = naturalWidth * scale;
      const imgHeight = naturalHeight * scale;

      translate = {
        x: (containerRect.width - imgWidth) / 2,
        y: (containerRect.height - imgHeight) / 2
      };

      updateTransform();
    };

    if (zoomImg.complete) zoomImg.onload();
  }

  // 🎯 Ouvre modale depuis .schema-wrapper
  document.querySelectorAll(".schema-wrapper").forEach(wrapper => {
    wrapper.addEventListener("click", () => {
      const imgSrc = wrapper.querySelector("img").getAttribute("src");
      openModalWithImage(imgSrc);
    });
  });

  // 🎯 Ouvre modale depuis bouton zoom
  document.querySelectorAll('.zoom-trigger').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const gallery = button.closest('.gallery');
      currentGalleryImages = Array.from(gallery.querySelectorAll('.thumbnails button'));

      const mainImage = gallery.querySelector('.main-image img');
      const src = mainImage.src;
      const filename = src.split('/').pop();
      const index = currentGalleryImages.findIndex(btn =>
        btn.getAttribute('data-img')?.endsWith(filename)
      );
      currentZoomIndex = index >= 0 ? index : 0;

      openModalWithImage(src);
    });
  });

  function openModalWithImage(src) {
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    loadZoomedImage(src);
  
    // ✅ Extraire uniquement le nom du fichier, pour une comparaison robuste
    const srcFilename = src.split('/').pop();
  
    const isInGallery = currentGalleryImages.some(btn => {
      const btnFilename = btn.getAttribute("data-img")?.split('/').pop();
      return btnFilename === srcFilename;
    });
  
    document.getElementById("modal-prev").style.display = isInGallery ? "block" : "none";
    document.getElementById("modal-next").style.display = isInGallery ? "block" : "none";
  }

  // 🔒 Fermer la modale
  closeModal.addEventListener("click", closeModalHandler);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModalHandler();
  });

  function closeModalHandler() {
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  // 🔍 Zoom à la molette
  zoomContainer.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const rect = zoomImg.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const zoomFactor = 1 + delta;

    const oldScale = scale;
    scale *= zoomFactor;
    scale = Math.max(0.05, Math.min(scale, 6));
    translate.x -= offsetX * (scale / oldScale - 1);
    translate.y -= offsetY * (scale / oldScale - 1);

    updateTransform();
  });

  // ✋ Drag pour se déplacer
  zoomContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    start = { x: e.clientX, y: e.clientY };
    zoomContainer.style.cursor = "grabbing";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    zoomContainer.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    translate.x += dx;
    translate.y += dy;
    start = { x: e.clientX, y: e.clientY };
    updateTransform();
  });

  // ⌨️ Navigation clavier : flèches dans l'image + modale
  function handleArrowKeys(e) {
    const step = 20;
    switch (e.key) {
      case "ArrowLeft": translate.x += step; break;
      case "ArrowRight": translate.x -= step; break;
      case "ArrowUp": translate.y += step; break;
      case "ArrowDown": translate.y -= step; break;
      default: return;
    }
    updateTransform();
    e.preventDefault();
  }

  document.addEventListener("keydown", (e) => {
    if (modal.getAttribute("aria-hidden") === "false") {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        handleArrowKeys(e);
      }
    }
  });

  // ♻️ Appliquer la transformation
  function updateTransform() {
    zoomImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
    updateMiniMap();
  }

  function updateMiniMap() {
    const containerRect = zoomContainer.getBoundingClientRect();
    const imgWidth = naturalWidth * scale;
    const imgHeight = naturalHeight * scale;
    const viewWidth = containerRect.width;
    const viewHeight = containerRect.height;

    const miniMapWidth = miniMap.clientWidth;
    const miniMapHeight = miniMap.clientHeight;

    const visibleRatioX = viewWidth / imgWidth;
    const visibleRatioY = viewHeight / imgHeight;

    const offsetX = -translate.x / imgWidth * miniMapWidth;
    const offsetY = -translate.y / imgHeight * miniMapHeight;

    const rectWidth = Math.min(visibleRatioX * miniMapWidth, miniMapWidth);
    const rectHeight = Math.min(visibleRatioY * miniMapHeight, miniMapHeight);

    viewRectangle.style.width = `${rectWidth}px`;
    viewRectangle.style.height = `${rectHeight}px`;
    viewRectangle.style.left = `${Math.max(0, Math.min(offsetX, miniMapWidth - rectWidth))}px`;
    viewRectangle.style.top = `${Math.max(0, Math.min(offsetY, miniMapHeight - rectHeight))}px`;
  }

  // 🠔🠖 Navigation modale avec flèches
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  const updateModalImage = (newIndex) => {
    const button = currentGalleryImages[newIndex];
    const newSrc = button.getAttribute('data-img');
    currentZoomIndex = newIndex;
    loadZoomedImage(newSrc);
  };

  modalPrev.addEventListener('click', () => {
    if (!currentGalleryImages.length) return;
    const newIndex = (currentZoomIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateModalImage(newIndex);
  });
  
  modalNext.addEventListener('click', () => {
    if (!currentGalleryImages.length) return;
    const newIndex = (currentZoomIndex + 1) % currentGalleryImages.length;
    updateModalImage(newIndex);
  });
});



// ========================
// ✅ 5. MENU DEROULANT : ARCHITECTURE DE L'INFO
// ========================
function toggleMenu(element) {
    const submenu = element.nextElementSibling;
    const icon = element.querySelector('i');

    if (!submenu || !icon) return;

    if (submenu.style.display === 'block') {
      submenu.style.display = 'none';
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down');
    } else {
      submenu.style.display = 'block';
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-up');
    }
};



// ========================
// ✅ 6. GALERIE D'IMAGES : avec miniature cliquable
// ========================
document.querySelectorAll('.gallery').forEach(gallery => {
  const mainImage = gallery.querySelector('.main-image img');
  const thumbnails = gallery.querySelectorAll('.thumbnails button');
  const zoomButton = gallery.querySelector('.zoom-trigger');
  const prevBtn = gallery.querySelector('.gallery-prev');
  const nextBtn = gallery.querySelector('.gallery-next');

  let currentIndex = 0;

  const updateMainImage = (index) => {
    const button = thumbnails[index];
    const newSrc = button.getAttribute('data-img');
    const newAlt = button.getAttribute('data-alt');
    mainImage.src = newSrc;
    mainImage.alt = newAlt;
    currentIndex = index;
  };

  thumbnails.forEach((button, index) => {
    button.addEventListener('click', () => {
      updateMainImage(index);
    });
  });

  prevBtn.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    updateMainImage(newIndex);
  });

  nextBtn.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % thumbnails.length;
    updateMainImage(newIndex);
  });

  // Accessibilité : flèches clavier
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn.click();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn.click();
    }
  });
});


// ========================
// ✅ 7. SECTION COLLAPSE
// ========================
document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.toggle-section');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const contentId = button.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const expanded = button.getAttribute('aria-expanded') === 'true';

      console.log('Toggle button clicked, contentId:', contentId, content);

      content.classList.toggle('open');
      button.setAttribute('aria-expanded', String(!expanded));

      const icon = button.querySelector('i');
      const newText = !expanded ? 'Lire moins' : 'Lire plus';
      
      if (icon) {
        icon.classList.toggle('fa-chevron-down', expanded);
        icon.classList.toggle('fa-chevron-up', !expanded);
        button.innerHTML = `${newText} <i class="${icon.className}" aria-hidden="true"></i>`;
      } else {
        button.textContent = newText;
      }
    });
  });
});



// ========================
// ✅ 8. TEXT COLLAPSE
// ========================
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.read-more');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const collapse = button.previousElementSibling; // cherche l'élément juste avant : .text-collapse
      
      const expanded = collapse.classList.toggle('expanded');
      button.textContent = expanded ? 'Lire moins' : 'Lire plus';
      button.setAttribute('aria-expanded', expanded);

      // Ajouter l’icône après le texte
      const icon = document.createElement('i');
      icon.classList.add('fa-solid');
      icon.classList.add(expanded ? 'fa-chevron-up' : 'fa-chevron-down');
      button.textContent += ' '; // petit espace
      button.appendChild(icon);

      // Accessibilité
      button.setAttribute('aria-expanded', expanded);
    });
  });
});

// ========================
// ✅ 8. JUXTAPOSE
// ========================
const slider = document.getElementById('slider');
const topImage = document.getElementById('topImage');
const handle = document.getElementById('sliderHandle');


if (slider && topImage && handle) {
  slider.addEventListener('mousemove', (e) => {
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = (x / rect.width) * 100;

    topImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
  });

  slider.addEventListener('mouseleave', () => {
    topImage.style.clipPath = `inset(0 50% 0 0)`;
    handle.style.left = `50%`;
  });
}


// ========================
// ✅ 9. ROADMAP
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const tasks = document.querySelectorAll(".task");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.4 // ajustable pour + ou - de déclenchement
    }
  );

  tasks.forEach((task) => observer.observe(task));
});