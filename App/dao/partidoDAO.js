/**
 * ==========================================
 * DAO de Partidos
 * ==========================================
 */
 
const fs = require("fs");
const path = require("path");
 
const Partido = require("../models/partido");
 
// Ruta del archivo de datos
 
const ARCHIVO = path.join(
    __dirname,
    "..",
    "data",
    "partidos.txt"
);
 
/*=========================================
  Crear archivo si no existe
=========================================*/
 
function inicializarArchivo() {
 
    if (!fs.existsSync(ARCHIVO)) {
 
        fs.writeFileSync(ARCHIVO, "");
 
    }
 
}
 
/*=========================================
  Leer archivo
=========================================*/
 
function leerArchivo() {
 
    inicializarArchivo();
 
    const contenido = fs.readFileSync(
        ARCHIVO,
        "utf8"
    );
 
    if (contenido.trim() === "") {
 
        return [];
 
    }
 
    return contenido
        .trim()
        .split("\n")
        .map(linea => {
 
            // trim() porque el último campo es texto y puede traer el salto de línea

            const datos = linea.trim().split(";");
 
            return new Partido(
 
                datos[0],
 
                datos[1],
 
                datos[2],
 
                datos[3],
 
                datos[4]
 
            );
 
        });
 
}
 
/*=========================================
  Escribir archivo
=========================================*/
 
function escribirArchivo(partidos) {
 
    const lineas = partidos.map(partido => {
 
        return `${partido.codigo};${partido.nombre};${partido.siglas};${partido.ideologia};${partido.fechaFundacion}`;
 
    });
 
    fs.writeFileSync(
 
        ARCHIVO,
 
        lineas.join("\n"),
 
        "utf8"
 
    );
 
}
 
/*=========================================
  Listar partidos
=========================================*/
 
function listar() {
 
    return leerArchivo();
 
}
 
/*=========================================
  Buscar por código
=========================================*/
 
function buscarPorCodigo(codigo) {
 
    const partidos = leerArchivo();
 
    return partidos.find(
 
        partido => partido.codigo === codigo
 
    ) || null;
 
}
 
/*=========================================
  Guardar partido
=========================================*/
 
function guardar(partido) {
 
    const partidos = leerArchivo();
 
    partidos.push(partido);
 
    escribirArchivo(partidos);
 
}
 
/*=========================================
  Modificar partido
=========================================*/
 
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
 
/*=========================================
  Eliminar partido
=========================================*/
 
function eliminar(codigo) {
 
    const partidos = leerArchivo();
 
    const nuevos = partidos.filter(
 
        partido => partido.codigo !== codigo
 
    );
 
    escribirArchivo(nuevos);
 
}
 
/*=========================================
  Exportar funciones
=========================================*/
 
module.exports = {
 
    listar,
 
    buscarPorCodigo,
 
    guardar,
 
    modificar,
 
    eliminar
 
};