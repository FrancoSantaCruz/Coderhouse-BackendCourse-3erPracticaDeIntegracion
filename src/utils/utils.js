import bcrypt from 'bcrypt';
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken';
import config from "../config/config.js"

export const __dirname = join(dirname(fileURLToPath(import.meta.url)), "..");

// BCRYPT
export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
};

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData);
}

// export const generateToken = ( user ) => {
//     const token = jwt.sign(user, JWT_SECRET, {expiresIn: 180 })
//     return token;
// }

export const generateToken = (user) => {
    const token = jwt.sign(user, config.jwt_secret, { expiresIn: 240})
    return token;
}
