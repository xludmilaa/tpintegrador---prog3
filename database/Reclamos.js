import { conexion } from "./conexion.js";

export default class Reclamos {

    //---Método para obtener todos los reclamos
    buscarTodos = async () => {
        const sql = `SELECT r.asunto, r.descripcion, r.fechaCreado, r.fechaFinalizado, r.fechaCancelado, 
                        r.idReclamoEstado, re.descripcion AS "Descripción Estado", 
                        r.idReclamoTipo, rt.descripcion AS "Descripción Tipo", 
                        u.nombre AS "Creado por"
                    FROM reclamos AS r
                    INNER JOIN reclamostipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo
                    INNER JOIN reclamosestado AS re ON re.idReclamoEstado = r.idReclamoEstado
                    INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador;`

        const [result] = await conexion.query(sql);
        return result;
    }

    //---Método para buscar un reclamo por ID
    buscarPorId = async (idReclamo) => {
        console.log("Consulta SQL para buscar por ID:", idReclamo); // Verificar el ID en la consulta
        const sql = `SELECT * FROM reclamos WHERE idReclamo = ?`;
        const [result] = await conexion.query(sql, [idReclamo]);
    
        console.log("Resultado de la consulta SQL:", result); // Verificar el resultado
        return (result.length > 0) ? result[0] : null;
    }
    
    
    //---Método para crear un nuevo reclamo
    crear = async ({ asunto, descripcion, idReclamoTipo, idUsuarioCreador }) => {
        try {
            //---Insertar un nuevo reclamo
            const sql = 'INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador) VALUES (?, ?, NOW(), 1, ?, ?)';
            const [result] = await conexion.query(sql, [asunto, descripcion, idReclamoTipo, idUsuarioCreador]);

            //---Verificar si el reclamo fue creado exitosamente
            if (result.affectedRows === 0) {
                return {
                    estado: "Falla",
                    mensaje: "No se pudo crear el Reclamo."
                };
            }

            //---Retornar el reclamo recién creado
            return this.buscarPorId(result.insertId);

        } catch (error) {
            console.error('Error al crear el reclamo:', error);
            return {
                estado: "Falla",
                mensaje: "Error interno al crear el Reclamo."
            };
            };
        }
    
     // Método para modificar un reclamo
     async modificar(idReclamo, datosActualizacion) {
        console.log("Modificando reclamo en la base de datos. ID:", idReclamo, "Datos:", datosActualizacion);
        
        const { asunto, descripcion, idReclamoTipo, idReclamoEstado } = datosActualizacion;
        const query = `
            UPDATE reclamos 
            SET 
                asunto = ?,
                descripcion = ?,
                idReclamoTipo = ?,
                idReclamoEstado = ?
            WHERE idReclamo = ?
        `;
        const values = [asunto, descripcion, idReclamoTipo, idReclamoEstado, idReclamo];

        try {
            const [result] = await conexion.query(query, values);
            console.log("Resultado de la actualización:", result);
            if (result.affectedRows === 0) {
                console.log("No se encontró el reclamo para actualizar");
                return null;
            }
            return this.buscarPorId(idReclamo);
        } catch (error) {
            console.error('Error al modificar reclamo en la base de datos:', error);
            throw error;
        }
    }

    buscarDatosReportePdf = async () => {
        const sql = 'CALL `datosPDF`()';

        const [result] = await conexion.query(sql);

        const datosReporte = {
            reclamosTotales : result[0][0].reclamosTotales,
            reclamosNoFinalizados : result[0][0].reclamosNoFinalizados,
            reclamosFinalizados : result[0][0].reclamosFinalizados,
            descripcionTipoReclamoFrecuente : result[0][0].descripcionTipoReclamoFrecuente,
            cantidadTipoReclamoFrecuente : result[0][0].cantidadTipoReclamoFrecuente
        }

        return datosReporte;
    };

    buscarDatosReporteCsv = async () => {
        const sql = `SELECT r.idReclamo as 'reclamo', rt.descripcion as 'tipo', re.descripcion AS 'estado',
                    DATE_FORMAT(r.fechaCreado, '%Y-%m-%d %H:%i:%s') AS 'fechaCreado', CONCAT(u.nombre, ' ', u.apellido) AS 'cliente'
                    FROM reclamos AS r 
                    INNER JOIN reclamos_tipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo 
                    INNER JOIN reclamos_estado AS re ON re.idReclamoEstado = r.idReclamoEstado 
                    INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador 
                        WHERE r.idReclamoEstado <> 4;`;

        const [result] = await conexion.query(sql);
        return result;
    }
}


    
