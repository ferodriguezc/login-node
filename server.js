// Importación de módulos
const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const multer = require('multer');
const sharp = require('sharp');
const app = express();
const routes = require('./routes/Routes');
const action = require('./controllers/action');
const db = require('./config/db');
require('dotenv').config();

// Middleware para analizar JSON
app.use(express.json());

// Middleware para analizar datos de formularios urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar sesiones
app.use(session({
  secret: 'your-secret-key', // Cambia esto por una clave secreta más segura
  resave: false,
  saveUninitialized: true
}));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Multer para la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir y convertir imágenes
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
  }

  try {
    const originalName = req.file.originalname;
    const newFileName = 'img1.webp'; // Nombre fijo o generado dinámicamente
    const outputPath = path.join(__dirname, 'uploads', newFileName);

    // Convertir la imagen a formato .webp usando sharp
    await sharp(req.file.buffer)
      .webp()
      .toFile(outputPath);

    res.json({ message: 'Imagen subida y convertida a .webp correctamente', filename: newFileName });
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

// Rutas
app.use('/', routes);
app.use('/', action);

// Inicio del servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
