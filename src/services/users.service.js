import { usersDao } from "../DAOs/MongoDB/users.dao.js";
import { CustomError, ErrorMessages } from "../errors/error.js";

export const findAll = async () => {
    const users = await usersDao.getAll();
    return users;
};

export const findById = async (id) => {
    const user = await usersDao.getById(id);
    return user;
};

export const findByEmail = async (email) => {
    const user = await usersDao.getByEmail(email);
    return user;
};

export const createOne = async (obj) => {
    const newUser = await usersDao.create(obj);
    return newUser
}

export const updateOne = async (id, obj) => {
    const updatedUser = await usersDao.update(id, obj);
    return updatedUser;
};

export const deleteOne  = async (id) => {
    const user = await usersDao.delete(id);
    return user;
};

export const updateRole = async (user) => {
    const obj = await usersDao.getByEmail(user.email);
    if(!obj) throw CustomError.createError(ErrorMessages.USER_NOT_FOUND, ErrorMessages.ISSUE_SESSION);
    if(obj.role == "user"){
        obj.role = "premium"
    } else {
        obj.role = "user"
    }
    const updatedUser = await usersDao.update(user._id, obj);
    return obj.role;
}