import path, {join} from 'path';
import config from '../config/config.js';
import url from 'url';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import passport from 'passport';
import { faker } from '@faker-js/faker';
import { CustomError } from "../utils/CustomError.js";
import { validateTokenError } from "../utils/CauseMessageError.js";
import EnumsError from "../utils/EnumsError.js";

const __filename = url.fileURLToPath(import.meta.url);
export const baseDir = path.dirname(__filename);
export const __dirname = join(baseDir, '..');

const URL_BASE = config.urlBase;
const JWT_SECRET = config.jwtSecret;
const JWT_SECRETRECOVERY = config.jwtSecretRecovery;

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
    const dataTemp = data;
    const { _id, products } = dataTemp;
    return {
        _id,
        products: products.map((e) => e.toJSON())
    }
};

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
    const payload = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        carts: user.carts
    };
    return JWT.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export const generateRecoveryToken = (email) => {
    const payload = {
        email: email
    };
    return JWT.sign(payload, JWT_SECRETRECOVERY, { expiresIn: '60m' });
}

export const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRET, (error, payload) => {
            if (error){
                return reject(error)
            }
            resolve(payload);
        })
    })
}

export const validateRecoveryToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRETRECOVERY, (error, payload) => {
            if (error){
                CustomError.create({
                    name: 'Invalid Token',
                    cause: validateTokenError(token),
                    message: 'El Token se ha vencido o es invalido',
                    code: EnumsError.TOKEN_ERROR,
                });
            }
            resolve(payload);
        });
    })
}

export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
        }
        if (!payload) {
            console.log(info.message);
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
    if (!role.includes(userRole)) {
        return res.status(403).json({ message: 'No permissions' });
    }
    next();
};

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        code: faker.string.alphanumeric({ length: 10 }),
        price: faker.commerce.price({ min: 10000, max: 999999 }),
        category: faker.commerce.department(),
        stock: faker.number.int({ min: 1, max: 999 }),
        thumbnail: faker.image.url(),
        status: faker.datatype.boolean()
    }
}