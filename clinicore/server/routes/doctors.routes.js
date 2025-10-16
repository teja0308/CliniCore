import { Router } from 'express';
import { listApproved, listSlotsForDate } from '../controllers/doctors.controller.js';

const router = Router();

router.get('/', listApproved);
router.get('/:doctorId/slots', listSlotsForDate);

export default router;


