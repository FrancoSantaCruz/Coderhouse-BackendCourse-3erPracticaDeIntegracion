import { findAll, findById, createOne, deleteOne, updateOne } from '../services/products.service.js'
import {customError, ErrorMessages} from "../errors/error.js";


export const findProducts = async (req, res, next) => {
    try {
        const products = await findAll(req.query);
        res.status(200).json({ message: 'Products founded', products })
    } catch (error) {
        next(error)
    }
};

export const findProductById = async (req, res, next) => {
    const { pid } = req.params
    try {
        const product = await findById(pid)
        res.status(200).json({ message: 'Product found', product })
    } catch (error) {
        next(error)
    }
};

export const newProduct = async (req, res, next) => {
    try {
        const { newProduct } = await createOne(req.body);
        res.status(200).json({ message: 'Product created', newProduct })
    } catch (error) {
        next(error)
    }
};

export const updateProduct = async (req, res) => {
    const data = { id: req.params, data: req.body }
    try {
        const modifyProduct = await updateOne(data);
        res.status(200).json({ message: "Product has been modified.", modifyProduct });
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await deleteOne(req.params)
        res.status(200).json({ message: 'Product deleted', product })
    } catch (error) {
        next(error);
    }
};