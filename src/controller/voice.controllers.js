import voiceAgent from "../voice-agents/voice-agent.js";
import Candidate from "../model/candidate.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const agent = new voiceAgent();

//start conversations 

export const startConversation = asyncHandler(async (req, res) => {
    const {candidateData} = req.body;
    const result = await agent.startConversation(candidateData);
    ApiResponse(200, result, "Conversation started successfully")
})

export const processResponse = asyncHandler(async (req, res) => {
    const { userInput, candidateId } = req.body;
  
  const result = await agent.processResponse(userInput, candidateId);
  ApiResponse(200, result, "Response processed successfully")
})

export const getCandidate = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const candidate = await Candidate.findById(id);
  
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  
  return res.status(200).json(new ApiResponse(200, candidate, "Candidate fetched successfully"));
})

