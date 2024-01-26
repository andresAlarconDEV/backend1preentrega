import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    code: {type: String, required: true},
    amount: {type: Number, required: true},
    purchase_datetime: {type: Date, required: true, default: new Date()},
    purchaser: {type: String, required: true}
},{timestamps: true});

export default mongoose.model('Ticket', TicketSchema);