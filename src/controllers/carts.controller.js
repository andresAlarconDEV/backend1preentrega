import CartsService from "../services/cart.service.js";
import ProductsService from "../services/product.service.js";
import { buildResponsePaginated } from '../utils2.js';
import UsersService from "../services/user.service.js";
// import

export default class CartsController {

    static getAll() {
        return CartsService.getAll();
    }

    static getCartById(cid) {
        return CartsService.getCartById(cid);
    }

    static async addCart(req) {
        const newCart = { 'products': [] }
        const cartCreate = await CartsService.addCart(newCart);
        await UsersService.postCartUser(req.user.id,cartCreate._id);
        return cartCreate;
    }

    static async addProductInCart(cid, pid){
        let productExist = await ProductsService.getProductById(pid);

        if (productExist) {

            let cartExist = await CartsService.getCartById(cid);
            if (cartExist) {

            const updateProductCart = await CartsService.incQuantityProductCart(cid, pid);
                if (updateProductCart.modifiedCount) {
                    return 'Se Adiciono correctamente el valor';
                } else {
                    const cartCreado =   await CartsService.createProductCart(cid, pid);
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

    static async deleteProductInCart(cid, pid) {
        const cart = await CartsService.getCartById(cid);
        const position = cart.products.findIndex((e) => {
            return e.idProduct == pid;
        });
        if (position === -1) {
            throw new Error('No existe el producto en el carrito con el ID ' + pid);
        }
        const product = cart.products.splice(position,1);
        await CartsService.updateCart(cid, cart);
        return product;
    };

    static async updateProductCart(cid, body) {
        const modify = await CartsService.updateProductCart(cid, body);
        if(modify.matchedCount) {
            return modify;
        } else {
            throw new Error('No existe el  carrito con el ID ' + cid);
        }
    };

    static async updateQuantityProductInCart (cid, pid, body){
        const { quantity } = body;
        const modify = await CartsService.updateQuantityProductInCart(cid, pid, quantity);
        if(modify.matchedCount) {
            return modify;
        } else {
            throw new Error('No existe el producto en el carrito con el ID ' + pid);
        }
    };

    static async deleteAllProductCart(cid) {
        const modify = await CartsService.deleteAllProductCart(cid);
        if(modify.matchedCount) {
            return modify;
        } else {
            throw new Error('No existe el carrito con el ID ' + cid);
        }
    }

    static async postPurchase(req) {
        const { cid } = req.params;
        const email = req.user.email;
        const cartsUser = req.user.carts;
        const cartFind = cartsUser.find((e) => e.idCart===cid);
        if (cartFind) {
            const cart = await CartsService.getCartById(cid);
            // const products = await ProductsService.getAll();
            // console.log(cart.products);
            cart.products.map(async (e)=> {
                let product = await ProductsService.getProductById(e.idProduct);
                if (e.quantity<=product.stock){
                    console.log("tiene Stock");
                }
                else {
                    console.log("no tiene stock");
                }
            })
        } else {
            throw new Error('ID de Cart no es encontrado a su usuario');
        }
        // return CartsService.postPurchase(cid, email);
    }

}