const winston = require("winston");

// Configuración de logs
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Middleware para tracking
const trackVisits = (req, res, next) => {
  logger.info({
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  next();
};

module.exports = { logger, trackVisits };
