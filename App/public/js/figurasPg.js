// ==========================================
// FIGURAS PÚBLICAS
// ==========================================

const formularioFigura = document.getElementById("formFigura");

const figuraIdInput = document.getElementById("figuraId");

const nombreCompletoInput = document.getElementById("nombreCompleto");

const cargoActualInput = document.getElementById("cargoActual");

const fechaNacimientoInput = document.getElementById("fechaNacimiento");

const nacionalidadInput = document.getElementById("nacionalidad");

const nivelEducativoInput = document.getElementById("nivelEducativo");

const aniosExperienciaInput = document.getElementById("aniosExperiencia");

const biografiaInput = document.getElementById("biografia");

const fotoInput = document.getElementById("foto");

const tablaFiguras =
    document.getElementById("tablaFiguras");

const btnCancelarFigura =
    document.getElementById("btnCancelarFigura");


// ==========================================
// CARGOS HISTÓRICOS
// ==========================================

const formularioCargo = document.getElementById("formCargo");

const cargoIdInput = document.getElementById("cargoId");

const figuraIdCargoInput = document.getElementById("figuraIdCargo");

const cargoInput = document.getElementById("cargo");

const institucionInput = document.getElementById("institucion");

const fechaInicioInput = document.getElementById("fechaInicio");

const fechaFinInput = document.getElementById("fechaFin");

const logrosInput = document.getElementById("logros");

const motivoSalidaInput = document.getElementById("motivoSalida");

const regionInput = document.getElementById("region");

const imagenEventoInput = document.getElementById("imagenEvento");

const tablaCargos =
    document.getElementById("tablaCargos");

const btnCancelarCargo =
    document.getElementById("btnCancelarCargo");


// ==========================================
// SERIALIZAR IMAGEN
// Lee el archivo seleccionado y lo convierte a texto
// base64 para enviarlo dentro del JSON al servidor
// ==========================================

function leerImagen(inputArchivo) {

    return new Promise((resolve, reject) => {

        const archivo = inputArchivo.files[0];

        if (!archivo) {

            resolve(null);

            return;

        }

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result.split(",")[1]);

        lector.onerror = reject;

        lector.readAsDataURL(archivo);

    });

}


// ==========================================
// CONSULTAR FIGURAS PÚBLICAS
// ==========================================

