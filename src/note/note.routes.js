import { Router } from 'express';
import { check } from 'express-validator';
import { createNote, getAllNotes, getNotesByCreator, updateNote } from './note.controller.js';
import { validateJWT, validateRole } from '../middlewares/validate-jwt.js';
import { existNoteById, findUsername } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.post(

    '/create',
    [
        validateJWT,
        validateRole('SUPPORTER_ROLE'),
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
        validateJWT,
        validateRole('SUPPORTER_ROLE', 'ADMIN_ROLE'),
    ],
    getAllNotes
);

router.get(

    '/creator',
    [
        validateJWT,
        validateRole('SUPPORTER_ROLE'),
    ],
    getNotesByCreator
);

router.put(
    
    '/update/:id',
    [
        validateJWT,
        validateRole('SUPPORTER_ROLE'),
        check('id', 'Not a valid ID').isMongoId(),
        check('id').custom(existNoteById),
        validarCampos
    ],
    updateNote
);

export default router;
