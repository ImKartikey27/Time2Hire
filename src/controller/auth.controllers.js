import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Admin } from "../model/admin.models";

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

export {login, logout}