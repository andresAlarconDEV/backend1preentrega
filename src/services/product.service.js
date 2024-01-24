// import  { productDao } from "../dao/factory.js"
// import productDao from "../dao/mongoDB/product.mongodb.dao.js";
import { productsRepository } from "../repositories/index.js";

export default class ProductsService {
static getAll (criteria, options){
    return productsRepository.getAll(criteria, options);
}

static getProductById (pid){
    return productsRepository.getProductById(pid);
}

static getProductByCode (pcode){
    return productsRepository.getProductByCode(pcode);
}

static addProduct (newProduct){
    return productsRepository.addProduct(newProduct);
}

static updateProduct (pid, objectUpdate){
    return productsRepository.updateProduct(pid, objectUpdate);
}

static deleteProduct (pid){
    return productsRepository.deleteProduct(pid);
}


}