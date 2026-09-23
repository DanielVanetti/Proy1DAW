const conectarMongoDB =
    require("../config/mongodb");
 
const { ObjectId } =
    require("mongodb");
 
 
class FiguraMongoDAO {
 
 
    // ==========================
    // CREAR
    // ==========================
 
    async crear(figura) {

        const db =
            await conectarMongoDB();


        const documento = {
 
            tipo: "figura",
 
            nombreCompleto: figura.nombreCompleto,
 
            cargoActual: figura.cargoActual,
 
            partido: figura.partido,
 
            fechaNacimiento: figura.fechaNacimiento,
 
            nacionalidad: figura.nacionalidad,
 
            nivelEducativo: figura.nivelEducativo,
 
            universidad: figura.universidad,
 
            profesion: figura.profesion,
 
            aniosExperiencia: Number(
                figura.aniosExperiencia
            ),
 
            cargosAnteriores: figura.cargosAnteriores,
 
            propuestasPrincipales:
                figura.propuestasPrincipales,
 
            redesSociales: figura.redesSociales,
 
            popularidadEstimada: Number(
                figura.popularidadEstimada
            ),
 
            regionRepresentada:
                figura.regionRepresentada,
 
            fechaInicioCargo: figura.fechaInicioCargo,
 
            fechaFinCargo:
                figura.fechaFinCargo || null,
 
            estadoCivil: figura.estadoCivil,
 
            idiomas: figura.idiomas,
 
            controversias: figura.controversias,
 
            biografiaCorta: figura.biografiaCorta,
 
            sitioWebOficial: figura.sitioWebOficial,
 
            numeroSeguidores: Number(
                figura.numeroSeguidores
            ),
 
            // La foto llega BINARIA desde el controlador
            // y se guarda como BinData (igual que BYTEA en la Parte 2)
            foto: figura.foto || null
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
 
 
        // CARGA LAZY: aquí se trae solo la lista de documentos sin la imagen

        return await db
            .collection("CollMongoDB")
            .find({
                tipo: "figura"
            })
            .project({
                foto: 0
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
        // (la foto sale BINARIA y el controlador la serializa a base64)
        return await db
            .collection("CollMongoDB")
            .findOne({
                _id: new ObjectId(id),
                tipo: "figura"
            });
    }
 
 
    // ==========================
    // ACTUALIZAR
    // ==========================
 
    async actualizar(id, figura) {
 
        const db =
            await conectarMongoDB();
 
 
        const datos = {
 
            nombreCompleto: figura.nombreCompleto,
 
            cargoActual: figura.cargoActual,
 
            partido: figura.partido,
 
            fechaNacimiento: figura.fechaNacimiento,
 
            nacionalidad: figura.nacionalidad,
 
            nivelEducativo: figura.nivelEducativo,
 
            universidad: figura.universidad,
 
            profesion: figura.profesion,
 
            aniosExperiencia: Number(
                figura.aniosExperiencia
            ),
 
            cargosAnteriores: figura.cargosAnteriores,
 
            propuestasPrincipales:
                figura.propuestasPrincipales,
 
            redesSociales: figura.redesSociales,
 
            popularidadEstimada: Number(
                figura.popularidadEstimada
            ),
 
            regionRepresentada:
                figura.regionRepresentada,
 
            fechaInicioCargo: figura.fechaInicioCargo,
 
            fechaFinCargo:
                figura.fechaFinCargo || null,
 
            estadoCivil: figura.estadoCivil,
 
            idiomas: figura.idiomas,
 
            controversias: figura.controversias,
 
            biografiaCorta: figura.biografiaCorta,
 
            sitioWebOficial: figura.sitioWebOficial,
 
            numeroSeguidores: Number(
                figura.numeroSeguidores
            )
        };
 
 
        // La imagen solo se reemplaza si se seleccionó una nueva
        // (equivale al COALESCE de la Parte 2 con PostgreSQL).
        // Llega BINARIA desde el controlador y se guarda como BinData

        if (figura.foto) {

            datos.foto = figura.foto;
        }
 
 
        const resultado =
            await db
                .collection("CollMongoDB")
                .updateOne(
 
                    {
                        _id:
                            new ObjectId(id),
                        tipo: "figura"
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
 
 
        const figura =
            await this.obtenerPorId(id);
 
 
        if (!figura) {
 
            return null;
        }
 
 
        await db
            .collection("CollMongoDB")
            .deleteOne({
 
                _id:
                    new ObjectId(id)
 
            });
 
 
        return figura;
    }
 
}
 
 
module.exports = FiguraMongoDAO;