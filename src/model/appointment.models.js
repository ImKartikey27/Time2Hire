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
  scheduled_time: {
    type: Date,
  },
  confirmed: {
    type: Boolean,
    default: false
  },
}, {timestamps: true})

export const Appointment = mongoose.model("Appointment", appointmentSchema)