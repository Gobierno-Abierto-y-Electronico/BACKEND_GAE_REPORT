import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({

    idPatient: {
        type: String,
        //ref: 'User',
        required: true,
    },

    idPhycologist: {
        type: String,
       // ref: 'User',
        required: true,
    },

    date: { //Para resivir la fecha de la cita uwu
        type: Date,
        required: true,
    },

    notes: { //por si quiere mandar un comentario con la solicitud
        type: String,
    },

    status: {
        type: Boolean,
        default: true,
    },

    createdAt: { // fecha de solicitud
        type: Date,
        default: Date.now,
    }
});

appointmentSchema.methods.toJSON = function() {
    const { __v, _id, ...appointment } = this.toObject();
    appointment.appointment_id = _id;
    return appointment;
};

export default mongoose.model('appointment', appointmentSchema);