import cartDao from "../dao/cart.dao.js"

export default class CartsService {

    static getAll (){
        return cartDao.getAll();
    }

    static getCartById(cid){
        return cartDao.getCartById(cid);
    }

    static addCart(newCart) {
        return cartDao.addCart(newCart);
    }

    static updateCart(cid, cart){
        return cartDao.updateCart(cid, cart);
    }

    static incQuantityProductCart(cid, pid){
        return cartDao.incQuantityProductCart(cid, pid);
    }

    static createProductCart(cid, pid){
        return cartDao.createProductCart(cid, pid);
    }

    static updateProductCart(cid, body){
        return cartDao.updateProductCart(cid, body);
    }

    static updateQuantityProductInCart (cid, pid, quantity){
        return cartDao.updateQuantityProductInCart(cid, pid, quantity);
    }

    static deleteAllProductCart(cid){
        return cartDao.deleteAllProductCart(cid);
    }
}