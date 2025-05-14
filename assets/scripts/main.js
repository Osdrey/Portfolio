// Script principal
import { themeLoader, partialsLoader } from './loaders.js';
import { loadTheme, toggleTheme } from './theme-toggle.js';
import { setupLanguageSelector } from './language-selector.js';

const init = async () => {
  // Carga de estilos
  await themeLoader();
  // Carga de header, sidebar, footer      
  await partialsLoader();
  // Carga del tema seleccionado
  loadTheme();                
  // Activacióm de cambio de tema
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', toggleTheme);
  } else {
    console.warn('No se encontró el contenedor .theme-toggle');
  }
  // Carga del cambio de lenguaje
  setupLanguageSelector();
};

init();
