import ProductModel from '../dao/models/product.model.js';

export default class ProductDaoMongoDB {
    static getAll(criteria, options) {
        return ProductModel.paginate(criteria, options);
    }

    static getProductById(pid) {
        return ProductModel.findById(pid);
    };

    static getProductByCode(pcode) {
        return ProductModel.findOne({'code': pcode });
    };

    static addProduct(newProduct) {
        return ProductModel.create(newProduct);
    }

    static  updateProduct(pid, objectUpdate) {
        return ProductModel.updateOne({ _id: pid }, { $set: objectUpdate });
    }

    static async deleteProduct(pid) {
        await ProductModel.deleteOne({ _id: pid });
    }

}