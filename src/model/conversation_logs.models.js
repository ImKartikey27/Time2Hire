import mongoose, {Schema} from "mongoose";

const conversationLogsSchema = new mongoose.Schema({
  candidate: {
    type: Schema.Types.ObjectId,
    ref: "Candidate",
  },
  sender: {
    type: string,
    enum: ['agent', 'candidate'],
    required: true
  },
  timestamps: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    required: true
  },
  intent_detected: {
    type: String
  },
  entity_extracted: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const ConversationLogs = mongoose.model("ConversationLogs", conversationLogsSchema)