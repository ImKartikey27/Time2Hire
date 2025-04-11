import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ConversationLogs } from "../model/conversation.models";


const getConversationLogs = asyncHandler(async (req, res) => {
    const candidate_id = req.params.id
    const conversation = await ConversationLogs.find({candidate: candidate_id})
    if(!conversation || conversation.length === 0) throw new ApiError(404, "Conversation not found")
    return res.status(200).json(new ApiResponse(200, conversation, "Conversation fetched successfully"))
})

const createConversation = asyncHandler(async (req, res) => {
    const {candidate_id, message} = req.body

    const existedConversation = await ConversationLogs.findOne({candidate: candidate_id})
    if(existedConversation){
        existedConversation.messages.push(message)
        await existedConversation.save()
        return res.status(200).json(new ApiResponse(200, existedConversation, "Conversation updated successfully"))
    }
    try {
        const conversation = await ConversationLogs.create({
            candidate: candidate_id,
            messages: [message]
        })
        return res.status(201).json(new ApiResponse(201, conversation, "Conversation created successfully"))
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const getConversationById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const conversation = await ConversationLogs.findById(id)
    if(!conversation) throw new ApiError(404, "Conversation not found")
    return res.status(200).json(new ApiResponse(200, conversation, "Conversation fetched successfully"))
})
export {
    getConversationLogs,
    createConversation,
    getConversationById

}