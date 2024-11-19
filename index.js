import express from 'express';
import dotenv from 'dotenv';
import validateContentType from './middlewares/validateContentType.js';
import session from 'express-session';
import passport from 'passport';

//---Rutas
import { router as v1ReclamosEstadoRouter } from './v1/routes/reclamosEstadosRoutes.js';
import { router as v1ReclamosRouter } from './v1/routes/reclamosRoutes.js';
import authRoutes from './v1/routes/authRoutes.js';
import { router as v1OficinasRouter } from './v1/routes/oficinasRoutes.js';
import { router as v1AdministradoresRouter } from './v1/routes/administradoresRoutes.js';
import { router as v1AdminReclamosTipoRouter } from './v1/routes/adminReclamosTipoRoutes.js';

//---Estrategias de Passport
import { estrategiaLocal, estrategiaJWT } from './config/passportConfig.js';

//---Configurar variables de entorno
dotenv.config();

//---Inicializar Passport con las estrategias de autenticación
passport.use('local', estrategiaLocal);
passport.use(estrategiaJWT);

const app = express();

//---Middleware para manejar formularios (parsear datos de POST)
app.use(express.urlencoded({ extended: false }));

//---Middleware para parsear JSON
app.use(express.json());

//---Middleware para validar el tipo de contenido
app.use(validateContentType);



//---Configuración de sesiones
app.use(session({
  secret: 'mi_secreto_seguro',
  resave: false,
  saveUninitialized: false
}));

//---Iniciar Passport
app.use(passport.initialize());
app.use(passport.session());

//---Definir las rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reclamosEstados',passport.authenticate('jwt' , {session:false}), v1ReclamosEstadoRouter);
app.use('/api/v1/reclamos',passport.authenticate( 'jwt', {session:false}), v1ReclamosRouter); //<-----  informe pdf
app.use('/api/v1/oficinas',passport.authenticate( 'jwt', {session:false}), v1OficinasRouter); //----- corregir
app.use('/api/v1/administradores',passport.authenticate( 'jwt', {session:false}), v1AdministradoresRouter);
app.use('/api/v1/adminReclamosTipo', v1AdminReclamosTipoRouter);



const puerto = process.env.PUERTO;
app.listen(puerto, () => {
    console.log(`Estoy escuchando en puerto ${puerto}`);
  });