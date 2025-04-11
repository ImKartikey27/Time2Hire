import mongoose, {Schema} from "mongoose";

const conversationLogsSchema = new mongoose.Schema({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: "Candidate",
  },
  sender: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  intent_detected: {
    type: String
  },
}, {timestamps: true})

export const ConversationLogs = mongoose.model("ConversationLogs", conversationLogsSchema)