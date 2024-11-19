import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import UsersService from '../service/usersService.js';
import dotenv from 'dotenv';

dotenv.config();

const usersService = new UsersService();

const estrategiaLocal = new LocalStrategy({
    usernameField: 'correoElectronico',
    passwordField: 'contrasenia'
}, 

    async (correoElectronico, contrasenia, done) => {
    console.log('Intentando autenticar usuario:', correoElectronico);
    try {
        const user = await usersService.find(correoElectronico);
        if (!user) {
            console.log('Usuario no encontrado:', correoElectronico);
            return done(null, false, { message: 'Usuario no encontrado.' });
        }
        const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!isMatch) {
            console.log('Contraseña incorrecta para:', correoElectronico);
            return done(null, false, { message: 'Contraseña incorrecta.' });
        }
        console.log('Usuario autenticado:', user);
        return done(null, user);
    } catch (error) {
        console.error('Error en estrategia local:', error);
        return done(error);
    }
});

const estrategiaJWT = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
    console.log('Validando token JWT:', jwtPayload);
    try {
        const user = await usersService.findById(jwtPayload.id);
        if (user) {
            console.log('Usuario encontrado por JWT:', user);
            return done(null, user);
        } else {
            console.log('Usuario no encontrado para el token JWT');
            return done(null, false);
        }
    } catch (error) {
        console.error('Error en validación JWT:', error);
        return done(error, false);
    }
});

export { estrategiaLocal, estrategiaJWT };