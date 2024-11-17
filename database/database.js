// database/database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',     // Cambia por tu usuario de MySQL
    password: 'root', // Cambia por tu contraseña de MySQL
    database: 'mucabat_db' // Cambia por el nombre de tu base de datos
});

module.exports = pool.promise();
