
import express from 'express';
const router = express.Router();
import { getDashboardLinks, addDashboardLinks } from '../controllers/tableauController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/links').get(protect, getDashboardLinks);
router.route('/add').post(protect, addDashboardLinks);

export default router;

