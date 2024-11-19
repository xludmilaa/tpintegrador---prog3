import { conexion } from "./conexion.js";

export default class AdminReclamosTipo {


obtenerTodosLosTipos = async () => {
    const sql = 'SELECT * FROM reclamos_tipo;';
    const [result] = await conexion.query(sql); 
    return result;
}

//----------------------------------------------------------------

obtenerTipoPorId = async (id) => {
    const sql = 'SELECT * FROM reclamos_tipo WHERE idReclamosTipo = ?;';
    const [result] = await conexion.query(sql, [id]);
    return result;
}

//----------------------------------------------------------------

crearNuevoTipo = async (descripcion, activo) => {
    const sql = 'INSERT INTO reclamos_tipo (descripcion, activo) VALUES (?, ?);';
    const [result] = await conexion.query(sql, [descripcion, activo]);
    return result;
}

//----------------------------------------------------------------

actualizarTipo = async (id, descripcion, activo) => {
    const sql = 'UPDATE reclamos_tipo SET descripcion = ?, activo = ? WHERE idReclamosTipo = ?;';
    const [result] = await conexion.query(sql, [descripcion, activo, id]);
    return result;
}

//----------------------------------------------------------------

eliminarTipo =  async (id) => {
    const sql = 'UPDATE reclamos_tipo SET activo = 0 WHERE idReclamosTipo = ?;';
    const [result] = await conexion.query(sql, [id]);

    if (result.affectedRows === 0) {
        throw new Error("No se pudo eliminar el empleado.");
    }
    return result;
}


}