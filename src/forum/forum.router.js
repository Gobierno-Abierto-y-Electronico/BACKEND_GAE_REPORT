import { Router } from "express";
import { check } from 'express-validator'
import { createForum, postMessage, deleteForum, deleteComment, getForums, getComentaryById, updateForum,getForumsById } from './forum.controller.js'
import { existForum } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validateJWT } from '../middlewares/validate-jwt.js';

const router = Router();

router.post(
    '/',
    [
        
        check('title','The title indicates how the forum works.').not().isEmpty(),
        check('type','The type indicates what the type of problem is.').not().isEmpty(),    
        check('title').custom(existForum),
        validarCampos,
        validateJWT        
    ], createForum
)

router.get(
    '/',[validateJWT],getForums
)

router.get(
    '/:forumId',[],getForumsById
)

router.get(
    '/:forumId/comments/:commentId',
    [validateJWT],
    getComentaryById
);

router.put(
    '/addMessage',
    [
        check('title', 'The title indicates where the comment belongs.').not().isEmpty(),
        check('user', 'The title indicates who wrote the comment.').not().isEmpty(),
        check('text', 'The text is requiredio').not().isEmpty(),
        validarCampos,
        validateJWT
    ],
    postMessage
);

router.put('/:forumId', 
    [
        check('title', 'The title is required').not().isEmpty(),
        check('type', 'The type is required').not().isEmpty(),
        check('title').custom(existForum),
        validarCampos,
    ],
    updateForum
);

router.delete(
    '/:id',
    [validateJWT],
    deleteForum
);

router.delete(
    '/:forumId/comments/:commentId',
    [validateJWT],
    deleteComment
);

export default router;