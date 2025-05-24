document.addEventListener("DOMContentLoaded", () => {
  showElement(welcomeSection);
  createAnimatedText();
  restartAnimation(welcomeSection, true);
  restartAnimation(waveEmoji, true);
});

const welcomeText = document.getElementById("welcome-text");
const welcomeSection = document.querySelector(".welcome-container");
const waveEmoji = document.querySelector(".wave-emoji");
const imageContainer = document.querySelector(".image-container");
const nameWrapper = document.querySelector(".name-wrapper");
const occupation = document.querySelector(".occupation");
const animatedElements = [welcomeSection, waveEmoji, imageContainer, nameWrapper, occupation].filter(Boolean);
const text = welcomeText?.textContent.trim() || "";

function createAnimatedText() {
  if (!welcomeText) return;
  welcomeText.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${i * 0.05}s`;
    welcomeText.appendChild(span);
  });
}

function restartAnimation(el, immediate = false) {
  if (!el) return;
  const className = el.dataset.animation;
  if (!className) return;

  if (immediate && el === welcomeText) {
    [...el.children].forEach(span => {
      span.style.animationDelay = "0s";
    });
  }

  el.style.animationDelay = immediate ? "0s" : "";
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

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

let lastScrollY = window.scrollY;
let goingUp = false;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
});

function handleEntryAnimation(entry) {
  const el = entry.target;
  if (entry.isIntersecting) {
    showElement(el);
    if (el === welcomeSection) {
      createAnimatedText();
    }
    restartAnimation(el, goingUp);
  } else {
    hideElement(el);
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(handleEntryAnimation);
}, {
  threshold: 0.5,
  rootMargin: "0px 0px -10% 0px"
});

animatedElements.forEach(el => observer.observe(el));
