import { usersDao } from "../DAOs/MongoDB/users.dao.js";

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

export const updateOne = async (obj) => {
    const { id, ...data } = obj;
    const updatedUser = await usersDao.update(id, data);
    return updatedUser;
};

export const deleteOne  = async (id) => {
    const user = await usersDao.delete(id);
    return user;
};
