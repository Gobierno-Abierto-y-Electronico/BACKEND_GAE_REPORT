// routes/reporteRoutes.js
import express from 'express';
import { storeReporteData, getReporteData, getReporteByDate } from './report.controller.js';

const router = express.Router();

// Ruta para almacenar datos de asistencia
router.post('/', storeReporteData);

// Ruta para obtener el último reporte
router.get('/', getReporteData);

// Ruta para obtener el reporte de un día específico (usando un query parameter "date")
router.get('/by-date', getReporteByDate);

export default router;
