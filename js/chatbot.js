/* ============================================================
   CHATBOT "PREGÚNTALE AL FABRICANTE"
   Bot basado en reglas (sin servidor): detecta palabras clave
   y responde sobre Nica, Rigel, el orfanato Grave, la autora
   y los secretos de la novela. Incluye chips de sugerencias y 
   efecto de "escribiendo…".
   ============================================================ */

(function chatbot() {
  const fab = document.getElementById("chatFab");
  const win = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const chipsBox = document.getElementById("chatChips");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!fab || !win) return;

  /* ---------- Base de conocimiento ---------- */
  const KB = [
    {
      keys: ["nica", "nicole", "protagonista"],
      reply:
        "📖 <strong>Nica (Nicole Dover)</strong> es la protagonista de la historia. Tras perder a sus padres en un trágico accidente, crece en el severo orfanato Grave, donde todos la conocen como la chica de los ojos claros y un corazón lleno de sensibilidad, adoptada finalmente por los Milligan."
    },
    {
      keys: ["rigel", "rigel wilde", "fabricante"],
      reply:
        "🖤 <strong>Rigel Wilde</strong> es el enigmático coprotagonista. Con una melena oscura y una actitud fría que oculta un pasado doloroso, es considerado por muchos como el mismísimo Fabricante de Lágrimas del cuento de terror del orfanato."
    },
    {
      keys: ["grave", "orfanato", "lugar"],
      reply:
        "🏛️ El <strong>orfanato Grave</strong> (la tumba) es el oscuro escenario donde crecieron Nica y Rigel bajo normas estrictas y leyendas de terror, siendo la más famosa la historia del artesano que fabricaba lágrimas de cristal."
    },
    {
      keys: ["erin doom", "autora", "escritora", "libro"],
      reply:
        "🖋️ <strong>Erin Doom</strong> es el seudónimo de la autora italiana del bestseller <em>El fabricante de lágrimas</em>. Inició su camino en la plataforma digital Wattpad antes de convertirse en un fenómeno editorial mundial."
    },
    {
      keys: ["cuento", "leyenda", "fabrica", "lagrimas"],
      reply:
        "✨ El cuento del <strong>Fabricante de Lágrimas</strong> habla de un misterioso artesano de ojos transparentes que vivía en la oscuridad, tallando emociones y lágrimas de cristal, una metáfora profunda sobre el dolor y el amor entre Nica y Rigel."
    },
    {
      keys: ["milionar", "milligan", "adoptivos", "padres"],
      reply:
        "🏡 Los <strong>esposos Milligan</strong> son quienes finalmente adoptan a Nica, brindándole un hogar lleno de calidez y la oportunidad de dejar atrás los fantasmas del pasado en el Grave."
    },
    {
      keys: ["trama", "argumento", "de que trata", "historia"],
      reply:
        "🥀 La novela combina el romance oscuro, los traumas de la infancia y la redención emocional. Nica y Rigel, obligados a convivir bajo el mismo techo tras su adopción, descubren que sus destinos siempre estuvieron atados por el sufrimiento y un amor inquebrantable."
    },
    {
      keys: ["juego", "jugar", "trivia"],
      reply:
        '🎮 ¡Pon a prueba lo que sabes! Sube a la sección de la <a href="#juego">Trivia</a> y demuestra qué tan bien conoces los secretos de Nica y Rigel 😉.'
    },
    {
      keys: ["hola", "buenas", "hey", "saludos", "hi"],
      reply:
        "¡Hola! 🖤 Soy el asistente de este rincón oscuro. Puedo contarte sobre <strong>Nica</strong>, <strong>Rigel</strong>, el orfanato <strong>Grave</strong> o la autora <strong>Erin Doom</strong>. ¿Qué deseas descubrir?"
    },
    {
      keys: ["gracias", "genial", "perfecto"],
      reply: "¡Con gusto! 🥀 Si quieres desentrañar más secretos de la historia, aquí estoy."
    }
  ];

  const FALLBACK =
    "Mmm, eso se encuentra oculto en las sombras 🤔. Prueba preguntarme por: " +
    "<em>Nica</em>, <em>Rigel</em>, <em>el orfanato Grave</em>, " +
    "<em>Erin Doom</em> o <em>la historia</em>.";

  const CHIPS = [
    "¿Quién es Nica?",
    "¿Quién es Rigel?",
    "El orfanato Grave",
    "Erin Doom",
    "El cuento de terror",
    "La historia"
  ];

  /* ---------- Utilidades ---------- */
  const normalize = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function answerFor(text) {
    const q = normalize(text);
    for (const rule of KB) {
      if (rule.keys.some((k) => q.includes(k))) return rule.reply;
    }
    return FALLBACK;
  }

  function addMessage(html, who) {
    const div = document.createElement("div");
    div.className = "chat-msg " + who; // "bot" o "user"
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function botReply(text) {
    const typing = addMessage('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      typing.innerHTML = answerFor(text);
      messages.scrollTop = messages.scrollHeight;
    }, 550 + Math.random() * 450);
  }

  function send(text) {
    if (!text.trim()) return;
    addMessage(text.replace(/</g, "&lt;"), "user");
    botReply(text);
  }

  /* ---------- Chips de sugerencias ---------- */
  CHIPS.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", () => send(label));
    chipsBox.appendChild(b);
  });

  /* ---------- Abrir / cerrar ---------- */
  let greeted = false;
  function openChat() {
    win.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => win.classList.add("open"));
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage(
          "¡Hola! 🖤 Pregúntame sobre <strong>Nica</strong>, <strong>Rigel</strong>, " +
          "el orfanato <strong>Grave</strong> o la autora <strong>Erin Doom</strong>. " +
          "También puedes tocar una sugerencia aquí abajo.",
          "bot"
        );
      }, 350);
    }
    input.focus();
  }
  function closeChat() {
    win.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
    setTimeout(() => { win.hidden = true; }, 300);
  }

  fab.addEventListener("click", () => (win.hidden ? openChat() : closeChat()));
  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
    input.value = "";
  });
})();