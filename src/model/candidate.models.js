import mongoose, {Schema} from "mongoose";

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    notice_period: {
        type: String,
        required: true 
    },
    current_ctc: {
        type: String,
        required: true
    },
    expected_ctc: {
        type: String,
        required: true
    },
},{timestamps: true})

export const Candidate = mongoose.model("Candidate", candidateSchema)