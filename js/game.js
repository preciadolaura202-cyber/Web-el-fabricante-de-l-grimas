document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    {
      question: "¿Cómo se llamaba el legendario personaje del cuento de terror que contaban en el orfanato Grave?",
      options: [
        "El Fabricante de Lágrimas",
        "El Monstruo de las Nieves",
        "El Herrero de las Sombras",
        "El Guardián del Silencio"
      ],
      correct: 0
    },
    {
      question: "¿Quiénes adoptan finalmente a Nica tras su estancia en el orfanato?",
      options: [
        "La familia Foster",
        "Los esposos Milligan",
        "Los duques de Dover",
        "La familia Hopkins"
      ],
      correct: 1
    },
    {
      question: "¿Qué característica física o accesorio distingue fuertemente a Rigel frente a los demás?",
      options: [
        "Usa siempre una bufanda roja",
        "Toca el piano a la luz de la luna",
        "Sus ojos claros y su melena oscura, además de su actitud fría",
        "Una cicatriz profunda en el rostro"
      ],
      correct: 2
    },
    {
      question: "¿Bajo qué seudónimo literario escribe la autora original de la novela (Erin Doom)?",
      options: [
        "Es un seudónimo y su identidad real se mantuvo en anonimato",
        "El nombre real de la autora es Elena Daneri",
        "Es un colectivo de escritores italianos",
        "Su nombre real es Beatrice Rossi"
      ],
      correct: 0
    },
    {
      question: "¿Cuál es el sentimiento central que une la historia y el vínculo entre Nica y Rigel?",
      options: [
        "Una rivalidad escolar por las notas",
        "El deseo de venganza contra el orfanato",
        "El reconocimiento mutuo de sus heridas y la culpa",
        "Un secreto familiar sobre una herencia perdida"
      ],
      correct: 2
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let answerSelected = false;

  const questionText = document.getElementById("triviaQuestionText");
  const optionsContainer = document.getElementById("triviaOptions");
  const progressText = document.getElementById("triviaProgress");
  const scoreText = document.getElementById("triviaScore");
  const nextBtn = document.getElementById("triviaNextBtn");
  const triviaContainer = document.getElementById("triviaContainer");
  const winScreen = document.getElementById("triviaWin");
  const winText = document.getElementById("triviaWinText");
  const restartBtn = document.getElementById("triviaRestart");

  if (!questionText) return;

  function loadQuestion() {
    answerSelected = false;
    if (nextBtn) nextBtn.style.display = "none";
    
    const q = questions[currentQuestionIndex];
    if (progressText) progressText.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
    if (scoreText) scoreText.textContent = `Puntuación: ${score}`;
    if (questionText) questionText.textContent = q.question;
    
    if (!optionsContainer) return;
    optionsContainer.innerHTML = "";
    
    q.options.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.className = "trivia-option-btn";
      
      btn.addEventListener("click", () => selectOption(index, btn));
      optionsContainer.appendChild(btn);
    });
  }

  function selectOption(selectedIndex, selectedBtn) {
    if (answerSelected) return;
    answerSelected = true;

    const q = questions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll("button");

    if (selectedIndex === q.correct) {
      selectedBtn.style.background = "rgba(74, 222, 128, 0.2)";
      selectedBtn.style.borderColor = "#4ade80";
      score += 20;
    } else {
      selectedBtn.style.background = "rgba(248, 113, 113, 0.2)";
      selectedBtn.style.borderColor = "#f87171";
      if (buttons[q.correct]) {
        buttons[q.correct].style.background = "rgba(74, 222, 128, 0.2)";
        buttons[q.correct].style.borderColor = "#4ade80";
      }
    }

    buttons.forEach(b => b.style.cursor = "default");
    if (scoreText) scoreText.textContent = `Puntuación: ${score}`;

    if (currentQuestionIndex < questions.length - 1) {
      if (nextBtn) nextBtn.style.display = "inline-block";
    } else {
      setTimeout(showWinScreen, 1000);
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      loadQuestion();
    });
  }

  function showWinScreen() {
    if (triviaContainer) triviaContainer.style.display = "none";
    if (winScreen) winScreen.hidden = false;
    if (winText) winText.textContent = `¡Has conseguido ${score} puntos de 100 posibles!`;
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      currentQuestionIndex = 0;
      score = 0;
      if (triviaContainer) triviaContainer.style.display = "block";
      if (winScreen) winScreen.hidden = true;
      loadQuestion();
    });
  }

  loadQuestion();
});