import DoctorAvailability from '../models/DoctorAvailability.model.js';
import { utcToZonedTime } from 'date-fns-tz';
import { addDays, isBefore } from 'date-fns';

const IST = 'Asia/Kolkata';

function dateRange(startDate, endDate) {
  const dates = [];
  let d = new Date(startDate);
  while (d <= endDate) {
    dates.push(new Date(d));
    d = addDays(d, 1);
  }
  return dates;
}

export async function createAvailability(req, res) {
  const { startDate, endDate, startTime, endTime } = req.body; // dates as YYYY-MM-DD, times as HH:mm
  if (!startDate || !startTime || !endTime) return res.status(400).json({ message: 'Missing fields' });
  const endD = endDate ? new Date(endDate) : new Date(startDate);
  const days = dateRange(new Date(startDate), endD);

  const docs = [];
  for (const day of days) {
    const istDate = utcToZonedTime(day, IST);
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    // Build 20-min slots aligned to 00/20/40 within 09:00-20:00
    const slots = [];
    let hour = sh;
    let minute = sm - (sm % 20);
    if (sm % 20 !== 0) minute += 20;
    if (hour < 9) { hour = 9; minute = 0; }
    if (hour > 20) continue;
    while (hour < 20 && (hour < eh || (hour === eh && minute < em))) {
      const start = new Date(istDate);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 20);
      const endLimit = new Date(istDate);
      endLimit.setHours(eh, em, 0, 0);
      const campusClose = new Date(istDate);
      campusClose.setHours(20, 0, 0, 0);
      if (end <= endLimit && end <= campusClose) {
        slots.push({ start, end });
      }
      minute += 20;
      if (minute >= 60) { minute = 0; hour += 1; }
    }
    // Convert to UTC
    for (const s of slots) {
      s.start = new Date(s.start.toISOString());
      s.end = new Date(s.end.toISOString());
    }
    if (!slots.length) continue;
    const dateKey = new Date(new Date(day).setHours(0,0,0,0));
    // Overlap validation: ensure none of the generated slots overlap existing slots for the date
    const existing = await DoctorAvailability.findOne({ doctor: req.user.userId, date: dateKey });
    if (existing) {
      // If any generated slot overlaps any existing slot time, reject
      for (const s of slots) {
        const hasOverlap = existing.slots.some(es => {
          return (s.start < es.end) && (s.end > es.start);
        });
        if (hasOverlap) {
          return res.status(409).json({ message: 'Availability overlaps existing slots for the date' });
        }
      }
    }
    docs.push({ doctor: req.user.userId, date: dateKey, slots });
  }

  try {
    const created = [];
    for (const doc of docs) {
      const exists = await DoctorAvailability.findOne({ doctor: doc.doctor, date: doc.date });
      if (exists) {
        // append non-overlapping slots if any remain (shouldn't happen due to earlier check)
        exists.slots.push(...doc.slots);
        await exists.save();
        created.push(exists);
      } else {
        created.push(await DoctorAvailability.create(doc));
      }
    }
    return res.status(201).json(created);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function listDoctorAppointments(req, res) {
  // Placeholder; implemented in appointment controller
  return res.status(200).json([]);
}


