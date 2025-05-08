const basePath = window.location.pathname.includes("/Portfolio/") ? "/Portfolio" : "";

const routes = {
    homeRouteHeader: `${basePath}/index.html`,
    homeRoute: `${basePath}/index.html`,
    aboutMeRoute: `${basePath}/pages/aboutMe.html`,
    projectsRoute: `${basePath}/pages/projects.html`,
    skillsRoute: `${basePath}/pages/skills.html`,
    contactRoute: `${basePath}/pages/contact.html`
};