import { Router } from "express";
import { check } from "express-validator";
import {
    postPersonal,
    getPersonales,
    getPersonalById,
    putPersonal,
    deletePersonal,
} from "./personal.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from '../middlewares/validate-jwt.js'; 

const router = Router();

router.post(
    "/",
    [
        //validateJWT,
        check("name", "The name of the unity is required").not().isEmpty(),
        check("lastName", "The name of the unity is required").not().isEmpty(),
        check("number", "The number it has to be a number is required").isNumeric(),
        check("unidadId", "The id of unidad Id is required").not().isEmpty(),
        check("unidadId", "The unidadId it has to be a mongo is valid").isMongoId(),
        validarCampos,
    ],
    postPersonal
);

router.get(
    "/",
    //validateJWT,
    getPersonales
);

router.get(
    "/:id",
    [
        //validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    getPersonalById
);

router.put(
    "/:id",
    [
        //validateJWT,
        check("number", "The number it has to be a number is required").isNumeric(),
        check("unidadId", "The unidadId it has to be a mongo is valid").isMongoId(),
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    putPersonal
);

router.delete(
    "/:id",
    [
        //validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    deletePersonal
);

export default router;
