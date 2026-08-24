/* ============================================================
   EL FABRICANTE DE LÁGRIMAS — JavaScript
   1. Mariposas blancas brillantes en el hero (canvas)
   2. Animaciones de aparición al hacer scroll (IntersectionObserver)
   3. Contadores animados en las estadísticas
   4. Menú hamburguesa en móvil
   5. Botón "volver arriba"
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Mariposas blancas brillantes (estética Dark Romance) ---------- */
(function butterflies() {
  const canvas = document.getElementById("butterflies");
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, flock = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function makeButterfly() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 8,          // tamaño del ala
      angle: Math.random() * Math.PI * 2,   // dirección de vuelo
      speed: 0.25 + Math.random() * 0.55,
      flap: Math.random() * Math.PI * 2,    // fase del aleteo
      flapSpeed: 0.12 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.02,  // giro suave
      alpha: 0.6 + Math.random() * 0.4
    };
  }

  function draw(b) {
    const wing = Math.abs(Math.sin(b.flap)); // 0 = alas cerradas, 1 = abiertas
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle + Math.PI / 2);
    
    // Configuración del brillo etéreo y luminoso blanco
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = "#f4f4f6"; // Blanco perla / plateado claro

    // Ala izquierda y derecha (elipses que se pliegan con el aleteo)
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(
        side * b.size * 0.55 * wing, 0,
        b.size * 0.6 * Math.max(wing, 0.25), b.size,
        side * 0.5, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Cuerpo de la mariposa
    ctx.globalAlpha = b.alpha * 0.9;
    ctx.fillStyle = "#d1d5db"; // Gris platino suave para el centro
    ctx.beginPath();
    ctx.ellipse(0, 0, b.size * 0.14, b.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const b of flock) {
      b.flap += b.flapSpeed;
      b.angle += b.drift + Math.sin(b.flap * 0.3) * 0.01;
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed - 0.08; // tienden a subir

      // Reaparecen por el lado contrario al salir
      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;
      if (b.y < -20) b.y = height + 20;
      if (b.y > height + 20) b.y = -20;

      draw(b);
    }
    requestAnimationFrame(step);
  }

  resize();
  const count = Math.min(26, Math.max(10, Math.floor(width / 60)));
  flock = Array.from({ length: count }, makeButterfly);
  window.addEventListener("resize", resize);
  step();
})();

/* ---------- 2. Aparición al hacer scroll ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // solo anima una vez
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- 3. Contadores animados ---------- */
(function counters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMotion) { el.textContent = target; return; }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((el) => observer.observe(el));
})();

/* ---------- 4. Menú hamburguesa ---------- */
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Cierra el menú al elegir un enlace
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- Botón "volver arriba" (Funcionalidad completa) ---------- */
(function toTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;

  // 1. Mostrar u ocultar según el scroll
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });

  // 2. Acción de subir al hacer clic
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
})();

