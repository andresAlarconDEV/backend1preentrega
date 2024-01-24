export default class CartRepository {

    constructor(dao) {
        this.dao = dao;
      }

    getAll (){
        return this.dao.getAll();
    }

    getCartById(cid){
        return this.dao.getCartById(cid);
    }

    addCart(newCart) {
        return this.dao.addCart(newCart);
    }

    updateCart(cid, cart){
        return this.dao.updateCart(cid, cart);
    }

    incQuantityProductCart(cid, pid){
        return this.dao.incQuantityProductCart(cid, pid);
    }

    createProductCart(cid, pid){
        return this.dao.createProductCart(cid, pid);
    }

    updateProductCart(cid, body){
        return this.dao.updateProductCart(cid, body);
    }

    updateQuantityProductInCart (cid, pid, quantity){
        return this.dao.updateQuantityProductInCart(cid, pid, quantity);
    }

    deleteAllProductCart(cid){
        return this.dao.deleteAllProductCart(cid);
    }
}