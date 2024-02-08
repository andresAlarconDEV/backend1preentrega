import EnumsError from "../utils/EnumsError.js";
import { logger } from "../config/logger.js";

export const errorHandlerMiddleware = (error, req, res, next) => {
    logger.error(error.cause || error.message);
    switch (error.code) {
        case EnumsError.BAD_REQUEST_ERROR:
            res.status(400).json({ status: 'error', message: error.message });
            break;
        case EnumsError.INVALID_PARAMS_ERROR:
            res.status(400).json({ status: 'error', message: error.message });
            break;
        case EnumsError.DATA_BASE_ERROR:
            res.status(503).json({ status: 'error', message: error.message });
            break;
        case EnumsError.ROUTING_ERROR:
            res.status(401).json({ status: 'error', message: error.message });
            break;
        case EnumsError.NOTFOUND_ERROR:
            res.status(404).json({ status: 'error', message: error.message });
            break;
        case EnumsError.UNAUTHORIZED_ERROR:
            res.status(401).json({ status: 'error', message: error.message });
            break;
        default:
            res.status(500).json({ status: 'error', message: error.message });
            break;
    }
}