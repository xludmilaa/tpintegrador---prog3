import AdminReclamosTipoServices from '../service/adminReclamosTipoServices.js';


export default class AdminReclamosTipoController {
    constructor () {
        this.service = new AdminReclamosTipoServices();
    }

    
    obtenerTodos = async (req, res) => {
        try {
            const tiposReclamos = await this.service.obtenerTodos();
            console.log(tiposReclamos); 
            res.status(200).json(tiposReclamos);
        } catch (error) {
            console.error(error); 
            res.status(500).json({ mensaje: "Error interno." });
        }
    }

    //----------------------------------------------------------------

    obtenerPorId = async (req, res) => {
        try {
            const id = req.params.idReclamosTipo;
            const tipoReclamo = await this.service.obtenerPorId(id);

            if (tipoReclamo.length === 0) {
                return res.status(404).json({ mensaje: "Tipo de reclamo no encontrado." });
            }

            res.status(200).json(tipoReclamo);
        } catch (err) {
            res.status(500).json({ mensaje: "Error interno." });
        }
    }

    //----------------------------------------------------------------

    crear = async (req, res) => {
        try {
            const { descripcion, activo } = req.body;
            if (!descripcion || activo === undefined) {
                return res.status(400).json({ mensaje: "Faltan campos requeridos." });
            }

            await this.service.crearTipo(descripcion, activo);
            res.status(201).json({ mensaje: "Tipo de reclamo creado." });
        } catch (err) {
            res.status(500).json({ mensaje: "Error interno." });
            console.log(err)
        }
    }

    //----------------------------------------------------------------

    actualizar = async (req, res) => {
        try {
            const { descripcion, activo } = req.body;
            const id = req.params.idReclamosTipo;

            if (!descripcion || activo === undefined) {
                return res.status(400).json({ mensaje: "Faltan campos requeridos." });
            }

            await this.service.actualizarTipo(id, descripcion, activo);
            res.status(200).json({ mensaje: "Tipo de reclamo actualizado." });
        } catch (err) {
            res.status(500).json({ mensaje: "Error interno." });
        }
    }

    //----------------------------------------------------------------

    eliminarLogicamente = async (req, res) => {
        try {
            const id = req.params.idReclamosTipo;
            await this.service.eliminarTipo(id);
            res.status(200).json({ mensaje: "Tipo de reclamo eliminado lógicamente." });
        } catch (err) {
            res.status(500).json({ mensaje: "Error interno." });
        }
    }
    
} 