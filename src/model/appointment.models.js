import mongoose, {Schema} from "mongoose";

const appointmentSchema = new mongoose.Schema({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  job: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  slot: {
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    }
  },
  confirmed: {
    type: Boolean,
    default: false
  },
}, {timestamps: true})

export const Appointment = mongoose.model("Appointment", appointmentSchema)