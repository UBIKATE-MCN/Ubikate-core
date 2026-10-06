const Distrito = require('./Distrito');

/**
 * Vivienda de Madrid.
 *
 * Refactorización POO (Fase 3 - Ideación):
 *  - Se elimina el atributo `idDistrito: int` (clave ajena propia de SQL).
 *  - Se añade `distrito: Distrito` (referencia directa al objeto), de modo que
 *    se puede hacer  vivienda.getDistrito().getCalidadAire()  sin buscar
 *    por id en ninguna lista.
 */
class Vivienda {
    constructor(idVivienda, direccion, precio, m2, distrito) {
        this.idVivienda = idVivienda;
        this.direccion = direccion;
        this.precio = precio;
        this.m2 = m2;
        this.distrito = null; // Distrito (referencia a objeto)
        this.setDistrito(distrito);
    }

    getDistrito() {
        return this.distrito;
    }

    /**
     * Asigna el distrito y mantiene sincronizada la colección
     * `distrito.viviendas` (también al mover la vivienda de un distrito a otro).
     */
    setDistrito(distrito) {
        if (!(distrito instanceof Distrito)) {
            throw new TypeError('Vivienda.distrito debe ser una instancia de Distrito');
        }
        if (this.distrito === distrito) return;

        if (this.distrito) {
            const i = this.distrito.viviendas.indexOf(this);
            if (i !== -1) this.distrito.viviendas.splice(i, 1);
        }
        this.distrito = distrito;
        distrito.viviendas.push(this);
    }

    getDetalles() {
        return `${this.direccion} · ${this.precio} € · ${this.m2} m² · Distrito: ${this.distrito.nombre}`;
    }

    mostrarInfo() {
        console.log(this.getDetalles());
    }

    /**
     * Serialización para la API: el distrito va resumido (sin su lista de
     * viviendas) para evitar la referencia circular Vivienda <-> Distrito.
     */
    toJSON() {
        return {
            idVivienda: this.idVivienda,
            direccion: this.direccion,
            precio: this.precio,
            m2: this.m2,
            distrito: {
                idDistrito: this.distrito.idDistrito,
                nombre: this.distrito.nombre,
                cp: this.distrito.cp
            }
        };
    }
}

module.exports = Vivienda;
