const {Router} = require('express');
const { promises: fs } = require('fs');

const router = Router();

class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        this.products = await getJSONFromFile(this.path);
        let codeExist = this.products.find(e => e.code === code);
        if (!codeExist) {
            if (title && description && price && thumbnail && code && stock) {
                this.products.push({
                    id: (this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1),
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                )
                await saveJSONToFile(this.path, this.products);
            } else {
                throw new Error('Todos los campos son obligatorios.');
            }
        } else {
            console.error(`El producto con codigo ${code} ya se encuentra creado`)
        }
        return
    }

    getProducts() {
        return this.products;
    }

    async getProductById(id) {
        this.products = await getJSONFromFile(this.path);
        let productExist = this.products.find(e => e.id === id);
        if (productExist) { return productExist }
        else {
            console.error(`Not found`)
        }

    }

    async updateProduct(id, objectUpdate) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === id);
        if (product) {
            const keysUpdate = Object.keys(objectUpdate);
            keysUpdate.map((e) => {
                (e in product) ? product[e] = objectUpdate[e] : console.error('No existe la clave a actualizar', e)
            });
            await saveJSONToFile(this.path, this.products);
            return product;
        } else {
            throw new Error('No existe el producto con el ID ', id);
        }
    }

    async deleteProduct(id) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === id);
        let ind = this.products.indexOf(product);
        this.products.splice(ind, 1);
        await saveJSONToFile(this.path, this.products);
        return;
    }

    get() {
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

router.get('/products',async (req, res) => {
    const { query } = (req);
    const { limit } = query;
    console.log(limit)
    if (limit) {
        const arrayProduct = await products.get();
        res.status(200).json(arrayProduct.slice(0,(limit)));
    } else {
        res.status(200).json(await products.get());
    }
});

router.get('/products/:pid',async (req, res) => {
    const arrayProduct = await products.get();
    const { pid } = req.params;  
    const product = arrayProduct.find((p) => {
        return p.id === parseInt(pid)
    });
    product ? res.status(200).json(product) : res.status(404).json({error: 'Producto no encontrado'});
});

const products = new ProductManager('./files/products.json');


module.exports = router;