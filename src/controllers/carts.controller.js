import { Router } from "express";
import { customError, ErrorMessages } from "../errors/error.js";

import {
    findById,
    createOne,
    addProd,
    removeProd,
    clear,
    buy
} from "../services/carts.service.js";

const router = Router();

export const findCart = async (req, res, next) => {
    try {
        const cart = await findById(req.params);
        res.status(200).json({ message: 'Cart found', cart });
    } catch (error) {
        next(error);
    };
};

export const newCart = async (req, res, next) => {
    try {
        const newCart = await createOne({ products: [] });
        res.status(200).json({ message: 'New cart', cart: newCart });
    } catch (error) {
        next(error);
    };
};

export const addProdToCart = async (req, res, next) => {
    try {
        const { cart } = addProd(req.params)
        res.status(200).redirect('back')
        // res.status(200).json({message: 'Product added.', cart})
    } catch (error) {
        next(error);
    };
};

export const removeProdFromCart = async (req, res, next) => {
    try {
        const { updatedCart } = await removeProd(req.params);
        res.status(200).redirect('back');
        // res.status(200).json({message: 'Product removed.', updatedCart})
    } catch (error) {
        next(error);
    };
};

export const clearCart = async (req, res, next) => {
    try {
        const { emptyCart } = await clear(req.params)
        // res.status(200).json({message: 'Cart cleaned.', emptyCart})
        res.status(200).redirect('back');
    } catch (error) {
        next(error);
    };
};

export const buyCart = async (req, res, next) => {
    const user = req.user;
    try {
        if (!req.user) return customError.createError(ErrorMessages.USER_NOT_LOGGED, ErrorMessages.ISSUE_SESSION);
        const user = req.user;
        const { cart_aux, ticket } = buy(user)
        res.status(200).json({ message: "Bought complete!", "Unprocessed Products": cart_aux, ticket });
    } catch (error) {
        next(error);
    };
};


export default router;