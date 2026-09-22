const { Pool, types } = require("pg");

require("dotenv").config();

// Las columnas DATE se devuelven como texto "AAAA-MM-DD"
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
