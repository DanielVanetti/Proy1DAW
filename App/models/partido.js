/**
 * ==========================================
 * Modelo de Partido Político (Parte 1 - .txt)
 * ==========================================
 */

class Partido {

    constructor(codigo, nombre, siglas, ideologia, fechaFundacion) {

        this.codigo = codigo;
        this.nombre = nombre;
        this.siglas = siglas;
        this.ideologia = ideologia;
        this.fechaFundacion = fechaFundacion;

    }

}

module.exports = Partido;
