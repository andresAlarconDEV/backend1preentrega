import productModel from '../models/products.model.js'

export default class productModel {
    static get() {
        return productModel.find();
    }

    
}