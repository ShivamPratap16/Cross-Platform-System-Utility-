import express from 'express';
import {
  receiveSystemReport,
  getAllReports,
  exportReportsToCSV,
  getComplianceStats
} from '../controllers/systemController.js';

const router = express.Router();

router.post('/reportdata', receiveSystemReport);
router.get('/reports', getAllReports);
router.get('/reports/export', exportReportsToCSV);
router.get('/reports/stats', getComplianceStats);

export default router;
