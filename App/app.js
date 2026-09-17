const express = require("express");
 
const path = require("path");
 
// AGREGADO: variables del archivo .env (visto en S5)
 
require("dotenv").config();
 
const app = express();
 
 
/*
=================================
Middleware
=================================
*/
 
 
// CAMBIO: se aumenta el límite del JSON porque las imágenes
// viajan serializadas en base64 dentro del cuerpo de la petición
 
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
AGREGADO: Rutas - Parte 3 (Semana 5 - MongoDB)
 
IMPORTANTE (igual que en S5):
las rutas /mongo deben registrarse ANTES
que las rutas /:id de PostgreSQL
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
AGREGADO: Rutas - Parte 2 (Semana 4 - PostgreSQL)
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
AGREGADO: Páginas de la Parte 2 y Parte 3
(igual que "Pagina principal" de S4 y S5)
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
 
// CAMBIO: este manejo de error estaba en la versión comentada
// del app.js de PROYECTOESTUDIANTES; se activa para la Parte 4
 
app.use((req, res) => {
 
    res.status(404).send("Error 404 - Página no encontrada");
 
});
 
 
/*
=================================
Servidor
=================================
*/
 
// CAMBIO: el puerto se toma del .env como en S4 y S5
// (en PROYECTOESTUDIANTES estaba fijo en 2000)
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT,()=>{
 
    console.log(
        "Servidor iniciado en puerto " + PORT
    );
 
});
 
 
 
 
 
 
/* // ==========================================
// Importación de módulos
// ==========================================
 
const express = require("express");
const path = require("path");
 
// ==========================================
// Crear la aplicación Express
// ==========================================
 
const app = express();
 
// ==========================================
// Configuración
// ==========================================
 
const PORT = 3000;
 
// ==========================================
// Middleware
// ==========================================
 
// Permite recibir datos JSON
 
app.use(express.json());
 
// Permite recibir datos enviados desde formularios HTML
 
app.use(express.urlencoded({ extended: true }));
 
// Archivos públicos
// CSS
// JavaScript
// imágenes
 
app.use(express.static(path.join(__dirname, "public")));
 
// ==========================================
// Importar rutas
// ==========================================
 
const authRoutes = require("./routes/authRoutes");
const partidoRoutes = require("./routes/partidoRoutes");
 
// ==========================================
// Registrar rutas
// ==========================================
 
app.use("/", authRoutes);
 
app.use("/", partidoRoutes);
 
// ==========================================
// Ruta para páginas inexistentes
// ==========================================
 
app.use((req, res) => {
 
    res.status(404).send("Error 404 - Página no encontrada");
 
});
 
// ==========================================
// Iniciar servidor
// ==========================================
 
app.listen(PORT, () => {
 
    console.log("--------------------------------");
 
    console.log("Servidor iniciado correctamente");
 
    console.log("Puerto:", PORT);
 
    console.log("http://localhost:" + PORT);
 
    console.log("--------------------------------");
 
}); */