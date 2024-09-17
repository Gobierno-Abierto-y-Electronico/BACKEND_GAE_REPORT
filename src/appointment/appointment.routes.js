import { Router } from "express";
import { check } from "express-validator";
import { createAppointment, getAppointmentById, rescheduleAppointment } from "./appointment.container.js";
import { validarCampos } from "../middlewares/validar-campos.js";

import { validateJWT } from "../middlewares/validate-jwt.js";

import { userByExists,
    appointmentExistsById
 } from "../helpers/db-validators.js";
const router = Router();

router.post(
    "/new",
    [
        validateJWT,
        check("idPatient", 'El id del patient es obligatorio').isMongoId().custom(userByExists),
        check("idPhycologist", 'El id del psicólogo es obligatorio').isMongoId().custom(userByExists),
        check("date", 'La fecha es obligatoria').isDate({format: 'DD-MM-YYYY'}),
        check("notes", 'Las notas son obligatorias').not().isEmpty(),
        validarCampos,
    ],
    createAppointment
);

router.get(
    "/:id",
    [
        check("id", 'El id de la cita es obligatorio').isMongoId(),
    ],
    getAppointmentById
);

router.put(
    "/reschedule/:id",
    [   
        validateJWT,
        check("id", 'El id de la cita es obligatorio').isMongoId().custom(appointmentExistsById),
        check("date", 'La nueva fecha es obligatoria').isDate({format: 'DD-MM-YYYY'}),
        validarCampos,
    ],
    rescheduleAppointment
);

export default router;
