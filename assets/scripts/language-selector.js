// Lógica para el cambio de idioma
import { partialsLoader, pageLoader, reassignEvents } from "./loaders.js";

const getCurrentPage = () => {
  return window.location.hash?.replace('#', '') || 'home';
};

export const setupLanguageSelector = () => {
  const selector = document.getElementById("language-selector");
  if (!selector) return;
  const currentLang = localStorage.getItem("lang") || 'es';
  selector.value = currentLang;
  selector.addEventListener("change", async (e) => {
      const lang = e.target.value;
      localStorage.setItem("lang", lang);
      await partialsLoader();
      await pageLoader(getCurrentPage());
      reassignEvents();
  });
};
