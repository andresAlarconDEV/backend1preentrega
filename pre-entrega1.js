
class ProductManager {

    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let codeExist = this.products.find(e => e.code === code);
        if (!codeExist) {
            if (title && description && price && thumbnail && code && stock) {
                this.products.push({
                    id: this.products.length + 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                )
            } else {
                console.error(`Todos los campos son obligatorios`)
            }
        } else {
            console.error(`El producto con codigo ${code} ya se encuentra creado`)
            
        }
        return
    }

    getProducts() {
        return this.products;
    }

    getProductById (id){
        let productExist = this.products.find(e => e.id === id);
        if(productExist){return productExist}
        else{
            console.error(`Not found`)
        }   

    }

}

let products = new ProductManager();
console.log(products.getProducts())

products.addProduct("producto prueba", "Este es un producto prueba", "200", "sin imagen", "abc123", "25")
console.log(products.getProducts())

products.addProduct("producto prueba", "Este es un producto prueba", "200", "sin imagen", "abc123", "25")



console.log(products.getProductById(1))