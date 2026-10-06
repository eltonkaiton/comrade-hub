import mongoose from 'mongoose';

const houseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    distance: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'House type is required'],
      enum: ['Single Room', 'Bedsitter', 'One Bedroom', 'Hostel', 'Other'],
      default: 'Other',
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: 0,
    },
    availability: {
      type: String,
      enum: ['Available Now', 'Available Soon', 'Taken'],
      default: 'Available Now',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
  },
  { timestamps: true }
);

houseSchema.index({ title: 'text', location: 'text', description: 'text' });

const House = mongoose.model('House', houseSchema);
export default House;