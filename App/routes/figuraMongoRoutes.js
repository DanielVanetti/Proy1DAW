const express = require("express");

const router = express.Router();

const FiguraMongoController =
    require("../controllers/FiguraMongoController");


// ======================================================
// MONGODB + DAO
// Estas rutas deben estar ANTES de /:id
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