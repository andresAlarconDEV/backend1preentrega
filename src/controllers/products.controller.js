import ProductsService from "../services/product.service.js";
import { buildResponsePaginated } from '../utils2.js';

export default class ProductsController {

    static async getAll(query, endpoint) {
        const { limit=4, page=1, sort, search } = query;
        // sort por price, ASC/DESC
        // search por category
        const criteria = {};
        const options = { limit, page };
        if (sort) {
            options.sort = {price: sort};
        }
        if (search){
            criteria.category = search;
        }
        const result = await ProductsService.getAll(criteria, options);
        const responsePaginate = buildResponsePaginated({...result, options, criteria , endpoint });
        return responsePaginate;
    }

    static getProductById(pid) {
        return ProductsService.getProductById(pid);
        
    };

    static async addProduct(body) {
        const {title, description, price, code, stock, status, category, thumbnail} = body;
        // let codeExist = this.products.find(e => e.code === code);
        const codeExist = await ProductsService.getProductByCode(code);
        if (!codeExist) {
            if (title && description && price && code && stock && category) {
                const newProduct = {
                    ...body,
                    status: 1
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
                    throw new Error('No existe el campo a actualizar "'+ e + '"')
                }
            });
            await ProductsService.updateProduct(pid, objectUpdate);
            product = await ProductsService.getProductById(pid);
            return product;
        } else {
            throw new Error('No existe el producto con el ID '+ id);
        }
    }

    static async deleteProduct(pid) {
        await ProductsService.getProductById(pid);
        await ProductsService.deleteProduct(pid);
    }

}