import { response, request } from "express";
import Personal from "./personal.model.js";

// Función para crear un nuevo registro de Personal
export const postPersonal = async (req, res) => {
    const { name, lastName, number, reason, unidadId } = req.body;
    const ipCliente = req.ip || req.connection.remoteAddress; // Capturar la IP del cliente

    // Crear un nuevo objeto de Personal con los datos proporcionados y la IP
    const personal = new Personal({ name, lastName, number, reason, unidadId, ip: ipCliente });

    try {
        // Guardar el nuevo registro de personal en la base de datos
        await personal.save();
        res.status(201).json({
            msg: "Personal created successfully: ",
            personal
        });
    } catch (error) {
        res.status(500).json({
            error
        });
    }
};

// Función para obtener todos los registros de Personal
export const getPersonales = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        // Obtener el total de registros y los registros de personal con paginación
        const [total, personales] = await Promise.all([
            Personal.countDocuments(query),
            Personal.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            personales
        });
    } catch (error) {
        console.error('Error fetching personales:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Función para obtener los registros de Personal por unidad
export const getPersonalById = async (req, res) => {
    const { start, end } = req.query;
    const { id } = req.params;
    const query = { status: true, unidadId: id};

    try {
        // Obtener el total de registros y los registros de personal por unidad con paginación
        const [total, personales] = await Promise.all([
            Personal.countDocuments(query),
            Personal.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            personales
        });
    } catch (error) {
        console.error('Error fetching personales:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Función para actualizar un registro de Personal
export const putPersonal = async (req, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    const ipCliente = req.ip || req.connection.remoteAddress; // Capturar la IP del cliente

    try {
        // Actualizar el registro de personal con los nuevos datos, incluida la IP
        const updatedPersonal = await Personal.findByIdAndUpdate(
            id, 
            { ...resto, ip: ipCliente }, // Actualizar la IP junto con los otros datos
            { new: true }
        );

        res.status(200).json({
            msg: 'Updated Personal!!',
            unity: updatedPersonal
        });
    } catch (error) {
        console.error('Error updating unity:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

// Función para eliminar un registro de Personal (marcar como inactivo)
export const deletePersonal = async (req, res) => {
    const { id } = req.params;

    try {
        // Marcar el personal como inactivo
        const personal = await Personal.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            msg: 'Personal successfully removed',
            personal,
        });
    } catch (error) {
        console.error('Error deleting personal:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};
