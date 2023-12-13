import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';

const __filename = url.fileURLToPath(import.meta.url);

const URL_BASE = 'http://localhost:8080/';

export const buildResponsePaginated = (data) => {
    const {docs, totalPages, prevPage, nextPage, page ,hasPrevPage, hasNextPage, limit, options, criteria, endpoint } = data;
    let link = URL_BASE+endpoint+'?limit='+limit;
    options.sort ? link = link+'&sort='+options.sort.price: link;
    criteria.category ? link = link +'&search='+criteria.category: link;
    return {
    status: "success",
    payload: docs.map((e)=> e.toJSON()),
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink: hasPrevPage ? link+'&page='+prevPage : null,
    nextLink: hasNextPage ? link+'&page='+nextPage : null
}
};

export const buildResponseProductsInCart = (data) => {
    const dataTemp = data[0];
    const { _id , products } = dataTemp;
    return {
        _id,
        products: products.map((e) => e.toJSON())
    }
};

export const __dirname = path.dirname(__filename);


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password); 
