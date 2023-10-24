const {Router} = require('express');
const { promises: fs } = require('fs');

const router = Router();

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
                    ...body,
                    id: (this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1),
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
    if (limit) {
        const arrayProduct = await products.get();
        res.status(200).json(arrayProduct.slice(0,(limit)));
    } else {
        res.status(200).json(await products.get());
    }
});


router.get('/products/:pid',async (req, res) => {
    const { pid } = req.params;  
    try {
        res.status(200).json(await products.getProductById(pid))
    }
    catch(error) {
        res.status(404).send(error.message);
            }
});

router.post('/products',async (req, res) => {
    const { body } = req;
    try {
        res.status(201).json(await products.addProduct(body));
    }
    catch(error) {
        res.status(400).send(error.message);
    }
});

router.put('/products/:pid',async (req, res) => {
    const { pid } = req.params; 
    const { body } = req;
    try {
        res.status(201).json(await products.updateProduct(pid, body));
    }
    catch(error) {
        res.status(400).send(error.message);
    }
});

router.delete('/products/:pid',async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(201).json(await products.deleteProduct(pid));
    }
    catch(error){
        res.status(404).send(error.message);
    }
});

const products = new ProductManager('./files/products.json');

// const runTest = async () => {
//     try {        
//         // console.log(await products.get())
//         //await products.addProduct("producto prueba", "Este es un producto prueba", "200", "sin imagen", "abc123", "25")
//         //console.log(await getJSONFromFile())
//         //await products.addProduct("producto prueba", "Este es un producto prueba", "400", "sin imagen", "abc123", "25")
//         console.log(await products.getProductById(4));
//         // await products.updateProduct(1, { title: 'actualizacion de prueba test', stock: '100' })
//         // await products.deleteProduct(1);
//     }
//     catch (error) {
//         console.error('Ha ocurrido un error:', error.message);
//     }
// }

// runTest();


module.exports = router;