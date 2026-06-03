export async function init() {
  observeContact();
  initializeEmailJS();
}

let lastScrollY = window.scrollY;
let goingUp = false;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  goingUp = currentScrollY < lastScrollY;
  lastScrollY = currentScrollY;
});

function restartAnimation(el, immediate = false) {
  const className = el.dataset.animation || el.classList[0];
  if (!className) return;

  el.style.animationDelay = immediate ? "0s" : "";
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function showElement(el) {
  el.style.opacity = "";
  el.style.pointerEvents = "";
  el.style.visibility = "";
}

function hideElement(el) {
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.style.visibility = "hidden";
}

function handleEntryAnimation(entry) {
  const el = entry.target;
  if (entry.isIntersecting) {
    showElement(el);
    restartAnimation(el, goingUp);
  } else {
    hideElement(el);
  }
}

export function observeContact() {
  const elements = [
    ".contact-title",
    ".contact-subtitle",
    ".contact-container",
    ".info-item",
    ".form-group",
    ".submit-button"
  ].flatMap(selector => Array.from(document.querySelectorAll(selector)));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(handleEntryAnimation);
  }, {
    threshold: 0.5,
    rootMargin: "0px 0px -10% 0px"
  });

  elements.forEach(el => {
    if (!el.dataset.animation) {
      el.dataset.animation = el.classList[0];
    }
    observer.observe(el);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        elements.forEach(el => {
          showElement(el);
          restartAnimation(el, false);
        });
      }
    });
  });
}

function initializeEmailJS() {
  if (typeof emailjs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = setupEmailJS;
    document.body.appendChild(script);
  } else {
    setupEmailJS();
  }

  function setupEmailJS() {
    const form = document.getElementById('contact-form');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupIcon = document.getElementById('popup-icon');
    const popupSuccessAlert = document.getElementById('popup-success-alert');
    const popupSuccessMessage = document.getElementById('popup-success-message');
    const popupErrorAlert = document.getElementById('popup-error-alert');
    const popupErrorMessage = document.getElementById('popup-error-message');
    const popupSuccessButton = document.getElementById('popup-success-button');
    const popupErrorButton = document.getElementById('popup-error-button');

    emailjs.init('q1pZRL-f60yf1rc1g');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      emailjs.sendForm('email_portfolio', 'es_received_mail', form)
        .then(() => {
          form.reset();
          showPopup('success');
        })
        .catch((error) => {
          console.error("Error al enviar:", error);
          showPopup('error');
        });
    });

    function showPopup(type) {
      const iconClasses = {
        success: 'fa-regular fa-circle-check',
        error: 'fa-regular fa-circle-xmark'
      };

      popupIcon.className = iconClasses[type] + ' popup-icon';
      popupIcon.classList.remove('success', 'error');
      popupIcon.classList.add(type);

      const isSuccess = type === 'success';
      
      popupSuccessAlert.classList.toggle('hidden', !isSuccess);
      popupSuccessMessage.classList.toggle('hidden', !isSuccess);
      popupSuccessButton.classList.toggle('hidden', !isSuccess);
      popupErrorAlert.classList.toggle('hidden', isSuccess);
      popupErrorMessage.classList.toggle('hidden', isSuccess);
      popupErrorButton.classList.toggle('hidden', isSuccess);
      popupOverlay.classList.remove('hidden');
    }

    popupSuccessButton.addEventListener('click', () => {
      popupOverlay.classList.add('hidden');
    });

    popupErrorButton.addEventListener('click', () => {
      popupOverlay.classList.add('hidden');
    });

    window.showPopup = showPopup;
  }
}
