class Usuario {
    constructor(idUsuario, email, password, preferencias) {
        this.idUsuario = idUsuario;
        this.email = email;
        this.password = password;
        this.preferencias = preferencias; // List<String>
    }

    registrar() { return true; }
    login(user, pass) { return true; }
}
module.exports = Usuario;