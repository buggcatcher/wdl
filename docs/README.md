![Where Do Locals](assets/img/original/logo-wdl.png)

**Esperienze autentiche in Toscana.**  

---

Web-app mobile-first accessibile tramite QR code sul portachiavi delle case vacanza. 

Scelta guidata di esperienze locali e form dinamico per richiedere info allo satff. 

stack tecnologico:HTML, CSS, JS, Bootstrap


---

![Where Do Locals](assets/img/original/logo-wdl.png)

Project: [Where Do Locals]
Website Type: Static site (HTML, CSS, JS only)
Form Behavior: Generates pre-filled message for email or WhatsApp
Backend: None (no database, no data storage)

------------------------------------------------------------
Legal & Privacy Compliance (EU GDPR + Italian Regulations)
------------------------------------------------------------

✅ 1. Privacy Policy (Required)
- A dedicated page ("privacy-policy.html") is included.
- It contains:
  - Identity of the Data Controller
  - What personal data is used (name, email, phone, etc.)
  - Purpose: only to generate a message that the user manually sends
  - No data is stored or processed by the server
  - Legal basis: user’s explicit consent (via checkbox)
  - User rights (access, correction, deletion, etc.)
  - Contact info for any concerns or GDPR inquiries
  - Notice regarding external third-party links

✅ 2. Consent Checkbox (Required)
- The form includes a required checkbox to collect user consent.
- The form cannot be submitted unless the checkbox is selected.
- Consent text clearly refers to the Privacy Policy.

✅ 3. Cookie Policy
- This site does NOT use profiling or tracking cookies.
- Only essential technical cookies (if any) may be used.
- If future analytics are implemented, a proper cookie banner will be added.

✅ 4. External Links Attributes
- All external links use: `target="_blank"` and `rel="noopener noreferrer"`
- Ensures better privacy (no referrer leak) and protection (anti-tabnabbing)

✅ 5. Licenses & Attributions
- Icons by Flaticon (with attribution)
- Images from Unsplash or Pixabay (free license)
- Full credits are listed in the website footer
- Ownership and authorship are indicated as:
  "Designed and developed by [Your Name or Team]"

✅ 6. VAT / Legal Info (If applicable)
- If the website belongs to a registered business, the Privacy Policy includes:
  - Legal business name
  - VAT number (Partita IVA)
  - Registered address
  - Contact email

------------------------------------------------------------
Summary
This site is fully compliant with EU and Italian privacy standards for static websites.
There is no personal data processing or storage on the server.
All communication is handled client-side via user-initiated messaging.
------------------------------------------------------------

Date: [Insert Date]
Author(s): [Your Name or Team]

---

**Comando per git per tutti i siti : Start Da Where Do Locals/**  


cd generale/;git add .;git commit -m "update";git push;cd ../palazzo-nave/;git add .;git commit -m "update";git push;cd ../velonis/;git add .;git commit -m "update";git push;cd ../

---

**Case for cookie e GDPR for Privacy & Policy**  


| Caso                                    | Obbligo di registrare consenso | Note                               |
| --------------------------------------- | ------------------------------ | ---------------------------------- |
| Sito senza memorizzazione dati          | No                             | Basta checkbox obbligatoria        |
| Sito con raccolta dati e memorizzazione | Sì                             | Devi conservare prova del consenso |


**form_GA4**

Aggiungi all’inizio di sendMsg la variabile experience:

const experience = document.querySelector(".section-title")?.innerText.trim() || document.title.trim() || "Unknown Experience";


Sostituisci la stringa hard-coded nell’array lines:

// Prima:
`Hello! I'd like to book "Live the Dolce Vita in Florence - eFiat 500 Tour".`,
// Dopo:
`Hello! I'd like to book "${experience}".`,


Aggiungi la riga GA4 subito dopo aver definito experience e prima dell’invio del messaggio:

gtag("event", "form_contact", {
  method: method,
  experience: experience
});


💡 Con queste modifiche, ogni form invierà a GA4:

experience → il nome dell’esperienza preso automaticamente

method → "whatsapp" o "email"

Non serve modificare il resto del JS, né creare parametri manuali per ogni pagina.