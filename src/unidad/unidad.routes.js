import { Router } from "express";
import { check } from "express-validator";
import {
    postUnity,
    getUnits,
    getUnityById,
    putUnity,
    deleteUnity,
    generarExcel, 
    getUnitsUpdatedToday
} from "./unidad.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from '../middlewares/validate-jwt.js'; 

const router = Router();

router.post(
    "/",
    [
        //validateJWT,
        check("nameUnity", "The name of the unity is required").not().isEmpty(),
        check("numberOfWorkers", "The number of workers is required").not().isEmpty(),
        validarCampos,
    ],
    postUnity
);

router.get(
    "/",
    //validateJWT,
    getUnits
);

router.get(
    "/:id",
    [
        //validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    getUnityById
);

router.get(
    "/updated-today",
    getUnitsUpdatedToday
);

router.put(
    "/:id",
    [
        //validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    putUnity
);

router.delete(
    "/:id",
    [
        //validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    deleteUnity
);

router.post(
    "/excel", generarExcel
)

export default router;
