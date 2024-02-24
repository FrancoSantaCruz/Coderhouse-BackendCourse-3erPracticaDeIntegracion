import { logger } from "../utils/winston.js";
import { CustomError, ErrorMessages } from "../errors/error.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

export const authValidation = (roles) => {
    return async (req, res, next) => {
        try {
            const cookie = req.cookies["token"];
            const user = jwt.verify(cookie, config.jwt_secret);
            if(!roles.includes(user.role)){
                throw CustomError.createError(ErrorMessages.USER_NOT_ALLOWED, ErrorMessages.ISSUE_SESSION, 400);
            };
            next();
        } catch (error) {
            res.status(500).send({ Type: error.name, Error: error.message });
        };
    };
};
