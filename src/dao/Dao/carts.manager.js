import productModel from '../models/carts.model.js'

export default class productModel {
    static get() {
        return productModel.find();
    }

    
}