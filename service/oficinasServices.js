import Oficinas from '../database/oficinas.js';

const estadosReclamo = {
    1: 'Creado',
    2: 'En Proceso',
    3: 'Cancelado',
    4: 'Finalizado',
    5: 'Suspendido'
};

export default class OficinasServices {
    constructor() {
        this.oficinas = new Oficinas();
    }

    autenticar = async (email, password) => {
        return this.oficinas.autenticar(email, password);
    }

    atenderReclamo = async (idReclamo, nuevoEstado, idEmpleado) => {
      console.log(`Atendiendo reclamo ${idReclamo}. Nuevo estado: ${nuevoEstado}`);
      const reclamoActualizado = await this.oficinas.actualizarEstadoReclamo(idReclamo, nuevoEstado, idEmpleado);
      return reclamoActualizado;
  }

  listarReclamosOficina = async (idEmpleado) => {
    console.log('OficinasServices: Listando reclamos para el empleado:', idEmpleado);

    //---Llamar al método que obtiene los reclamos desde la base de datos
    const reclamos = await this.oficinas.listarReclamosOficina(idEmpleado);

    //---Verificar si se encontraron reclamos
    if (!Array.isArray(reclamos) || reclamos.length === 0) {
        console.log(`No se encontraron reclamos para el empleado ${idEmpleado}`);
        return [];  // Devolver array vacío si no hay reclamos
    }

    //---Devolver los reclamos tal como se obtuvieron de la base de datos
    return reclamos;
}

    obtenerDescripcionEstado = (idEstado) => {
        return estadosReclamo[idEstado] || 'Desconocido';
    }
}