/**
 * ==========================================
 * DAO de Partidos Políticos (Parte 1 - .txt)
 * Mismo patron de Semana 2 (estudianteDAO.js)
 * ==========================================
 */

const fs = require("fs");
const path = require("path");

const Partido = require("../models/partido");

const ARCHIVO = path.join(__dirname, "..", "data", "partidos.txt");

function inicializarArchivo() {

    if (!fs.existsSync(ARCHIVO)) {

        fs.writeFileSync(ARCHIVO, "");

    }

}

function leerArchivo() {

    inicializarArchivo();

    const contenido = fs.readFileSync(ARCHIVO, "utf8");

    if (contenido.trim() === "") {

        return [];

    }

    return contenido
        .trim()
        .split("\n")
        .map(linea => {

            const datos = linea.split(";");

            return new Partido(
                datos[0],
                datos[1],
                datos[2],
                datos[3],
                datos[4]
            );

        });

}

function escribirArchivo(partidos) {

    const lineas = partidos.map(partido => {

        return `${partido.codigo};${partido.nombre};${partido.siglas};${partido.ideologia};${partido.fechaFundacion}`;

    });

    fs.writeFileSync(ARCHIVO, lineas.join("\n"), "utf8");

}

function listar() {

    return leerArchivo();

}

function buscarPorCodigo(codigo) {

    const partidos = leerArchivo();

    return partidos.find(partido => partido.codigo === codigo) || null;

}

function guardar(partido) {

    const partidos = leerArchivo();

    partidos.push(partido);

    escribirArchivo(partidos);

}

function modificar(partidoActualizado) {

    const partidos = leerArchivo();

    const nuevos = partidos.map(partido => {

        if (partido.codigo === partidoActualizado.codigo) {

            return partidoActualizado;

        }

        return partido;

    });

    escribirArchivo(nuevos);

}

function eliminar(codigo) {

    const partidos = leerArchivo();

    const nuevos = partidos.filter(partido => partido.codigo !== codigo);

    escribirArchivo(nuevos);

}

module.exports = {
    listar,
    buscarPorCodigo,
    guardar,
    modificar,
    eliminar
};
