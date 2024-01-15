import CartModel from '../dao/models/cart.model.js';

export default class CartDaoMongoDB {

    static getAll (){
        return CartModel.find();
    }

    static getCartById(cid){
        return CartModel.findById(cid);
    }

    static addCart(newCart){
        return CartModel.create(newCart);
    }

    static async updateCart(cid, cart){
        await CartModel.updateOne({_id: cid}, cart);
    }

    static incQuantityProductCart(cid, pid){
        return CartModel.updateOne({$and:[{ '_id': cid },{'products.idProduct':pid}]},{ $inc: {'products.$.quantity': 1 } } );
    }

    static createProductCart(cid, pid){
        return CartModel.updateOne({ '_id': cid }, { $push: { products: { idProduct: pid, quantity: 1 } } });
    }

    static updateProductCart(cid, body){
        return CartModel.updateOne({ _id: cid}, {$set:{"products": body }});
    }

    static updateQuantityProductInCart(cid, pid, quantity){
        return CartModel.updateOne({$and:[{ '_id': cid },{'products.idProduct':pid}]},{ $set: {'products.$.quantity': quantity } } );
    }

    static deleteAllProductCart(cid){
        return CartModel.updateOne({ _id: cid}, {$set:{"products": [] }} );
    }

}