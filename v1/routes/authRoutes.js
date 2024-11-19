import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UsersService from '../../service/usersService.js';

const router = express.Router();
const usersService = new UsersService();

const logRequest = (req, res, next) => {
  console.log('Solicitud recibida en ruta de autenticación:', req.method, req.originalUrl);
  next();
};

router.post('/login', logRequest, (req, res, next) => {
  console.log('Cuerpo de la solicitud de login:', req.body);
  
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error en autenticación:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
    if (!user) {
      console.log('Autenticación fallida:', info.message);
      return res.status(401).json({ message: info.message });
    }

    const token = jwt.sign(
      { 
        id: user.idUsuario,
        email: user.correoElectronico
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Token generado:', token);
    return res.json({ token });
  })(req, res, next);
});

router.post('/register', logRequest, async (req, res) => {
  console.log('Cuerpo de la solicitud de registro:', req.body);
  const { nombre, apellido, correoElectronico, contrasenia, idUsuarioTipo } = req.body;

  if (!nombre || !apellido || !correoElectronico || !contrasenia || !idUsuarioTipo) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const existingUser = await usersService.find(correoElectronico);
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const nuevoUsuario = await usersService.create({
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idUsuarioTipo,
      imagen: null
    });

    console.log('Usuario creado:', nuevoUsuario);
    res.status(201).json({ message: 'Usuario creado con éxito', usuario: nuevoUsuario });

  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error interno en el servidor.' });
  }
});

router.get('/perfil', logRequest, passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Usuario autenticado:', req.user);
  res.json({
    message: 'Perfil de usuario',
    user: req.user
  });
});

export default router;