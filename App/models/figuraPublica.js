/**
 * ==========================================
 * Modelo Figura Pública
 * ==========================================
 */
 
class FiguraPublica {
 
    constructor(codigo, nombreCompleto, cargoActual, partido, fechaNacimiento) {
 
        this.codigo = codigo;
        this.nombreCompleto = nombreCompleto;
        this.cargoActual = cargoActual;
        this.partido = partido;
        this.fechaNacimiento = fechaNacimiento;
 
    }
 
}
 
module.exports = FiguraPublica;