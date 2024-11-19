import AdminReclamosTipo from "../database/adminReclamosTipo.js";


export default class AdminReclamosTipoServices {

    constructor (){
        this.adminReclamosTipo = new AdminReclamosTipo();
    }
    //---
    obtenerTodos = () => {
        return this.adminReclamosTipo.obtenerTodosLosTipos();
    }

    //---

    obtenerPorId = (id) => {
        return this.adminReclamosTipo.obtenerTipoPorId(id);
    }

    //---

    crearTipo = (descripcion, activo) => {
        return this.adminReclamosTipo.crearNuevoTipo(descripcion, activo);
    }

    //---
    actualizarTipo = (id, descripcion, activo) => {
        return this.adminReclamosTipo.actualizarTipo(id, descripcion, activo);
    }

    //---
    eliminarTipo = async (id) => {
        return this.adminReclamosTipo.eliminarTipo(id);
    }



}