import express from 'express';
import OficinasController from '../../controllers/oficinasController.js';
import passport from 'passport';

const router = express.Router();
const oficinasController = new OficinasController();

router.post('/login', oficinasController.login); 

//router.get('/reclamos',authUser([2]), oficinasController.listarReclamosOficina); 
//router.put('/reclamos/:idReclamo',authUser([2]), oficinasController.atenderReclamo);

//router.put('/reclamos/:idReclamo', passport.authenticate('jwt', { session: false }), oficinasController.actualizarEstadoReclamo);

//router.get('/reclamos', autenticarToken, oficinasController.listarReclamosOficina);
//router.put('/reclamos/:idReclamo', autenticarToken, oficinasController.actualizarEstadoReclamo);

export { router };