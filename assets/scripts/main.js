// Script principal
import { themeLoader, partialsLoader, pageLoader } from './loaders.js';
import { loadTheme, toggleTheme } from './theme-toggle.js';
import { setupLanguageSelector } from './language-selector.js';
import { initSidebar } from "./sidebar-toggle.js";

const init = async () => {
  // Carga de estilos
  await themeLoader();
  // Carga de header, sidebar, footer      
  await partialsLoader();
  // Carga del tema seleccionado
  loadTheme();
  // Carga de la barra lateral
  initSidebar();                
  // Activacióm de cambio de tema
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  } else {
    console.warn('No se encontró el contenedor .theme-toggle');
  }
  // Carga del cambio de lenguaje
  setupLanguageSelector();  
  // Carga de páginas  
  await pageLoader()
};

init();