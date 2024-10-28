import { response, request } from "express";
import Unidad from "./unidad.model.js";
import exceljs from 'exceljs';

export const postUnity = async (req, res) => {
    const { nameUnity, numberOfWorkers } = req.body;
    const Unity = new Unidad({ nameUnity, numberOfWorkers });

    try {
        await Unity.save();
        res.status(201).json({
            msg: "Unity created successfully: ",
            Unity
        });

    } catch (error) {
        res.status(500).json({
            error,
            error: 'Internal server error'
        });
    }
};

export const getUnitsUpdatedToday = async (req, res = response) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const units = await Unidad.find({
            dateOfReportByUnity: { $gte: startOfDay, $lte: endOfDay },
            status: true
        });

        res.status(200).json({
            units
        });
    } catch (error) {
        console.error('Error fetching units updated today:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getUnits = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        const [total, units] = await Promise.all([
            Unidad.countDocuments(query),
            Unidad.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            units
        });
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getUnityByName = async (req, res) => {
    const { nameUnity } = req.params;

    try {
        const unity = await Unidad.findOne({ nameUnity });

        if (!unity) {
            return res.status(404).json({
                error: 'Unity not found'
            });
        }

        res.status(200).json({
            unity
        });
    } catch (error) {
        console.error('Error fetching unity by name:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const putUnityByName = async (req, res) => {
    const { nameUnity } = req.params;
    const { ...resto } = req.body;

    try {
        const updatedUnity = await Unidad.findOneAndUpdate({ nameUnity }, resto, { new: true });

        if (!updatedUnity) {
            return res.status(404).json({
                error: 'Unity not found'
            });
        }

        res.status(200).json({
            msg: 'Updated Unity!!',
            unity: updatedUnity
        });
    } catch (error) {
        console.error('Error updating unity:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const deleteUnityByName = async (req, res) => {
    const { nameUnity } = req.params;

    try {
        const unity = await Unidad.findOneAndUpdate({ nameUnity }, { status: false });

        if (!unity) {
            return res.status(404).json({
                error: 'Unity not found'
            });
        }

        res.status(200).json({
            msg: 'Unity successfully removed',
            unity,
        });
    } catch (error) {
        console.error('Error deleting unity:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

const getDepartmentNameByName = async (nameUnity) => {
    try {
        const unidad = await Unidad.findOne({ nameUnity });
        console.log(unidad);
        return unidad ? unidad.nameUnity : 'Unknown Department';
    } catch (error) {
        console.error('Error fetching department name:', error);
        return 'Error';
    }
};


export const generarExcel = async (req, res) => {
    const { listado } = req.body;

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Informe de personal');

    worksheet.addRow(['Nombre', 'Apellido', 'Numero', 'Departamento', 'Asistencia', 'Razón']);

    for (const personal of listado) {
        const { name, lastName, number, unidadId, selected, reason } = personal;
        const departmentName = await getDepartmentNameById(unidadId);
        worksheet.addRow([name, lastName, number, departmentName, selected ? 'No Asistió' : 'Asistió', reason]);
    }

    worksheet.columns.forEach(column => {
        column.width = 25;
    });

    try {
        // Guardar el archivo en memoria y enviarlo como descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="listado.xlsx"');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({
            error: 'Error al generar el archivo de Excel'
        });
    }
};




