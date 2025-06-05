import { getCurrentLang } from "../../assets/scripts/loaders.js";
import { routes } from "../../assets/scripts/routes.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

export async function init() {
  const lang = getCurrentLang();
  const jsonPath = routes.pages.projects.json;
  const data = await fetch(jsonPath).then(res => res.json());
  projectsList = data[lang]?.projectsList || [];

  if (projectsList.length === 0) {
    console.warn("No se encontraron proyectos para el idioma:", lang);
    return;
  }

  observeProjects();
  setupCarouselEvents();
  updateCarousel(0);
}

let projectsList = [];
let currentIndex = 0;
let isAnimating = false;

function updateCarousel(newIndex) {
  if (isAnimating) return;
  isAnimating = true;

  const cards = document.querySelectorAll(".card");
  const dots = document.querySelectorAll(".dot");
  const projectName = document.querySelector(".project-name");
  const projectType = document.querySelector(".project-type");
  const projectDescription = document.querySelector(".project-description");

  currentIndex = (newIndex + cards.length) % cards.length;

  cards.forEach((card, i) => {
    const offset = (i - currentIndex + cards.length) % cards.length;

    card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

    if (offset === 0) card.classList.add("center");
    else if (offset === 1) card.classList.add("right-1");
    else if (offset === 2) card.classList.add("right-2");
    else if (offset === cards.length - 1) card.classList.add("left-1");
    else if (offset === cards.length - 2) card.classList.add("left-2");
    else card.classList.add("hidden");
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });

  setTimeout(() => {
    projectName.textContent = projectsList[currentIndex].name;
    projectType.textContent = projectsList[currentIndex].type;
    projectDescription.textContent = projectsList[currentIndex].description;
  }, 300);

  setTimeout(() => {
    isAnimating = false;
  }, 800);
}

function setupCarouselEvents() {
  const cards = document.querySelectorAll(".card");
  const dots = document.querySelectorAll(".dot");
  const leftArrow = document.querySelector(".nav-arrow.left");
  const rightArrow = document.querySelector(".nav-arrow.right");

  leftArrow?.addEventListener("click", () => updateCarousel(currentIndex - 1));
  rightArrow?.addEventListener("click", () => updateCarousel(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => updateCarousel(i));
  });

  cards.forEach((card, i) => {
    card.addEventListener("click", () => updateCarousel(i));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") updateCarousel(currentIndex - 1);
    else if (e.key === "ArrowRight") updateCarousel(currentIndex + 1);
  });

  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) updateCarousel(currentIndex + 1);
      else updateCarousel(currentIndex - 1);
    }
  }
}

let lastScrollY = window.scrollY || 0;
let goingUp = false;
let hasScrolled = false;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY || 0;
  goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
  hasScrolled = true;
});

function hideElement(el) {
  if (!el) return;
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.style.visibility = "hidden";
}

function showElement(el) {
  if (!el) return;
  el.style.opacity = "";
  el.style.pointerEvents = "";
  el.style.visibility = "";
}

function restartAnimation(el, immediate = false) {
  const className = el.dataset.animation || el.classList[0];
  if (!className) return;

  el.style.animationDelay = immediate ? "0s" : "";
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function handleEntryAnimation(entry) {
  const el = entry.target;
  if (entry.isIntersecting) {
    showElement(el);
    restartAnimation(el, hasScrolled && goingUp);
  } else {
    hideElement(el);
  }
}

export function observeProjects() {
  const selectors = [
    ".projects-title",
    ".carousel-container",
    ".carousel-track",
    ".card",
    ".project-info",
    ".project-name",
    ".project-type",
    ".project-description",
    ".dot"
  ];

  const elements = selectors.flatMap(selector =>
    Array.from(document.querySelectorAll(selector))
  );

  if (elements.length === 0) {
    console.warn("No se encontraron elementos para observar en Projects.");
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(handleEntryAnimation);
  }, {
    threshold: 0.5,
    rootMargin: "0px 0px -10% 0px"
  });

  elements.forEach(el => {
    if (!el.dataset.animation) {
      el.dataset.animation = el.classList[0];
    }
    observer.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        elements.forEach(el => {
          showElement(el);
          restartAnimation(el, false);
        });
      }
    });
  });
}