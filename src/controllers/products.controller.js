import { findAll, findById, createOne, deleteOne, updateOne } from '../services/products.service.js'

export const findProducts = async (req, res, next) => {
    try {
        const products = await findAll(req.query);
        res.status(200).send({ message: 'Products founded', products })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const findProductById = async (req, res, next) => {
    const { pid } = req.params
    try {
        const product = await findById(pid)
        res.status(200).send({ message: 'Product found', product })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const newProduct = async (req, res, next) => {
    try {
        const data = { product: req.body, owner: req.user }
        const { newProduct } = await createOne(data);
        res.status(200).send({ message: 'Product created', newProduct })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};

export const updateProduct = async (req, res) => {
    const data = { id: req.params, data: req.body }
    try {
        const modifyProduct = await updateOne(data);
        res.status(200).send({ message: "Product has been modified.", modifyProduct });
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await deleteOne(req.params)
        res.status(200).send({ message: 'Product deleted', product })
    } catch (error) {
        res.status(error.status).send({ Type: error.name, Error: error.message })
    }
};