import { routes } from './routes.js';
import { loadTheme, toggleTheme } from './theme-toggle.js';
import { setupLanguageSelector } from './language-selector.js';
import { initSidebar } from './sidebar-toggle.js';

// Carga dinámica de hojas de estilo
const loadStylesheet = (href, isPageStyle = false) => {
  return new Promise((resolve) => {
    const timestampedHref = href + '?v=' + new Date().getTime();
    let link = document.querySelector(`link[href="${timestampedHref}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = timestampedHref;
      if (isPageStyle) link.dataset.pageStyle = true;
      link.onload = () => resolve();
      document.head.appendChild(link);
    } else {
      resolve();
    }
  });
};

// Eliminador de estilos de páginas
const clearPageStyles = () => {
  const links = document.querySelectorAll('link[rel="stylesheet"][data-page-style]');
  links.forEach(link => {
    document.head.removeChild(link);
  });
};

// Reasignador de eventos para cargas dinamicas
export const reassignEvents = () => {
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.removeEventListener('click', toggleTheme);
    toggle.addEventListener('click', toggleTheme);
  }
  loadTheme();
  setupLanguageSelector();
  initSidebar();
};

// Carga de temas (dark y light)
export const themeLoader = async () => {
  await loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
  await loadStylesheet(routes.themes.dark);
  await loadStylesheet(routes.themes.light);

  const isDark = localStorage.getItem('dark-mode') === 'true';

  if (isDark) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
};

// Carga de traducciones o cambio de idioma
export const getCurrentLang = () => {
  return localStorage.getItem('lang') || 'es';
};

export const translationsLoader = async (jsonPath) => {
  const lang = getCurrentLang();
  const data = await fetch(jsonPath).then(res => res.json());
  const translations = data[lang];

  if (!translations) {
    console.warn(`No hay traducciones para el idioma: ${lang}`);
    return;
  }

  Object.entries(translations).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = text;
  });
  document.querySelectorAll('[data-tooltip]').forEach(elem => {
    const key = elem.getAttribute('data-tooltip');
    if (translations[key]) {
      elem.setAttribute('data-tooltip', translations[key]);
    }
  });
};

// Carga dinámica de partials: header, sidebar, footer con sus estilos
export const partialsLoader = async () => {
  const partials = routes.partials;
  for (const [id, content] of Object.entries(partials)) {
    const html = await fetch(content.html).then(res => res.text());
    document.getElementById(id).innerHTML = html;
    await loadStylesheet(content.css);
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  await translationsLoader(routes.common.json);
  reassignEvents();
};

// Carga dinámica de páginas
export const pageLoader = async () => {
  clearPageStyles();
  for (const [pageId, content] of Object.entries(routes.pages)) {
    try {
      const html = await fetch(content.html).then(res => res.text());
      const pageElement = document.getElementById(pageId);
      if (pageElement) {
        pageElement.innerHTML = html;
      } else {
        console.warn(`No se encontró la sección: ${pageId}`);
      }
      await loadStylesheet(content.css, true);
      await translationsLoader(content.json);
      if (content.js) {
        try {
          const module = await import(`../../${content.js}`);
          if (typeof module.init === "function") {
            module.init();
          }
        } catch (scriptErr) {
          console.warn(`No se pudo cargar el script para ${pageId}:`, scriptErr);
        }
      }
    } catch (err) {
      console.error(`Error al cargar la página "${pageId}":`, err);
    }
  }
  reassignEvents();
};
