const bcrypt = require('bcrypt');

const password = 'a1'; // La contraseña que deseas cifrar

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hash generado:', hash); // Imprime el hash
});
