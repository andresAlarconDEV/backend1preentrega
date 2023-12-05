import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    age: { type: String, required: false },
    role: { type: String, default: 'user' },
    password: { type: String, required: true }
}, { timestamps: true });


export default mongoose.model('User', UserSchema);