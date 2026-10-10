/**
 * SHAHD MAGDY — MAIN PORTFOLIO CONTROLLER
 * Handles horizontal drag & swipe, category filtering,
 * video lightbox, scroll animations, and dynamic project rendering.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const portfolioStrip = document.getElementById("portfolioStrip");
  const portfolioPrev = document.getElementById("portfolioPrev");
  const portfolioNext = document.getElementById("portfolioNext");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const mainNav = document.getElementById("mainNav");
  const navMenuBtn = document.getElementById("navMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Lightbox Elements
  const lightbox = document.getElementById("lightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxSoftware = document.getElementById("lightboxSoftware");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  // State
  let projects = [];
  let filteredProjects = [];
  let currentFilter = "all";
  let activeLightboxIndex = 0;

  // -------------------------------------------------------------------------
  // 1. LOAD & RENDER PROJECTS
  // -------------------------------------------------------------------------
  async function loadProjects() {
    try {
      projects = await window.PortfolioStorage.getProjects();
      // Filter out unpublished for public view
      projects = projects.filter(p => p.published !== false);
      applyFilter(currentFilter);
    } catch (err) {
      console.error("Failed to load projects:", err);
      if (portfolioStrip) {
        portfolioStrip.innerHTML = `<p style="padding: 40px; color: var(--color-muted);">Unable to load projects at this time.</p>`;
      }
    }
  }

  function applyFilter(filter) {
    currentFilter = filter;
    if (filter === "all") {
      filteredProjects = [...projects];
    } else {
      const targetCategory = filter.toLowerCase().replace(/s$/, ""); // Normalize "reels" -> "reel"
      filteredProjects = projects.filter(p => {
        const cat = (p.category || "").toLowerCase();
        if (targetCategory === "reel") return cat.includes("reel");
        if (targetCategory === "advertisement" || targetCategory === "ad") return cat.includes("ad");
        if (targetCategory === "motion-graphic" || targetCategory === "motion") return cat.includes("motion");
        return cat === targetCategory;
      });
    }
    renderPortfolioStrip();
  }

  function renderPortfolioStrip() {
    if (!portfolioStrip) return;

    if (filteredProjects.length === 0) {
      portfolioStrip.innerHTML = `
        <div style="padding: 60px 40px; color: var(--color-muted); font-family: var(--font-mono); letter-spacing: 0.15em;">
          NO PROJECTS FOUND IN THIS CATEGORY.
        </div>
      `;
      return;
    }

    portfolioStrip.innerHTML = filteredProjects.map((p, idx) => {
      const formattedNum = String(idx + 1).padStart(2, "0");
      const defaultThumb = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80";
      const thumb = p.thumbnailUrl || defaultThumb;

      return `
        <article class="project-card" data-id="${p.id}" data-index="${idx}">
          <div class="project-card__media">
            <img src="${thumb}" alt="${p.title}" class="project-card__thumb" loading="lazy" />
            <div class="project-card__overlay"></div>
            <div class="project-card__badge">${p.category}</div>
            <span class="project-card__number">${formattedNum}</span>
            <div class="project-card__play-btn" aria-label="Play video">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div class="project-card__content">
            <div>
              <h3 class="project-card__title">${escapeHtml(p.title)}</h3>
              <p class="project-card__desc">${escapeHtml(p.description)}</p>
            </div>
            <div class="project-card__footer">
              <span class="project-card__software">${escapeHtml(p.software || "Premiere Pro")}</span>
              <span class="project-card__year">${p.year || "2026"}</span>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Reattach click events for lightbox
    const cards = portfolioStrip.querySelectorAll(".project-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        const index = parseInt(card.dataset.index, 10);
        openLightbox(index);
      });
    });
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // -------------------------------------------------------------------------
  // 2. HORIZONTAL SCROLL & DRAG INTERACTIONS
  // -------------------------------------------------------------------------
  let isDown = false;
  let startX;
  let scrollLeft;
  let moved = false;

  if (portfolioStrip) {
    portfolioStrip.addEventListener("mousedown", (e) => {
      isDown = true;
      moved = false;
      portfolioStrip.classList.add("is-dragging");
      startX = e.pageX - portfolioStrip.offsetLeft;
      scrollLeft = portfolioStrip.scrollLeft;
    });

    portfolioStrip.addEventListener("mouseleave", () => {
      isDown = false;
      portfolioStrip.classList.remove("is-dragging");
    });

    portfolioStrip.addEventListener("mouseup", (e) => {
      isDown = false;
      portfolioStrip.classList.remove("is-dragging");
    });

    portfolioStrip.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - portfolioStrip.offsetLeft;
      const walk = (x - startX) * 1.6; // Scroll multiplier
      if (Math.abs(walk) > 5) {
        moved = true;
      }
      portfolioStrip.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    let touchStartX = 0;
    portfolioStrip.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    // Arrow navigation
    const getScrollStep = () => {
      const card = portfolioStrip.querySelector(".project-card");
      return card ? card.offsetWidth + 28 : 360;
    };

    if (portfolioPrev) {
      portfolioPrev.addEventListener("click", () => {
        portfolioStrip.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
      });
    }

    if (portfolioNext) {
      portfolioNext.addEventListener("click", () => {
        portfolioStrip.scrollBy({ left: getScrollStep(), behavior: "smooth" });
      });
    }
  }

  // -------------------------------------------------------------------------
  // 3. CATEGORY FILTERS
  // -------------------------------------------------------------------------
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });

  // -------------------------------------------------------------------------
  // 4. CINEMATIC VIDEO LIGHTBOX
  // -------------------------------------------------------------------------
  function openLightbox(index) {
    if (!filteredProjects[index]) return;
    activeLightboxIndex = index;
    const project = filteredProjects[index];

    lightboxCategory.textContent = project.category || "Video";
    lightboxTitle.textContent = project.title || "Selected Project";
    lightboxDesc.textContent = project.description || "";
    lightboxSoftware.textContent = project.software ? `Software: ${project.software}` : "";

    if (project.videoUrl) {
      lightboxVideo.src = project.videoUrl;
      lightboxVideo.play().catch(e => console.log("Autoplay blocked or waiting:", e));
    } else {
      lightboxVideo.src = "";
    }

    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    lightboxVideo.src = "";
    document.body.style.overflow = "";
  }

  function showNextLightbox() {
    if (filteredProjects.length === 0) return;
    activeLightboxIndex = (activeLightboxIndex + 1) % filteredProjects.length;
    openLightbox(activeLightboxIndex);
  }

  function showPrevLightbox() {
    if (filteredProjects.length === 0) return;
    activeLightboxIndex = (activeLightboxIndex - 1 + filteredProjects.length) % filteredProjects.length;
    openLightbox(activeLightboxIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", showNextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrevLightbox);

  if (lightbox) {
    lightbox.querySelector(".lightbox__overlay").addEventListener("click", closeLightbox);
  }

  // Keyboard Navigation for Lightbox
  window.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNextLightbox();
    if (e.key === "ArrowLeft") showPrevLightbox();
  });

  // -------------------------------------------------------------------------
  // 5. SCROLL OBSERVER & ANIMATIONS
  // -------------------------------------------------------------------------
  const animElements = document.querySelectorAll(".anim-fade, .anim-text-reveal, .anim-tool");
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const animObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("is-revealed");
        }, parseInt(delay, 10));
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animElements.forEach(el => animObserver.observe(el));

  // -------------------------------------------------------------------------
  // 6. STICKY NAV BLUR & PARALLAX LIGHTING
  // -------------------------------------------------------------------------
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      mainNav.classList.add("nav--scrolled");
    } else {
      mainNav.classList.remove("nav--scrolled");
    }
  }, { passive: true });

  // Mouse Parallax for Atmospheric Orbs
  const orbs = document.querySelectorAll(".bg-orb");
  window.addEventListener("mousemove", (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5;
    const mouseY = (e.clientY / window.innerHeight) - 0.5;

    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 18;
      orb.style.transform = `translate3d(${mouseX * speed}px, ${mouseY * speed}px, 0)`;
    });
  });

  // Mobile menu toggle
  if (navMenuBtn && mobileMenu) {
    navMenuBtn.addEventListener("click", () => {
      navMenuBtn.classList.toggle("is-active");
      mobileMenu.classList.toggle("is-open");
    });

    mobileMenu.querySelectorAll(".mobile-menu__link").forEach(link => {
      link.addEventListener("click", () => {
        navMenuBtn.classList.remove("is-active");
        mobileMenu.classList.remove("is-open");
      });
    });
  }

  // Listen for admin changes
  window.addEventListener("portfolio:updated", () => {
    loadProjects();
  });

  // Initial Load
  loadProjects();
});
