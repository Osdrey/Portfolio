// Lógica para el cambio de tema
import { imageLoader } from './loaders.js'; 
const body = document.querySelector('body');

export const loadTheme = () => {
  const icon = document.querySelector('.toggle-icon');
  const darkmode = localStorage.getItem('dark-mode') === 'true';
  body.classList.add(darkmode ? 'dark-mode' : 'light-mode');
  icon.classList.add(darkmode ? 'fa-moon' : 'fa-sun');
  icon.classList.remove('animated');
};

export const toggleTheme = () => {
  const icon = document.querySelector('.toggle-icon');
  const isDarkMode = body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode', !isDarkMode);
  icon.classList.toggle('fa-moon', isDarkMode);
  icon.classList.toggle('fa-sun', !isDarkMode);
  icon.classList.add('animated');
  localStorage.setItem('dark-mode', isDarkMode);
  setTimeout(() => icon.classList.remove('animated'), 500);
  imageLoader();
};
