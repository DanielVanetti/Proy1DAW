/**
 * ==========================================
 * DAO de Figuras Públicas
 * ==========================================
 */
 
const fs = require("fs");
const path = require("path");
 
const FiguraPublica = require("../models/figuraPublica");
 
// Ruta del archivo de datos
 
const ARCHIVO = path.join(
    __dirname,
    "..",
    "data",
    "figuraspublicas.txt"
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
 
            return new FiguraPublica(
 
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
 
function escribirArchivo(figuras) {
 
    const lineas = figuras.map(figura => {
 
        return `${figura.codigo};${figura.nombreCompleto};${figura.cargoActual};${figura.partido};${figura.fechaNacimiento}`;
 
    });
 
    fs.writeFileSync(
 
        ARCHIVO,
 
        lineas.join("\n"),
 
        "utf8"
 
    );
 
}
 
/*=========================================
  Listar figuras públicas
=========================================*/
 
function listar() {
 
    return leerArchivo();
 
}
 
/*=========================================
  Buscar por código
=========================================*/
 
function buscarPorCodigo(codigo) {
 
    const figuras = leerArchivo();
 
    return figuras.find(
 
        figura => figura.codigo === codigo
 
    ) || null;
 
}
 
/*=========================================
  Guardar figura pública
=========================================*/
 
function guardar(figura) {
 
    const figuras = leerArchivo();
 
    figuras.push(figura);
 
    escribirArchivo(figuras);
 
}
 
/*=========================================
  Modificar figura pública
=========================================*/
 
function modificar(figuraActualizada) {
 
    const figuras = leerArchivo();
 
    const nuevas = figuras.map(figura => {
 
        if (figura.codigo === figuraActualizada.codigo) {
 
            return figuraActualizada;
 
        }
 
        return figura;
 
    });
 
    escribirArchivo(nuevas);
 
}
 
/*=========================================
  Eliminar figura pública
=========================================*/
 
function eliminar(codigo) {
 
    const figuras = leerArchivo();
 
    const nuevas = figuras.filter(
 
        figura => figura.codigo !== codigo
 
    );
 
    escribirArchivo(nuevas);
 
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