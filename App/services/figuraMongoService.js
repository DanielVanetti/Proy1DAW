const FiguraMongoDAO =
    require("../dao/FiguraMongoDAO");
 
 
const mongoDAO =
    new FiguraMongoDAO();
 
 
class FiguraMongoService {
 
 
 
    // ==================================================
    // MONGODB + DAO
    // ==================================================
 
 
    async crearMongo(figura) {
 
        return await mongoDAO.crear(
            figura
        );
    }
 
 
    async obtenerTodosMongo() {
 
        return await mongoDAO.obtenerTodos();
    }
 
 
    async obtenerPorIdMongo(id) {
 
        return await mongoDAO.obtenerPorId(
            id
        );
    }
 
 
    async actualizarMongo(
        id,
        figura
    ) {
 
        return await mongoDAO.actualizar(
            id,
            figura
        );
    }
 
 
    async eliminarMongo(id) {
 
        return await mongoDAO.eliminar(
            id
        );
    }
 
}
 
 
module.exports = FiguraMongoService;