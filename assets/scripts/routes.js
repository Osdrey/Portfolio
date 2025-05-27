export const routes = {
  themes: {
    dark:   `assets/styles/themes/dark-styles.css`,
    light:  `assets/styles/themes/light-styles.css`,
  },

  partials: {
    header: {
      html: `partials/header.html`,
      css:  `assets/styles/partials/header-styles.css`
    },
    sidebar: {
      html: `partials/sidebar.html`,
      css:  `assets/styles/partials/sidebar-styles.css`
    },
    footer: {
      html: `partials/footer.html`,
      css:  `assets/styles/partials/footer-styles.css`
    }
  },
    
  common: {
    css:  `assets/styles/common-styles.css`,
    json: `assets/translations/common-translations.json`
  },

  pages: {
    home: {
      html: `pages/home/home.html`,
      css:  `pages/home/home-styles.css`,
      json: `pages/home/home-translation.json`,
      js:   `pages/home/home-scripts.js`
    },
    aboutMe: {
      html: `pages/aboutMe/aboutMe.html`,
      css:  `pages/aboutMe/aboutMe-styles.css`,
      json: `pages/aboutMe/aboutMe-translation.json`,
      js:   `pages/aboutMe/aboutMe-scripts.js`
    },
    projects: {
      html: `pages/projects/projects.html`,
      css:  `pages/projects/projects-styles.css`,
      json: `pages/projects/projects-translation.json`,
      js:   `pages/projects/projects-scripts.js`
    },
    skills: {
      html: `pages/skills/skills.html`,
      css:  `pages/skills/skills-styles.css`,
      json: `pages/skills/skills-translation.json`,
      js:   `pages/skills/skills-scripts.js`
    },
    contact: {
      html: `pages/contact/contact.html`,
      css:  `pages/contact/contact-styles.css`,
      json: `pages/contact/contact-translation.json`,
      js:   `pages/contact/contact-scripts.js`
    }
  },

  images: {
    dark: `assets/images/dark-image.png`,
    light: `assets/images/light-image.png`,
    darkProfile: `assets/images/dark-profile.png`,
    lightProfile: `assets/images/light-profile.png`
  },

  files: {
    cv: `assets/files/curriculum-vitae.pdf`,
    hv: `assets/files/hoja-de-vida.pdf`
  },
};
