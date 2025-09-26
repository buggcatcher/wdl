// Funzione di esempio per futura logica JS dinamica
function toggleContent(id) {
    const content = document.getElementById(id);
    if (content) {
      content.classList.toggle('d-none');
    }
  }
  
function handleCardClick(card) {
  card.classList.toggle('flipped');
  if (card.classList.contains('flipped')) {
    setTimeout(() => card.classList.remove('flipped'), 10000); // ritorna dopo 5s
  }
}


function animateLogo() {                                        // Animazione logo WDL
  const logo = document.getElementById('wdl-logo');
  if (logo) {
    // Attiva l'animazione dopo un piccolo delay per assicurarsi che il banner sia caricato
    setTimeout(() => {
      logo.classList.add('show');
    }, 300);
  }
}

document.addEventListener("DOMContentLoaded", function () {
    // Avvia animazione logo
    animateLogo();                                              // fine parte animazione

    const buttons = document.querySelectorAll(".license-btn"); // solo i pulsanti, salta il primo paragrafo

    buttons.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            const contentId = `content${index + 2}`; // il primo pulsante corrisponde a content2
            const textId = `toggle-text${index + 2}`;
            const box = document.getElementById(contentId);
            const span = document.getElementById(textId);
            const arrow = btn.querySelector("img");

            if (!box || !span) return;

            const isVisible = box.offsetParent !== null;

            // Alterna visibilità
            box.style.display = isVisible ? "none" : "block";

            // Cambio testo
            if (!span.dataset.original) span.dataset.original = span.textContent;
            span.textContent = isVisible ? span.dataset.original : "Hide";

            // Ruota freccia
            if (arrow) {
                arrow.classList.remove("arrow-up", "arrow-down");
                arrow.classList.add(isVisible ? "arrow-down" : "arrow-up");
            }
        });
    });
});


