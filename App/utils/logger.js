/**
 * ==========================================
 * Logger de Acciones
 * ==========================================
 *
 * Registra todas las acciones de la aplicación en un archivo ".txt" con el formato:
 * Fecha - Hora / "Acción Realizada" / Usuario
 */

const fs = require("fs");
const path = require("path");
const ARCHIVO = path.join(
    __dirname,
    "..",
    "logs",
    "acciones.txt"
);
let usuarioActual = "desconocido";

/*=========================================
  Crear archivo si no existe
=========================================*/

function inicializarArchivo() {

    if (!fs.existsSync(ARCHIVO)) {

        // Crea la carpeta logs si no existe

        fs.mkdirSync(
            path.dirname(ARCHIVO),
            { recursive: true }
        );

        fs.writeFileSync(ARCHIVO, "");

    }

}

/*=========================================
  Asignar usuario activo
=========================================*/

function asignarUsuario(usuario) {

    usuarioActual = usuario || "desconocido";

}

/*=========================================
  Registrar acción
=========================================*/

function registrar(accion, usuario) {

    inicializarArchivo();

    const ahora = new Date();

    const fecha = ahora.toLocaleDateString("es-CR");

    const hora = ahora.toLocaleTimeString("es-CR");

    const linea =
        `${fecha} - ${hora} / "${accion}" / ${usuario || usuarioActual}\n`;

    fs.appendFileSync(
        ARCHIVO,
        linea,
        "utf8"
    );

}

/*=========================================
  Exportar funciones
=========================================*/

module.exports = {

    asignarUsuario,

    registrar

};