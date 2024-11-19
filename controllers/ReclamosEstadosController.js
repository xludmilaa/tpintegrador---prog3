import ReclamosEstadosService from "../service/ReclamosEstadosService.js";

export default class ReclamosEstadosController {
    constructor() {
        this.service = new ReclamosEstadosService();
    }

     // Método para buscar todos los estados de reclamos
     buscarTodos = async (req, res) => {
        try {
            const reclamosEstados = await this.service.buscarTodos();
            res.status(200).send(reclamosEstados);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                estado: "Falla",
                mensaje: "Error interno en servidor."
            });
        }
    }

    buscarPorId = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id){
                return res.status(400).send({
                    estado: "Falla",
                    mensaje: "Se requiere el ID del estado de reclamo."
                });
            }
            await this.service.buscarPorId(id);
            res.status(200).send({
                estado: "Exito",
                mensaje: "Estado de reclamo encontrado."
            });
            } catch (error) {
                console.log(error);
                res.status(500).send({
                    estado: "Falla",
                    mensaje: "Error interno en servidor."
                });
            };
        };

        
        

    // Método para crear un nuevo estado de reclamo
    crear = async (req, res) => {
        const { descripcion, activo } = req.body;

        // Verificar que se haya proporcionado la descripción
        if (!descripcion) {
            return res.status(400).send({
                estado: "Falla",
                mensaje: "Se requiere el campo descripción."    
            });
        }

        // Verificar que se haya proporcionado el estado activo
        if (activo === undefined || activo === null) {
            return res.status(400).send({
                estado: "Falla",
                mensaje: "Se requiere el campo activo."    
            });
        }

        try {
            const reclamoEstado = {
                descripcion, 
                activo
            };

            const nuevoReclamoEstado = await this.service.crear(reclamoEstado);
            res.status(201).send({
                estado: "OK",
                data: nuevoReclamoEstado
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({
                estado: "Falla",
                mensaje: "Error interno en servidor."
            });
        }
    }

    modificar = async (req, res) => {
        const { descripcion, activo } = req.body;
        const  idReclamoEstado = req.params.idReclamoEstado;

        if (!descripcion || activo === undefined) {
            return res.status(400).json({ mensaje: "Debe proporcionar la descripción y el estado" });        
        }
        try {

        await this.service.modificar(idReclamoEstado, descripcion, activo)
        res.status(200).send({
            estado: "OK",
            mensaje: "El estado de reclamo ha sido modificado exitosamente."
        });
        } catch (err) {
            res.status(500).json({ mensaje: "Error Interno "});
        }
    };

    eliminar = async (req, res) => {
        try {
            const idReclamoEstado = req.params.idReclamoEstado;
            if (idReclamoEstado === undefined) {
                res.status(400).send({ 
                    estado: 'Falla',
                    mensaje: "Debe proporcionar el id del estado de reclamo." });
            }
            await this.service.eliminar(idReclamoEstado);
            res.status(200).json({
                estado: "OK",
                mensaje: "El estado de reclamo ha sido eliminado exitosamente."});
        } catch (error) {
            res.status(500).json({ mensaje: "Error interno" });
        }
    };
}
