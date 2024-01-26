// import { cartDao } from "../dao/factory.js"
// import cartDao from "../dao/mongoDB/cart.mongodb.dao.js";
import { cartsRepository } from "../repositories/index.js";

export default class CartsService {

    static getAll (){
        return cartsRepository.getAll();
    }

    static getCartById(cid){
        return cartsRepository.getCartById(cid);
    }

    static addCart(newCart) {
        return cartsRepository.addCart(newCart);
    }

    static updateCart(cid, cart){
        return cartsRepository.updateCart(cid, cart);
    }

    static incQuantityProductCart(cid, pid){
        return cartsRepository.incQuantityProductCart(cid, pid);
    }

    static createProductCart(cid, pid){
        return cartsRepository.createProductCart(cid, pid);
    }

    static updateProductCart(cid, body){
        return cartsRepository.updateProductCart(cid, body);
    }

    static updateQuantityProductInCart (cid, pid, quantity){
        return cartsRepository.updateQuantityProductInCart(cid, pid, quantity);
    }

    static deleteAllProductCart(cid){
        return cartsRepository.deleteAllProductCart(cid);
    }

}