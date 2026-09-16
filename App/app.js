const express = require("express");
const path = require("path");

const Logger = require("./utils/logger");

const app = express();

/*
=================================
Middleware
=================================
*/

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));

/*
=================================
Archivos públicos
=================================
*/

app.use(express.static(path.join(__dirname, "public")));

/*
=================================
Rutas - Parte 1 (Semana 2 - .txt)
=================================
*/

const authRoutes = require("./routes/authRoutes");
const partidoRoutes = require("./routes/partidoRoutes");
const figuraPublicaRoutes = require("./routes/figuraPublicaRoutes");

app.use("/", authRoutes);
app.use("/", partidoRoutes);
app.use("/", figuraPublicaRoutes);

/*
=================================
Rutas - Parte 2 (Semana 4 - PostgreSQL)
=================================
*/

const partidoPgRoutes = require("./routes/partidoPgRoutes");
const figuraPgRoutes = require("./routes/figuraPgRoutes");

app.use("/", partidoPgRoutes);
app.use("/", figuraPgRoutes);

/*
=================================
Rutas - Parte 3 (Semana 5 - MongoDB)
=================================
*/

const partidoMongoRoutes = require("./routes/partidoMongoRoutes");
const figuraMongoRoutes = require("./routes/figuraMongoRoutes");

app.use("/", partidoMongoRoutes);
app.use("/", figuraMongoRoutes);

/*
=================================
Manejo de errores (Parte 4)
=================================
*/

// 404 - ruta no encontrada
app.use((req, res) => {

    res.status(404).json({
        mensaje: "Ruta no encontrada."
    });

});

// Manejador global de errores no controlados
app.use((err, req, res, next) => {

    console.error(err);

    Logger.registrarAccion(
        "Error no controlado: " + err.message,
        (req.headers && req.headers["x-usuario"]) || "desconocido"
    );

    res.status(500).json({
        mensaje: "Error interno del servidor."
    });

});

/*
=================================
Servidor
=================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Servidor iniciado en puerto " + PORT);

});
