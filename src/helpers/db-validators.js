    import User from '../user/user.model.js';
    import Appointment from "../appointment/appointment.model.js";
    import Forum from '../forum/forum.model.js';

    export const existUsername = async (username = '') => {

        const user = await User.findOne({ username });

        if (user) {

            throw new Error(`The username ${username} is already taken`);
        }
    }

    export const findUsername = async (username = '') => {

        const user = await User.findOne({ username });

        if (!user) {
            
            throw new Error(`The username ${username} does not exist`);
        }
    };

    export const existeEmail = async (email = '') => {

        const user = await User.findOne({ email });
        
        if (user) {

            throw new Error(`The email ${email} is already taken`);
        }
    }

    export const existNoteById = async (id = '') => {

        const note = await Note.findById(id);

        if (!note) {

            throw new Error(`The note with id ${id} does not exist`);
        }
    };


    export const isStatusValid = (status = true) => {

        if (status === false) {

            throw new Error('Status cannot be false');
        }
    }

    export const existForum = async (foro = '') => {
        
        const forum = await Forum.findOne({ foro });
        
        if(forum){
            throw new Error(`The forum ${foro} is already exist`);
        }
        
    }

    export const userByExists = async (id = "") => {
        const user = await User.findById(id);
        if (!user) {
            throw new Error(`El usuario con el ID ${id} no existe`);
        }
    };

    export const appointmentExistsById = async (id = "") => {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            throw new Error(`La cita con el ID ${id} no existe`);
        }
    };