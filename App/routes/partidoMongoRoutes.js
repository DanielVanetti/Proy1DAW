const express = require("express");
 
const router = express.Router();
 
const PartidoMongoController =
    require("../controllers/PartidoMongoController");
 
 
// ======================================================
// MONGODB + DAO
//
// IMPORTANTE:
// Estas rutas deben estar ANTES de /:id
// ======================================================
 
 
// CREAR MONGODB
router.post(
    "/mongo",
    PartidoMongoController.crearMongo
);
 
 
// CONSULTAR TODOS MONGODB
router.get(
    "/mongo",
    PartidoMongoController.obtenerTodosMongo
);
 
 
// CONSULTAR UNO MONGODB
router.get(
    "/mongo/:id",
    PartidoMongoController.obtenerPorIdMongo
);
 
 
// ACTUALIZAR MONGODB
router.put(
    "/mongo/:id",
    PartidoMongoController.actualizarMongo
);
 
 
// ELIMINAR MONGODB
router.delete(
    "/mongo/:id",
    PartidoMongoController.eliminarMongo
);
 
 
module.exports = router;