import mongoose, { Schema, model } from 'mongoose';

const ReporteSchema = new Schema(
    {
        reportes: [
            {
                name: String,
                lastName: String,
                number: String,
                unidadId: String,
                reason: String,
                selected: Boolean
            }
        ],
        date: { type: Date, required: true }
    },
    { timestamps: true }
);


export default model('Reporte', ReporteSchema);
