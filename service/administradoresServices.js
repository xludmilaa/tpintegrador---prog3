import Administradores from "../database/administradores.js";


export default class AdministradoresServices {
    constructor () {
        this.administradores = new Administradores();
    }

    autenticar = async (email, password) => {
        return this.administradores.autenticar(email, password);
    }

    consultarEmpleadoCreado = async (idUsuario) => {
        return this.administradores.consultarEmpleadoCreado(idUsuario);
    }

    crearUsuarioEmpleado = async (datos) => {
        return this.administradores.crearUsuarioEmpleado(datos);
    }

    obtenerTodosLosEmpleados = async () => {
        return this.administradores.obtenerTodosLosEmpleados();
    }

    actualizarEmpleado = async (idUsuario, datos) => {
        return this.administradores.actualizarEmpleado(idUsuario, datos);
    }

    eliminarEmpleado = async (idUsuario) => {
        return this.administradores.eliminarEmpleado(idUsuario);
    }

    obtenerOficinas = async () => {
        return this.administradores.obtenerOficinas();
    }

    crearOficina = async (datos) => {
        return this.administradores.crearOficina(datos);
    }

    actualizarOficina = async (idOficina, datos) => {
        return this.administradores.actualizarOficina(idOficina, datos);
    }

    eliminarOficina = async (idOficina) => {
        return this.administradores.eliminarOficina(idOficina);
    }

    agregarEmpleadoAOficina = async (idOficina, idEmpleado) => {
        return this.administradores.agregarEmpleadoAOficina(idOficina, idEmpleado);
    }

    quitarEmpleadoDeOficina = async (idOficina, idEmpleado) => {
        return this.administradores.quitarEmpleadoDeOficina(idOficina, idEmpleado);
    }
}