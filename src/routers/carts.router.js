const { Router } = require('express');
const { promises: fs } = require('fs');
const products = require("../productManager")


const router = Router();

class CartManager {


    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async addCart() {
        this.carts = await getJSONFromFile(this.path);
        const newCart = {
            id: (this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1),
            products: []
        }
        this.carts.push(newCart);
        await saveJSONToFile(this.path, this.carts);
        return newCart;
    }

    async getCartById(id) {
        this.carts = await getJSONFromFile(this.path);
        let cartExist = this.carts.find(e => e.id === parseInt(id));
        if (cartExist) { return cartExist.products }
        else {
            throw new Error('No existe el Carrito con el ID ' + id);
        }
    }

    async addProductInCart(cid, pid) {
        this.carts = await getJSONFromFile(this.path);
        let carts = this.carts.find(cart => cart.id === parseInt(cid));
        if (carts) {
            let product = carts.products.find(product => product.idProduct === parseInt(pid));
            if (product) {
                product.quantity++;
            } else {
                let productExist = await products.getProductById(pid);
                if (productExist) {
                    let newProduct = {
                        "idProduct": parseInt(pid),
                        "quantity": 1
                    };
                    carts.products.push(newProduct);
                }
            }

            await saveJSONToFile(this.path, this.carts);
            return carts;
        } else {
            throw new Error('No existe el carrito con el ID ' + cid);
        }
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

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        res.status(200).json(await carts.getCartById(cid))
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/carts', async (req, res) => {
    try {
        res.status(201).json(await carts.addCart());
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        res.status(201).json(await carts.addProductInCart(cid, pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

const carts = new CartManager('./files/carts.json');

module.exports = router;