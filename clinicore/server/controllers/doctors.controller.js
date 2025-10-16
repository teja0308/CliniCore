import User from '../models/User.model.js';
import DoctorAvailability from '../models/DoctorAvailability.model.js';

export async function listApproved(req, res) {
  const { specialization } = req.query;
  const filter = { role: 'doctor', approved: true };
  if (specialization) filter.specialization = specialization;
  const docs = await User.find(filter).select('_id name specialization');
  res.json(docs);
}

export async function listSlotsForDate(req, res) {
  const { doctorId } = req.params;
  const { date } = req.query; // YYYY-MM-DD
  if (!date) return res.status(400).json({ message: 'Missing date' });
  const midnight = new Date(date);
  const avail = await DoctorAvailability.findOne({ doctor: doctorId, date: new Date(midnight.setHours(0,0,0,0)) });
  if (!avail) return res.json([]);
  const slots = avail.slots.filter(s => !s.booked).map(s => ({ start: s.start, end: s.end }));
  res.json(slots);
}


