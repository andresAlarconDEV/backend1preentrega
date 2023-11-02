(   
    function () {
        const socket = io();

        document
            .getElementById('form-addProducts')
            .addEventListener('submit', (event) => {
                event.preventDefault();
                const inputcode = document.getElementById('code');
                const inputtitle = document.getElementById('title');
                const inputdescription = document.getElementById('description');
                const inputprice = document.getElementById('price');
                const inputcategory = document.getElementById('category');
                const inputstock = document.getElementById('stock');
                const inputstatus = document.getElementById('status');
                const newProduct = {
                    code: inputcode.value,
                    title: inputtitle.value,
                    description: inputdescription.value,
                    price: inputprice.value,
                    category: inputcategory.value,
                    stock: inputstock.value,
                    status: inputstatus.value
                };
                socket.emit('newProduct', newProduct);
            
            });



        socket.on('products', (listProducts) => {
            // console.log('products', listProducts);
            const bodyTableProducts = document.getElementById('bodyTableProducts');
            bodyTableProducts.innerHTML = '';
            listProducts.map((e) => {
                bodyTableProducts.insertRow(-1).innerHTML = `<tr>
        <th scope="row">${e.code}</th>
        <td>${e.category}</td>
        <td>${e.title}</td>
        <td>${e.description}</td>
        <td>${e.price}</td>
        <td>${e.stock}</td>
        <td><button id="btn${e.id}" class="botonPapelera" value=${e.id} ">X</button></td>
        </tr>`;
            });
                const botones = document.getElementsByClassName('botonPapelera');
                const array = Array.from(botones);
                array.map((e)=> {
                    let btn = document.getElementById(e.id);
                    console.log(btn);
                    btn.addEventListener('click', () => {
                        console.log('click en boton # ' , e.value);
                        socket.emit('deleteProduct', (e.value));
                        });
                });
        });

    })();

