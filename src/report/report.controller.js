import Reporte from './report.model.js';
import express from 'express';

const app = express();
app.set('trust proxy', true); // Configurar para manejar proxies

export const storeReporteData = async (req, res) => {
    const { records } = req.body;

    // Validación de datos
    if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ error: 'No hay registros para almacenar' });
    }

    try {
        const startOfDay = new Date(records[0].date + 'T00:00:00.000Z');
        const endOfDay = new Date(records[0].date + 'T23:59:59.999Z');

        // Verificar si ya existe un reporte para el usuario en el día
        const existingReport = await Reporte.findOne({
            date: { $gte: startOfDay, $lt: endOfDay },
            'reportes.user': records[0].user,
        });

        if (existingReport) {
            return res.status(400).json({
                error: `La asistencia ya fue registrada para el usuario ${records[0].user} en el día ${records[0].date}`,
            });
        }

        // Verificar si existe un reporte para el día
        let reporte = await Reporte.findOne({
            date: { $gte: startOfDay, $lt: endOfDay },
        });

        if (!reporte) {
            reporte = new Reporte({ date: startOfDay, reportes: [] });
        }

        // Obtener la IP real del cliente
        let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        if (clientIp.includes(',')) {
            clientIp = clientIp.split(',')[0].trim();
        }
        if (clientIp.startsWith('::ffff:')) {
            clientIp = clientIp.split(':').pop(); // Convierte a IPv4
        }
        if (clientIp === '::1' || clientIp === '127.0.0.1') {
            clientIp = 'IP Local';
        }

        console.log('IP del cliente:', clientIp);

        // Agregar registros al reporte
        records.forEach((record) => {
            const nuevoRegistro = {
                name: record.user,
                date: record.date,
                time: record.time,
                status: record.status,
                reason: record.reason || '',
                ip: clientIp,
            };

            reporte.reportes.push(nuevoRegistro);
        });

        await reporte.save();

        res.status(200).json({
            msg: 'Registros de asistencia almacenados correctamente',
            clientIp, // Incluye la IP del cliente en la respuesta para depuración
            data: reporte,
        });
    } catch (error) {
        console.error('Error al almacenar el registro de asistencia:', error.message, error.stack);
        res.status(500).json({ error: 'Error al almacenar el registro de asistencia' });
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
        console.error('Error al obtener el reporte:', error.message, error.stack);
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
        console.error('Error al obtener el reporte:', error.message, error.stack);
        res.status(500).json({ message: 'Error al obtener el reporte' });
    }
};
