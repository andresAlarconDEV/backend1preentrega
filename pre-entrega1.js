const { promises: fs } = require('fs');


class ProductManager {

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        this.products = await getJSONFromFile(this.path);
        console.log(this.products);
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


const runTest = async () => {
    try {
        const products = new ProductManager('./files/products.json');
        console.log(await getJSONFromFile())
        await products.addProduct("producto prueba", "Este es un producto prueba", "200", "sin imagen", "abc123", "25")
        console.log(await getJSONFromFile())
        await products.addProduct("producto prueba", "Este es un producto prueba", "400", "sin imagen", "abc123", "25")
        console.log(await products.getProductById(1));
        // await products.updateProduct(1, { title: 'actualizacion de prueba test', stock: '100' })
        // await products.deleteProduct(1);
    }
    catch (error) {
        console.error('Ha ocurrido un error', error.message);
    }
}

runTest()
