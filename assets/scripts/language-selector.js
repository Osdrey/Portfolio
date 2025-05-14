// Lógica para el cambio de idioma
import { partialsLoader, pageLoader } from "./loaders.js";
import { loadTheme, toggleTheme } from './theme-toggle.js';

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
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
        loadTheme();
        setupLanguageSelector();
        await pageLoader(getCurrentPage());
    });
};
