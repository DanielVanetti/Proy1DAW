const PartidoMongoService =
    require("../services/PartidoMongoService");
 
// AGREGADO: logger de acciones (requerimiento del proyecto, no está en S5)
const Logger =
    require("../utils/logger");
 
 
const service =
    new PartidoMongoService();
 
 
class PartidoMongoController {
 
 
 
    // ==================================================
    // MONGODB + DAO
    // ==================================================
 
 
    static async crearMongo(
        req,
        res
    ) {
 
        try {
 
            const partido =
                await service.crearMongo(
                    req.body
                );
 
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Crear partido " + partido._id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: partido creado",
 
                partido
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Error al crear partido en MongoDB: " + error.message
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
 
            const partidos =
                await service.obtenerTodosMongo();
 
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Consultar todos los partidos, sin imagen - carga lazy (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: consulta realizada",
 
                partidos
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Error consultando partidos en MongoDB: " + error.message
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
 
            const partido =
                await service.obtenerPorIdMongo(
                    req.params.id
                );
 
 
            if (!partido) {
 
                // AGREGADO: registro en el log
                Logger.registrar(
                    "Partido " + req.params.id + " no encontrado (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Partido no encontrado en MongoDB"
 
                });
            }
 
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Consultar partido " + req.params.id + " con imagen - carga lazy (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: partido encontrado",
 
                partido
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Error consultando partido en MongoDB: " + error.message
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
 
            const partido =
                await service.actualizarMongo(
 
                    req.params.id,
 
                    req.body
 
                );
 
 
            if (!partido) {
 
                // AGREGADO: registro en el log
                Logger.registrar(
                    "Partido " + req.params.id + " no encontrado (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Partido no encontrado en MongoDB"
 
                });
            }
 
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Actualizar partido " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: partido actualizado",
 
                partido
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Error actualizando partido en MongoDB: " + error.message
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
 
            const partido =
                await service.eliminarMongo(
                    req.params.id
                );
 
 
            if (!partido) {
 
                // AGREGADO: registro en el log
                Logger.registrar(
                    "Partido " + req.params.id + " no encontrado (MongoDB)"
                );
 
                return res.status(404).json({
 
                    mensaje:
                        "Partido no encontrado en MongoDB"
 
                });
            }
 
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Eliminar partido " + req.params.id + " (MongoDB)"
            );
 
 
            res.json({
 
                mensaje:
                    "MongoDB: partido eliminado",
 
                partido
 
            });
 
 
        } catch (error) {
 
            console.error(error);
 
            // AGREGADO: registro en el log
            Logger.registrar(
                "Error eliminando partido en MongoDB: " + error.message
            );
 
            res.status(500).json({
 
                mensaje:
                    "Error eliminando MongoDB"
 
            });
        }
    }
 
}
 
 
module.exports =
    PartidoMongoController;