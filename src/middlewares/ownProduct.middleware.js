import { logger } from "../utils/winston.js";
import { current } from "../controllers/sessions.controller.js";
import { findById } from "../services/products.service.js";
import { CustomError, ErrorMessages } from "../errors/error.js";
import config from "../config/config.js";

export const ownerValidation = () => {
    return async (req, res, next) => {
        try {
            const cookie = req.cookies["token"];
            const user = jwt.verify(cookie, config.jwt_secret);
            const { pid } = req.params
            const product = await findById(pid);
            if (!product) throw CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND, ErrorMessages.ISSUE_PRODUCT, 404);
            if (product.owner !== user.email && user.role !== "admin") {
                throw CustomError.createError(ErrorMessages.USER_NOT_ALLOWED, ErrorMessages.ISSUE_PRODUCT, 401);
            }
            req.user.isOwner = true
            
            next();
        } catch (error) {
            next(error)
        }

    }
}