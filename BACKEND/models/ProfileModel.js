const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },
  title: {
    type: String, // e.g., "Full Stack Developer", "UI/UX Designer"
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  skills: [
    {
      type: String, // e.g., "React", "Node.js", "MongoDB"
    }
  ],
  hourlyRate: {
    type: Number, // freelancer's rate per hour
    min: 0
  },
  experience: [
    {
      company: String,
      role: String,
      description: String,
      startDate: Date,
      endDate: Date
    }
  ],
  education: [
    {
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date
    }
  ],
  portfolio: [
    {
      title: String,
      description: String,
      url: String
    }
  ],
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  location: {
    country: String,
    city: String
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'away'],
    default: 'available'
  },
  socialLinks: {
    linkedin: String,
    github: String,
    website: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);