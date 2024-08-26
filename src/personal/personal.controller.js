import { response, request } from "express";
import Personal from "./personal.model.js";
import Unidad from '../unidad/unidad.model.js';

export const postPersonal = async (req, res) => {
    const { name, lastName, number, unidadId } = req.body;
    const personal = new Personal({ name, lastName, number, unidadId });

    try {
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

export const getPersonales = async (req = request, res = response) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
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

export const getPersonalById = async (req, res) => {
    const { start, end } = req.query;
    const { id } = req.params;
    const query = { status: true, unidadId: id};

    try {
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

export const putPersonal = async (req, res = response) => {
    const { id } = req.params;
    const { ...resto } = req.body;

    try {
        const updatedPersonal = await Personal.findByIdAndUpdate(id, resto, { new: true })

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

export const deletePersonal = async (req, res) => {
    const { id } = req.params;

    try {
        const personal = await Personal.findByIdAndUpdate(id, { status: false })

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
