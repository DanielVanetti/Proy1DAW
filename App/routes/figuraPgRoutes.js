const express = require("express");
const path = require("path");

const router = express.Router();

const FiguraPgController = require("../controllers/figuraPgController");

router.get("/figuras-pg/pagina", (req, res) => {

    res.sendFile(path.join(__dirname, "..", "views", "figurasPg.html"));

});

// Figuras Publicas
router.get("/api/figuras-pg", FiguraPgController.listarFiguras);
router.post("/api/figuras-pg", FiguraPgController.crearFigura);
router.put("/api/figuras-pg/:id", FiguraPgController.actualizarFigura);
router.delete("/api/figuras-pg/:id", FiguraPgController.eliminarFigura);

// Cargos Historicos (relacionados por figura_id)
router.get("/api/cargos-pg", FiguraPgController.listarCargos);
router.post("/api/cargos-pg", FiguraPgController.crearCargo);
router.put("/api/cargos-pg/:id", FiguraPgController.actualizarCargo);
router.delete("/api/cargos-pg/:id", FiguraPgController.eliminarCargo);

module.exports = router;
