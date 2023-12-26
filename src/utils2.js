import path from 'path';
import url from 'url';
import bcrypt from 'bcrypt';

const __filename = url.fileURLToPath(import.meta.url);

const URL_BASE = 'http://localhost:8080/';

export const buildResponsePaginated = (data) => {
    const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, limit, options, criteria, endpoint } = data;
    let link = URL_BASE + endpoint + '?limit=' + limit;
    options.sort ? link = link + '&sort=' + options.sort.price : link;
    criteria.category ? link = link + '&search=' + criteria.category : link;
    return {
        status: "success",
        payload: docs.map((e) => e.toJSON()),
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? link + '&page=' + prevPage : null,
        nextLink: hasNextPage ? link + '&page=' + nextPage : null
    }
};

export const buildResponseProductsInCart = (data) => {
    const dataTemp = data[0];
    const { _id, products } = dataTemp;
    return {
        _id,
        products: products.map((e) => e.toJSON())
    }
};

export const __dirname = path.dirname(__filename);


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

// export const generateToken = (user) => {
//     const {id, first_name, email } = user;
//     const payload = { id, first_name, email };
//     return JWT.sign(payload, JWT_SECRETE, { expiresIn: '5m' });
// }

// export const validateToken = (token) => {
//     return new Promise((resolve, reject) => {
//         JWT.verify(token, JWT_SECRETE, (error, payload) => {
//             if (error){
//                 return reject(error)
//             }
//             resolve(payload);
//         })
//     })
// }

export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
        }
        if (!payload) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next);
};

export const authRolesMiddleware = (role) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { role: userRole } = req.user;
    if (userRole !== role) {
        return res.status(403).json({ message: 'No permissions' });
    }
    next();
};
