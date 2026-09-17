/**
 * ==========================================
 * Logger de acciones de la aplicación
 * Formato exigido: Fecha - Hora / "Accion Realizada" / Usuario
 * Mismo patron de manejo de archivos .txt que los DAO de Semana 2 (fs + path)
 * ==========================================
 */

const fs = require("fs");
const path = require("path");

const ARCHIVO_LOG = path.join(__dirname, "..", "logs", "acciones.txt");

function inicializarArchivo() {

    if (!fs.existsSync(ARCHIVO_LOG)) {

        fs.mkdirSync(path.dirname(ARCHIVO_LOG), { recursive: true });

        fs.writeFileSync(ARCHIVO_LOG, "");

    }

}

function registrarAccion(accion, usuario) {

    inicializarArchivo();

    const ahora = new Date();

    const fechaHora =
        ahora.toLocaleDateString("es-CR") + " " + ahora.toLocaleTimeString("es-CR");

    const linea =
        fechaHora + " / \"" + accion + "\" / " + (usuario || "desconocido") + "\n";

    fs.appendFileSync(ARCHIVO_LOG, linea, "utf8");

}

module.exports = {
    registrarAccion
};
