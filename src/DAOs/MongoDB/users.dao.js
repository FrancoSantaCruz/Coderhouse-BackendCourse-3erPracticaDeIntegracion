import { usersModel } from "../../models/users.model.js"
import Manager from "./basic.dao.js";

class UsersDao extends Manager {
  constructor() {
    super(usersModel, { path: "cart", populate: { path: "products.product" } });
  }

  async getByEmail(email) {
    return usersModel
      .findOne({ email })
      .populate({ path: "cart", populate: { path: "products.product" } });
  }
}

export const usersDao = new UsersDao();