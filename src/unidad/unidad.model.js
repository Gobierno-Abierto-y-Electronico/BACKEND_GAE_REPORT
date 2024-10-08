import { Schema, model } from "mongoose";

const UnidadSchema = Schema({
    nameUnity: {
        type: String,
        required: [true, 'Name is necessary']
    },
    numberOfWorkers: {
        type: Number,
        required: [true, 'number of workers is necessary']
    },
    full: {
        type: Boolean,
        default: false
    },
    report: {
        type: Boolean,
        default: false
    },
    dateOfReportByUnity: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    }
});

export default model('Unidad', UnidadSchema);
