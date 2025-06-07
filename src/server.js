const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, "../")));

// Configurar headers para diferentes tipos de archivo
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
  } else if (req.path.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css; charset=utf-8");
  } else if (req.path.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  }
  next();
});

// Ruta principal
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Rutas para las páginas
app.get("/portfolio", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../portfolio.html"));
});

app.get("/portfolio.html", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../portfolio.html"));
});

app.get("/lab", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../lab.html"));
});

app.get("/lab.html", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../lab.html"));
});

app.get("/network", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../network.html"));
});

app.get("/network.html", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../network.html"));
});

app.get("/blog", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../blog.html"));
});

app.get("/blog.html", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../blog.html"));
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).setHeader("Content-Type", "text/html; charset=utf-8");
  res.sendFile(path.join(__dirname, "../index.html"));
});

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    console.log(`📂 Sirviendo archivos desde: ${path.join(__dirname, "../")}`);
  });
}
