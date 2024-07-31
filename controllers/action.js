const express = require('express'); // Asegúrate de que esta ruta apunte a tu módulo de base de datos
const action = express.Router();
const db = require('../config/db');
const bcrypt = require("bcrypt");
const path = require("path");

  
// Ruta para manejar el inicio de sesión
action.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
  
    db.query(sql, [username], (err, results) => {
      if (err) throw err;
  
      if (results.length === 0) {
        return res.send('Usuario no encontrado');
      }
  
      const user = results[0];
  
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
  
        if (result) {
          req.session.user = user;
  
          // Redirigir según el tipo de usuario
          if (user.type_user === 2) {
            res.sendFile(path.join(__dirname,"..","public", "homemoder.html"));
          } else if (user.type_user === 1) {
            res.sendFile(path.join(__dirname,"..","public", "home.html"));
          } else {
            res.send('Tipo de usuario desconocido');
          }
        } else {
          res.send('Contraseña incorrecta');
        }
      });
    });
  });
  


  action.get("/logout", (req, res) => {
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


  
// Ruta para registrar usuarios
action.post("/register", (req, res) => {
    console.log(req.body); // Para depurar y verificar el contenido de req.body
    
    const { username, password } = req.body;
  
    // Verificar si los datos necesarios están presentes
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan datos de usuario o contraseña' });
    }
  
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });
        if (results.length > 0) {
          return res.send("Usuario ya existe");
        }
  
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) return res.status(500).json({ error: 'Error al cifrar la contraseña' });
  
          db.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashedPassword],
            (err) => {
              if (err) return res.status(500).json({ error: 'Error al registrar el usuario' });
              req.session.user = { username };
              res.redirect("/success");
            }
          );
        });
      }
    );
  });


  // Ruta para obtener usuarios
action.get("/users", (req, res) => {
    const sql = "SELECT username, type_user FROM users";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      res.json(results);
    });
  });


  
  
// Ruta para eliminar usuarios
action.delete('/users/:username', (req, res) => {
    const { username } = req.params;
  
    if (!username) {
      return res.status(400).json({ error: 'Nombre de usuario no proporcionado' });
    }
  
    const sql = 'DELETE FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Error en la base de datos:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    });
  });
  

  module.exports = action;