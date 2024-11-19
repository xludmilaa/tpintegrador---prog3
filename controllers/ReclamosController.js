import ReclamosService from '../service/reclamosService.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const formatosPermitidos = ['pdf', 'csv'];

class ReclamosController {
  constructor() {
    this.reclamosService = new ReclamosService();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CORREO,
        pass: process.env.CONTRASENA
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  buscarTodos = async (req, res) => {
    try {
      const reclamos = await this.reclamosService.buscarTodos();
      res.json(reclamos);
    } catch (error) {
      console.error('Error al buscar todos los reclamos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  buscarPorId = async (req, res) => {
    try {
      const { idReclamo } = req.params;
      const reclamo = await this.reclamosService.buscarPorId(idReclamo);
      
      if (!reclamo) {
        return res.status(404).json({ message: 'Reclamo no encontrado' });
      }
      
      res.json(reclamo);
    } catch (error) {
      console.error('Error al buscar reclamo por ID:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  crear = async (req, res) => {
    try {
      const nuevoReclamo = await this.reclamosService.crear(req.body);

      // Preparar y enviar correo de notificación
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const plantillaPath = path.join(__dirname, '../utiles/plantilla.hbs');
      const plantilla = fs.readFileSync(plantillaPath, 'utf8');
      const template = handlebars.compile(plantilla);

      const correoHtml = template({
        idReclamo: nuevoReclamo.idReclamo,
        asunto: nuevoReclamo.asunto,
        descripcion: nuevoReclamo.descripcion,
        nombreUsuario: req.user ? req.user.nombre : 'Usuario',
        correoUsuario: req.user ? req.user.correoElectronico : 'No disponible'
      });

      const mailOptions = {
        from: process.env.CORREO,
        to: process.env.CORREO,
        subject: 'Nuevo Reclamo Recibido',
        html: correoHtml,
      };

      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });

      res.status(201).json({
        message: 'Reclamo creado exitosamente y notificación enviada',
        reclamo: nuevoReclamo
      });
    } catch (error) {
      console.error('Error al crear reclamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  modificar = async (req, res) => {
    try {
      const { idReclamo } = req.params;
      const datosActualizacion = req.body;
  
      console.log('Datos de actualización:', datosActualizacion);
  
      const reclamoModificado = await this.reclamosService.modificar(idReclamo, datosActualizacion);
      
      if (!reclamoModificado) {
        return res.status(404).json({ message: 'Reclamo no encontrado' });
      }
      
      // Si se actualizó el estado, enviar notificación por correo
      if (datosActualizacion.idReclamoEstado) {
        await this.enviarNotificacionActualizacionEstado(reclamoModificado);
      }
      
      res.json(reclamoModificado);
    } catch (error) {
      console.error('Error al modificar reclamo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  enviarNotificacionActualizacionEstado = async (reclamo) => {
    try {
      // Obtener la ruta correcta del archivo de plantilla
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const plantillaPath = path.join(__dirname, '..', 'utiles', 'notificacion_estado.hbs');
      
      console.log('Ruta de la plantilla:', plantillaPath); // Depuración
      
      if (!fs.existsSync(plantillaPath)) {
        throw new Error(`La plantilla no existe en la ruta: ${plantillaPath}`);
      }
  
      const plantilla = fs.readFileSync(plantillaPath, 'utf8');
      const template = handlebars.compile(plantilla);
  
      const correoHtml = template({
        idReclamo: reclamo.idReclamo,
        asunto: reclamo.asunto,
        nuevoEstado: reclamo.estadoDescripcion,
        nombreUsuario: reclamo.nombreUsuario || 'Usuario'
      });
  
      const mailOptions = {
        from: process.env.CORREO,
        to: reclamo.correoUsuario,
        subject: `Actualización de estado de su reclamo #${reclamo.idReclamo}`,
        html: correoHtml,
      };
  
      await this.transporter.sendMail(mailOptions);
      console.log(`Notificación de actualización de estado enviada para el reclamo ${reclamo.idReclamo}`);
    } catch (error) {
      console.error('Error al enviar notificación de actualización de estado:', error);
      throw error;
    }
  };

  testEnvioCorreo = async (req, res) => {
    try {
      const mailOptions = {
        from: process.env.CORREO,
        to: process.env.CORREO,
        subject: 'Prueba de envío de correo',
        text: 'Si recibes este correo, la configuración de Nodemailer está funcionando correctamente.'
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.response);
      res.status(200).json({ message: 'Correo de prueba enviado con éxito', info });
    } catch (error) {
      console.error('Error al enviar correo de prueba:', error);
      res.status(500).json({ message: 'Error al enviar correo de prueba', error: error.message });
    }
  }

  informe = async (req, res) => {
    try{
      const formato = req.query.formato;
      if(!formato || !formatosPermitidos.includes(formato)){
        return res.status(400).send({ message: 'Formato de informe inválido. Debe ser pdf o csv.' });
      }
      //se crea el informe
      const {buffer, path , headers} = await this.reclamosService.generarInforme(formato);

      //setea la cabecera
      res.set(headers)

      if (formato === 'pdf') {
        res.status(200).end(buffer);
    } else if (formato === 'csv') {
        res.status(200).download(path, (err) => {
            if (err) {
                return res.status(500).send({
                    estado:"Falla",
                    mensaje: " No se pudo generar el informe."    
                })
            }
        })
    }

    }catch (error){
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno."
            });
    }
  }
}

export default ReclamosController;