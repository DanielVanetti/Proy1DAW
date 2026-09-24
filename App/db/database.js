const { Pool, types } = require("pg");

require("dotenv").config({ quiet: true });

// Las columnas DATE llegan como texto "AAAA-MM-DD" (evita corrimiento de zona horaria en <input type="date">)
types.setTypeParser(1082, valor => valor);

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

module.exports = pool;
