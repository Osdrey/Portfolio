window.addEventListener("DOMContentLoaded", () => {
  animatedElements.forEach(el => showElement(el));
});

const animatedElements = [
  ".aboutMe-container",
  ".aboutMe-text",
  ".aboutMe-greeting",
  ".aboutMe-name",
  ".aboutMe-nickname",
  ".aboutMe-intro",
  ".aboutMe-buttons",
  ".aboutMe-profile",
  ".stat-item"
].flatMap(selector => Array.from(document.querySelectorAll(selector)));

let lastScrollY = window.scrollY || 0;
let goingUp = false;
let hasScrolled = false;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY || 0;
  goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
  hasScrolled = true;
});

function hideElement(element) {
  if (!element) return;
  element.style.opacity = "0";
  element.style.pointerEvents = "none";
  element.style.visibility = "hidden";
}

function showElement(element) {
  if (!element) return;
  element.style.opacity = "";
  element.style.pointerEvents = "";
  element.style.visibility = "";
}

function restartAnimationByClass(element, className) {
  if (!element) return;

  const shouldRemoveDelay = hasScrolled && goingUp;

  if (shouldRemoveDelay) {
    element.style.animationDelay = "0s";
  }

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function handleEntryAnimation(entry) {
  const el = entry.target;
  const className = el.classList[0];

  if (entry.isIntersecting) {
    showElement(el);
    restartAnimationByClass(el, className);
  } else {
    hideElement(el);
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(handleEntryAnimation);
}, { threshold: 0.5 });

animatedElements.forEach(el => observer.observe(el));
