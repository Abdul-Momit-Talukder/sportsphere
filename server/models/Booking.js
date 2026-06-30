import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

bookingSchema.index({ venue: 1, date: 1, startTime: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
