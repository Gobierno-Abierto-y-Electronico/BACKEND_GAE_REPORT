import { Router } from "express";
import { check } from "express-validator";
import {
    postUnity,
    getUnits,
    getUnityByName,
    putUnityByName,
    deleteUnityByName,
    generarExcel, 
    getUnitsUpdatedToday
} from "./unidad.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { authenticate } from '../middlewares/authmiddleware.js'; // Importa el middleware de autenticación

const router = Router();

router.post(
    "/",
    [
        authenticate, // Usar autenticación aquí
        check("nameUnity", "The name of the unity is required").not().isEmpty(),
        check("numberOfWorkers", "The number of workers is required").not().isEmpty(),
        validarCampos,
    ],
    postUnity
);

router.get(
    "/",
    authenticate, // Usar autenticación aquí
    getUnits
);

router.get(
    "/name/:nameUnity",
    [
        authenticate, // Usar autenticación aquí
        check("nameUnity", "The name of the unity is required").not().isEmpty(),
        validarCampos,
    ],
    getUnityByName
);

router.put(
    "/name/:nameUnity",
    [
        authenticate, // Usar autenticación aquí
        check("nameUnity", "The name of the unity is required").not().isEmpty(),
        validarCampos,
    ],
    putUnityByName
);

router.delete(
    "/name/:nameUnity",
    [
        authenticate, // Usar autenticación aquí
        check("nameUnity", "The name of the unity is required").not().isEmpty(),
        validarCampos,
    ],
    deleteUnityByName
);

router.get(
    "/obtener/UnidadesEnviadas",
    authenticate, // Usar autenticación aquí
    getUnitsUpdatedToday
);

router.post(
    "/excel",
    authenticate, // Usar autenticación aquí
    generarExcel
);

export default router;
