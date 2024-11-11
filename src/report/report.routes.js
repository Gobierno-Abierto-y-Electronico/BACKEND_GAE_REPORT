// routes/reporteRoutes.js
import express from 'express';
import { storeReporteData, getReporteData, getReporteByDate } from './report.controller.js';

const router = express.Router();

router.post('/enviar', storeReporteData);
router.get('/', getReporteData);
router.get('/by-date', getReporteByDate);

export default router;