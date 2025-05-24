window.addEventListener("DOMContentLoaded", () => {
  showElement(welcomeSection);
  createAnimatedText();
  restartAnimationByClass(welcomeSection, "welcome-container", false);
  restartAnimationByClass(waveEmoji, "wave-emoji", false);
});

const welcomeText = document.getElementById("welcome-text");
const welcomeSection = document.querySelector(".welcome-container");
const waveEmoji = document.querySelector(".wave-emoji");
const imageContainer = document.querySelector(".image-container");
const nameWrapper = document.querySelector(".name-wrapper");
const occupation = document.querySelector(".occupation");

const text = welcomeText ? welcomeText.textContent.trim() : "";

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

function restartAnimationByClass(element, className, immediate = false) {
  if (!element) return;
  if (immediate && element === welcomeText) {
    [...element.children].forEach(span => {
      span.style.animationDelay = "0s";
    });
  }
  if (immediate) {
    element.style.animationDelay = "0s";
  } else {
    element.style.animationDelay = "";
  }
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

let lastScrollY = window.scrollY || 0;
function isScrollingUp() {
  const currentScrollY = window.scrollY || 0;
  const goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
  return goingUp;
}

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

function handleEntryAnimation(entry) {
  const el = entry.target;
  const goingUp = isScrollingUp();
  if (entry.isIntersecting) {
    showElement(el);
    switch (el) {
      case welcomeSection:
        createAnimatedText();
        restartAnimationByClass(welcomeSection, "welcome-container", goingUp);
        restartAnimationByClass(waveEmoji, "wave-emoji", goingUp);
        break;
      case imageContainer:
        restartAnimationByClass(imageContainer, "image-container", goingUp);
        break;
      case nameWrapper:
        restartAnimationByClass(nameWrapper, "name-wrapper", goingUp);
        break;
      case occupation:
        restartAnimationByClass(occupation, "occupation", goingUp);
        break;
    }
  } else {
    hideElement(el);
  }
}

const animatedElements = [welcomeSection, imageContainer, nameWrapper, occupation].filter(Boolean);
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    handleEntryAnimation(entry);
  });
}, { threshold: 0.5 });

animatedElements.forEach(el => observer.observe(el));