import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }},
    { _id: false });

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, index: true, unique: true },
    age: { type: String, required: false },
    role: { type: String, default: 'user' },
    cart: { type: cartItemSchema, default: ''},
    // cart: {  type: String, required: false},
    password: { type: String }
}, { timestamps: true });

UserSchema.pre('find', function() {
    this.populate('cart');
});




export default mongoose.model('User', UserSchema);