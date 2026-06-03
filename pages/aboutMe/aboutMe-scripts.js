export async function init() {
  observeAboutMe();
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

export function observeAboutMe() {
  const selectors = [
    ".aboutMe-container",
    ".aboutMe-text",
    ".aboutMe-greeting",
    ".aboutMe-name",
    ".aboutMe-nickname",
    ".aboutMe-intro",
    ".aboutMe-buttons",
    ".aboutMe-profile",
    ".stat-item"
  ];

  const elements = selectors.flatMap(selector =>
    Array.from(document.querySelectorAll(selector))
  );

  if (elements.length === 0) {
    console.warn("No se encontraron elementos para observar en About.");
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