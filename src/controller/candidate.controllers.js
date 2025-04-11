import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Candidate } from "../model/candidates.models";

const getCandidates = asyncHandler(async (req, res) => {
    const candidates = await Candidate.find()
    if(!candidates || candidates.length === 0) throw new ApiError(404, "Candidates not found")
    return res.status(200).json(new ApiResponse(200, candidates, "Candidates fetched successfully"))
})

