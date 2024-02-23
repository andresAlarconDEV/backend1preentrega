import ProductsService from "../services/product.service.js";
import { buildResponsePaginated } from '../utils/utils2.js';
import { CustomError } from "../utils/CustomError.js";
import { generatorLoginError,generatorUserIdError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";

export default class ProductsController {

    static async getAll(query, endpoint) {
        // console.log(query)
        const { limit = 4, page = 1, sort, search } = query;
        // sort por price, ASC/DESC
        // search por category
        const criteria = {};
        const options = { limit, page };
        if (sort) {
            options.sort = { price: sort };
        }
        if (search) {
            criteria.category = search;
        }
        const result = await ProductsService.getAll(criteria, options);
        const responsePaginate = buildResponsePaginated({ ...result, options, criteria, endpoint });
        return responsePaginate;
    }

    static getProductById(pid) {
        return ProductsService.getProductById(pid);

    };

    static async addProduct(req, body) {
        const { title, description, price, code, stock, status, category, thumbnail } = body;
        const { id, role } = req.user;
        let owner;

        role === "premium" ? owner = id : owner = "admin";

        // let codeExist = this.products.find(e => e.code === code);
        const codeExist = await ProductsService.getProductByCode(code);
        if (!codeExist) {
            if (title && description && price && code && stock && category) {
                const newProduct = {
                    ...body,
                    status: 1,
                    owner: owner
                }
                const productCreate = await ProductsService.addProduct(newProduct);
                return productCreate;
            } else {
                throw new Error('Todos los campos son obligatorios');
            }
        } else {
            throw new Error('el producto con codigo ' + code + ' ya se encuentra creado');
        }

    }

    static async updateProduct(pid, objectUpdate) {
        let product = await ProductsService.getProductById(pid);
        if (product) {
            const keysUpdate = Object.keys(objectUpdate);
            keysUpdate.map((e) => {
                if (e in product && e !== "_id") {
                    product[e] = objectUpdate[e]
                } else {
                    throw new Error('No existe el campo a actualizar "' + e + '"')
                }
            });
            await ProductsService.updateProduct(pid, objectUpdate);
            product = await ProductsService.getProductById(pid);
            return product;
        } else {
            throw new Error('No existe el producto con el ID ' + id);
        }
    }

    static async deleteProduct(req, pid) {

        const product = await ProductsService.getProductById(pid);
        if (product) {
            const { id, role } = req.user;

            if (role === "admin" || product.owner === id) {
                await ProductsService.deleteProduct(pid);
            } else {
                CustomError.create({
                    name: 'Invalid permissions',
                    cause: generatorLoginError(id),
                    message: 'Error - Usuario sin permisos',
                    code: EnumsError.UNAUTHORIZED_ERROR
                });
            }
        }else{
            CustomError.create({
                name: 'Elemento no encontrado',
                cause: generatorUserIdError(pid),
                message: 'Producto no encontrado',
                code: EnumsError.NOTFOUND_ERROR
            });

        }
    }

}