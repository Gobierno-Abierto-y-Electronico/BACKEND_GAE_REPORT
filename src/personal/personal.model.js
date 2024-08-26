import mongoose, { Schema, model } from 'mongoose';

const PersonalSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is necessary']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is necessary']
    },
    number: {
        type: Number,
        required: [true, 'number of the personal is necessary'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    unidadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unidad',
        required: [true, "Enter a valid unidadId"]
    },
});

export default model('Personal', PersonalSchema);
