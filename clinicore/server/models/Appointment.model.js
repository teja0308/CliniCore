import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    text: String,
    createdAt: Date,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    start: { type: Date, required: true, index: true },
    end: { type: Date, required: true },
    durationMinutes: { type: Number, default: 20 },
    status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
    prescription: prescriptionSchema,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

appointmentSchema.index({ doctor: 1, start: 1 });
appointmentSchema.index({ student: 1, start: 1 });

export default mongoose.model('Appointment', appointmentSchema);


