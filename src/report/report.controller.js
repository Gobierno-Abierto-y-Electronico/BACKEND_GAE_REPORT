import Reporte from './report.model.js';

export const storeReporteData = async (req, res) => {
    const { user, date, time, status } = req.body;
    console.log(user, date, time, status, "registro de asistencia backend");

    // Convertimos la fecha recibida a un rango de inicio y fin del día.
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    try {
        // Buscamos si ya existe un reporte para la fecha enviada
        let reporte = await Reporte.findOne({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        const nuevoRegistro = { user, date, time, status };

        if (reporte) {
            // Si ya existe, añadimos el nuevo registro al reporte existente
            reporte.reportes.push(nuevoRegistro);
            await reporte.save();
        } else {
            // Si no existe, creamos un nuevo reporte para la fecha
            reporte = new Reporte({
                reportes: [nuevoRegistro],
                createdAt: startOfDay // Aquí puedes asegurar que la fecha sea la correcta
            });
            await reporte.save();
        }

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
