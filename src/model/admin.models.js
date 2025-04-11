import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

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



export const Admin = mongoose.model("Admin", adminSchema)