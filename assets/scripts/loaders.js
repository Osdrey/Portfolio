import { routes } from './routes.js';

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

// Carga de temas (dark y light)
export const themeLoader = async () => {
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
    if (el) el.textContent = text;
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
  await translationsLoader(routes.common.json);
};
