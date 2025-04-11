import mongoose, {Schema} from "mongoose";

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    slots: [{
        date: {
          type: Date,
          required: true
        },
        startTime: {
          type: String,
          required: true
        }
      }]

}, {timestamps: true})

export const Job = mongoose.model("Job", jobSchema)