async function cargarFiguras() {

    try {

        const respuesta =
            await fetch("/api/figuras");

        const figuras =
            await respuesta.json();

        tablaFiguras.innerHTML = "";

        figuras.forEach(figura => {

            const fila =
                document.createElement("tr");

            // La foto llega serializada en base64 y se muestra en un <img>
            // El botón Editar solo envía el id, porque son 8 campos

            fila.innerHTML = `

                <td>${figura.id}</td>

                <td>${figura.nombre_completo}</td>

                <td>${figura.cargo_actual}</td>

                <td>${figura.fecha_nacimiento}</td>

                <td>${figura.nacionalidad}</td>

                <td>${figura.nivel_educativo}</td>

                <td>${figura.anios_experiencia}</td>

                <td>${figura.biografia}</td>

                <td>
                    ${figura.foto ? `<img src="data:image/png;base64,${figura.foto}" width="60">` : "Sin foto"}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarFigura(
                            ${figura.id}
                        )">

                        Editar

                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarFigura(
                            ${figura.id}
                        )">

                        Eliminar

                    </button>

                </td>

            `;

            tablaFiguras.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar figuras:",
            error
        );

    }

}


// ==========================================
// CREAR O ACTUALIZAR FIGURA PÚBLICA
// ==========================================

formularioFigura.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id = figuraIdInput.value;


        const datos = {

            nombre_completo: nombreCompletoInput.value,

            cargo_actual: cargoActualInput.value,

            fecha_nacimiento: fechaNacimientoInput.value,

            nacionalidad: nacionalidadInput.value,

            nivel_educativo: nivelEducativoInput.value,

            anios_experiencia: aniosExperienciaInput.value,

            biografia: biografiaInput.value,

            // Imagen serializada en base64
            foto: await leerImagen(fotoInput)

        };


        try {

            let respuesta;


            if (id === "") {

                // CREAR

                respuesta = await fetch(
                    "/api/figuras",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            } else {

                // ACTUALIZAR

                respuesta = await fetch(
                    `/api/figuras/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            }


            if (!respuesta.ok) {

                throw new Error(
                    "Error en la operación"
                );

            }


            limpiarFormularioFigura();

            cargarFiguras();


        } catch (error) {

            console.error(error);

            alert(
                "No fue posible realizar la operación"
            );

        }

    }
);


// ==========================================
// EDITAR FIGURA PÚBLICA
// Como son 8 campos, se consultan con GET /api/figuras/:id
// ==========================================

async function editarFigura(id) {

    try {

        const respuesta =
            await fetch(`/api/figuras/${id}`);


        if (!respuesta.ok) {

            throw new Error(
                "Error al consultar"
            );

        }


        const figura =
            await respuesta.json();


        figuraIdInput.value = figura.id;

        nombreCompletoInput.value = figura.nombre_completo;

        cargoActualInput.value = figura.cargo_actual;

        fechaNacimientoInput.value = figura.fecha_nacimiento;

        nacionalidadInput.value = figura.nacionalidad;

        nivelEducativoInput.value = figura.nivel_educativo;

        aniosExperienciaInput.value = figura.anios_experiencia;

        biografiaInput.value = figura.biografia;

        nombreCompletoInput.focus();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible consultar la figura"
        );

    }

}


// ==========================================
// ELIMINAR FIGURA PÚBLICA
// ==========================================

async function eliminarFigura(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar esta figura pública?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/api/figuras/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al eliminar"
            );

        }


        cargarFiguras();

        // Los cargos de la figura se eliminan en cascada
        cargarCargos();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible eliminar la figura"
        );

    }

}


// ==========================================
// CANCELAR / LIMPIAR FIGURA PÚBLICA
// ==========================================

btnCancelarFigura.addEventListener(
    "click",
    limpiarFormularioFigura
);


function limpiarFormularioFigura() {

    figuraIdInput.value = "";

    nombreCompletoInput.value = "";

    cargoActualInput.value = "";

    fechaNacimientoInput.value = "";

    nacionalidadInput.value = "";

    nivelEducativoInput.value = "";

    aniosExperienciaInput.value = "";

    biografiaInput.value = "";

    fotoInput.value = "";

}


// ==========================================
// CONSULTAR CARGOS HISTÓRICOS
// ==========================================

async function cargarCargos() {

    try {

        const respuesta =
            await fetch("/api/cargos");

        const cargos =
            await respuesta.json();

        tablaCargos.innerHTML = "";

        cargos.forEach(cargo => {

            const fila =
                document.createElement("tr");

            // figura_nombre y figura_cargo_actual vienen de la CARGA EAGER (JOIN)
            // La imagen llega serializada en base64 y se muestra en un <img>
            // El botón Editar solo envía el id, porque son 8 campos

            fila.innerHTML = `

                <td>${cargo.id}</td>

                <td>${cargo.figura_id} - ${cargo.figura_nombre} (${cargo.figura_cargo_actual})</td>

                <td>${cargo.cargo}</td>

                <td>${cargo.institucion}</td>

                <td>${cargo.fecha_inicio}</td>

                <td>${cargo.fecha_fin || "Actual"}</td>

                <td>${cargo.logros}</td>

                <td>${cargo.motivo_salida}</td>

                <td>${cargo.region}</td>

                <td>
                    ${cargo.imagen_evento ? `<img src="data:image/png;base64,${cargo.imagen_evento}" width="60">` : "Sin imagen"}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        onclick="editarCargo(
                            ${cargo.id}
                        )">

                        Editar

                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarCargo(
                            ${cargo.id}
                        )">

                        Eliminar

                    </button>

                </td>

            `;

            tablaCargos.appendChild(fila);

        });

    } catch (error) {

        console.error(
            "Error al cargar cargos:",
            error
        );

    }

}


// ==========================================
// CREAR O ACTUALIZAR CARGO HISTÓRICO
// ==========================================

formularioCargo.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id = cargoIdInput.value;


        const datos = {

            figura_id: figuraIdCargoInput.value,

            cargo: cargoInput.value,

            institucion: institucionInput.value,

            fecha_inicio: fechaInicioInput.value,

            fecha_fin: fechaFinInput.value,

            logros: logrosInput.value,

            motivo_salida: motivoSalidaInput.value,

            region: regionInput.value,

            // Imagen serializada en base64
            imagen_evento: await leerImagen(imagenEventoInput)

        };


        try {

            let respuesta;


            if (id === "") {

                // CREAR

                respuesta = await fetch(
                    "/api/cargos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            } else {

                // ACTUALIZAR

                respuesta = await fetch(
                    `/api/cargos/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(datos)
                    }
                );

            }


            if (!respuesta.ok) {

                throw new Error(
                    "Error en la operación"
                );

            }


            limpiarFormularioCargo();

            cargarCargos();


        } catch (error) {

            console.error(error);

            alert(
                "No fue posible realizar la operación"
            );

        }

    }
);


// ==========================================
// EDITAR CARGO HISTÓRICO
// Como son 8 campos, se consultan con GET /api/cargos/:id
// ==========================================

async function editarCargo(id) {

    try {

        const respuesta =
            await fetch(`/api/cargos/${id}`);


        if (!respuesta.ok) {

            throw new Error(
                "Error al consultar"
            );

        }


        const cargo =
            await respuesta.json();


        cargoIdInput.value = cargo.id;

        figuraIdCargoInput.value = cargo.figura_id;

        cargoInput.value = cargo.cargo;

        institucionInput.value = cargo.institucion;

        fechaInicioInput.value = cargo.fecha_inicio;

        fechaFinInput.value = cargo.fecha_fin || "";

        logrosInput.value = cargo.logros;

        motivoSalidaInput.value = cargo.motivo_salida;

        regionInput.value = cargo.region;

        cargoInput.focus();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible consultar el cargo"
        );

    }

}


// ==========================================
// ELIMINAR CARGO HISTÓRICO
// ==========================================

async function eliminarCargo(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar este cargo histórico?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta =
            await fetch(
                `/api/cargos/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al eliminar"
            );

        }


        cargarCargos();


    } catch (error) {

        console.error(error);

        alert(
            "No fue posible eliminar el cargo"
        );

    }

}


// ==========================================
// CANCELAR / LIMPIAR CARGO HISTÓRICO
// ==========================================

btnCancelarCargo.addEventListener(
    "click",
    limpiarFormularioCargo
);


function limpiarFormularioCargo() {

    cargoIdInput.value = "";

    figuraIdCargoInput.value = "";

    cargoInput.value = "";

    institucionInput.value = "";

    fechaInicioInput.value = "";

    fechaFinInput.value = "";

    logrosInput.value = "";

    motivoSalidaInput.value = "";

    regionInput.value = "";

    imagenEventoInput.value = "";

}


// ==========================================
// CARGAR AL INICIAR
// ==========================================

cargarFiguras();

cargarCargos();
