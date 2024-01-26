import config from '../config/config.js';

// export let productDao;
// export let cartDao;
export let userDao, productDao, cartDao, ticketDao;

switch (config.persistence) {
  case 'mongoDB':
    const {default:UserDaoMongoDB} = await import('./mongoDB/user.mongodb.dao.js');
    userDao = UserDaoMongoDB;
    const {default:ProductDaoMongoDB} = await import('./mongoDB/product.mongodb.dao.js');
    productDao = ProductDaoMongoDB;
    const {default:CartDaoMongoDB} = await import('./mongoDB/cart.mongodb.dao.js');
    cartDao = CartDaoMongoDB;
    const {default:TicketDaoMongoDB} = await import('./mongoDB/ticket.mongodb.dao.js');
    ticketDao = TicketDaoMongoDB;
    break;
}
