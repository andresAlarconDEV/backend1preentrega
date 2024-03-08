import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');


describe('Ecommerce Testing', function () {
    before(function () {
        this.cookie = {};
        this.email = '';
        this.ids = {};
    });

    describe('Users Testing', function () {
        it('Registrar usuario de forma exitosa', async function () {
            this.email = `testmail${Date.now() / 1000}@gmail.com`;
            const userMock = {
                first_name: 'Ernesto',
                last_name: 'Rojas',
                email: this.email,
                age: '18',
                role: 'premium',
                password: '1q2w3e4r',
            };
            const {
                statusCode,
                ok,
                _body,
            } = await requester.post('/api/sessions/register').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('_id');
            expect(_body.password).to.be.not.equal(userMock.password);
        });

        it('Loguear usuario de forma exitosa', async function () {
            const userMock = {
                email: this.email,
                password: '1q2w3e4r',
            };
            const {
                headers,
                statusCode,
                ok,
            } = await requester.post('/api/sessions/login').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            const [key, _value] = headers['set-cookie'][0].split('=');
            const value = _value.split(";");
            this.cookie.key = key;
            this.cookie.value = value[0];

        });

        it('Obtener su informacion el usuario de forma exitosa', async function () {
            const {
                statusCode,
                ok,
                _body,
            } = await requester
                .get('/api/sessions/current')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('fullname');
            expect(_body).to.be.has.property('email', this.email);
        })
    });


    describe('Products Testing', function () {
        before(function () {

        });
        it('Listar productos de manera exitosa', async function () {
            const { statusCode, ok, _body } = await requester
                .get('/api/products')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('payload');
            expect(_body.status).to.be.equal('success');
            expect(Array.isArray(_body.payload)).to.be.equal(true);
        });

        it('Crear productos de manera exitosa', async function () {
            const productMock = {
                "price": 123000,
                "title": "Cortavientos verde",
                "stock": 14,
                "category": "otro",
                "description": "Tela semi-impermeable • Banda Siliconada parte baja • Cremallera refle…",
                "code": Date.now()
            };
            const { statusCode, ok, _body } = await requester
                .post('/api/products')
                .send(productMock)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('_id');
            this.ids.pid = _body._id;
        });

        it('Modificar productos de manera exitosa', async function () {
            const updatePropertyProd = {
                "price": 65000
            }
            const { statusCode, ok, _body } = await requester
                .put(`/api/products/${this.ids.pid}`)
                .send(updatePropertyProd)
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(202);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('_id');
            expect(_body.price).to.be.equal(updatePropertyProd.price);
        })
    });



    describe('Carts Testing', function () {
        it('listar los carritos existentes', async function () {
            const { statusCode, ok, _body } = await requester
                .get('/api/carts')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.ok;
            expect(_body[0]).to.be.has.property('_id');
            expect(Array.isArray(_body[0].products)).to.be.equal(true);
            // console.log(statusCode, ok, _body );
        })

        it('Crear un carrito de manera existosa', async function () {
            const { statusCode, ok, _body } = await requester
                .post('/api/carts')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
            expect(statusCode).to.be.equal(201);
            expect(ok).to.be.ok;
            expect(_body).to.be.has.property('_id');
            this.ids.cid = _body._id;
        })

        it('No puede agregar un producto al carrito el mismo usuario que creo el producto', async function () {
            const { statusCode, ok, text }= await requester
            .post(`/api/carts/${this.ids.cid}/product/${this.ids.pid}`)
            .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
        expect(statusCode).to.be.equal(404);
        expect(ok).to.be.not.ok;
        expect(text).to.be.equal("Usuario no puede agregar un producto propio");
        })
    })


});