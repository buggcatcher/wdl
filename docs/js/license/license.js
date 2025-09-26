// === HEADER LOGO ===
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('.menu-header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (y > lastY && y > header.offsetHeight) {
      // scrolling down past header height → hide
      header.style.transform = 'translateY(-100%)';
    } else {
      // scrolling up or near top → show
      header.style.transform = 'translateY(0)';
    }
    lastY = y;
  });
});

/* === License JS link flaticon scomparsa === */

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-attribution");
  const box = document.getElementById("attribution-box");
  const source = document.getElementById("flaticon-links");
  const arrowIcon = document.getElementById("arrow-icon");
  const toggleText = document.getElementById("toggle-text");

  toggleBtn.addEventListener("click", function () {
  const isVisible = box.offsetParent !== null;

    // Carico il contenuto solo la prima volta che mostro il box
    if (!isVisible && box.innerHTML.trim() === "") {
      box.innerHTML = source.innerHTML;
    }

    // Alterno visibilità del box
    box.style.display = isVisible ? "none" : "block";

    // Cambio testo del bottone in base allo stato
    toggleText.textContent = isVisible
      ? "Show icon credits"
      : "Hide source links";

    // Cambio la classe della freccia per ruotarla
    arrowIcon.classList.remove("arrow-up", "arrow-down");
    arrowIcon.classList.add(isVisible ? "arrow-down" : "arrow-up");
  });
});

document.getElementById("booking-form").addEventListener("submit", function (e) {
  const consent = document.getElementById("consent");
  const error = document.getElementById("consent-error");

  if (!consent.checked) {
    e.preventDefault(); // blocca invio
    error.classList.remove("hidden"); // mostra errore
    consent.focus();
  } else {
    error.classList.add("hidden"); // nascondi errore se ok
  }
});



