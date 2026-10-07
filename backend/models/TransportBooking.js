import mongoose from 'mongoose';

const bookingLocationSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    accuracy: { type: Number, min: 0 },
  },
  { _id: false }
);

const transportBookingSchema = new mongoose.Schema(
  {
    transport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transport',
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, required: true, trim: true, maxlength: 30 },
    serviceDate: { type: Date, required: true },
    pickupLocation: { type: String, required: true, trim: true, maxlength: 200 },
    pickupCoordinates: { type: bookingLocationSchema, required: true },
    destination: { type: String, required: true, trim: true, maxlength: 200 },
    destinationCoordinates: { type: bookingLocationSchema, required: true },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('TransportBooking', transportBookingSchema);