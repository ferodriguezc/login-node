const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Asegúrate de que esta ruta apunte a tu módulo de base de datos
const router = express.Router();
const session = require("express-session");

// Define las rutas
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "register.html"));
});

router.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "success.html"));
});

router.get("/homemoder", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "homemoder.html"));
});




router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});



module.exports = router;
