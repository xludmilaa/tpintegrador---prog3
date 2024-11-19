import { conexion } from '../database/conexion.js';
import bcrypt from 'bcryptjs';

export default class UsersService {
    async find(email) {
        try {
            const [rows] = await conexion.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [email]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            console.log('Buscando usuario por ID:', id);
            const [rows] = await conexion.query('SELECT * FROM usuarios WHERE idUsuario = ?', [id]);
            if (rows.length === 0) {
                console.log('Usuario no encontrado para ID:', id);
                return null;
            }
            console.log('Usuario encontrado:', rows[0]);
            return rows[0];
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    }

    async create(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.contrasenia, 10);
            const [result] = await conexion.query(
                'INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo) VALUES (?, ?, ?, ?, ?)',
                [userData.nombre, userData.apellido, userData.correoElectronico, hashedPassword, userData.idUsuarioTipo]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async update(id, userData) {
        try {
            const [result] = await conexion.query(
                'UPDATE usuarios SET nombre = ?, apellido = ?, correoElectronico = ? WHERE idUsuario = ?',
                [userData.nombre, userData.apellido, userData.correoElectronico, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const [result] = await conexion.query('DELETE FROM usuarios WHERE idUsuario = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }

    async changePassword(id, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const [result] = await conexion.query(
                'UPDATE usuarios SET contrasenia = ? WHERE idUsuario = ?',
                [hashedPassword, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            throw error;
        }
    }
}