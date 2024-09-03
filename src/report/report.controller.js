import Reporte from './report.model.js';

export const storeReporteData = async (req, res) => {
    const { listado, fecha } = req.body;
    console.log(listado, "listado backend");
    console.log(fecha, "fecha backend");

    try {
        const fechaParsed = new Date(fecha);

        let reporte = await Reporte.findOne({ fecha: fechaParsed });

        if (reporte) {
            reporte.reportes = [...reporte.reportes, ...listado];
            await reporte.save();
        } else {
            reporte = new Reporte({
                fecha: fechaParsed,
                reportes: listado
            });
            await reporte.save();
        }

        res.status(200).json({
            msg: 'Reporte almacenado correctamente',
            data: reporte
        });
    } catch (error) {
        console.error('Error al almacenar el reporte:', error);
        res.status(500).json({
            error: 'Error al almacenar el reporte'
        });
    }
};


export const getReporteData = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const reporte = await Reporte.findOne({
            createdAt: { $gte: today, $lt: tomorrow }
        }).sort({ createdAt: -1 }).exec();

        if (!reporte) {
            return res.status(404).json({ message: 'No se encontró ningún reporte para hoy' });
        }

        res.status(200).json(reporte);
    } catch (error) {
        console.error('Error al obtener el reporte:', error);
        res.status(500).json({ message: 'Error al obtener el reporte' });
    }
};

