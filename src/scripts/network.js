// Función para copiar el email al portapapeles
function copyEmail() {
  const email = "contact@jorgealias.me";
  navigator.clipboard.writeText(email).then(() => {
    const button = document.querySelector(".email-card .action-button");
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-copy"></i> Copy';
    }, 2000);
  });
}

// Manejo del formulario de contacto
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Mostrar mensaje de éxito
      const submitButton = document.querySelector(".submit-button");
      submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitButton.style.backgroundColor = "var(--primary-color)";
      submitButton.style.color = "var(--secondary-color)";

      // Resetear el formulario después de 2 segundos
      setTimeout(() => {
        document.getElementById("contactForm").reset();
        submitButton.innerHTML =
          '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        submitButton.style.backgroundColor = "transparent";
        submitButton.style.color = "var(--primary-color)";
      }, 2000);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Efecto glitch en el título
const glitchText = document.querySelector(".glitch-text");
let glitchInterval;

glitchText.addEventListener("mouseover", () => {
  clearInterval(glitchInterval);
  glitchInterval = setInterval(() => {
    glitchText.style.textShadow = `
            ${Math.random() * 10}px ${Math.random() * 10}px ${
      Math.random() * 10
    }px rgba(0,255,157,0.7),
            ${Math.random() * -10}px ${Math.random() * -10}px ${
      Math.random() * 10
    }px rgba(255,0,0,0.7)
        `;
  }, 50);
});

glitchText.addEventListener("mouseout", () => {
  clearInterval(glitchInterval);
  glitchText.style.textShadow = "none";
});
