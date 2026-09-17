const express = require("express");
 
const router = express.Router();
 
const FiguraMongoController =
    require("../controllers/FiguraMongoController");
 
 
// ======================================================
// MONGODB + DAO
//
// IMPORTANTE:
// Estas rutas deben estar ANTES de /:id
// (en app.js este router se registra antes que el de PostgreSQL)
// ======================================================
 
 
// CREAR MONGODB
router.post(
    "/mongo",
    FiguraMongoController.crearMongo
);
 
 
// CONSULTAR TODOS MONGODB
router.get(
    "/mongo",
    FiguraMongoController.obtenerTodosMongo
);
 
 
// CONSULTAR UNO MONGODB
router.get(
    "/mongo/:id",
    FiguraMongoController.obtenerPorIdMongo
);
 
 
// ACTUALIZAR MONGODB
router.put(
    "/mongo/:id",
    FiguraMongoController.actualizarMongo
);
 
 
// ELIMINAR MONGODB
router.delete(
    "/mongo/:id",
    FiguraMongoController.eliminarMongo
);
 
 
module.exports = router;