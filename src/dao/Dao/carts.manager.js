import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

export default class CartsManager {

    static get() {
        return CartModel.find();
    }

    static getCartById(cid) {
        return CartModel.findById(cid);
    };

    static async addCart() {
        const newCart = { 'products': [] }
        const productCreate = await CartModel.create(newCart);
        return productCreate;
    }

    static async addProductInCart(cid, pid) {
        let productExist = await ProductModel.exists({ _id: pid });

        if (productExist) {

            let cartExist = await CartModel.findById(cid);
            if (cartExist) {

            const updateProductCart = await CartModel.updateOne({$and:[{ '_id': cid },{'products.idProduct':pid}]},{ $inc: {'products.$.quantity': 1 } } )
                if (updateProductCart.modifiedCount) {
                    return 'Se Adiciono correctamente el valor';
                } else {
                    const cartCreado =   await CartModel.updateOne({ '_id': cid }, { $push: { products: { idProduct: pid, quantity: 1 } } });
                    if (cartCreado) {
                        return 'Se realizo la creación del producto dentro del carrito';
                    } else {
                        throw new Error('Ocurrio un error en la adición del producto en el carrito ');
                    }
                }
            } else {
                throw new Error('No existe el carrito con el ID ' + cid);
            }
        } else {
            throw new Error('El producto con id ' + cid + 'no existe en Productos');
        }
    }



}