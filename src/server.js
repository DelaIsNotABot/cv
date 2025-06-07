const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, "../")));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Rutas para las páginas
app.get("/portfolio", (req, res) => {
  res.sendFile(path.join(__dirname, "../portfolio.html"));
});

app.get("/lab", (req, res) => {
  res.sendFile(path.join(__dirname, "../lab.html"));
});

app.get("/network", (req, res) => {
  res.sendFile(path.join(__dirname, "../network.html"));
});

app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "../blog.html"));
});

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

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  console.log(`📂 Sirviendo archivos desde: ${path.join(__dirname, "../")}`);
});
