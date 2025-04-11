import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Candidate } from "../model/candidates.models";

const getCandidates = asyncHandler(async (req, res) => {
    const candidates = await Candidate.find()
    if(!candidates || candidates.length === 0) throw new ApiError(404, "Candidates not found")
    return res.status(200).json(new ApiResponse(200, candidates, "Candidates fetched successfully"))
})

const createCandidate = asyncHandler(async (req, res) => {
    const {name , email , phone , notice_period , current_ctc , expected_ctc} = req.body
    //validation 
    if([name , email , phone , notice_period , current_ctc , expected_ctc].some((field) => field?.trim()=== "")){
        throw new ApiError(400, "All fields are required")
    }
    const existedCandidate = await Candidate.findOne({
        $or: [{email: email},{phone: phone}]
    })
    if(existedCandidate){
        throw new ApiError(400, "Candidate already exists")
    }
    try {
        const candidate = await Candidate.create({
            name,
            email,
            phone,
            notice_period,
            current_ctc,
            expected_ctc
        })
        return res.status(201).json(new ApiResponse(201, candidate, "Candidate created successfully"))
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const getCandidateDetail = asyncHandler(async (req,res)=>{
    const id = req.params.id
    const candidate = await Candidate.findById(id)
    if(!candidate) throw new ApiError(404, "Candidate not found")
    return res.status(200).json(new ApiResponse(200, candidate, "Candidate fetched successfully"))
})

const updateCandidate = asyncHandler(async (req, res) => {
    const id = req.params.id
    const {name , email , phone , notice_period , current_ctc , expected_ctc} = req.body
    const candidate = await Candidate.findById(id)
    if(!candidate) throw new ApiError(404, "Candidate not found")
    const updateData = {}
    // Only add fields that are present in the request
    if(name !== undefined) updateData.name = name
    if(email !== undefined) updateData.email = email
    if(phone !== undefined) updateData.phone = phone
    if(notice_period !== undefined) updateData.notice_period = notice_period
    if(current_ctc !== undefined) updateData.current_ctc = current_ctc
    if(expected_ctc !== undefined) updateData.expected_ctc = expected_ctc
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    return res.status(200).json(new ApiResponse(200, updatedCandidate, "Candidate updated successfully"))
  })

const deleteCandidate = asyncHandler(async (req, res) => {
    const id = req.params.id
    const candidate = await Candidate.findByIdAndDelete(id)
    if(!candidate) throw new ApiError(404, "Candidate not found")
    return res.status(200).json(new ApiResponse(200, candidate, "Candidate deleted successfully"))
  })

export {
    getCandidates,
    createCandidate,
    getCandidateDetail,
    updateCandidate,
    deleteCandidate
}