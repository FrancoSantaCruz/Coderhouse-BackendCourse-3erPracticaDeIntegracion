import { productsDao } from "../DAOs/MongoDB/products.dao.js"
import { customError, ErrorMessages } from "../errors/error.js";

export const findAll = async (obj) => {
    const products = await productsDao.getAllPg(obj);
    return products;
};

export const findById = async (id) => {
    const product = await productsDao.getById(id);
    if (!product) return customError.createError(ErrorMessages.PRODUCT_NOT_FOUND, ErrorMessages.ISSUE_PRODUCT);
    return product;
};

export const createOne = async (obj) => {
    const { title, description, price, status, stock, category, sale, sale_percent } = obj;
    if (!title || !description || !price || !stock || !category) {
        return customError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_PRODUCT);
    };

    const code = codeGenerator(title);

    const prod = {
        title: title,
        description: description,
        code: code,
        price: price,
        status: status ? "false" : "true",
        stock: stock,
        category: category,
        sale: sale ? "true" : "false",
        sale_percent: sale_percent ? sale_percent : 0,
    };
   
    const newProduct = await productsDao.create(prod);
    return {newProduct};
};

export const updateOne = async (obj) => {
    const { id, data } = obj 
    const { title, description, code, price, status, stock, category } = data;
    if (!title || !description || !code || !price || !status || !stock || !category || !id) {
        return customError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_PRODUCT);
    };
    const modifyProduct = await productsDao.update(id, { title, description, code, price, status, stock, category });
    return modifyProduct;
};

export const deleteOne = async (id) => {
    const { pid } = id;
    if(!pid) return customError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_PRODUCT);
    const deletedProduct = await productsDao.delete(id);
    return deletedProduct;
};

function codeGenerator(title){
    let random_code = "";
    let random = 0;
    for (let i = 0; i < 5; i++) {
        random = Math.floor(Math.random() * title.length);
        random_code = random_code.concat(random);
    };
    return random_code;
}