document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));

    const toggleButton = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme") || "dark";

    loadThemeStyles(savedTheme, pageName);

    function loadThemeStyles(theme) {
        const linkId = "theme-stylesheet";
        let existingLink = document.getElementById(linkId);

        if (existingLink) {
            existingLink.href = `assets/styles/${theme}-styles.css`;
        } else {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `assets/styles/${theme}-styles.css`;
            link.id = linkId;
            document.head.appendChild(link);
        }

        document.body.classList.remove("light-mode", "dark-mode");
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem("theme", theme);
    }

    loadThemeStyles(savedTheme);

    toggleButton.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
        loadThemeStyles(newTheme);
    });
});
