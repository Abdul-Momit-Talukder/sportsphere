import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    sport: {
      type: String,
      required: [true, 'Sport type is required'],
      enum: ['football', 'basketball', 'tennis', 'cricket', 'badminton', 'swimming', 'volleyball', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: 1,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    amenities: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String,
      default: '06:00',
    },
    closeTime: {
      type: String,
      default: '22:00',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;
