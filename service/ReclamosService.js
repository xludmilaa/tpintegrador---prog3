import Reclamos from "../database/Reclamos.js";
import InformeService from './informesServices.js';

export default class ReclamosService {
    constructor() {
        this.reclamos = new Reclamos();
        this.informes = new InformeService();

    }

    buscarTodos = () => {
        return this.reclamos.buscarTodos();
    }

    buscarPorId = async (idReclamo) => {
        console.log("Buscando reclamo por ID en el servicio:", idReclamo);
        return this.reclamos.buscarPorId(idReclamo);
    }
    
    crear = (reclamo) => {
        return this.reclamos.crear(reclamo);
    }

    modificar = async (idReclamo, datos) => {
        console.log("Modificando reclamo en el servicio. ID:", idReclamo, "Datos:", datos);
        
        try {
            //---obtener el reclamo actual
            const reclamoActual = await this.reclamos.buscarPorId(idReclamo);
            
            if (!reclamoActual) {
                console.log("Reclamo no encontrado para modificar");
                return null;
            }

            //---Combinar los datos actuales con los nuevos datos
            const datosActualizados = { ...reclamoActual, ...datos };

            //---Asegurarse de que no estamos intentando modificar campos que no deberían cambiar
            delete datosActualizados.idReclamo;
            delete datosActualizados.fechaCreado;
            delete datosActualizados.fechaFinalizado;
            delete datosActualizados.fechaCancelado;

            //---Si idReclamoEstado no está en los datos nuevos, mantener el valor actual
            if (!datos.hasOwnProperty('idReclamoEstado')) {
                datosActualizados.idReclamoEstado = reclamoActual.idReclamoEstado;
            }

            console.log("Datos actualizados para enviar a la base de datos:", datosActualizados);

            //---Llamar al método modificar de la clase Reclamos con los datos actualizados
            const resultado = await this.reclamos.modificar(idReclamo, datosActualizados);
            
            console.log("Resultado de la modificación:", resultado);
            return resultado;
        } catch (error) {
            console.error("Error al modificar reclamo en el servicio:", error);
            throw error;
        }
    }

    atender = () => {
        //---Implementa la lógica para atender un reclamo si es necesario
    }

    generarInforme = async (formato) => {
        if (formato === 'pdf'){
            return await this.reportePDF();
        }else if (formato === 'csv'){
            return await this.reporteCSV();
        }
    }
    reportePDF = async () => {
        const datosReporte = await this.reclamos.buscarDatosReportePdf();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para armar el reporte' }
        }

        const pdf = await this.informes.informeReclamosPDF(datosReporte)

        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        }
    }
    reporteCSV = async () => {

        const datosReporte = await this.reclamos.buscarDatosReporteCsv();

        if (!datosReporte || datosReporte.lenght === 0) {
            return { estado: false, mensaje: 'Sin datos para armar el reporte' }
        }

        const csv = await this.informes.informeReclamosCSV(datosReporte);

        return {
            path: csv,
            header: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="reporte.csv"'
            }
        }
    }
}