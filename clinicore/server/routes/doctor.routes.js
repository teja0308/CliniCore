import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import { createAvailability, listDoctorAppointments } from '../controllers/doctor.controller.js';
import { listMy } from '../controllers/appointment.controller.js';

const router = Router();

router.use(authRequired, requireRole('doctor'));

router.post('/availability', createAvailability);
router.get('/appointments', listMy); // doctor's appointments

export default router;


