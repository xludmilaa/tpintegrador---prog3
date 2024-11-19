import express from "express";
import AdminReclamosTipoController from '../../controllers/adminReclamosTipoController.js';
import authUser from '../../middlewares/authUser.js';


const router = express.Router();
const adminReclamosTipoController = new AdminReclamosTipoController();


router.get('/',authUser([2]), adminReclamosTipoController.obtenerTodos); // Funcionando

router.get('/:idReclamosTipo',authUser([2]), adminReclamosTipoController.obtenerPorId); // Funcionando (Id)

router.post('/',authUser([1]), adminReclamosTipoController.crear); // Funcionando (descripcion,activo)

router.patch('/:idReclamosTipo',authUser([1]), adminReclamosTipoController.actualizar); // Funcionando ( id, descripcion, activo)

router.patch('/delete/:idReclamosTipo',authUser([1]), adminReclamosTipoController.eliminarLogicamente); 



export { router }