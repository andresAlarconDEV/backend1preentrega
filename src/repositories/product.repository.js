export default class ProductRepository {

    constructor(dao) {
        this.dao = dao;
    }


    getAll(criteria, options) {
        return this.dao.getAll(criteria, options);
    }

    getProductById(pid) {
        return this.dao.getProductById(pid);
    }

    getProductByCode(pcode) {
        return this.dao.getProductByCode(pcode);
    }

    addProduct(newProduct) {
        return this.dao.addProduct(newProduct);
    }

    updateProduct(pid, objectUpdate) {
        return this.dao.updateProduct(pid, objectUpdate);
    }

    deleteProduct(pid) {
        return this.dao.deleteProduct(pid);
    }

}