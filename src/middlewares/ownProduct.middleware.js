import { logger } from "../utils/winston.js";
import { userOn } from "../controllers/sessions.controller.js";
import { findById } from "../services/products.service.js";
import { CustomError, ErrorMessages } from "../errors/error.js";

export const ownerValidation = () => {
    return async (req, res, next) => {
        try {
            
            const user = await userOn(req, res);
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