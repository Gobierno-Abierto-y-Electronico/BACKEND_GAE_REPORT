import mongoose, { Schema, model } from 'mongoose';

const ReporteSchema = new Schema({
    fecha: {
        type: Date,
        required: true,
        unique: true
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ReporteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Reporte', ReporteSchema);
