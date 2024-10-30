import { Router } from "express";
import { validateJWT } from '../middlewares/validate-jwt.js'; // ../ de que la ruta sea correcta
import { verifyMicrosoftToken, generarJWT } from '../helpers/generate-jwt.js'; // Ajusta según tu estructura de archivos

const router = Router();


router.post("/login/microsoft", async (req, res) => {
    const { token } = req.body;

    try {
        const user = await verifyMicrosoftToken(token);
        if (!user) {
            return res.status(401).json({ msg: 'Token inválido' });
        }

        // Devolver el token y la información del usuario
        res.json({ msg: 'Login exitoso', accessToken: token, user });
    } catch (error) {
        console.error('Error en el login con Microsoft:', error);
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
});



// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', validateJWT, (req, res) => {
    res.json({
        msg: 'Acceso permitido',
        usuario: req.user, // `req.user` contendrá la información del usuario autenticado
    });
});

// Otras rutas que puedes agregar
router.get('/logout', (req, res) => {
    res.json({ msg: 'Sesión cerrada' });
});


export default router;
