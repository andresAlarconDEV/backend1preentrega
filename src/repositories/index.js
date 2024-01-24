import { userDao, cartDao, productDao } from '../dao/factory.js';

import UsersRepository from './users.repository.js';
import CartsRepository from './cart.repository.js';
import ProductsRepository from './product.repository.js';

export const usersRepository = new UsersRepository(userDao);
export const cartsRepository = new CartsRepository(cartDao);
export const productsRepository = new ProductsRepository(productDao);