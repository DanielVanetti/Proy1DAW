const PartidoMongoDAO =
    require("../dao/PartidoMongoDAO");
 
 
const mongoDAO =
    new PartidoMongoDAO();
 
 
class PartidoMongoService {
 
 
 
    // ==================================================
    // MONGODB + DAO
    // ==================================================
 
 
    async crearMongo(partido) {
 
        return await mongoDAO.crear(
            partido
        );
    }
 
 
    async obtenerTodosMongo(saltar, limite) {
 
        return await mongoDAO.obtenerTodos(saltar, limite);
    }
 
 
    async contarMongo() {
 
        return await mongoDAO.contar();
    }
 
 
    async obtenerPorIdMongo(id) {
 
        return await mongoDAO.obtenerPorId(
            id
        );
    }
 
 
    async actualizarMongo(
        id,
        partido
    ) {
 
        return await mongoDAO.actualizar(
            id,
            partido
        );
    }
 
 
    async eliminarMongo(id) {
 
        return await mongoDAO.eliminar(
            id
        );
    }
 
}
 
 
module.exports = PartidoMongoService;