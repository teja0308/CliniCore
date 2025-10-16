import Complaint from '../models/Complaint.model.js';

export async function createComplaint(req, res) {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text is required' });
  const c = await Complaint.create({ student: req.user.userId, text });
  res.status(201).json(c);
}


