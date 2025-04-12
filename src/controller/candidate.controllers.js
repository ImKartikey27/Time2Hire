import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Candidate from "../model/candidate.models.js";

const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await Candidate.find();
  if (!candidates || candidates.length === 0) throw new ApiError(404, "Candidates not found");
  return res.status(200).json(new ApiResponse(200, candidates, "Candidates fetched successfully"));
});

const createCandidate = asyncHandler(async (req, res) => {
  const { 
    name, 
    company, 
    position, 
    isInterested, 
    noticePeriod, 
    currentSalary, 
    expectedSalary, 
    rawAvailability
  } = req.body;
  
  // Validation for required fields based on your model
  if ([name, company, position].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name, company and position are required");
  }
  
  // You may want to check for existing candidates
  // Note: Your model doesn't have email/phone as unique identifiers
  // so I've adjusted this check to use name and company
  const existedCandidate = await Candidate.findOne({
    name: name,
    company: company,
    position: position
  });
  
  if (existedCandidate) {
    throw new ApiError(400, "Candidate already exists");
  }
  
  try {
    const candidate = await Candidate.create({
      name,
      company,
      position,
      isInterested,
      noticePeriod,
      currentSalary,
      expectedSalary,
      rawAvailability,
      // Initialize other fields if needed
      bookingConfirmed: false,
      conversationHistory: [] 
    });
    
    return res.status(201).json(new ApiResponse(201, candidate, "Candidate created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getCandidateDetail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const candidate = await Candidate.findById(id);
  if (!candidate) throw new ApiError(404, "Candidate not found");
  return res.status(200).json(new ApiResponse(200, candidate, "Candidate fetched successfully"));
});

const updateCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { 
    name, 
    company, 
    position, 
    isInterested, 
    noticePeriod, 
    currentSalary, 
    expectedSalary, 
    rawAvailability,
    interviewDateTime,
    bookingConfirmed
  } = req.body;
  
  const candidate = await Candidate.findById(id);
  if (!candidate) throw new ApiError(404, "Candidate not found");
  
  const updateData = {};
  
  // Only add fields that are present in the request
  if (name !== undefined) updateData.name = name;
  if (company !== undefined) updateData.company = company;
  if (position !== undefined) updateData.position = position;
  if (isInterested !== undefined) updateData.isInterested = isInterested;
  if (noticePeriod !== undefined) updateData.noticePeriod = noticePeriod;
  if (currentSalary !== undefined) updateData.currentSalary = currentSalary;
  if (expectedSalary !== undefined) updateData.expectedSalary = expectedSalary;
  if (rawAvailability !== undefined) updateData.rawAvailability = rawAvailability;
  if (interviewDateTime !== undefined) updateData.interviewDateTime = interviewDateTime;
  if (bookingConfirmed !== undefined) updateData.bookingConfirmed = bookingConfirmed;
  
  const updatedCandidate = await Candidate.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  return res.status(200).json(new ApiResponse(200, updatedCandidate, "Candidate updated successfully"));
});

const deleteCandidate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const candidate = await Candidate.findByIdAndDelete(id);
  if (!candidate) throw new ApiError(404, "Candidate not found");
  return res.status(200).json(new ApiResponse(200, candidate, "Candidate deleted successfully"));
});

// Add a new controller to update conversation history
const updateConversationHistory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { role, content } = req.body;
  
  if (!role || !content) {
    throw new ApiError(400, "Role and content are required for conversation history");
  }
  
  const candidate = await Candidate.findById(id);
  if (!candidate) throw new ApiError(404, "Candidate not found");
  
  candidate.conversationHistory.push({
    role,
    content,
    timestamp: new Date()
  });
  
  await candidate.save();
  
  return res.status(200).json(new ApiResponse(200, candidate, "Conversation history updated successfully"));
});

export {
  getCandidates,
  createCandidate,
  getCandidateDetail,
  updateCandidate,
  deleteCandidate,
  updateConversationHistory
};