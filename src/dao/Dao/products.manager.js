import ProductModel from '../models/product.model.js';

export default class ProductsManager {
    static get() {
        return ProductModel.find();
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