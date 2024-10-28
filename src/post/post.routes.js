import { Router } from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { createPost, updatePost, deletePost, listPost } from '../post/post.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });


router.get(
    '/getPost',
    [
        validateJWT,
        //validateRole('ADMIN_ROLE')
    ],
    listPost
);

router.post(
    '/newPost',
    [
        validateJWT,
        upload.single('photo'),
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        validarCampos
    ],
    createPost
);

router.put(
    '/:id',
    [
        validateJWT,
        upload.single('photo'),
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        validarCampos
    ],
    updatePost
);

router.delete(
    '/:id',
    [
        validateJWT
    ],
    deletePost
);

export default router;