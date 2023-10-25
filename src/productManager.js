const { promises: fs } = require('fs');


class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(body) {
        this.products = await getJSONFromFile(this.path);
        const {title, description, price, code, stock, status, category, thumbnail} = body;
        let codeExist = this.products.find(e => e.code === code);
        if (!codeExist) {
            if (title && description && price && code && stock && status && category) {
                const newProduct = {
                    id: (this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1),
                    ...body,
                    status: 1
                }
                this.products.push(newProduct)
                await saveJSONToFile(this.path, this.products);
                return newProduct;
            } else {
                throw new Error('Todos los campos son obligatorios.');
            }
        } else {
            throw new Error('el producto con codigo ' + code + ' ya se encuentra creado');
        }
    }

    getProducts() {
        return this.products;
    }

    async getProductById(id) {
        this.products = await getJSONFromFile(this.path);
        let productExist = this.products.find(e => e.id === parseInt(id));
        if (productExist) { return productExist }
        else {
            throw new Error ('No existe el producto con el ID '+ id);
        }
    }

    async updateProduct(id, objectUpdate) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === parseInt(id));
        if (product) {
            const keysUpdate = Object.keys(objectUpdate);
            keysUpdate.map((e) => {
                if (e in product && e !== "id") {
                    product[e] = objectUpdate[e]
                } else {
                    throw new Error('No existe el campo a actualizar "'+ e + '"')
                }
            });
            await saveJSONToFile(this.path, this.products);
            return product;
        } else {
            throw new Error('No existe el producto con el ID '+ id);
        }
    }

    async deleteProduct(id) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === parseInt(id));
        if (product) {
            this.products = this.products.filter(product => product.id !== parseInt(id));
            await saveJSONToFile(this.path, this.products);
        }else {
            throw new Error('No existe el producto con el ID '+ id);
        }
        return;
    }

    async get() {
        return getJSONFromFile(this.path);
    }

}

const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
}

const getJSONFromFile = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        return [];
    }
    const content = await fs.readFile(path, 'utf-8');
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
}

const products = new ProductManager('./files/products.json');


module.exports = products;