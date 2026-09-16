/*
==========================================
Menú lateral - común a todas las vistas
==========================================
*/

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {

    const usuario = sessionStorage.getItem("usuario") || "invitado";

    const etiqueta = document.getElementById("usuarioActivo");

    if (etiqueta) {

        etiqueta.innerText = "Usuario: " + usuario;

    }

    const btnSalir = document.getElementById("btnSalir");

    if (btnSalir) {

        btnSalir.addEventListener("click", salir);

    }

}

function salir() {

    const usuario = sessionStorage.getItem("usuario") || "";

    sessionStorage.removeItem("usuario");

    window.location.href = "/logout?usuario=" + encodeURIComponent(usuario);

}
