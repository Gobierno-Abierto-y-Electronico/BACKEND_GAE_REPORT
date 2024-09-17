import Reporte from './report.model.js';

export const storeReporteData = async (req, res) => {
    const { listado } = req.body;
    console.log(listado, "listado backend");

<<<<<<< HEAD
    try {
        let reporte = await Reporte.findOne();

        if (reporte) {
=======
    const today = new Date().toISOString().split('T')[0];

    try {

        let reporte = await Reporte.findOne({
            createdAt: {
                $gte: new Date(today),
                $lt: new Date(today + 'T23:59:59.999Z')
            }
        });

        if (reporte) {
           
>>>>>>> origin/master
            reporte.reportes = [...reporte.reportes, ...listado];
            await reporte.save();
        } else {
            reporte = new Reporte({
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
