const Vivienda = require('./Vivienda');

/**
 * Usuario de Ubikate.
 *
 * Refactorización POO (Fase 3 - Ideación):
 *  - Los favoritos son una colección de OBJETOS (`favoritos: List<Vivienda>`),
 *    no ids numéricos. La tabla puente USUARIO_FAVORITOS (relación N:M) es un
 *    detalle de la base de datos que se resuelve en la capa de acceso a datos.
 */
class Usuario {
    constructor(idUsuario, email, password) {
        this.idUsuario = idUsuario;
        this.email = email;
        this.password = password;
        this.favoritos = []; // List<Vivienda>
    }

    registrar() { return true; } // TODO: persistir en BD (hash de contraseña)
    login(user, pass) { return true; } // TODO: validar contra BD (comparar hash)

    agregarFavorito(vivienda) {
        if (!(vivienda instanceof Vivienda)) {
            throw new TypeError('agregarFavorito() espera una instancia de Vivienda');
        }
        if (!this.esFavorito(vivienda)) {
            this.favoritos.push(vivienda);
        }
    }

    eliminarFavorito(vivienda) {
        const i = this.favoritos.indexOf(vivienda);
        if (i !== -1) this.favoritos.splice(i, 1);
    }

    esFavorito(vivienda) {
        return this.favoritos.includes(vivienda);
    }

    /** Copia de la lista, para que nadie la modifique desde fuera. */
    getFavoritos() {
        return [...this.favoritos];
    }

    /** Serialización para la API: nunca se expone la contraseña. */
    toJSON() {
        return {
            idUsuario: this.idUsuario,
            email: this.email,
            favoritos: this.favoritos
        };
    }
}

module.exports = Usuario;
