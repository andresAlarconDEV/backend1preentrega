import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true, index: true },
    code: {type: String, required: true, index: true },
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    thumbnail: {type: String, required: false},
    status: {type: Boolean, required: true}
}, {timestamps: true});

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', ProductSchema);