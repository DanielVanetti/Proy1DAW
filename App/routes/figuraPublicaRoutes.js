const express = require("express");
 
const router = express.Router();
 
const FiguraPublicaController =
require("../controllers/figuraPublicaController");
 
 
const path = require("path");
 
 
/*
==================================
Mostrar página CRUD
==================================
*/
 
router.get(
    "/figuras/pagina",
    (req,res)=>{
 
        res.sendFile(
 
            path.join(
 
                __dirname,
 
                "..",
 
                "views",
 
                "figuras.html"
 
            )
 
        );
 
    }
);
 
 
 
/*
==================================
Consultar figuras públicas
==================================
*/
 
router.get(
 
    "/figuras",
 
    FiguraPublicaController.listar
 
);
 
 
 
/*
==================================
Crear figura pública
==================================
*/
 
router.post(
 
    "/figuras",
 
    FiguraPublicaController.guardar
 
);
 
 
 
/*
==================================
Modificar figura pública
==================================
*/
 
router.put(
 
    "/figuras",
 
    FiguraPublicaController.modificar
 
);
 
 
 
/*
==================================
Eliminar figura pública
==================================
*/
 
router.delete(
 
    "/figuras/:codigo",
 
    FiguraPublicaController.eliminar
 
);
 
 
 
module.exports = router;