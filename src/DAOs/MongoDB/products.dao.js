import { productsModel } from "../../models/products.model.js";
import Manager from "./basic.dao.js";

class ProductsDao extends Manager {
    constructor() {
        super(productsModel);
    };

    async getAllPg(options) {
        const { limit = 10, page = 1, category, status, sort } = options;
        let filters = {};

        const opt = {
            page,
            limit,
            sort: sort == "-1" ? { price: -1 } : { price: 1 }
        };

        if (category) filters.category = category
        if (status) filters.status = status

        const products = await productsModel.paginate(filters, opt);
        const info = {
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : null
        };
        let aux = JSON.stringify(info);
        aux = JSON.parse(aux);
        return aux;
    };
};

export const productsDao = new ProductsDao();