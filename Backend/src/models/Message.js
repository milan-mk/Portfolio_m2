import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Chief / Recruiter name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Carrier Pigeon / Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    orders: {
      type: String,
      required: [true, 'Battle Orders / Message content is required'],
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    role: {
      type: String,
      trim: true,
      default: 'junior',
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived'],
      default: 'unread',
    },
    source: {
      type: String,
      default: 'portfolio_contact_form',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual alias so 'message' maps to 'orders'
messageSchema.virtual('message').get(function () {
  return this.orders;
});

export const Message = mongoose.model('Message', messageSchema);
