/*
==========================================
CRUD DE FIGURAS + CARGOS HISTORICOS (Parte 2 - PostgreSQL)
==========================================
*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    document.getElementById("btnGuardarFigura").addEventListener("click", guardarFigura);
    document.getElementById("btnModificarFigura").addEventListener("click", modificarFigura);
    document.getElementById("btnEliminarFigura").addEventListener("click", eliminarFigura);
    document.getElementById("btnLimpiarFigura").addEventListener("click", limpiarFigura);

    document.getElementById("btnGuardarCargo").addEventListener("click", guardarCargo);
    document.getElementById("btnModificarCargo").addEventListener("click", modificarCargo);
    document.getElementById("btnEliminarCargo").addEventListener("click", eliminarCargo);
    document.getElementById("btnLimpiarCargo").addEventListener("click", limpiarCargo);

    listarFiguras();
    listarCargos();

}

function cabeceras() {

    return {
        "Content-Type": "application/json",
        "x-usuario": sessionStorage.getItem("usuario") || "desconocido"
    };

}

// PENDIENTE: confirmar con el profesor si esta es la tecnica de serializacion vista en clase.
function archivoABase64(inputFile) {

    return new Promise((resolve) => {

        const archivo = inputFile.files[0];

        if (!archivo) {

            resolve(null);
            return;

        }

        const lector = new FileReader();

        lector.onload = () => {

            const resultado = lector.result;
            const base64 = resultado.split(",")[1];
            resolve(base64);

        };

        lector.readAsDataURL(archivo);

    });

}

function mostrarMensaje(texto) {

    document.getElementById("mensaje").innerHTML = texto;

}

// ================= FIGURAS PUBLICAS =================

async function obtenerFormularioFigura() {

    return {
        nombreCompleto: document.getElementById("nombreCompleto").value.trim(),
        cargoActual: document.getElementById("cargoActual").value.trim(),
        fechaNacimiento: document.getElementById("fechaNacimiento").value,
        nacionalidad: document.getElementById("nacionalidad").value.trim(),
        nivelEducativo: document.getElementById("nivelEducativo").value.trim(),
        aniosExperiencia: Number(document.getElementById("aniosExperiencia").value) || 0,
        biografia: document.getElementById("biografia").value.trim(),
        fotoBase64: await archivoABase64(document.getElementById("foto"))
    };

}

async function guardarFigura() {

    const figura = await obtenerFormularioFigura();

    const respuesta = await fetch("/api/figuras-pg", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(figura)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarFigura();
    listarFiguras();

}

async function modificarFigura() {

    const id = document.getElementById("figuraId").value;

    if (!id) {

        mostrarMensaje("Seleccione una figura de la tabla para modificar.");
        return;

    }

    const figura = await obtenerFormularioFigura();

    const respuesta = await fetch("/api/figuras-pg/" + id, {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(figura)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarFigura();
    listarFiguras();
    listarCargos();

}

async function eliminarFigura() {

    const id = document.getElementById("figuraId").value;

    if (!id) {

        mostrarMensaje("Seleccione una figura de la tabla para eliminar.");
        return;

    }

    const respuesta = await fetch("/api/figuras-pg/" + id, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarFigura();
    listarFiguras();
    listarCargos();

}

function limpiarFigura() {

    document.getElementById("figuraId").value = "";
    document.getElementById("nombreCompleto").value = "";
    document.getElementById("cargoActual").value = "";
    document.getElementById("fechaNacimiento").value = "";
    document.getElementById("nacionalidad").value = "";
    document.getElementById("nivelEducativo").value = "";
    document.getElementById("aniosExperiencia").value = "";
    document.getElementById("biografia").value = "";
    document.getElementById("foto").value = "";

}

function editarFigura(figura) {

    document.getElementById("figuraId").value = figura.id;
    document.getElementById("nombreCompleto").value = figura.nombreCompleto;
    document.getElementById("cargoActual").value = figura.cargoActual;
    document.getElementById("fechaNacimiento").value = (figura.fechaNacimiento || "").toString().substring(0, 10);
    document.getElementById("nacionalidad").value = figura.nacionalidad;
    document.getElementById("nivelEducativo").value = figura.nivelEducativo;
    document.getElementById("aniosExperiencia").value = figura.aniosExperiencia;
    document.getElementById("biografia").value = figura.biografia;

}

let figurasCache = [];

async function listarFiguras() {

    const respuesta = await fetch("/api/figuras-pg");

    figurasCache = await respuesta.json();

    const tbody = document.querySelector("#tablaFiguras tbody");

    tbody.innerHTML = "";

    const select = document.getElementById("cargoFiguraId");
    select.innerHTML = "";

    figurasCache.forEach(figura => {

        const imgHtml = figura.fotoBase64
            ? `<img class="miniatura" src="data:image/png;base64,${figura.fotoBase64}">`
            : "(sin imagen)";

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + figura.id + "</td>" +
            "<td>" + figura.nombreCompleto + "</td>" +
            "<td>" + figura.cargoActual + "</td>" +
            "<td>" + figura.nacionalidad + "</td>" +
            "<td>" + figura.aniosExperiencia + "</td>" +
            "<td>" + imgHtml + "</td>" +
            "<td><button onclick='window.__seleccionarFigura(" + figura.id + ")'>Seleccionar</button></td>";

        tbody.appendChild(fila);

        const opcion = document.createElement("option");
        opcion.value = figura.id;
        opcion.textContent = figura.nombreCompleto;
        select.appendChild(opcion);

    });

}

window.__seleccionarFigura = function (id) {

    const figura = figurasCache.find(f => f.id === id);

    if (figura) {

        editarFigura(figura);

    }

};

// ================= CARGOS HISTORICOS =================

async function obtenerFormularioCargo() {

    return {
        figuraId: Number(document.getElementById("cargoFiguraId").value),
        cargo: document.getElementById("cargo").value.trim(),
        institucion: document.getElementById("institucion").value.trim(),
        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaFin").value || null,
        logros: document.getElementById("logros").value.trim(),
        motivoSalida: document.getElementById("motivoSalida").value.trim(),
        region: document.getElementById("region").value.trim(),
        imagenEventoBase64: await archivoABase64(document.getElementById("imagenEvento"))
    };

}

async function guardarCargo() {

    const cargo = await obtenerFormularioCargo();

    const respuesta = await fetch("/api/cargos-pg", {
        method: "POST",
        headers: cabeceras(),
        body: JSON.stringify(cargo)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarCargo();
    listarCargos();

}

async function modificarCargo() {

    const id = document.getElementById("cargoId").value;

    if (!id) {

        mostrarMensaje("Seleccione un cargo de la tabla para modificar.");
        return;

    }

    const cargo = await obtenerFormularioCargo();

    const respuesta = await fetch("/api/cargos-pg/" + id, {
        method: "PUT",
        headers: cabeceras(),
        body: JSON.stringify(cargo)
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarCargo();
    listarCargos();

}

async function eliminarCargo() {

    const id = document.getElementById("cargoId").value;

    if (!id) {

        mostrarMensaje("Seleccione un cargo de la tabla para eliminar.");
        return;

    }

    const respuesta = await fetch("/api/cargos-pg/" + id, {
        method: "DELETE",
        headers: cabeceras()
    });

    const datos = await respuesta.json();

    mostrarMensaje(datos.mensaje);
    limpiarCargo();
    listarCargos();

}

function limpiarCargo() {

    document.getElementById("cargoId").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("institucion").value = "";
    document.getElementById("fechaInicio").value = "";
    document.getElementById("fechaFin").value = "";
    document.getElementById("logros").value = "";
    document.getElementById("motivoSalida").value = "";
    document.getElementById("region").value = "";
    document.getElementById("imagenEvento").value = "";

}

let cargosCache = [];

async function listarCargos() {

    const respuesta = await fetch("/api/cargos-pg");

    cargosCache = await respuesta.json();

    const tbody = document.querySelector("#tablaCargos tbody");

    tbody.innerHTML = "";

    cargosCache.forEach(cargo => {

        const imgHtml = cargo.imagenEventoBase64
            ? `<img class="miniatura" src="data:image/png;base64,${cargo.imagenEventoBase64}">`
            : "(sin imagen)";

        const fila = document.createElement("tr");

        fila.innerHTML =
            "<td>" + cargo.id + "</td>" +
            "<td>" + cargo.figuraNombre + "</td>" +
            "<td>" + cargo.cargo + "</td>" +
            "<td>" + cargo.institucion + "</td>" +
            "<td>" + cargo.region + "</td>" +
            "<td>" + imgHtml + "</td>" +
            "<td><button onclick='window.__seleccionarCargo(" + cargo.id + ")'>Seleccionar</button></td>";

        tbody.appendChild(fila);

    });

}

window.__seleccionarCargo = function (id) {

    const cargo = cargosCache.find(c => c.id === id);

    if (!cargo) {

        return;

    }

    document.getElementById("cargoId").value = cargo.id;
    document.getElementById("cargoFiguraId").value = cargo.figuraId;
    document.getElementById("cargo").value = cargo.cargo;
    document.getElementById("institucion").value = cargo.institucion;
    document.getElementById("fechaInicio").value = (cargo.fechaInicio || "").toString().substring(0, 10);
    document.getElementById("fechaFin").value = (cargo.fechaFin || "").toString().substring(0, 10);
    document.getElementById("logros").value = cargo.logros;
    document.getElementById("motivoSalida").value = cargo.motivoSalida || "";
    document.getElementById("region").value = cargo.region;

};
