export async function init() {
  observeHomeSection();
  createAnimatedText();
}

let lastScrollY = window.scrollY;
let goingUp = false;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
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

  if (immediate && el.id === "welcome-text") {
    [...el.children].forEach(span => {
      span.style.animationDelay = "0s";
    });
  }

  el.style.animationDelay = immediate ? "0s" : "";
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function createAnimatedText() {
  const welcomeText = document.getElementById("welcome-text");
  if (!welcomeText) return;

  const text = welcomeText.dataset.text || welcomeText.textContent.trim();
  welcomeText.dataset.text = text;
  welcomeText.innerHTML = "";

  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${i * 0.05}s`;
    welcomeText.appendChild(span);
  });
}

function handleEntryAnimation(entry) {
  const el = entry.target;
  if (entry.isIntersecting) {
    showElement(el);
    if (el.classList.contains("welcome-container")) {
      createAnimatedText();
    }
    restartAnimation(el, goingUp);
  } else {
    hideElement(el);
  }
}

export function observeHomeSection() {
  const selectors = [
    ".welcome-container",
    ".wave-emoji",
    ".image-container",
    ".name-wrapper",
    ".occupation"
  ];

  const elements = selectors.flatMap(selector =>
    Array.from(document.querySelectorAll(selector))
  );

  if (elements.length === 0) {
    console.warn("No se encontraron elementos para observar en Home.");
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
          if (el.classList.contains("welcome-container")) {
            createAnimatedText();
          }
        });
      }
    });
  });
}