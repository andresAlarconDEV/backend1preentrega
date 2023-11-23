import mongoose from "mongoose";

const productItemSchema = new mongoose.Schema({
    idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    }, { _id: false });

const CartSchema = new mongoose.Schema({
    products: { type: [productItemSchema], default: []}
}, {timestamps: true});

CartSchema.pre('find', function() {
    this.populate('products.idProduct');
});

export default mongoose.model('Cart', CartSchema);