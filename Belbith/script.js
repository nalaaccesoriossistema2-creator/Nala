// Configuración de nombres y mensajes
const CONFIG = {
  segundosCarga: 3,
  para: "Belbith",
  de: "Luis ❤️",
  mensajeInicial: "“Espero que te guste, mi amor. ♥ Lo hice con todo mi corazón, solo para ti.”",
  recuerdos: [
    "Recuerdo 1: cada momento contigo es especial. ❤️",
    "Recuerdo 2: tu sonrisa siempre mejora mis días. 💗",
    "Recuerdo 3: mi corazón está lleno de amor por ti. Te quiero, Belbith. ❤️"
  ]
};

// Asignar textos iniciales
document.getElementById("recipient").textContent = CONFIG.para;
document.getElementById("sender").textContent = CONFIG.de;
document.getElementById("introMessage").textContent = CONFIG.mensajeInicial;

// Elementos DOM
const loading = document.getElementById("loading");
const welcome = document.getElementById("welcome");
const giftWrap = document.getElementById("giftWrap");
const heartButton = document.getElementById("heartButton");
const heartScene = document.getElementById("heartScene");
const heartContainer = document.getElementById("heartContainer");
const instruction = document.getElementById("instruction");
const bigFillRect = document.getElementById("bigFillRect");
const progressLabel = document.getElementById("progressLabel");
const memoryMessage = document.getElementById("memoryMessage");
const finalCard = document.getElementById("finalCard");
const romanticStory = document.getElementById("romanticStory");

// Transición inicial desde la pantalla de carga
window.setTimeout(() => {
  loading.classList.remove("active");
  window.setTimeout(() => welcome.classList.add("active"), 180);
}, CONFIG.segundosCarga * 1000);

let started = false;
let progress = 0;
let memoryIndex = 0;
let completed = false;

// Inicio al hacer clic en el botón pequeño
heartButton.addEventListener("click", () => {
  if (started) return;
  started = true;

  giftWrap.classList.add("show-heart");
  heartScene.hidden = false;
  progressLabel.textContent = "0%";
  memoryMessage.textContent = "";
  instruction.textContent = "";
});

// Toque/Clic en el Corazón Grande (3 pasos: 33%, 66%, 100%)
heartScene.addEventListener("click", (e) => {
  if (!started || completed) return;

  memoryIndex += 1;
  progress = Math.min(memoryIndex * (100 / 3), 100);

  // Animación del llenado SVG
  const height = 180 * progress / 100;
  bigFillRect.setAttribute("height", String(height));
  bigFillRect.setAttribute("y", String(180 - height));

  // Efecto de pulso y partículas
  triggerHeartBeat();
  createSparks(e.clientX, e.clientY);

  // Actualizar porcentaje con efecto Pop
  progressLabel.textContent = `${Math.round(progress)}%`;
  progressLabel.classList.add("pop");
  setTimeout(() => progressLabel.classList.remove("pop"), 200);

  // Mensaje del recuerdo actual
  const recuerdo = CONFIG.recuerdos[memoryIndex - 1];
  if (recuerdo) {
    memoryMessage.style.opacity = "0";
    setTimeout(() => {
      memoryMessage.textContent = recuerdo;
      memoryMessage.style.opacity = "1";
    }, 100);
  }

  // Verificar si llegó al 100%
  if (memoryIndex >= 3) {
    completed = true;
    progressLabel.textContent = "100% ❤️";
    showFloatingHearts();

    // Transición rápida (1 segundo) hacia el mensaje final
    setTimeout(() => {
      heartScene.classList.add("fade-out");
      setTimeout(() => {
        heartScene.hidden = true;
        finalCard.hidden = false;

        // Tras 1.5 segundos en la tarjeta final, desplegamos el contenido romántico
        setTimeout(() => {
          finalCard.style.opacity = "0";
          finalCard.style.transform = "translateY(-10px)";
          setTimeout(() => {
            finalCard.hidden = true;
            romanticStory.hidden = false;
            initSlider(); // Inicializar carrusel táctil (audio controlado por el usuario)
          }, 400);
        }, 1500);

      }, 350);
    }, 1000);
  }
});

// Pulso visual del corazón
function triggerHeartBeat() {
  heartContainer.classList.remove("heart-pulse");
  void heartContainer.offsetWidth; // Force Reflow
  heartContainer.classList.add("heart-pulse");
}

// Micro-partículas al tocar
function createSparks(x, y) {
  if (!x || !y) {
    const rect = heartContainer.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  const count = 8;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement("div");
    spark.className = "click-spark";

    const isHeart = Math.random() > 0.5;
    if (isHeart) {
      spark.textContent = "♥";
      spark.style.color = "#e62950";
      spark.style.fontSize = `${10 + Math.random() * 12}px`;
    } else {
      spark.style.width = `${4 + Math.random() * 6}px`;
      spark.style.height = spark.style.width;
      spark.style.background = "#ff9ebb";
    }

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const dist = 35 + Math.random() * 45;

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 450);
  }
}

// Lluvia de corazones al finalizar
function showFloatingHearts() {
  for (let i = 0; i < 16; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "♥";
    const drift = Math.round((Math.random() - 0.5) * 180);
    heart.style.setProperty("--drift", `${drift}px`);
    heart.style.left = `${15 + Math.random() * 70}%`;
    heart.style.animationDelay = `${Math.random() * 0.4}s`;
    giftWrap.appendChild(heart);
    window.setTimeout(() => heart.remove(), 2100);
  }
}

// --- LÓGICA DEL CARRUSEL TÁCTIL Y ACORDEÓN ---
function initSlider() {
  const track = document.getElementById("sliderTrack");
  const dots = document.querySelectorAll(".dot");
  if (!track) return;

  const totalSlides = 3;
  let currentIndex = 0;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;

  function updateSlider() {
    currentTranslate = -currentIndex * 100;
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  // Gestos Táctiles (Touch Events)
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    const containerWidth = track.parentElement.offsetWidth;
    const movePercent = (diffX / containerWidth) * 100;
    track.style.transform = `translateX(${prevTranslate + movePercent}%)`;
  });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (diffX < -40 && currentIndex < totalSlides - 1) {
      currentIndex++;
    } else if (diffX > 40 && currentIndex > 0) {
      currentIndex--;
    }
    updateSlider();
  });

  // Puntos del acordeón
  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      currentIndex = parseInt(e.target.dataset.index);
      updateSlider();
    });
  });
}