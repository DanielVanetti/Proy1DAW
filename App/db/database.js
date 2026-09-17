const { Pool, types } = require("pg");

// CAMBIO: en S4 los datos de conexión estaban escritos en este archivo.
// Aquí se leen del archivo .env (dotenv, visto en S5) para que cada
// integrante use su propia contraseña y no se suba a GitHub.
require("dotenv").config();

// AGREGADO: las columnas DATE se devuelven como texto "AAAA-MM-DD"
// para cargarlas en los <input type="date"> sin cambios de zona horaria
types.setTypeParser(1082, valor => valor);

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

module.exports = pool;
