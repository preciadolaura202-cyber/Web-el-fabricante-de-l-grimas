/* ============================================================
   MÓDULO DE ACCESIBILIDAD: LECTOR DE VOZ (SPEECH SYNTHESIS)
   ============================================================ */

(function textToSpeech() {
  // Verificamos si el navegador soporta síntesis de voz
  if (!('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;
  let isSpeaking = false;
  let currentUtterance = null;

  // Creamos el botón flotante de accesibilidad dinámicamente o lo buscamos si ya existe
  let speechBtn = document.getElementById("speechToggleBtn");
  if (!speechBtn) {
    speechBtn = document.createElement("button");
    speechBtn.id = "speechToggleBtn";
    speechBtn.className = "speech-floating-btn";
    speechBtn.innerHTML = "🔊 Leer página";
    speechBtn.setAttribute("aria-label", "Escuchar contenido de la página");
    document.body.appendChild(speechBtn);
  }

  // Función para recopilar el texto principal de la página
  function getPageText() {
    // Seleccionamos encabezados, párrafos y tarjetas principales de la novela
    const elements = document.querySelectorAll("h1, h2, h3, p, .centro-card, .trivia-container");
    let textToRead = "Bienvenido al rincón de El Fabricante de Lágrimas. ";
    
    elements.forEach(el => {
      // Evitamos leer textos ocultos o del propio chat/footer si no deseamos
      if (el.offsetParent !== null && !el.closest("#chatWindow")) {
        textToRead += el.innerText + ". ";
      }
    });
    return textToRead;
  }

  function toggleSpeech() {
    if (isSpeaking) {
      synth.cancel();
      isSpeaking = false;
      speechBtn.innerHTML = "🔊 Leer página";
      speechBtn.classList.remove("speaking");
    } else {
      const text = getPageText();
      currentUtterance = new SpeechSynthesisUtterance(text);
      currentUtterance.lang = "es-ES"; // Idioma español
      currentUtterance.rate = 1.0;     // Velocidad normal

      currentUtterance.onend = () => {
        isSpeaking = false;
        speechBtn.innerHTML = "🔊 Leer página";
        speechBtn.classList.remove("speaking");
      };

      currentUtterance.onerror = () => {
        isSpeaking = false;
        speechBtn.innerHTML = "🔊 Leer página";
        speechBtn.classList.remove("speaking");
      };

      synth.speak(currentUtterance);
      isSpeaking = true;
      speechBtn.innerHTML = "🔇 Detener lectura";
      speechBtn.classList.add("speaking");
    }
  }

  speechBtn.addEventListener("click", toggleSpeech);
})();