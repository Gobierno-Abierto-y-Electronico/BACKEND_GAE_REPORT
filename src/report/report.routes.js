// routes/reporteRoutes.js
import express from 'express';
import { storeReporteData, getReporteData } from './report.controller.js';

const router = express.Router();

router.post('/', storeReporteData);

router.get("/", getReporteData);

export default router;