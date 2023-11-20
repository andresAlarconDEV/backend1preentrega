import productModel from '../models/messages.model.js'

export default class productModel {
    static get() {
        return productModel.find();
    }

    
}