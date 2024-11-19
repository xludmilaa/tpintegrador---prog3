import { conexion } from './conexion.js';

const estadosReclamo = {
    1: 'Creado',
    2: 'En Proceso',
    3: 'Cancelado',
    4: 'Finalizado',
    5: 'Suspendido'
};

export default class Oficinas {
    listarReclamosOficina = async (idEmpleado) => {
        try {
            const [reclamos] = await conexion.query(`
                SELECT 
                    r.idReclamo, 
                    r.asunto, 
                    r.descripcion, 
                    r.fechaCreado,
                    r.fechaFinalizado,
                    r.fechaCancelado,
                    re.descripcion AS estadoReclamo,
                    u.nombre AS nombreUsuarioCreador, 
                    u.apellido AS apellidoUsuarioCreador,
                    rt.descripcion AS tipoReclamo,
                    o.nombre AS nombreOficina
                FROM usuariosoficinas uo
                JOIN oficinas o ON uo.idOficina = o.idOficina
                JOIN reclamostipo rt ON o.idReclamoTipo = rt.idReclamoTipo
                JOIN reclamos r ON r.idReclamoTipo = rt.idReclamoTipo
                JOIN usuarios u ON r.idUsuarioCreador = u.idUsuario
                JOIN reclamosestado re ON r.idReclamoEstado = re.idReclamoEstado
                WHERE uo.idUsuario = ?
                ORDER BY r.fechaCreado DESC
            `, [idEmpleado]);
    
            console.log(`Reclamos encontrados para el empleado ${idEmpleado}:`, reclamos.length);
            return reclamos;
        } catch (error) {
            console.error('Error al listar reclamos de la oficina:', error);
            throw error;
        }
    }
    async actualizarEstadoReclamo(idReclamo, nuevoEstado, idEmpleado) {
        try {
            const query = `
                UPDATE reclamos r
                JOIN usuariosoficinas uo ON uo.idUsuario = ?
                JOIN oficinas o ON o.idOficina = uo.idOficina
                SET r.idReclamoEstado = ?
                WHERE r.idReclamo = ? AND r.idReclamoTipo = o.idReclamoTipo
            `;
            const [result] = await conexion.query(query, [idEmpleado, nuevoEstado, idReclamo]);

            if (result.affectedRows === 0) {
                throw new Error('No se pudo actualizar el reclamo. Verifique que el reclamo exista y pertenezca a su departamento.');
            }

            console.log(`Reclamo ${idReclamo} actualizado con éxito a estado ${nuevoEstado}`);
            
            // Obtener el reclamo actualizado
            const reclamoActualizado = await this.buscarReclamoPorId(idReclamo);
            
            // Obtener información del usuario creador
            const usuarioCreador = await this.obtenerUsuarioCreador(reclamoActualizado.idUsuarioCreador);
            
            return {
                ...reclamoActualizado,
                estadoDescripcion: this.obtenerDescripcionEstado(nuevoEstado),
                nombreUsuario: usuarioCreador.nombre,
                correoUsuario: usuarioCreador.correoElectronico
            };
        } catch (error) {
            console.error('Error al actualizar el estado del reclamo:', error);
            throw error;
        }
    }

    async buscarPorId(idOficina) {
        try {
            const [result] = await conexion.query(
                'SELECT * FROM oficinas WHERE idOficina = ?',
                [idOficina]
            );
            return (result.length > 0) ? result[0] : null;
        } catch (error) {
            console.error('Error al buscar oficina por ID:', error);
            throw error;
        }
    
    }

    obtenerDescripcionEstado(idEstado) {
        return estadosReclamo[idEstado] || 'desconocido';
    }

    async buscarReclamoPorId(idReclamo) {
        try {
            const [result] = await conexion.query(
                'SELECT * FROM reclamos WHERE idReclamo = ?',
                [idReclamo]
            );
            return (result.length > 0) ? result[0] : null;
        } catch (error) {
            console.error('Error al buscar reclamo por ID:', error);
            throw error;
        }
    }

    async obtenerUsuarioCreador(idUsuario) {
        try {
            const [result] = await conexionDB.query(
                'SELECT nombre, correoElectronico FROM usuarios WHERE idUsuario = ?',
                [idUsuario]
            );
            return (result.length > 0) ? result[0] : null;
        } catch (error) {
            console.error('Error al obtener usuario creador:', error);
            throw error;
        }
    }
}