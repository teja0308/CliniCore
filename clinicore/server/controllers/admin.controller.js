import User from '../models/User.model.js';
import Complaint from '../models/Complaint.model.js';

export async function listPendingDoctors(req, res) {
  const docs = await User.find({ role: 'doctor', approved: false }).select('_id name email specialization');
  res.json(docs);
}

export async function approveDoctor(req, res) {
  const { id } = req.params;
  const doc = await User.findOneAndUpdate({ _id: id, role: 'doctor' }, { approved: true }, { new: true });
  if (!doc) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ id: doc._id, approved: doc.approved });
}

export async function rejectDoctor(req, res) {
  const { id } = req.params;
  const doc = await User.findOne({ _id: id, role: 'doctor' });
  if (!doc) return res.status(404).json({ message: 'Doctor not found' });
  await User.deleteOne({ _id: id });
  res.json({ message: 'Doctor registration removed' });
}

export async function listComplaints(req, res) {
  const items = await Complaint.find().sort({ createdAt: -1 });
  res.json(items);
}


