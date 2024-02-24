import { CustomError, ErrorMessages } from "../errors/error.js";

import {
    findAll, 
    findById,
    createOne,
    addProd,
    removeProd,
    clear,
    buy,
    deleteOne
} from "../services/carts.service.js";

export const findAllCarts = async (req,res) => {
    try {
        const carts = await findAll();
        res.status(200).send({ message: 'All Carts', carts });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};


export const findCart = async (req, res) => {
    const { cid } = req.params
    try {
        const cart = await findById(cid);
        res.status(200).send({ message: 'Cart found', cart });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const newCart = async (req, res) => {
    try {
        const newCart = await createOne({ products: [] });
        res.status(200).send({ message: 'New cart', cart: newCart });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const addProdToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { cart } = await addProd({ cid, pid, user: req.user })
        res.status(200).send({message: 'Product added.', cart})
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const removeProdFromCart = async (req, res) => {
    try {
        const { updatedCart } = await removeProd(req.params);
        res.status(200).send({message: 'Product removed.', cart: updatedCart})
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const clearCart = async (req, res) => {
    try {
        const { emptyCart } = await clear(req.params)
        res.status(200).send({ message: "Cart cleared" , cart: emptyCart});
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const buyCart = async (req, res) => {
    try {
        if (!req.user) throw CustomError.createError(ErrorMessages.USER_NOT_LOGGED, ErrorMessages.ISSUE_SESSION, 401);
        const user = req.user;
        const { cart_aux, ticket } = buy(user)
        res.status(200).send({ message: "Bought complete!", "Unprocessed Products": cart_aux, ticket });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    };
};

export const deleteCart = async(req, res) => {
    const { cid } = req.params;
    try {
        const deletedCart = await deleteOne(cid);
        res.status(200).send({ message: "Cart deleted" , cart: deletedCart});
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
}