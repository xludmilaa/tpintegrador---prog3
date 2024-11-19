import AdministradoresServices from '../service/administradoresServices.js';
import jwt from 'jsonwebtoken';

export default class AdministradoresController {
    constructor() {
        this.service = new AdministradoresServices();
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await this.service.autenticar(email, password);
            if (admin) {
                const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Credenciales inválidas' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    consultarEmpleadoCreado = async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario;
            const empleado = await this.service.consultarEmpleadoCreado(idUsuario);
            if (empleado) {
                res.status(200).json(empleado);
            } else {
                res.status(404).json({ mensaje: "Empleado no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ mensaje: "Error interno del servidor" });
        }
    }

    crearUsuarioEmpleado = async (req, res) => {
        try {
            const nuevoEmpleado = await this.service.crearUsuarioEmpleado(req.body);
            res.status(201).json(nuevoEmpleado);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear el empleado" });
        }
    }

    obtenerTodosLosEmpleados = async (req, res) => {
        try {
            const empleados = await this.service.obtenerTodosLosEmpleados();
            res.status(200).json(empleados);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener los empleados" });
        }
    }

    actualizarEmpleado = async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario;
            const empleadoActualizado = await this.service.actualizarEmpleado(idUsuario, req.body);
            res.status(200).json(empleadoActualizado);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar el empleado" });
        }
    }

    eliminarEmpleado = async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario;
            await this.service.eliminarEmpleado(idUsuario);
            res.status(204).json({
                estado: 'OK',
                mensaje: 'Empleado Eliminado'});
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar el empleado" });
        }
    }

    obtenerOficinas = async (req, res) => {
        try {
            const oficinas = await this.service.obtenerOficinas();
            res.status(200).json(oficinas);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener las oficinas" });
        }
    }

    crearOficina = async (req, res) => {
        try {
            const nuevaOficina = await this.service.crearOficina(req.body);
            res.status(201).json(nuevaOficina);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear la oficina" });
        }
    }

    actualizarOficina = async (req, res) => {
        try {
            const idOficina = req.params.idOficina;
            const oficinaActualizada = await this.service.actualizarOficina(idOficina, req.body);
            res.status(200).json(oficinaActualizada);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar la oficina" });
        }
    }

    eliminarOficina = async (req, res) => {
        try {
            const idOficina = req.params.idOficina;
            await this.service.eliminarOficina(idOficina);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ mensaje: "Error al eliminar la oficina" });
        }
    }

    agregarEmpleadoAOficina = async (req, res) => {
        try {
            const idOficina = req.params.idOficina;
            const idEmpleado = req.body.idEmpleado;
            await this.service.agregarEmpleadoAOficina(idOficina, idEmpleado);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ mensaje: "Error al agregar el empleado a la oficina" });
        }
    }

    quitarEmpleadoDeOficina = async (req, res) => {
        try {
            const idOficina = req.params.idOficina;
            const idEmpleado = req.params.idEmpleado;
            await this.service.quitarEmpleadoDeOficina(idOficina, idEmpleado);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ mensaje: "Error al quitar el empleado de la oficina" });
        }
    }
}