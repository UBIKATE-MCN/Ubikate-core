class Distrito {
    constructor(idDistrito, nombre, cp, puntuacion4ejes) {
        this.idDistrito = idDistrito;
        this.nombre = nombre;
        this.cp = cp;
        this.indicadores = [];
        this.puntuacion4ejes = puntuacion4ejes;
    }

    getCalidadAire() {
        return 8.5; // Valor de prueba
    }

    getZonasVerdes() {
        return 12; // Valor de prueba
    }
}

module.exports = Distrito;