import { Router } from "express";
import { check } from "express-validator";
import {
    postMessage,
    getMessages,
    getMessageById,
    putMessage,
    deleteMessage
} from "./message.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from '../middlewares/validate-jwt.js';

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        check("receptor", "The receptor is required").not().isEmpty(),
        check("receptor", "This is not a valid ID for receptor").isMongoId(),
        check("emisor", "The emisor is required").not().isEmpty(),
        check("emisor", "This is not a valid ID for emisor").isMongoId(),
        check("content", "The content is required").not().isEmpty(),
        check("chatId", "The chatId is required").not().isEmpty(),
        check("chatId", "This is not a valid ID for chatId").isMongoId(),
        validarCampos,
    ],
    postMessage
);

router.get(
    "/",
    getMessages
);

router.get(
    "/:id",
    [
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    getMessageById
);

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    putMessage
);

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    deleteMessage
);

export default router;
