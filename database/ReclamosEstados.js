import { conexion } from "./conexion.js";


export default class ReclamosEstados {

    buscarTodos = async () => {
        const sql = 'SELECT * FROM reclamos_estado WHERE activo = 1;';
        const [result] = await conexion.query(sql);
        return result;
    }

    buscarPorId = async (idReclamoEstado) => {
        const sql = `SELECT * FROM reclamos_estado WHERE activo = 1 AND idReclamoEstado = ?`;
        const [result] = await conexion.query(sql, [idReclamoEstado]);
        return (result.length > 0) ? result[0] : null;
    }

    crear = async ({descripcion, activo}) => {
        try {
            const sql = 'INSERT INTO reclamos_estado (descripcion, activo) VALUES (?,?)';
            const [result] = await conexion.query(sql, [descripcion, activo]);

            if (result.affectedRows === 0) {
                throw new Error("No se pudo crear el Reclamo-estado.");
            }
            
            return this.buscarPorId(result.insertId);
        } catch (error) {
            console.error("Error al crear el Reclamo-estado:", error);
            throw error;
        }
    }

    modificar = async (idReclamoEstado, descripcion, activo) => {
        const sql = 'UPDATE reclamos_estado SET descripcion = ?, activo = ? WHERE idReclamoEstado = ?;'
        const [result] = await conexion.query(sql, [descripcion, activo, idReclamoEstado]);
        return result
    };

    eliminar = async (idReclamoEstado) => {
        const sql = 'UPDATE reclamos_estado SET activo = 0 WHERE idReclamoEstado = ?;';
        const [result] = await conexion.query(sql, [idReclamoEstado]);
        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el empleado.");
        }
        return result;
    };
}