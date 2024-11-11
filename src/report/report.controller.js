import Reporte from './report.model.js';

export const storeReporteData = async (req, res) => {
    const { name, lastName, number, unidadId, reason, selected, date } = req.body;
    console.log(name, lastName, number, unidadId, reason, selected, date, "registro de asistencia backend");

    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    try {
        let reporte = await Reporte.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        const nuevoRegistro = { name, lastName, number, unidadId, reason, selected };

        if (reporte) {
            reporte.reportes.push(nuevoRegistro);
        } else {
            reporte = new Reporte({
                date: startOfDay,
                reportes: [nuevoRegistro]
            });
        }

        await reporte.save();

        res.status(200).json({
            msg: 'Registro de asistencia almacenado correctamente',
            data: reporte
        });
    } catch (error) {
        console.error('Error al almacenar el registro de asistencia:', error);
        res.status(500).json({
            error: 'Error al almacenar el registro de asistencia'
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
