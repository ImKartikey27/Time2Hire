import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../model/admin.models.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async( admin_id ) => {
    try {
        const admin = await Admin.findById(admin_id)
        if(!admin) throw new ApiError(404, "Admin not found")
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken();
        admin.refreshToken = refreshToken;
        await admin.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh token")
    }
}

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) throw new ApiError(400, "All fields are required")

    const admin = await Admin.findOne({email})
    if(!admin) throw new ApiError(404, "Admin not found")

    const isPasswordCorrect = await admin.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(401, "Invalid credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(admin._id)
    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new ApiResponse(200, {accessToken, refreshToken}, "Login successful"))
})

const logout = asyncHandler(async (req, res) => {
    await Admin.findOneAndUpdate(
        req.admin._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {new: true}
    )
    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }

    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, "Logout successful"))
})

const registerAdmin = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password) throw new ApiError(400, "All fields are required")
    
    const admin = await Admin.findOne({email})
    if(admin) throw new ApiError(400, "Admin already exists")
    const newAdmin = await Admin.create({
        name,
        email,
        password
    })
    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res
        .status(201)
        .json(new ApiResponse(201, "Admin created successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh Token is required")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const admin = await Admin.findById(decodedToken?.id).select("-password")
        if(!admin) throw new ApiError(401, "Unauthorized")
        if(incomingRefreshToken!== admin?.refreshToken) throw new ApiError(401, "Invalid refresh token")
        
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(admin._id)
        const option = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed successfully"))
    } catch (error) {
        console.log("refresh Token", error);
        
        throw new ApiError(401, "Something went wrong while refreshing access token")
    }
})


export {login, logout,registerAdmin, refreshAccessToken}