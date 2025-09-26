document.addEventListener("DOMContentLoaded", () => {
  // === GALLERY ===
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    const imageFiles = ["01.jpg", "02.jpg", "03.jpg"]; //file name of pic
    const basePath = "../../../assets/img/boxes/restaurants/cibreo/cibleo/"; //path pic
    const images = imageFiles.map(f => basePath + f);
//cambiare alt name linea 14
    galleryContainer.innerHTML = `
      <div class="gallery">
        <button class="gallery-btn prev">&#10094;</button>
        <div class="gallery-track-container">
          <div class="gallery-track">
            ${images.map(src => `<div class="gallery-slide"><img src="${src}" alt="Cibreo" /></div>`).join('')}
          </div>
        </div>
        <button class="gallery-btn next">&#10095;</button>
      </div>
    `;

    const track = galleryContainer.querySelector('.gallery-track');
    const slides = galleryContainer.querySelectorAll('.gallery-slide');
    const prevBtn = galleryContainer.querySelector('.gallery-btn.prev');
    const nextBtn = galleryContainer.querySelector('.gallery-btn.next');
    let idx = 0;

    const updateGallery = () => {
      const w = slides[0].clientWidth;
      track.style.transform = `translateX(-${idx * w}px)`;
    };
    nextBtn.addEventListener('click', () => { idx = (idx+1)%slides.length; updateGallery(); });
    prevBtn.addEventListener('click', () => { idx = (idx-1+slides.length)%slides.length; updateGallery(); });
    window.addEventListener('resize', updateGallery);
    updateGallery();

    // touch
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 30) nextBtn.click();
      if (endX > startX + 30) prevBtn.click();
    });
  }

  // === FORM === //cambiare qui info form
  const formContainer = document.getElementById("form-container");
  if (formContainer) {
    formContainer.innerHTML = `
      <div id="message-box" class="hidden">
        <p id="message-text"></p>
      </div>

      <form id="booking-form" class="booking-form" novalidate>
        <label class="bold-text" for="date-picker">Straight Booking</label>
        <div><p></p></div>
        <a href="https://widget.thefork.com/en-GB/410a205b-f0ee-4860-a4e1-be3378bd437b/homepage/2cce23fb-e4c5-4f30-bc73-7d6f8ab84f85?utm_source=referral&utm_medium=website&utm_campaign=francesco-deza"
          class="check-btn"
          role="button"
          style="display: block; margin: 0 auto; width: 80%; height: auto; text-align: center; text-decoration: none;">
          Go to Reservation
        </a>
      </form>
    `;
    const dateInput = document.getElementById('date-picker');
    const picker = new Pikaday({
      field: dateInput,
      format: 'DD/MM/YYYY',
      minDate: new Date(),
      theme: 'dark-theme' // opzionale
  });

  const sendMsg = method => {
    const val = id => document.getElementById(id)?.value.trim() || '';
    const experience = document.querySelector(".section-title")?.innerText.trim() || document.title.trim() || "Unknown Experience";

    gtag("event", "form_contact", {
      method: method,
      experience: experience
    });
    
    const lines = [
      `Hello! I'd like to book ${experience}.`,
      ``,
      `📅 Date:  ${val("date-picker")}`,
      `👤 Name:  ${val("main-guest")}`,
      `🧑‍🤝‍🧑 Adults: ${val("guest-picker")}`,
      `👶 Minors: ${val("under-18")}`,
      `📧 Email: ${val("email")}`,
      `📞 Phone: ${val("phone")}`,
    ];
  
    if (val("optional-request")) {
      lines.push(`📝 Notes: ${val("optional-request")}`);
    }
  
    lines.push(``, `Looking forward to your reply!`);
  
    const msg = lines.join('\n');
  
// 🔹 Aspetta mezzo secondo per dare tempo a GA4 di registrare l'evento
    setTimeout(() => {
      if (method === "whatsapp") {
        window.open(`https://wa.me/393473119031?text=${encodeURIComponent(msg)}`, "_blank");
      } else {
        const mailMsg = encodeURIComponent(msg);
        window.location.href = `mailto:wheredolocals@gmail.com?subject=&body=${mailMsg}`;
      }
    }, 1000);
  };
  

    document.getElementById("booking-form")
      .addEventListener("submit", e => { e.preventDefault(); sendMsg("whatsapp"); });
    document.getElementById("submit-email")
      .addEventListener("click", () => sendMsg("email"));
  }

  // === HEADER LOGO ===
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