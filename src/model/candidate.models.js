const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  isInterested: {
    type: Boolean
  },
  noticePeriod: {
    type: String
  },
  currentSalary: {
    type: String
  },
  expectedSalary: {
    type: String
  },
  rawAvailability: {
    type: String
  },
  interviewDateTime: {
    type: String
  },
  bookingConfirmed: {
    type: Boolean
  },
  conversationHistory: [{
    role: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export const Candidate = mongoose.model("Candidate", candidateSchema);