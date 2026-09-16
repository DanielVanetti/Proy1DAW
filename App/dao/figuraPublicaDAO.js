/**
 * ==========================================
 * DAO de Figuras Públicas (Parte 1 - .txt)
 * Mismo patron de Semana 2 (estudianteDAO.js)
 * ==========================================
 */

const fs = require("fs");
const path = require("path");

const FiguraPublica = require("../models/figuraPublica");

const ARCHIVO = path.join(__dirname, "..", "data", "figuraspublicas.txt");

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

            return new FiguraPublica(
                datos[0],
                datos[1],
                datos[2],
                datos[3],
                datos[4]
            );

        });

}

function escribirArchivo(figuras) {

    const lineas = figuras.map(figura => {

        return `${figura.codigo};${figura.nombreCompleto};${figura.cargoActual};${figura.partido};${figura.fechaNacimiento}`;

    });

    fs.writeFileSync(ARCHIVO, lineas.join("\n"), "utf8");

}

function listar() {

    return leerArchivo();

}

function buscarPorCodigo(codigo) {

    const figuras = leerArchivo();

    return figuras.find(figura => figura.codigo === codigo) || null;

}

function guardar(figura) {

    const figuras = leerArchivo();

    figuras.push(figura);

    escribirArchivo(figuras);

}

function modificar(figuraActualizada) {

    const figuras = leerArchivo();

    const nuevos = figuras.map(figura => {

        if (figura.codigo === figuraActualizada.codigo) {

            return figuraActualizada;

        }

        return figura;

    });

    escribirArchivo(nuevos);

}

function eliminar(codigo) {

    const figuras = leerArchivo();

    const nuevos = figuras.filter(figura => figura.codigo !== codigo);

    escribirArchivo(nuevos);

}

module.exports = {
    listar,
    buscarPorCodigo,
    guardar,
    modificar,
    eliminar
};
