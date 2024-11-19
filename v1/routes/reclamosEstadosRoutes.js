import express from 'express';
import ReclamosEstadosController from '../../controllers/ReclamosEstadosController.js';
import authUser from '../../middlewares/authUser.js';

const router = express.Router();
const reclamosEstadosController = new ReclamosEstadosController();

//---Definir rutas
router.get('/', authUser([1]), reclamosEstadosController.buscarTodos);// Ruta para obtener todos los estados
router.get('/:idReclamosEstado', reclamosEstadosController.buscarPorId) // ID
router.post('/', authUser([1]), reclamosEstadosController.crear);      // Descripcion / activo
router.patch('/:idReclamoEstado', authUser([1]), reclamosEstadosController.modificar); // id | descripcion | activo
router.delete('/delete/reclamoEstado/:idReclamoEstado', authUser([1]), reclamosEstadosController.eliminar); // idReclamoEstado

//---Exportar el router
export { router };