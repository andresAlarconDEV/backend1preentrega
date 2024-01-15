import productDao from "../dao/product.dao.js"

export default class ProductsService {
static getAll (criteria, options){
    return productDao.getAll(criteria, options);
}

static getProductById (pid){
    return productDao.getProductById(pid);
}

static getProductByCode (pcode){
    return productDao.getProductByCode(pcode);
}

static addProduct (newProduct){
    return productDao.addProduct(newProduct);
}

static updateProduct (pid, objectUpdate){
    return productDao.updateProduct(pid, objectUpdate);
}

static deleteProduct (pid){
    return productDao.deleteProduct(pid);
}


}