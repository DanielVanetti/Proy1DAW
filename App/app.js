const express = require("express");
 
const path = require("path");
 
require("dotenv").config({ quiet: true });
 
const app = express();
 
 
/*
=================================
Middleware
=================================
*/
 
 
// El límite se aumenta porque las imágenes viajan serializadas en base64
 
app.use(express.json({
    limit:"10mb"
}));
 
app.use(express.urlencoded({
    extended:true
}));
 
 
/*
=================================
Archivos públicos
=================================
*/
 
app.use(express.static(
    path.join(__dirname,"public")
));
 
 
/*
=================================
Rutas - Parte 1 (Semana 2 - archivos .txt)
=================================
*/
 
const authRoutes =
require("./routes/authRoutes");
 
 
const partidoRoutes =
require("./routes/partidoRoutes");
 
 
const figuraPublicaRoutes =
require("./routes/figuraPublicaRoutes");
 
 
app.use("/",authRoutes);
 
app.use("/",partidoRoutes);
 
app.use("/",figuraPublicaRoutes);
 
 
/*
=================================
Rutas - Parte 3 (Semana 5 - MongoDB)
=================================
*/
 
const partidoMongoRoutes =
require("./routes/partidoMongoRoutes");
 
 
const figuraMongoRoutes =
require("./routes/figuraMongoRoutes");
 
 
app.use("/api/partidos",partidoMongoRoutes);
 
app.use("/api/figuras",figuraMongoRoutes);
 
 
/*
=================================
Rutas - Parte 2 (Semana 4 - PostgreSQL)
=================================
*/
 
const partidoPgRoutes =
require("./routes/partidoPgRoutes");
 
 
const propuestaPgRoutes =
require("./routes/propuestaPgRoutes");
 
 
const figuraPgRoutes =
require("./routes/figuraPgRoutes");
 
 
const cargoPgRoutes =
require("./routes/cargoPgRoutes");
 
 
app.use("/api/partidos",partidoPgRoutes);
 
app.use("/api/propuestas",propuestaPgRoutes);
 
app.use("/api/figuras",figuraPgRoutes);
 
app.use("/api/cargos",cargoPgRoutes);
 
 
/*
=================================
Páginas de la Parte 2 y Parte 3
=================================
*/
 
// Pagina Partidos y Propuestas (PostgreSQL)
app.get("/partidos-pg", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "partidosPg.html"));
});
 
// Pagina Figuras y Cargos Históricos (PostgreSQL)
app.get("/figuras-pg", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "figurasPg.html"));
});
 
// Pagina Partidos (MongoDB)
app.get("/partidos-mongo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "partidosMongo.html"));
});
 
// Pagina Figuras Públicas (MongoDB)
app.get("/figuras-mongo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "figurasMongo.html"));
});
 
 
/*
=================================
Ruta para páginas inexistentes
=================================
*/
 
app.use((req, res) => {
 
    res.status(404).send("Error 404 - Página no encontrada");
 
});
 
 
/*
=================================
Servidor
=================================
*/
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT,()=>{
 
    console.log(
        "Servidor iniciado en http://localhost:" + PORT
    );
 
});
 