import { logger } from "../utils/winston.js";
import { userOn } from "../controllers/sessions.controller.js";
import { CustomError, ErrorMessages } from "../errors/error.js";

export const authValidation = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await userOn(req, res);
            if(!roles.includes(user.role) && !req.user.isOwner){
                throw CustomError.createError(ErrorMessages.USER_NOT_ALLOWED, ErrorMessages.ISSUE_SESSION, 400);
            }
            next();
        } catch (error) {
            next(error)
        }
        
    }
}

// http://localhost:8080/products/65d53faa7f360dceeea9a060