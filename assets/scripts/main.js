// Script principal
import { themeLoader, partialsLoader, handleRouteChange } from './loaders.js';
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
  // Cambios en la URL
  window.addEventListener('hashchange', handleRouteChange);
  // Controlador de rutas
  handleRouteChange();
};

init();
