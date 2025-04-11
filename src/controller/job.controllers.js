import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Job } from "../model/jobs.models";

const getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find()
    if(!jobs || jobs.length === 0) throw new ApiError(404, "Jobs not found")
    return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"))
})

const createJob = asyncHandler(async (req, res) => {
    const {company, title, description, requirements, slots} = req.body
    //validation
    if([company, title, description, requirements, slots].some((field) => field?.trim()=== "")){
        throw new ApiError(400, "All fields are required")
    }


    const existedJob = await Job.findOne({
        $and: [{company: company}, {title: title}]
    })


    if(existedJob){
        throw new ApiError(400, "Job already exists")
    }

    try {
        const job = await Job.create({
            company,
            title,
            description,
            requirements,
            slots
        })
        const createdJob = await Job.findById(job._id)
        if(!createdJob) throw new ApiError(404, "Job not found")
        return res.status(201).json(new ApiResponse(201, createdJob, "Job created successfully"))
    } catch (error) {
        throw new ApiError(400, error.message)
    }

})

const getJobDetail = asyncHandler(async (req,res)=>{
    const id = req.params.id
    const job = await Job.findById(id)
    if(!job) throw new ApiError(404, "Job not found")
    return res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"))
})

const updateJob = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { company, title, description, requirements, slots } = req.body
    
    const job = await Job.findById(id)
    if(!job) throw new ApiError(404, "Job not found")
    
    const updateData = {}
    // Only add fields that are present in the request
    if(company !== undefined) updateData.company = company
    if(title !== undefined) updateData.title = title
    if(description !== undefined) updateData.description = description
    if(requirements !== undefined) updateData.requirements = requirements
    if(slots !== undefined) updateData.slots = slots
    
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    return res.status(200).json(new ApiResponse(200, updatedJob, "Job updated successfully"))
  })

const deleteJob = asyncHandler(async (req, res) => {
    const id = req.params.id
    const job = await Job.findByIdAndDelete(id)
    if(!job) throw new ApiError(404, "Job not found")
    return res.status(200).json(new ApiResponse(200, job, "Job deleted successfully"))
})

export {
    getJobs,
    createJob,
    getJobDetail,
    updateJob,
    deleteJob
}