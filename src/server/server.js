const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Configuración del transporter para emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API para el formulario de contacto
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "contact@jorgealias.me",
      subject: `Nuevo mensaje de ${name}`,
      text: `
                Nombre: ${name}
                Email: ${email}
                Mensaje: ${message}
            `,
      html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
    });

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
});

// API para las visualizaciones de datos
app.get("/api/skills", (req, res) => {
  const skills = {
    technical: [
      { name: "Data Engineering", level: 85 },
      { name: "Telecommunications", level: 80 },
      { name: "Python", level: 90 },
      { name: "SQL", level: 85 },
      { name: "Network Protocols", level: 75 },
    ],
    soft: [
      { name: "Problem Solving", level: 90 },
      { name: "Team Work", level: 85 },
      { name: "Communication", level: 80 },
    ],
  };
  res.json(skills);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
