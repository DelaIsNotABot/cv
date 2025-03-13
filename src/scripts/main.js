document.addEventListener("DOMContentLoaded", function () {
  const elements = document.querySelectorAll(".typing-text");
  let delay = 0;

  elements.forEach((element, index) => {
    const text = element.textContent;
    element.textContent = "";

    // Incrementar el delay para cada elemento
    delay += element.classList.contains("command") ? 1000 : 2000;

    setTimeout(() => {
      typeWriter(
        element,
        text,
        element.classList.contains("command") ? 50 : 30
      );
    }, delay);
  });
});

function typeWriter(element, text, speed = 50) {
  let i = 0;

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Efecto del cursor terminal
const cursor = document.querySelector(".terminal-cursor");
setInterval(() => {
  cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
}, 500);
