import express from 'express';
import ReclamosController from '../../controllers/ReclamosController.js';
import authUser from '../../middlewares/authUser.js';

const router = express.Router();
const reclamosController = new ReclamosController();

//---Informes
router.get('/informe',authUser([1]),reclamosController.informe);

//---Obtener todos los reclamos
router.get('/',authUser([2]),reclamosController.buscarTodos); 

//---Obtener un reclamo por ID
router.get('/:idReclamo',authUser([3]), reclamosController.buscarPorId); // ID Reclamo

//---Crear un nuevo reclamo
router.post('/',authUser([3]),reclamosController.crear); // Asunto , Descripcion , idReclamoTipo, idUsuarioCreador

//---Modificar un reclamo por ID
router.patch('/:idReclamo',authUser([3]),reclamosController.modificar); // Asunto , Descripcion , idReclamoTipo, idUsuarioCreador

//---Nueva ruta para probar el envío de correos
router.get('/test-email',reclamosController.testEnvioCorreo);


export { router };