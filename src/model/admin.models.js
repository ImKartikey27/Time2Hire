import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken: {
        type: String
    }
},{timestamps: true})

adminSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email
    }, 
    process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        id: this._id,
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}



export const Admin = mongoose.model("Admin", adminSchema)