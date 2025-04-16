import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../model/appointment.models.js";

const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
    if(!appointments || appointments.length === 0) throw new ApiError(404, "Appointments not found")
    return res.status(200).json(new ApiResponse(200, appointments, "Appointments fetched successfully"))
})

const createAppointment = asyncHandler(async (req, res) => {
    const { candidate_id, job_id, slot } = req.body;
  
    // Validate required fields
    if (!candidate_id?.trim() || !job_id?.trim() || !slot?.date || !slot?.startTime) {
      throw new ApiError(400, "Candidate ID, Job ID, and slot (date and startTime) are required");
    }
  
    const slotDate = new Date(slot.date);
    if (isNaN(slotDate)) {
      throw new ApiError(400, "Invalid date format for slot.date");
    }
    // Check for existing appointment with same candidate, job, and slot time
    const existedAppointment = await Appointment.findOne({
      candidate_id,
      job_id,
      "slot.date": slotDate,
      "slot.startTime": slot.startTime,
    });
    
    if (existedAppointment) {
      throw new ApiError(400, "Appointment already exists for this slot");
    }
  
    // Create appointment
    const appointment = await Appointment.create({
      candidate: candidate_id,
      job: job_id,
      slot: {
        date: slotDate,
        startTime: slot.startTime,
      },
    });
    console.log("created an appointment");
    
  
    return res
      .status(201)
      .json(new ApiResponse(201, appointment, "Appointment created successfully"));
  });
  
const getAppointmentDetail = asyncHandler(async (req,res)=>{
    const id = req.params.id
    const appointment = await Appointment.findById(id)
    if(!appointment) throw new ApiError(404, "Appointment not found")
    return res.status(200).json(new ApiResponse(200, appointment, "Appointment fetched successfully"))
})

const updateAppointment = asyncHandler(async (req, res) => {
    const id = req.params.id
    const { candidate_id, job_id, slot } = req.body
    
    const appointment = await Appointment.findById(id)
    if(!appointment) throw new ApiError(404, "Appointment not found")
    
    const updateData = {}
    // Only add fields that are present in the request
    if(candidate_id !== undefined) updateData.candidate_id = candidate_id
    if(job_id !== undefined) updateData.job_id = job_id
    if(slot !== undefined) updateData.slot = slot
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    return res.status(200).json(new ApiResponse(200, updatedAppointment, "Appointment updated successfully"))
})

const deleteAppointment = asyncHandler(async (req, res) => {
    const id = req.params.id
    const appointment = await Appointment.findByIdAndDelete(id)
    if(!appointment) throw new ApiError(404, "Appointment not found")
    return res.status(200).json(new ApiResponse(200, appointment, "Appointment deleted successfully"))
  })

export {
    getAppointments,
    createAppointment,
    getAppointmentDetail,
    updateAppointment,
    deleteAppointment
}