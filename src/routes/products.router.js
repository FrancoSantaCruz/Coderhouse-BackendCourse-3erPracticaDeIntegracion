import { Router } from "express";
import { findProducts, findProductById, newProduct, deleteProduct, updateProduct } from '../controllers/products.controller.js'

import { authValidation } from "../middlewares/auth.middleware.js";
import { ownerValidation } from "../middlewares/ownProduct.middleware.js";

const router = Router();

router.get('/', findProducts);

router.get('/:pid', findProductById);

router.post('/new', authValidation(["admin", "premium"]), newProduct);

router.put('/update/:pid', ownerValidation(), authValidation(["admin", "premium"]), updateProduct);

router.post('/delete/:pid', ownerValidation(), authValidation(["admin", "premium"]), deleteProduct);

export default router;