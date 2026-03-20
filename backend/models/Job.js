const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    type: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    date: { type: String },
    notes: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
