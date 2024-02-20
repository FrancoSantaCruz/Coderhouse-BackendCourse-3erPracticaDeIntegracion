import { cartsModel } from "../../models/carts.model.js";
import Manager from "./basic.dao.js";

class CartsDao extends Manager {
    constructor() {
        super(cartsModel, "products.product");
    }
}

export const cartsDao = new CartsDao();