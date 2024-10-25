import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta protegida para obtener el perfil del usuario
router.get('/perfil', authenticate, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' }); // Manejo de errores
  }
  
  res.json({
    msg: 'Acceso permitido',
    usuario: req.user, // `req.user` contendrá la información del usuario autenticado
  });
});

// Otras rutas que puedes agregar
router.get('/logout', (req, res) => {
  // Implementa la lógica para cerrar sesión
  res.json({ msg: 'Sesión cerrada' });
});

export default router;
