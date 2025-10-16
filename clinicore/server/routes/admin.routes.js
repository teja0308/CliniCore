import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { approveDoctor, listComplaints, listPendingDoctors, rejectDoctor } from '../controllers/admin.controller.js';

const router = Router();

router.use(authRequired, requireRole('admin'));

router.get('/doctors/pending', listPendingDoctors);
router.post('/doctors/:id/approve', approveDoctor);
router.post('/doctors/:id/reject', rejectDoctor);
router.get('/complaints', listComplaints);

export default router;


