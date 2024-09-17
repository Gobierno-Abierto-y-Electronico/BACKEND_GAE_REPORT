import Appointment from "./appointment.model.js";

export const createAppointment = async( req, res) =>{
    const {idPatient, idPhycologist, date, notes, createdAt} = req.body;

    try {
        const newAppintment = new Appointment({
            idPatient, 
            idPhycologist, 
            date, 
            notes, 
            createdAt
        });

        await newAppintment.save();

        res.status(200).json(
            newAppintment
        )
    } catch (e) {
        res.status(500).json({
            msg: 'server error',
            e
        })
    }
}

export const getAppointmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id).populate('idPatient').populate('idPhycologist');

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (e) {
        res.status(500).json({
            msg: 'Server error',
            e
        });
    }
};

export const rescheduleAppointment = async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment.date = date;
        await appointment.save();

        res.status(200).json(appointment);
    } catch (e) {
        res.status(500).json({
            msg: 'Server error',
            e
        });
    }
};