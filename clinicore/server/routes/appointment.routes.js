import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { addPrescription, book, cancel, listMy } from '../controllers/appointment.controller.js';

const router = Router();

router.use(authRequired);

router.post('/', requireRole('student'), book);
router.get('/', listMy);
router.delete('/:id', requireRole('student'), cancel);
router.post('/:id/prescription', requireRole('doctor'), addPrescription);

export default router;


