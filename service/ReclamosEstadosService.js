import ReclamosEstados from "../database/ReclamosEstados.js";

export default class ReclamosEstadosService {

    constructor(){
        this.ReclamosEstados = new ReclamosEstados();
    }

    buscarTodos = () => {
        return this.ReclamosEstados.buscarTodos();
    }

    buscarPorId = () => {
        return this.ReclamosEstados.buscarPorId();
    }
    
    crear = (reclamoEstado) => {
        return this.ReclamosEstados.crear(reclamoEstado);
    }

    modificar = async (idReclamoEstado, descripcion, activo) => {
        return this.ReclamosEstados.modificar(idReclamoEstado, descripcion, activo);
    }

    eliminar = async (idReclamoEstado) => {
        return this.ReclamosEstados.eliminar(idReclamoEstado);
    }
}