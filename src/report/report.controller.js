import Reporte from './report.model.js';

// Configurar `trust proxy` si usas un proxy inverso
import express from 'express';
const app = express();
app.set('trust proxy', true);

export const storeReporteData = async (req, res) => {
    const { records } = req.body;

    if (!records || records.length === 0) {
        return res.status(400).json({ error: 'No hay registros para almacenar' });
    }

    try {
        // Obtener la IP del cliente desde el encabezado X-Forwarded-For
        let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Si hay múltiples IPs (en caso de proxies), tomamos la primera
        if (clientIp.includes(',')) {
            clientIp = clientIp.split(',')[0].trim();
        }

        console.log('IP cliente detectada:', clientIp);

        // Aquí continúa tu lógica para almacenar los registros
        // Agregar la IP del cliente a cada registro
        records.forEach((record) => {
            record.ip = clientIp;
        });

        // Resto de tu lógica...
        res.status(200).json({ msg: 'Registros procesados', ip: clientIp });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
