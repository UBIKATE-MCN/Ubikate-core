/**
 * Distrito de Madrid evaluado con los 4 ejes.
 *
 * Refactorización POO (Fase 3 - Ideación):
 *  - La relación con Vivienda es una AGREGACIÓN (1 Distrito -> 0..* Viviendas)
 *    y se modela con una colección de OBJETOS (`viviendas: List<Vivienda>`),
 *    no con ids ni claves ajenas. Las claves (id_distrito...) son cosa de la
 *    base de datos y solo se usan en la capa de acceso a datos.
 *  - Esta clase NO importa Vivienda para evitar dependencias circulares:
 *    el vínculo bidireccional lo mantiene Vivienda.setDistrito().
 */
class Distrito {
    constructor(idDistrito, nombre, cp, puntuacion4ejes, color4ejes = null) {
        this.idDistrito = idDistrito;
        this.nombre = nombre;
        this.cp = cp;
        this.indicadores = [];
        this.color4ejes = color4ejes;
        this.puntuacion4ejes = puntuacion4ejes;
        this.viviendas = []; // List<Vivienda> (colección de objetos)
    }

    /**
     * Añade una vivienda a este distrito. Delega en Vivienda.setDistrito()
     * para que ambos lados de la relación queden siempre coherentes.
     */
    agregarVivienda(vivienda) {
        if (!vivienda || typeof vivienda.setDistrito !== 'function') {
            throw new TypeError('agregarVivienda() espera una instancia de Vivienda');
        }
        vivienda.setDistrito(this);
    }

    /** Copia de la lista, para que nadie la modifique desde fuera. */
    getViviendas() {
        return [...this.viviendas];
    }

    getCalidadAire() {
        return 8.5; // Valor de prueba
    }

    getZonasVerdes() {
        return 12; // Valor de prueba
    }

    /**
     * Serialización para la API. No incluye las viviendas completas:
     * cada Vivienda apunta a su Distrito y JSON.stringify fallaría por
     * referencia circular.
     */
    toJSON() {
        return {
            idDistrito: this.idDistrito,
            nombre: this.nombre,
            cp: this.cp,
            color4ejes: this.color4ejes,
            puntuacion4ejes: this.puntuacion4ejes,
            numViviendas: this.viviendas.length
        };
    }
}

module.exports = Distrito;
