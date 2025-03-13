// Inicialización del gráfico de radar para soft skills
document.addEventListener("DOMContentLoaded", function () {
  // Gráfico de Soft Skills
  const ctx = document.getElementById("softSkillsChart").getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Communication",
        "Team Work",
        "Problem Solving",
        "Adaptability",
        "Leadership",
        "Time Management",
      ],
      datasets: [
        {
          label: "Soft Skills",
          data: [90, 85, 95, 88, 80, 85],
          backgroundColor: "rgba(0, 255, 157, 0.2)",
          borderColor: "rgba(0, 255, 157, 1)",
          pointBackgroundColor: "rgba(0, 255, 157, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(0, 255, 157, 1)",
        },
      ],
    },
    options: {
      scales: {
        r: {
          angleLines: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          pointLabels: {
            color: "#8892b0",
          },
          ticks: {
            color: "#8892b0",
            backdropColor: "transparent",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  // Inicializar barras de nivel de idiomas
  document.querySelectorAll(".level-bar").forEach((bar) => {
    const level = bar.getAttribute("data-level");
    bar.style.setProperty("--level", `${level}%`);
  });

  // Botón de descarga de CV
  document.getElementById("downloadCV").addEventListener("click", function () {
    // Aquí puedes añadir la lógica para descargar el CV
    alert("CV download functionality will be implemented");
  });

  // Animación de las barras de progreso al hacer scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute("data-width");
      }
    });
  });

  document.querySelectorAll(".progress").forEach((bar) => {
    observer.observe(bar);
  });
});

// Función para el efecto de escritura
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.innerHTML = ""; // Limpiar el contenido existente

  // Añadir el cursor parpadeante
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";
  cursor.innerHTML = "|";
  element.parentNode.appendChild(cursor);

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Cuando termine de escribir, mantener el cursor parpadeante
      cursor.style.animation = "blink 1s step-end infinite";
    }
  }
  type();
}

// Función para generar el PDF del CV
async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Configuración básica
  doc.setFont("helvetica");
  doc.setFontSize(20);

  // Encabezado
  doc.setTextColor(0, 153, 76); // Color verde similar al de la web
  doc.text("Jorge Alias Álvarez", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text("Data & Telecommunications Engineering Student", 20, 30);

  // Información personal
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204);
  doc.text("Personal Information", 20, 45);

  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text("Age: 19", 20, 55);
  doc.text("Location: Gijón, Spain", 20, 65);

  // Educación
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204);
  doc.text("Education", 20, 85);

  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text("Double Degree in Data Engineering & Telecommunications", 20, 95);
  doc.text("Universidad de Oviedo - 2024-Present", 20, 105);

  // Idiomas
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204);
  doc.text("Languages", 20, 125);

  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text("Spanish: Native", 20, 135);
  doc.text("English: C1", 20, 145);
  doc.text("French: B1", 20, 155);

  // Guardar el PDF
  doc.save("Jorge_Alias_CV.pdf");
}

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar efectos de escritura
  const textElements = document.querySelectorAll(".typing-text");
  textElements.forEach((element) => {
    const originalText = element.textContent;
    typeWriter(element, originalText);
  });

  // Configurar el botón de descarga
  const downloadBtn = document.getElementById("downloadCV");
  downloadBtn.addEventListener("click", generatePDF);

  // ... resto del código existente ...
});

// Añadir estilos CSS para el cursor
const style = document.createElement("style");
style.textContent = `
    .typing-cursor {
        font-weight: bold;
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        from, to { opacity: 1 }
        50% { opacity: 0 }
    }
`;
document.head.appendChild(style);

// Observador de intersección para iniciar la animación cuando el elemento sea visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.hasAttribute("data-typed")) {
        const text = entry.target.textContent;
        typeWriter(entry.target, text);
        entry.target.setAttribute("data-typed", "true");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

// Observar todos los elementos con texto que queremos animar
document.querySelectorAll(".typing-text").forEach((element) => {
  observer.observe(element);
});
