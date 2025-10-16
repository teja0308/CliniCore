import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export async function register(req, res) {
  const { name, email, password, role, specialization, adminPasscode } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  if (role === 'admin' && adminPasscode !== process.env.ADMIN_PASSCODE) {
    return res.status(403).json({ message: 'Invalid admin passcode' });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role, specialization, approved: role === 'doctor' ? false : true });
  return res.status(201).json({ id: user._id, role: user.role, approved: user.approved });
}

export async function login(req, res) {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email, role });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.role === 'doctor' && !user.approved) return res.status(403).json({ message: 'Waiting for admin approval' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
}


