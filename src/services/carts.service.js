import { cartsDao } from "../DAOs/MongoDB/carts.dao.js";
import { productsDao } from "../DAOs/MongoDB/products.dao.js";
import { ticketsDao } from "../DAOs/MongoDB/tickets.dao.js";
import { CustomError, ErrorMessages } from "../errors/error.js";
import { logger } from "../utils/winston.js";

export const findAll = async (obj) => {
    const carts = await cartsDao.getAll();
    if (!carts) throw CustomError.createError("Any cart created yet", ErrorMessages.ISSUE_CART, 404);
    return carts;
};

export const findById = async (cid) => {
    if (!cid) throw CustomError.createError(ErrorMessages.MISSING_DATA, ErrorMessages.ISSUE_CART, 400);
    const cart = await cartsDao.getById(cid);
    if (!cart) throw CustomError.createError(ErrorMessages.CART_NOT_FOUND, ErrorMessages.ISSUE_CART, 400);
    return cart;
};

export const createOne = async (obj) => {
    const newCart = await cartsDao.create(obj);
    return newCart;
};

export const updateOne = async (id, obj) => {
    const updatedCart = await cartsDao.update({ _id: id }, obj);
    return updatedCart;
};

export const deleteOne = async (id) => {
    const deletedCart = await cartsDao.delete(id);
    return deletedCart;
};

export const addProd = async (obj) => {
    const { cid, pid } = obj;
    const { email } = obj.user;

    const cart = await cartsDao.getById(cid)
    if (!cart) throw CustomError.createError(ErrorMessages.CART_NOT_FOUND, ErrorMessages.ISSUE_CART, 404);

    const product = await productsDao.getById(pid);
    if (!product) throw CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND, ErrorMessages.ISSUE_PRODUCT, 404);

    if (product.owner === email) throw CustomError.createError(ErrorMessages.CANT_ADD_OWN_PROD, ErrorMessages.ISSUE_PRODUCT, 400);

    const prod_idx = cart.products.findIndex((prod) => prod.product._id.equals(pid));
    // Como prod.product son tipo de datos ObjectId de mongoose
    // necesitamos usar .equals() para comparar con otro tipo de dato

    if (prod_idx === -1) {
        cart.products.push({ product: pid, quantity: 1 })
    } else {
        cart.products[prod_idx].quantity++
    }

    await cartsDao.update(cid, cart)
    return { cart }
}

export const removeProd = async (obj) => {
    const { cid, pid } = obj;
    const cart = await cartsDao.getById(cid);
    if (!cart) throw CustomError.createError(ErrorMessages.CART_NOT_FOUND, ErrorMessages.ISSUE_CART, 404);

    const product = await productsDao.getById(pid);
    if (!product) throw CustomError.createError(ErrorMessages.PRODUCT_NOT_FOUND, ErrorMessages.ISSUE_PRODUCT, 404);

    const idx = cart.products.findIndex((p) => p.product._id.equals(pid));
    if (idx === -1) {
        throw CustomError.createError(ErrorMessages.PRODUCT_NOT_IN_CART, ErrorMessages.ISSUE_PRODUCT, 400);
    } else {
        cart.products[idx].quantity--
        if (cart.products[idx].quantity <= 0) {
            cart.products.splice(idx, 1);
        }
        const updatedCart = await cartsDao.update(cid, cart)
    }
    return { updatedCart };
}

export const clear = async (id) => {
    const cart = await cartsDao.getById(id)
    cart.products = []
    const emptyCart = await cartsDao.update({ _id: id }, cart);
    return { emptyCart };
}

export const buy = async (user) => {
    const cart = user.cartInfo;
    let cart_total = 0;
    let cart_aux = [];

    if (!cart) throw CustomError.createError(ErrorMessages.CART_NOT_FOUND, ErrorMessages.ISSUE_CART, 404);
    if (!user) throw CustomError.createError(ErrorMessages.USER_NOT_LOGGED, ErrorMessages.ISSUE_SESSION, 401);

    for (let i = 0; i < cart.length; i++) {
        let prodDB = await productsDao.getById(cart[i].product._id);

        if (prodDB.stock >= cart[i].quantity) {
            prodDB.stock = prodDB.stock - cart[i].quantity;
            if (prodDB.stock == 0) prodDB.status = false;
            await productsDao.update(prodDB._id, prodDB);

            cart_total += cart[i].subtotal;
        } else {
            cart_aux.push(cart[i]);
        };
    };

    const cartDB = await cartsDao.getById(user.cart._id);
    cartDB.products = cart_aux;
    await cartsDao.update(user.cart._id, cartDB);

    const ticket = await ticketsDao.create(cart_total, user.email);
    return { cart_aux, ticket };
};
