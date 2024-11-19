import { conexion } from "./conexion.js";
import bcrypt from 'bcrypt';

export default class Administradores {

    autenticar = async (email, password) => {
        const sql = 'SELECT * FROM usuarios WHERE correoElectronico = ? AND idUsuarioTipo = 1;';
        const [result] = await conexion.query(sql, [email]);
        if (result.length > 0) {
            const match = await bcrypt.compare(password, result[0].contrasenia);
            if (match) {
                return result[0];
            }
        }
        return null;
    }

    consultarEmpleadoCreado = async (idUsuario) => {
        const sql = 'SELECT usuarios.idUsuario, usuarios.nombre, usuarios.apellido, usuarios.correoElectronico, usuariostipo.descripcion FROM usuarios INNER JOIN usuariostipo ON usuarios.idUsuarioTipo = usuariostipo.idUsuarioTipo WHERE usuarios.idUsuario = ?;'
        const [result] = await conexion.query(sql, [idUsuario])
        return (result.length > 0) ? result[0] : null;
    }

    crearUsuarioEmpleado = async (datos) => {
        const hashedPassword = await bcrypt.hash(datos.contrasenia, 10);
        const sql = 'INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo, imagen, activo) VALUES (?, ?, ?, ?, ?, ?, ?);'
        const [result] = await conexion.query(sql, [datos.nombre, datos.apellido, datos.correoElectronico, hashedPassword, datos.idUsuarioTipo, datos.imagen, datos.activo]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo crear el empleado.");
        }
        
        return this.consultarEmpleadoCreado(result.insertId);
    }

    obtenerTodosLosEmpleados = async () => {
        const sql = 'SELECT usuarios.idUsuario, usuarios.nombre, usuarios.apellido, usuarios.correoElectronico, usuariostipo.descripcion FROM usuarios INNER JOIN usuariostipo ON usuarios.idUsuarioTipo = usuariostipo.idUsuarioTipo WHERE usuarios.idUsuarioTipo != 1;'
        const [result] = await conexionDB.query(sql);
        return result;
    }

    actualizarEmpleado = async (idUsuario, datos) => {
        let sql = 'UPDATE usuarios SET nombre = ?, apellido = ?, correoElectronico = ?, imagen = ?, activo = ? WHERE idUsuario = ?;'
        let params = [datos.nombre, datos.apellido, datos.correoElectronico, datos.imagen, datos.activo, idUsuario];

        if (datos.contrasenia) {
            const hashedPassword = await bcrypt.hash(datos.contrasenia, 10);
            sql = 'UPDATE usuarios SET nombre = ?, apellido = ?, correoElectronico = ?, contrasenia = ?, imagen = ?, activo = ? WHERE idUsuario = ?;'
            params = [datos.nombre, datos.apellido, datos.correoElectronico, hashedPassword, datos.imagen, datos.activo, idUsuario];
        }

        const [result] = await conexion.query(sql, params);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo actualizar el empleado.");
        }
        
        return this.consultarEmpleadoCreado(idUsuario);
    }

    eliminarEmpleado = async (idUsuario) => {
        const sql = 'UPDATE usuarios SET activo = 0 WHERE idUsuario = ?;'
        const [result] = await conexion.query(sql, [idUsuario]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el empleado.");
        }
        return result;
    }

    obtenerOficinas = async () => {
        const sql = 'SELECT * FROM oficinas WHERE activo = 1;'
        const [result] = await conexion.query(sql);
        return result;
    }

    crearOficina = async (datos) => {
        const sql = 'INSERT INTO oficinas (nombre, direccion, telefono, activo) VALUES (?, ?, ?, ?);'
        const [result] = await conexion.query(sql, [datos.nombre, datos.direccion, datos.telefono, datos.activo]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo crear la oficina.");
        }
        
        return this.obtenerOficinaPorId(result.insertId);
    }

    obtenerOficinaPorId = async (idOficina) => {
        const sql = 'SELECT * FROM oficinas WHERE idOficina = ?;'
        const [result] = await conexion.query(sql, [idOficina]);
        return (result.length > 0) ? result[0] : null;
    }

    actualizarOficina = async (idOficina, datos) => {
        const sql = 'UPDATE oficinas SET nombre = ?, direccion = ?, telefono = ?, activo = ? WHERE idOficina = ?;'
        const [result] = await conexion.query(sql, [datos.nombre, datos.direccion, datos.telefono, datos.activo, idOficina]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo actualizar la oficina.");
        }
        
        return this.obtenerOficinaPorId(idOficina);
    }

    eliminarOficina = async (idOficina) => {
        const sql = 'UPDATE oficinas SET activo = 0 WHERE idOficina = ?;'
        const [result] = await conexion.query(sql, [idOficina]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar la oficina.");
        }
    }

    agregarEmpleadoAOficina = async (idOficina, idEmpleado) => {
        const sql = 'INSERT INTO oficinas_empleados (idOficina, idEmpleado) VALUES (?, ?);'
        const [result] = await conexion.query(sql, [idOficina, idEmpleado]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo agregar el empleado a la oficina.");
        }
    }

    quitarEmpleadoDeOficina = async (idOficina, idEmpleado) => {
        const sql = 'DELETE FROM oficinas_empleados WHERE idOficina = ? AND idEmpleado = ?;'
        const [result] = await conexion.query(sql, [idOficina, idEmpleado]);
        
        if (result.affectedRows === 0) {
            throw new Error("No se pudo quitar el empleado de la oficina.");
        }
    }
}