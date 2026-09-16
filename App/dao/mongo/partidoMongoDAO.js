/**
 * ==========================================
 * DAO de Partidos (Parte 3 - MongoDB, Semana 5)
 * Coleccion unica "CollMongoDB", discriminada por "tipo": "partido"
 * (misma coleccion tambien usada por figuraMongoDAO.js con tipo "figura")
 *
 * CARGA LAZY: "listar" NO trae el campo logoBase64 (se excluye con
 * projection) para no cargar el binario de los 60 documentos de una
 * sola vez; la imagen completa solo se consulta en "obtenerPorId",
 * es decir, unicamente cuando el usuario realmente la necesita.
 * ==========================================
 */

const conectarMongoDB = require("../../config/mongodb");
const { ObjectId } = require("mongodb");

const COLECCION = "CollMongoDB";
const TIPO = "partido";

async function listar() {

    const db = await conectarMongoDB();

    return await db.collection(COLECCION)
        .find({ tipo: TIPO })
        .project({ logoBase64: 0 })
        .toArray();

}

async function obtenerPorId(id) {

    const db = await conectarMongoDB();

    return await db.collection(COLECCION).findOne({
        _id: new ObjectId(id),
        tipo: TIPO
    });

}

async function crear(datos) {

    const db = await conectarMongoDB();

    const documento = {
        tipo: TIPO,
        ...datos
    };

    const resultado = await db.collection(COLECCION).insertOne(documento);

    return { _id: resultado.insertedId, ...documento };

}

async function actualizar(id, datos) {

    const db = await conectarMongoDB();

    const cambios = { ...datos };

    if (cambios.logoBase64 === null || cambios.logoBase64 === undefined) {

        delete cambios.logoBase64;

    }

    const resultado = await db.collection(COLECCION).updateOne(
        { _id: new ObjectId(id), tipo: TIPO },
        { $set: cambios }
    );

    if (resultado.matchedCount === 0) {

        return null;

    }

    return obtenerPorId(id);

}

async function eliminar(id) {

    const db = await conectarMongoDB();

    const documento = await obtenerPorId(id);

    if (!documento) {

        return null;

    }

    await db.collection(COLECCION).deleteOne({
        _id: new ObjectId(id),
        tipo: TIPO
    });

    return documento;

}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
