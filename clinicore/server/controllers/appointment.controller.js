import mongoose from 'mongoose';
import Appointment from '../models/Appointment.model.js';
import DoctorAvailability from '../models/DoctorAvailability.model.js';

export async function book(req, res) {
  const { doctorId, startISO } = req.body;
  const studentId = req.user.userId;
  if (!doctorId || !startISO) return res.status(400).json({ message: 'Missing fields' });
  const start = new Date(startISO);
  const end = new Date(start.getTime() + 20 * 60000);

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 1) slot exists and not booked
      const dateKey = new Date(new Date(start).setHours(0, 0, 0, 0));
      const avail = await DoctorAvailability.findOne({ doctor: doctorId, date: dateKey }).session(session);
      if (!avail) throw Object.assign(new Error('No availability'), { status: 404 });
      const slotIndex = avail.slots.findIndex(s => s.start.getTime() === start.getTime());
      if (slotIndex === -1) throw Object.assign(new Error('Slot not found'), { status: 404 });
      if (avail.slots[slotIndex].booked) throw Object.assign(new Error('Slot already booked'), { status: 409 });

      // 2) student has no overlapping appointment
      const overlap = await Appointment.findOne({
        student: studentId,
        status: { $in: ['booked'] },
        $or: [
          { start: { $lt: end }, end: { $gt: start } },
          { start: start, end: end },
        ],
      }).session(session);
      if (overlap) throw Object.assign(new Error('Overlapping appointment'), { status: 409 });

      // 3) create appointment
      const appt = await Appointment.create([{
        student: studentId,
        doctor: doctorId,
        start,
        end,
      }], { session });

      // 4) mark slot booked atomically
      avail.slots[slotIndex].booked = true;
      avail.slots[slotIndex].appointmentId = appt[0]._id;
      await avail.save({ session });

      res.status(201).json(appt[0]);
    });
  } catch (e) {
    const status = e.status || 500;
    res.status(status).json({ message: e.message });
  } finally {
    await session.endSession();
  }
}

export async function listMy(req, res) {
  const { role, userId } = req.user;
  const filter = role === 'student' ? { student: userId } : { doctor: userId };
  const items = await Appointment.find(filter).sort({ start: 1 });
  res.json(items);
}

export async function cancel(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;
  const appt = await Appointment.findById(id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (String(appt.student) !== String(userId)) return res.status(403).json({ message: 'Forbidden' });
  const now = new Date();
  if (appt.start.getTime() - now.getTime() <= 30 * 60000) return res.status(400).json({ message: 'Too late to cancel' });
  appt.status = 'cancelled';
  await appt.save();
  // free slot
  const dateKey = new Date(new Date(appt.start).setHours(0,0,0,0));
  const avail = await DoctorAvailability.findOne({ doctor: appt.doctor, date: dateKey });
  if (avail) {
    const idx = avail.slots.findIndex(s => s.start.getTime() === appt.start.getTime());
    if (idx !== -1) { avail.slots[idx].booked = false; avail.slots[idx].appointmentId = null; await avail.save(); }
  }
  res.json({ message: 'Cancelled' });
}

export async function addPrescription(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  const doctorId = req.user.userId;
  const appt = await Appointment.findById(id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (String(appt.doctor) !== String(doctorId)) return res.status(403).json({ message: 'Forbidden' });
  appt.prescription = { text, createdAt: new Date(), author: doctorId };
  await appt.save();
  res.json(appt);
}


