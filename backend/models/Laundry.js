import mongoose from 'mongoose';

const laundrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    serviceArea: {
      type: String,
      required: [true, 'Service area is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceUnit: {
      type: String,
      default: 'per load',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },
    services: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: ['Available Now', 'Available Soon', 'Closed'],
      default: 'Available Now',
    },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

laundrySchema.index({ name: 'text', location: 'text', description: 'text' });

const Laundry = mongoose.model('Laundry', laundrySchema);
export default Laundry;