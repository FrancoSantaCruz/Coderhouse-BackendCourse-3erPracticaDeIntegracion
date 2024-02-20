import { messagesDao } from "../DAOs/MongoDB/messages.dao.js";

export const findAll = async () => {
    const messages = await messagesDao.getAll();
    return messages;
};

export const findById = async (id) => {
    const chat = await messagesDao.getById(id);
    return chat;
};

export const findByField = async (obj) => {
    const message = await messagesDao.getByField(obj);
    return message;
};

export const createOne = async (obj) => {
    const newMessage = await messagesDao.create(obj);
    return newMessage;
};

export const updateOne = async (id, obj) => {
    const updatedChat = await messagesDao.update(id, obj);
    return updatedChat;
};

export const deleteOne = async (id) => {
    const deletedChat = await messagesDao.delete(id);
    return deletedChat;
};
