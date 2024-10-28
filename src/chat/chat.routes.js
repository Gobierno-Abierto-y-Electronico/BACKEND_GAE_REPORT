import { Router } from "express";
import { check } from "express-validator";
import {
    postChat,
    getChats,
    getChatById,
    putChat,
    deleteChat,
} from "./chat.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from '../middlewares/validate-jwt.js'; 

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        check("owner", "The owner is required").not().isEmpty(),
        check("owner", "This is not a valid ID for owner").isMongoId(),
        check("receptor", "The receptor is required").not().isEmpty(),
        check("receptor", "This is not a valid ID for receptor").isMongoId(),
        validarCampos,
    ],
    postChat
);

router.get(
    "/",
    validateJWT,
    getChats
);

router.get(
    "/:id",
    [
        validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    getChatById
);

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    putChat
);

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    deleteChat
);

export default router;
