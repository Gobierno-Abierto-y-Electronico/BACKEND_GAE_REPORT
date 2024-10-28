import { Router } from 'express';
import { check } from 'express-validator';
import { createNote, getAllNotes, getNotesByCreator, updateNote } from './note.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { existNoteById, findUsername } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(

    '/create',
    [
        validateJWT,
        check('title', 'Title is required').not().isEmpty(),
        check('notedUsername').custom(findUsername),
        check('body', 'Body is required').not().isEmpty(),
        validarCampos
    ],
    createNote
);

router.get(

    '/all',
    [
        validateJWT
    ],
    getAllNotes
);

router.get(

    '/creator',
    [
        validateJWT
    ],
    getNotesByCreator
);

router.put(
    
    '/update/:id',
    [
        validateJWT,
        check('id', 'Not a valid ID').isMongoId(),
        check('id').custom(existNoteById),
        validarCampos
    ],
    updateNote
);

export default router;
