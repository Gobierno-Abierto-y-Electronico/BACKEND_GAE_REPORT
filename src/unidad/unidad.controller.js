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

export const getUnityById = async (req, res) => {
    const { id } = req.params;

    try {
        const unity = await Unidad.findOne({ _id: id })

        res.status(200).json({
            unity
        });
    } catch (error) {
        console.error('Error fetching unity by ID:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const putUnity = async (req, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const updatedUnity = await Unidad.findByIdAndUpdate(id, resto, { new: true })

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

export const deleteUnity = async (req, res) => {
    const { id } = req.params;

    try {
        const unity = await Unidad.findByIdAndUpdate(id, { status: false })

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

const getDepartmentNameById = async (id) => {
    try {
        const unidad = await Unidad.findById(id);
        console.log(unidad)
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




