const FiguraMongoService =
    require("../services/FiguraMongoService");
 
// Logger de acciones
const Logger =
    require("../utils/logger");
 
 
const service =
    new FiguraMongoService();
 
 
class FiguraMongoController {
 
 
 
    // ==================================================
    // MONGODB + DAO
    // ==================================================
 
 
    static async crearMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.crearMongo(
                    req.body
                );
 
            Logger.registrar(
                "Crear figura pública " + figura._id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública creada",
 
                figura
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error al crear figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error al crear en MongoDB"
 
            });
        }
    }
 
 
 
    static async obtenerTodosMongo(
        req,
        res
    ) {
 
        try {
 
            const figuras =
                await service.obtenerTodosMongo();
 
 
            Logger.registrar(
                "Consultar todas las figuras públicas"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: consulta realizada",
 
                figuras
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error consultando figuras públicas en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error consultando MongoDB"
 
            });
        }
    }
 
 
 
    static async obtenerPorIdMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.obtenerPorIdMongo(
                    req.params.id
                );
 
 
            if (!figura) {
 
                Logger.registrar(
                    "Figura pública " + req.params.id + " no encontrada (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Figura pública no encontrada en MongoDB"
 
                });
            }
 
            Logger.registrar(
                "Consultar figura pública " + req.params.id
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública encontrada",
 
                figura
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error consultando figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error consultando MongoDB"
 
            });
        }
    }
 
 
 
    static async actualizarMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.actualizarMongo(
 
                    req.params.id,
 
                    req.body
 
                );
 
 
            if (!figura) {
 
                Logger.registrar(
                    "Figura pública " + req.params.id + " no encontrada (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Figura pública no encontrada en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Actualizar figura pública " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública actualizada",
 
                figura
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error actualizando figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error actualizando MongoDB"
 
            });
        }
    }
 
 
 
    static async eliminarMongo(
        req,
        res
    ) {
 
        try {
 
            const figura =
                await service.eliminarMongo(
                    req.params.id
                );
 
 
            if (!figura) {
 
                Logger.registrar(
                    "Figura pública " + req.params.id + " no encontrada (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Figura pública no encontrada en MongoDB"
 
                });
            }
 
 
            Logger.registrar(
                "Eliminar figura pública " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: figura pública eliminada",
 
                figura
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            Logger.registrar(
                "Error eliminando figura pública en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error eliminando MongoDB"
 
            });
        }
    }
 
}
 
 
module.exports =
    FiguraMongoController;