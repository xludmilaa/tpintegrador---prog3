import express from "express";
import AdministradoresController from "../../controllers/administradoresController.js";
import AdminReclamosTipoController from "../../controllers/adminReclamosTipoController.js";
import authUser from '../../middlewares/authUser.js';

const router = express.Router();
const administradoresController = new AdministradoresController();
const adminReclamosTipoController = new AdminReclamosTipoController();

//---Gestionar empleados
router.get('/empleados/:idUsuario',authUser([1]), administradoresController.consultarEmpleadoCreado);
router.post('/empleados',authUser([1]), administradoresController.crearUsuarioEmpleado);
router.get('/empleados',authUser([1]), administradoresController.obtenerTodosLosEmpleados);
router.patch('/empleados/:idUsuario',authUser([1]), administradoresController.actualizarEmpleado);
router.delete('/empleados/:idUsuario',authUser([1]), administradoresController.eliminarEmpleado);

//---Gestionar tipos de reclamos
router.get('/tipos-reclamos',authUser([1]), adminReclamosTipoController.obtenerTodos);
router.get('/tipos-reclamos/:idReclamosTipo',authUser([1,2]), adminReclamosTipoController.obtenerPorId);
router.post('/tipos-reclamos',authUser([1,2]), adminReclamosTipoController.crear);
router.patch('/tipos-reclamos/:idReclamosTipo',authUser([1,2]), adminReclamosTipoController.actualizar);
router.delete('/tipos-reclamos/delete/:idReclamosTipo',authUser([1,2]), adminReclamosTipoController.eliminarLogicamente);

//---Gestionar oficinas
router.get('/oficinas',authUser([1]), administradoresController.obtenerOficinas);
router.post('/oficinas',authUser([1]), administradoresController.crearOficina);
router.patch('/oficinas/:idOficina',authUser([1]), administradoresController.actualizarOficina);
router.delete('/oficinas/:idOficina',authUser([1]), administradoresController.eliminarOficina);

//---Agregar o quitar empleados de oficinas
router.post('/oficinas/:idOficina/empleados',authUser([1]), administradoresController.agregarEmpleadoAOficina);
router.delete('/oficinas/:idOficina/empleados/:idEmpleado',authUser([1]), administradoresController.quitarEmpleadoDeOficina);

export { router };