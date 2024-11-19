import OficinasServices from "../service/oficinasServices.js";
import ReclamosController from './ReclamosController.js';

import jwt from 'jsonwebtoken';

export default class OficinasController {
    constructor() {
        this.service = new OficinasServices();
        this.reclamosController = new ReclamosController();
    }

    login = async (req, res) => {
        try {
            const { correoElectronico, contrasenia } = req.body;
            console.log('Intento de login para:', correoElectronico);
            const empleado = await this.service.autenticar(correoElectronico, contrasenia);
            if (empleado) {
                const token = jwt.sign(
                    { id: empleado.idUsuario, email: empleado.correoElectronico, role: 'empleado' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                console.log('Token generado para empleado:', empleado.idUsuario);
                res.json({ token, empleado: { ...empleado, contrasenia: undefined } });
            } else {
                res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    }

    atenderReclamo = async (req, res) => {
        try {
            const { idReclamo } = req.params;
            const { nuevoEstado } = req.body;
            const idEmpleado = req.user.id || req.user.idUsuario;
            console.log('Atendiendo reclamo. ID Empleado:', idEmpleado, 'ID Reclamo:', idReclamo, 'Nuevo Estado:', nuevoEstado);
      
            const reclamoActualizado = await this.service.atenderReclamo(idReclamo, nuevoEstado, idEmpleado);
            
            // Enviar notificación de actualización de estado
            await this.reclamosController.enviarNotificacionActualizacionEstado(reclamoActualizado);
            
            res.json(reclamoActualizado);
        } catch (error) {
            console.error('Error al atender el reclamo:', error);
            res.status(500).json({ message: 'Error al atender el reclamo', error: error.message });
        }
    }

    listarReclamosOficina = async (req, res) => {
        try {
            console.log('Usuario en req:', req.user);
            const idEmpleado = req.user.idUsuario;
            console.log('ID del empleado para listar reclamos:', idEmpleado);
            
            if (!idEmpleado) {
                console.log('ID de empleado no encontrado en el token');
                return res.status(401).json({ message: 'Usuario no autenticado correctamente' });
            }

            const reclamos = await this.service.listarReclamosOficina(idEmpleado);
            console.log(`Reclamos obtenidos para empleado ${idEmpleado}:`, reclamos.length);
            res.status(200).send(reclamos); 
        } catch (error) {
            console.error('Error al listar los reclamos:', error);
            res.status(500).json({ message: 'Error al listar los reclamos', error: error.message });
        }
    }
}