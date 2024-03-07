import { expect } from 'chai';
import Assert from 'assert';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');


    describe('Ecommerce Testing', function () {
        before(function (){
            this.cookie = {};
            this.email = '';
          });

    describe('Users Testing', function () {
        it('Registrar usuario de forma exitosa', async function (){
            this.email = `testmail${Date.now()/1000}@gmail.com`;
            const userMock ={
                first_name: 'Ernesto',
                last_name: 'Rojas',
                email: this.email,
                age: '18',
                role: 'user',
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
        it('Loguear usuario de forma exitosa', async function (){
            const userMock ={
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
            it('Listar productos de manera exitosa', async function (){
                const {  statusCode, ok, _body  } = await requester
                .get('/api/products')
                .set('Cookie', [`${this.cookie.key}=${this.cookie.value}`]);
                expect(statusCode).to.be.equal(200);
                expect(ok).to.be.ok;
                expect(_body).to.be.has.property('payload');
                expect(_body.status).to.be.equal('success');
                expect(Array.isArray(_body.payload)).to.be.equal(true);
            });
    });



    
//     describe('Carts Testing', function () {

//         it('Listar productos de manera exitosa', async function (){
            
//         })

//     });
});