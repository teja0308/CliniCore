import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.model.js';

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/clinicore';
  await mongoose.connect(uri);
  console.log('Connected');

  await User.deleteMany({ email: { $in: ['admin@n.it', 'doctor@n.it', 'student@n.it'] } });

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@n.it',
    role: 'admin',
    approved: true,
    passwordHash: await bcrypt.hash('Admin@123', 10),
  });

  const doctor = await User.create({
    name: 'Dr. Demo',
    email: 'doctor@n.it',
    role: 'doctor',
    specialization: 'General',
    approved: true,
    passwordHash: await bcrypt.hash('Doctor@123', 10),
  });

  const student = await User.create({
    name: 'Student Demo',
    email: 'student@n.it',
    role: 'student',
    approved: true,
    passwordHash: await bcrypt.hash('Student@123', 10),
  });

  console.log({ admin: admin.email, doctor: doctor.email, student: student.email });
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