/* ---------- Efecto de escritura por letras en los H2 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const h2Elements = document.querySelectorAll("h2");

  h2Elements.forEach((h2) => {
    // Guardamos el texto original
    const text = h2.textContent;
    h2.textContent = ""; // Limpiamos el título

    // Creamos un span por cada letra para animarla individualmente
    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char; // Respeta los espacios en blanco
      span.classList.add("char-anim");
      // Retraso muy rápido en cascada (0.018s por letra) para que sea veloz
      span.style.animationDelay = `${index * 0.018}s`;
      h2.appendChild(span);
    });
  });
});

// ==========================================
// CARRUSEL 3D DE PERSONAJES Y UNIVERSO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const sectionObras = document.querySelector('#obras');
    if (!sectionObras) return;

    const carousel = sectionObras.querySelector('.carousel');
    if (!carousel) return;

    const products = [...carousel.querySelectorAll('.product')];
    const prev = carousel.querySelector('.carousel__button--prev');
    const next = carousel.querySelector('.carousel__button--next');
    const dotsContainer = carousel.querySelector('.carousel__dots');

    if (!products.length || !prev || !next || !dotsContainer) return;

    let current = 0;
    let autoplay;

    // Crear los puntos indicadores dinámicamente si están vacíos
    if (dotsContainer.children.length === 0) {
        products.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Ver personaje ${index + 1}`);

            dot.addEventListener('click', () => {
                current = index;
                update();
                startAutoplay();
            });

            dotsContainer.appendChild(dot);
        });
    }

    const dots = [...dotsContainer.children];

    function update() {
        const total = products.length;

        products.forEach((product, index) => {
            let position = (index - current + total) % total;

            if (position > total / 2) position -= total;

            product.style.setProperty('--x', `${position * 260}px`);
            product.style.setProperty(
                '--z',
                `${position === 0 ? 80 : -Math.abs(position) * 115}px`
            );
            product.style.setProperty('--rotate', `${position * -18}deg`);
            product.style.setProperty(
                '--scale',
                position === 0 ? '1.04' : '.78'
            );
            product.style.setProperty(
                '--opacity',
                Math.abs(position) > 2 ? '0' : '1'
            );
            product.style.setProperty(
                '--filter',
                position === 0
                    ? 'none'
                    : 'brightness(.65) saturate(.85)'
            );

            product.classList.toggle('is-active', position === 0);
            product.setAttribute('aria-hidden', position !== 0);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === current);
            dot.setAttribute(
                'aria-current',
                index === current ? 'true' : 'false'
            );
        });
    }

    function goNext() {
        current = (current + 1) % products.length;
        update();
    }

    function goPrev() {
        current = (current - 1 + products.length) % products.length;
        update();
    }

    function startAutoplay() {
        clearInterval(autoplay);
        autoplay = setInterval(goNext, 4000);
    }

    next.addEventListener('click', () => {
        goNext();
        startAutoplay();
    });

    prev.addEventListener('click', () => {
        goPrev();
        startAutoplay();
    });

    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', startAutoplay);

    document.addEventListener('keydown', event => {
        // Solo accionar si la sección está cerca o visible
        const rect = sectionObras.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (!isVisible) return;

        if (event.key === 'ArrowRight') {
            goNext();
            startAutoplay();
        }

        if (event.key === 'ArrowLeft') {
            goPrev();
            startAutoplay();
        }
    });

    update();
    startAutoplay();
});

/* ---------- Distribución geométrica del Carrusel 3D (6 imágenes) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const ring = document.getElementById("carouselRing");
  if (!ring) return;
  
  const cells = ring.querySelectorAll(".carousel-cell");
  const count = cells.length; // Será 6
  const radius = 280; // Radio del círculo en píxeles (puedes ajustarlo si quieres las fotos más juntas o separadas)

  cells.forEach((cell, i) => {
    const angle = (i / count) * 360;
    cell.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
});

/* ---------- Mariposas blancas brillantes independientes para el Carrusel (Dark Romance) ---------- */
(function butterflies2() {
  const canvas = document.getElementById("butterflies2");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height, flock = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function makeButterfly() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: 5 + Math.random() * 8,          // tamaño del ala
      angle: Math.random() * Math.PI * 2,   // dirección de vuelo
      speed: 0.25 + Math.random() * 0.55,
      flap: Math.random() * Math.PI * 2,    // fase del aleteo
      flapSpeed: 0.12 + Math.random() * 0.12,
      drift: (Math.random() - 0.5) * 0.02,  // giro suave
      alpha: 0.6 + Math.random() * 0.4
    };
  }

  function draw(b) {
    const wing = Math.abs(Math.sin(b.flap)); // 0 = alas cerradas, 1 = abiertas
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle + Math.PI / 2);
    
    // Configuración del brillo etéreo y luminoso blanco
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
    
    ctx.globalAlpha = b.alpha;
    ctx.fillStyle = "#f4f4f6"; // Blanco perla / plateado claro

    // Ala izquierda y derecha
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(
        side * b.size * 0.55 * wing, 0,
        b.size * 0.6 * Math.max(wing, 0.25), b.size,
        side * 0.5, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Cuerpo de la mariposa
    ctx.globalAlpha = b.alpha * 0.9;
    ctx.fillStyle = "#d1d5db"; // Gris platino suave para el centro
    ctx.beginPath();
    ctx.ellipse(0, 0, b.size * 0.14, b.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const b of flock) {
      b.flap += b.flapSpeed;
      b.angle += b.drift + Math.sin(b.flap * 0.3) * 0.01;
      b.x += Math.cos(b.angle) * b.speed;
      b.y += Math.sin(b.angle) * b.speed - 0.08; // tienden a subir

      // Reaparecen por el lado contrario al salir
      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;
      if (b.y < -20) b.y = height + 20;
      if (b.y > height + 20) b.y = -20;

      draw(b);
    }
    requestAnimationFrame(step);
  }

  resize();
  const count = Math.min(22, Math.max(8, Math.floor(width / 70)));
  flock = Array.from({ length: count }, makeButterfly);
  window.addEventListener("resize", resize);
  step();
})();