const savedLanguage = localStorage.getItem("language");
if (savedLanguage) {
  document.getElementById("language-selector").value = savedLanguage;
  changeLanguage(savedLanguage); 
} else {
    changeLanguage("es");
}

const languageSelector = document.getElementById("language-selector");

languageSelector.addEventListener("change", (event) => {
    const language = event.target.value;
    changeLanguage(language);
    localStorage.setItem("language", language);
});

function changeLanguage(language) {
    fetch('assets/translations/index.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById("homeLabel").textContent = data.homeLabel[language];
            document.getElementById("aboutMeLabel").textContent = data.aboutMeLabel[language];
            document.getElementById("projectsLabel").textContent = data.projectsLabel[language];
            document.getElementById("skillsLabel").textContent = data.skillsLabel[language];
            document.getElementById("contactLabel").textContent = data.contactLabel[language];
            document.getElementById("welcome").textContent = data.welcome[language];
            document.getElementById("description").textContent = data.description[language];
        })
}
