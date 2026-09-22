const conectarMongoDB =
    require("../config/mongodb");
 
const { ObjectId } =
    require("mongodb");
 
 
class PartidoMongoDAO {
 
 
    // ==========================
    // CREAR
    // ==========================
 
    async crear(partido) {

        const db =
            await conectarMongoDB();


        const documento = {
 
            tipo: "partido",
 
            nombre: partido.nombre,
 
            siglas: partido.siglas,
 
            ideologia: partido.ideologia,
 
            fechaFundacion: partido.fechaFundacion,
 
            sede: partido.sede,
 
            sitioWeb: partido.sitioWeb,
 
            numMilitantes: Number(
                partido.numMilitantes
            ),
 
            liderActual: partido.liderActual,
 
            coloresRepresentativos:
                partido.coloresRepresentativos,
 
            presenciaRegional:
                partido.presenciaRegional,
 
            numeroDiputados: Number(
                partido.numeroDiputados
            ),
 
            descripcion: partido.descripcion,
 
            // El logo llega BINARIO desde el controlador
            // y se guarda como BinData (igual que BYTEA en la Parte 2)
            logo: partido.logo || null
        };


        const resultado =
            await db
                .collection("CollMongoDB")
                .insertOne(documento);


        return {

            _id: resultado.insertedId,

            ...documento

        };
    }
 
 
    // ==========================
    // CONSULTAR TODOS
    // ==========================
 
    async obtenerTodos() {
 
        const db =
            await conectarMongoDB();
 
 
        // CARGA LAZY : aquí se trae solo la lista de documentos sin la imagen
        return await db
            .collection("CollMongoDB")
            .find({
                tipo: "partido"
            })
            .project({
                logo: 0
            })
            .toArray();
    }
 
 
    // ==========================
    // CONSULTAR UNO
    // ==========================
 
    async obtenerPorId(id) {
 
        const db =
            await conectarMongoDB();
 
 
        // CARGA LAZY: aquí sí se trae el documento completo con la imagen
        // (el logo sale BINARIO y el controlador lo serializa a base64)
        return await db
            .collection("CollMongoDB")
            .findOne({
                _id: new ObjectId(id),
                tipo: "partido"
            });
    }
 
 
    // ==========================
    // ACTUALIZAR
    // ==========================
 
    async actualizar(id, partido) {
 
        const db =
            await conectarMongoDB();
 
 
        const datos = {
 
            nombre: partido.nombre,
 
            siglas: partido.siglas,
 
            ideologia: partido.ideologia,
 
            fechaFundacion: partido.fechaFundacion,
 
            sede: partido.sede,
 
            sitioWeb: partido.sitioWeb,
 
            numMilitantes: Number(
                partido.numMilitantes
            ),
 
            liderActual: partido.liderActual,
 
            coloresRepresentativos:
                partido.coloresRepresentativos,
 
            presenciaRegional:
                partido.presenciaRegional,
 
            numeroDiputados: Number(
                partido.numeroDiputados
            ),
 
            descripcion:
                partido.descripcion
        };
 

        // El logo solo se reemplaza si se seleccionó una imagen nueva
        // (equivale al COALESCE de la Parte 2 con PostgreSQL).
        // Llega BINARIO desde el controlador y se guarda como BinData

        if (partido.logo) {

            datos.logo = partido.logo;
        }
 
 
        const resultado =
            await db
                .collection("CollMongoDB")
                .updateOne(
 
                    {
                        _id:
                            new ObjectId(id),
                        tipo: "partido"
                    },
 
                    {
                        $set: datos
                    }
 
                );
 
 
        if (resultado.matchedCount === 0) {
 
            return null;
        }
 
 
        return await this.obtenerPorId(id);
    }
 
 
    // ==========================
    // ELIMINAR
    // ==========================
 
    async eliminar(id) {
 
        const db =
            await conectarMongoDB();
 
 
        const partido =
            await this.obtenerPorId(id);
 
 
        if (!partido) {
 
            return null;
        }
 
 
        await db
            .collection("CollMongoDB")
            .deleteOne({
 
                _id:
                    new ObjectId(id)
 
            });
 
 
        return partido;
    }
 
}
 
 
module.exports = PartidoMongoDAO;