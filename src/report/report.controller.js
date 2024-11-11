import Reporte from './report.model.js';

export const storeReporteData = async (req, res) => {
    const { records } = req.body; // Recibir el arreglo de registros del frontend
    if (!records || records.length === 0) {
        return res.status(400).json({ error: 'No hay registros para almacenar' });
    }

    try {
        // Convertir la fecha de los registros a inicio y fin del día
        const startOfDay = new Date(records[0].date + 'T00:00:00.000Z');
        const endOfDay = new Date(records[0].date + 'T23:59:59.999Z');

        // Buscar el reporte para el día específico
        let reporte = await Reporte.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });

        // Si el reporte no existe, crearlo
        if (!reporte) {
            reporte = new Reporte({
                date: startOfDay,
                reportes: [], // Iniciar un array vacío si el reporte no existe
            });
        }

        // Agregar los registros al reporte
        records.forEach((record) => {
            const nuevoRegistro = {
                user: record.user,
                date: record.date,
                time: record.time,
                status: record.status,
                ip: record.ip,
            };
            // Si el reporte ya existe, solo agregar los registros
            reporte.reportes.push(nuevoRegistro);
        });

        // Guardar el reporte con los nuevos registros
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



// Obtener el último reporte
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
