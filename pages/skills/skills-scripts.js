import { getCurrentLang } from "../../assets/scripts/loaders.js";
import { routes } from "../../assets/scripts/routes.js";

export async function init() {
  const lang = getCurrentLang();
  const data = await fetch(routes.pages.skills.json).then(res => res.json());
  const { title, subtitle, categories, levels } = data[lang];
  const container = document.querySelector('.skills-container');
  if (!container) {
    console.warn('No se encontró el contenedor .skills-container');
    return;
  }

  // Título y subtítulo
  container.innerHTML = `
    <h2 class="skills-title">${title}</h2>
    <p class="skills-subtitle">${subtitle}</p>
  `;

  // Generar categorías y habilidades
  categories.forEach(cat => {
    const categoryHTML = document.createElement('div');
    categoryHTML.className = 'skill-category';
    categoryHTML.innerHTML = `
      <button class="category-toggle">
        <span class="category-content">
          <i class="${cat.icon}"></i>
          <span class="category-label">${cat.label}</span>
        </span>
        <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
      </button>
      <div class="skills-list">
        ${cat.skills.map(skill => `
          <div class="skill-item" data-level="${skill.level}">
            <span class="skill-name">${skill.name}</span>
            <div class="skill-levels"></div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(categoryHTML);
  });

  setupCategoryToggles();
  renderSkillLevels(levels);
  observeSkills();
}

function setupCategoryToggles() {
  document.querySelectorAll('.category-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const list = button.nextElementSibling;
      const arrow = button.querySelector('.arrow i');
      const isOpen = list.style.display === 'flex';
      document.querySelectorAll('.skills-list').forEach(l => l.style.display = 'none');
      document.querySelectorAll('.category-toggle').forEach(btn => btn.classList.remove('open'));
      document.querySelectorAll('.arrow i').forEach(icon => icon.classList.replace('fa-chevron-up', 'fa-chevron-down'));
      if (!isOpen) {
        list.style.display = 'flex';
        button.classList.add('open');
        arrow.classList.replace('fa-chevron-down', 'fa-chevron-up');
      }
    });
  });
}

function renderSkillLevels(levels) {
  const totalLevels = 5;
  document.querySelectorAll('.skill-item').forEach(item => {
    const level = parseInt(item.getAttribute('data-level')) || 0;
    const container = item.querySelector('.skill-levels');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < totalLevels; i++) {
      const span = document.createElement('span');
      span.classList.add('level');
      if (i < level) {
        span.classList.add('active');
        if (i === level - 1) {
          span.classList.add('tooltip');
          span.setAttribute('data-tooltip', levels[i]);
        }
      }
      span.style.animationDelay = `${i * 0.1}s`;
      container.appendChild(span);
    }
  });
}

let lastScrollY = window.scrollY;
let goingUp = false;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
});

function restartAnimation(el, immediate = false) {
  const className = el.dataset.animation || el.classList[0];
  if (!className) return;

  if (immediate && el.classList.contains("skills-title")) {
    [...el.children].forEach(span => {
      span.style.animationDelay = "0s";
    });
  }

  el.style.animationDelay = immediate ? "0s" : "";
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function showElement(el) {
  el.style.opacity = "";
  el.style.pointerEvents = "";
  el.style.visibility = "";
}

function hideElement(el) {
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.style.visibility = "hidden";
}

function handleEntryAnimation(entry) {
  const el = entry.target;
  if (entry.isIntersecting) {
    showElement(el);
    restartAnimation(el, goingUp);
  } else {
    hideElement(el);
  }
}

export function observeSkills() {
  const elements = [
    ".skills-container",
    ".skills-title",
    ".skills-subtitle",
    ".skill-category",
    ".skill-item",
    ".level"
  ].flatMap(selector => Array.from(document.querySelectorAll(selector)));

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
