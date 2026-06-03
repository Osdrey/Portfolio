// Logica para el funcionamiento de la barra lateral
export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const navButtons = sidebar.querySelectorAll("nav button");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.section);
    target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  const sections = Array.from(navButtons).map(btn => {
    return document.getElementById(btn.dataset.section);
  });

  function onScrollSpy() {
    const scrollPos = window.scrollY || window.pageYOffset;
    let currentSectionId = sections[0]?.id;

    for (const section of sections) {
    if (section.offsetTop <= scrollPos + 150) {
      currentSectionId = section.id;
    }
    }

    navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.section === currentSectionId);
    });
  }

  window.addEventListener("scroll", onScrollSpy);
  setTimeout(() => {
  const hash = window.location.hash.replace('#', '');
    if (hash) {
      const btnToActivate = Array.from(document.querySelectorAll("#sidebar nav button")).find(
      btn => btn.dataset.section.toLowerCase() === hash.toLowerCase()
      );
      if (btnToActivate) {
      document.querySelectorAll("#sidebar nav button").forEach(b => b.classList.remove("active"));
      btnToActivate.classList.add("active");
      }
    }
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);
  }, 100);
}
