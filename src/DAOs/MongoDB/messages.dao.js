import { messagesModel } from "../../models/messages.model.js";
import Manager from "./basic.dao.js";

class MessagesDao extends Manager {
    constructor() {
        super(messagesModel);
    }

    async getByField(obj) {
        const res = await messagesModel.findOne(obj).populate('chats.autor').lean()
        return res
    }
}

export const messagesDao = new MessagesDao();