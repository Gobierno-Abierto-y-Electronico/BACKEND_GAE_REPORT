import Reporte from './report.model.js';

// Configurar `trust proxy` si usas un proxy inverso
import express from 'express';
const app = express();
app.set('trust proxy', true);

export const storeReporteData = async (req, res) => {
    const { records } = req.body; // Recibir el arreglo de registros del frontend
    console.log('Datos recibidos:', records); // Verificar los datos recibidos

    if (!records || records.length === 0) {
        return res.status(400).json({ error: 'No hay registros para almacenar' });
    }

    try {
        const startOfDay = new Date(records[0].date + 'T00:00:00.000Z');
        const endOfDay = new Date(records[0].date + 'T23:59:59.999Z');

        // Verificar si ya hay un registro para el usuario en este día
        const existingReport = await Reporte.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
            'reportes.user': records[0].user, // Buscar por el usuario
        });

        if (existingReport) {
            return res.status(400).json({
                error: `La asistencia ya fue registrada para el usuario ${records[0].user} en el día ${records[0].date}`,
            });
        }

        let reporte = await Reporte.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        // Si no existe un reporte para ese día, crear uno nuevo
        if (!reporte) {
            reporte = new Reporte({
                date: startOfDay,
                reportes: [],
            });
        }

        // Obtener la IP del cliente
        const clientIp = req.ip;

        // Agregar cada registro al arreglo "reportes"
        records.forEach((record) => {
            const nuevoRegistro = {
                name: record.user,
                date: record.date,
                time: record.time,
                status: record.status,
                reason: record.reason || '',
                ip: clientIp || '', // Guardar la IP del cliente
            };

            reporte.reportes.push(nuevoRegistro);
        });

        // Guardar el reporte actualizado
        await reporte.save();

        res.status(200).json({
            msg: 'Registros de asistencia almacenados correctamente',
            data: reporte,
        });
    } catch (error) {
        console.error('Error al almacenar el registro de asistencia:', error);
        res.status(500).json({
            error: 'Error al almacenar el registro de asistencia',
        });
    }
};

export const getReporteData = async (req, res) => {
    try {
        const reporte = await Reporte.findOne().sort({ createdAt: -1 }).exec();

        if (!reporte) {
            return res.status(404).json({ message: 'No se encontró ningún reporte' });
        }

        res.status(200).json(reporte);
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        res.status(500).json({ message: 'Error al obtener el reporte' });
    }
};

// Obtener el reporte de una fecha específica
export const getReporteByDate = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Por favor, proporciona una fecha válida en formato YYYY-MM-DD' });
    }

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    try {
        const reporte = await Reporte.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!reporte) {
            return res.status(404).json({ message: 'No se encontró un reporte para la fecha especificada' });
        }

        res.status(200).json(reporte);
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        res.status(500).json({ message: 'Error al obtener el reporte' });
    }
};
