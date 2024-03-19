import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    idCart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }},
    { _id: false });

    const documentSchema = new mongoose.Schema({
    name: { type: String, required: false },
    reference: {type: String, required: false}},
    { _id: false });

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, index: true, unique: true },
    age: { type: String, required: false },
    role: { type: String, enum: ['user','admin','premium'] },
    carts: { type:[cartItemSchema], default: []},
    documents: {type:[documentSchema], default: []},
    last_connection: {type: Date},
    password: { type: String }
}, { timestamps: true });

UserSchema.pre('find', function() {
    this.populate('carts.idCart');
});

export default mongoose.model('User', UserSchema);