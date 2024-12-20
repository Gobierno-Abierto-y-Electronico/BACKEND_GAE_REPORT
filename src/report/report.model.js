import mongoose, { Schema, model } from 'mongoose';

const ReporteSchema = new Schema({
    reportes: [
        {
            name: String,
            date: String,
            time: String,
            status: String,
            reason: { type: String, required: false },
            ip: String
        }
    ],
    date: {
        type: Date,
        required: true
    },
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
