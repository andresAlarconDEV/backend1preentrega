import CartsService from "../services/cart.service.js";
import ProductsService from "../services/product.service.js";
import { buildResponsePaginated } from '../utils/utils2.js';
import UsersService from "../services/user.service.js";
import TicketsController from "./tickets.controller.js";
import { CustomError } from "../utils/CustomError.js";
import { generatorLoginError,generatorUserIdError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";
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
        await UsersService.postCartUser(req.user.id, cartCreate._id);
        return cartCreate;
    }

    static async addProductInCart(cid, pid, req) {
        let productExist = await ProductsService.getProductById(pid);
        const uid = req.user.id;
        
        if (productExist) {
            
            if (!(productExist.owner === uid)) {

                let cartExist = await CartsService.getCartById(cid);

                if (cartExist) {

                    const updateProductCart = await CartsService.incQuantityProductCart(cid, pid);
                    if (updateProductCart.modifiedCount) {
                        return 'Se Adiciono correctamente el valor';
                    } else {
                        const cartCreado = await CartsService.createProductCart(cid, pid);
                        if (cartCreado) {
                            return 'Se realizo la creación del producto dentro del carrito';
                        } else {
                            throw new Error('Ocurrio un error en la adición del producto en el carrito ');
                        }
                    }
                } else {
                    throw new Error('No existe el carrito con el ID ' + cid);
                }
            }else{
                CustomError.create({
                    name: 'Permiso no autorizado',
                    cause: generatorLoginError(productExist.owner),
                    message: 'Usuario no puede agregar un producto propio',
                    code: EnumsError.UNAUTHORIZED_ERROR
                });
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
        const product = cart.products.splice(position, 1);
        await CartsService.updateCart(cid, cart);
        return product;
    };

    static async updateProductCart(cid, body) {
        const modify = await CartsService.updateProductCart(cid, body);
        if (modify.matchedCount) {
            return modify;
        } else {
            throw new Error('No existe el  carrito con el ID ' + cid);
        }
    };

    static async updateQuantityProductInCart(cid, pid, body) {
        const { quantity } = body;
        const modify = await CartsService.updateQuantityProductInCart(cid, pid, quantity);
        if (modify.matchedCount) {
            return modify;
        } else {
            throw new Error('No existe el producto en el carrito con el ID ' + pid);
        }
    };

    static async deleteAllProductCart(cid) {
        const modify = await CartsService.deleteAllProductCart(cid);
        if (modify.matchedCount) {
            return modify;
        } else {
            throw new Error('No existe el carrito con el ID ' + cid);
        }
    }

    static async postPurchase(req) {
        const { cid } = req.params;
        const email = req.user.email;
        const cartsUser = req.user.carts;
        let productNoStock = [];
        let productStock = [];
        let responseTicket = {};
        const cartFind = cartsUser.find((e) => e.idCart === cid);
        if (cartFind) {
            const cart = await CartsService.getCartById(cid);
            if (cart.products.length >= 1) {
                for (const e of cart.products) {
                    let product = await ProductsService.getProductById(e.idProduct);
                    if (e.quantity <= product.stock) {
                        product.stock = product.stock - e.quantity;
                        await ProductsService.updateProduct(product._id, { "stock": product.stock });
                        let productQuantity = { id: e.idProduct, quantity: e.quantity, price: product.price };
                        productStock.push(productQuantity);
                    }
                    else {
                        productNoStock.push(e);
                    }
                };

                if (productNoStock.length >= 1) {
                    await CartsController.updateProductCart(cid, productNoStock);
                    responseTicket.productosSinStock = productNoStock;
                } else {
                    await CartsController.deleteAllProductCart(cid);
                }

                if (productStock.length >= 1) {
                    const amount = productStock.reduce((total, producto) =>
                        total + (producto.price * producto.quantity), 0);
                    const dataTicket = {
                        amount: amount,
                        purchaser: email
                    };
                    const ticketCreate = await TicketsController.postTicket(dataTicket);
                    responseTicket.ticketInfo = ticketCreate;
                }
                return responseTicket
            }
            else {
                throw new Error('No hay productos en el carrito');
            }
        } else {
            throw new Error('ID de Cart no es encontrado a su usuario');
        }
        // return CartsService.postPurchase(cid, email);
    }

}