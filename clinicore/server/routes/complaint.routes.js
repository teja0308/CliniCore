import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { createComplaint } from '../controllers/complaint.controller.js';

const router = Router();

router.post('/complaint', authRequired, requireRole('student'), createComplaint);

export default router;


