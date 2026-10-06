import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business / provider name is required'],
      trim: true,
      maxlength: 120,
    },
    type: {
      type: String,
      required: [true, 'Transport type is required'],
      enum: [
        'Boda Boda',
        'Tuk Tuk',
        'Taxi',
        'Car Hire',
        'Van / Moving',
        'School / Campus Transport',
        'Bus',
        'Other',
      ],
      default: 'Other',
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

transportSchema.index({ name: 'text', location: 'text', description: 'text' });

const Transport = mongoose.model('Transport', transportSchema);
export default Transport;