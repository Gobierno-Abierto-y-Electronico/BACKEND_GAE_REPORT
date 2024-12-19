/* import Reporte from './report.model.js';
import express from 'express';

const app = express();
app.set('trust proxy', true); // Configurar para manejar proxies
 */
import Reporte from './report.model.js';
import express from 'express';

const app = express();
app.set('trust proxy', 1); // Configurar correctamente el nivel de proxy

export const storeReporteData = async (req, res) => {
    const { user, date, time, status, reason, ip } = req.body;

    if (!user || !date || !time || !status) {
        return res.status(400).json({ error: "Faltan datos requeridos para registrar la asistencia" });
    }

    try {
        // Valida si ya existe un registro para el mismo usuario y día
        const startOfDay = new Date(date + 'T00:00:00.000Z');
        const endOfDay = new Date(date + 'T23:59:59.999Z');

        const existingReport = await Reporte.findOne({
            date: { $gte: startOfDay, $lt: endOfDay },
            'reportes.user': user,
        });

        if (existingReport) {
            return res.status(400).json({ error: `Ya existe un registro para el usuario ${user} en el día ${date}` });
        }

        // Crea el nuevo registro
        const nuevoRegistro = {
            user,
            date,
            time,
            status,
            reason: reason || "",
            ip: ip || "IP no disponible",
        };

        let reporte = await Reporte.findOne({ date: { $gte: startOfDay, $lt: endOfDay } });
        if (!reporte) {
            reporte = new Reporte({ date: startOfDay, reportes: [] });
        }

        reporte.reportes.push(nuevoRegistro);
        await reporte.save();

        res.status(200).json({
            msg: "Asistencia registrada correctamente",
            data: nuevoRegistro,
        });
    } catch (error) {
        console.error("Error al registrar la asistencia:", error);
        res.status(500).json({ error: "Error interno del servidor" });
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
