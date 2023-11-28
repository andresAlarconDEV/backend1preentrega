import ProductModel from '../models/product.model.js';
import { buildResponsePaginated } from '../../utils2.js';

export default class ProductsManager {
    static async get(query, endpoint) {
                const { limit=10, page=1, sort, search } = query;
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
        const result = await ProductModel.paginate(criteria, options);
        // console.log(result);
        const responsePaginate = buildResponsePaginated({...result, options, criteria , endpoint });
        return responsePaginate;
    }

    static getProductById(pid) {
        let product = ProductModel.findById(pid);
        return product;
    };

    static async addProduct(body) {
        const {title, description, price, code, stock, status, category, thumbnail} = body;
        // let codeExist = this.products.find(e => e.code === code);
        const codeExist = await ProductModel.findOne({'code': code });
        if (!codeExist) {
            if (title && description && price && code && stock && status && category) {
                const newProduct = {
                    ...body,
                    status: 1
                }
                const productCreate = await ProductModel.create(newProduct);
                return productCreate;
            } else {
                throw new Error('Todos los campos son obligatorios.');
            }
        } else {
            throw new Error('el producto con codigo ' + code + ' ya se encuentra creado');
        }
    }


    static async updateProduct(pid, objectUpdate) {
        let product = await ProductModel.findById(pid);
        console.log(product);
        if (product) {
            const keysUpdate = Object.keys(objectUpdate);
            keysUpdate.map((e) => {
                if (e in product && e !== "_id") {
                    product[e] = objectUpdate[e]
                } else {
                    throw new Error('No existe el campo a actualizar "'+ e + '"')
                }
            });
            await ProductModel.updateOne({ _id: pid }, { $set: objectUpdate });
            product = await ProductModel.findById(pid);
            return product;
        } else {
            throw new Error('No existe el producto con el ID '+ id);
        }
    }

    static async deleteProduct(pid) {
        await ProductModel.findById(pid);
        await ProductModel.deleteOne({ _id: pid });
    }

}