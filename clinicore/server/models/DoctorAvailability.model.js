import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    booked: { type: Boolean, default: false },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { _id: false }
);

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, index: true },
    slots: [slotSchema],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

doctorAvailabilitySchema.index({ doctor: 1, date: 1 }, { unique: true });

export default mongoose.model('DoctorAvailability', doctorAvailabilitySchema);


