import mongoose,{Schema} from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,//this is the name of the old company
    required: true
  },
  position: {
    type: String,//position in the old company  
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
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

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate