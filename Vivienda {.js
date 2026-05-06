class Vivienda {
    constructor(idVivienda, direccion, precio, m2) {
        this.idVivienda = idVivienda;
        this.direccion = direccion;
        this.precio = precio;
        this.m2 = m2;
    }

    getDetalles() { return ""; }
    mostrarInfo() { console.log(this.direccion); }
}
module.exports = Vivienda;