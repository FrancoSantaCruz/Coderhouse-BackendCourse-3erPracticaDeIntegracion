import { Router } from "express";
import { findProducts, findProductById, newProduct, deleteProduct, updateProduct } from '../controllers/products.controller.js'

import { authValidation } from "../middlewares/auth.middleware.js";
import { ownerValidation } from "../middlewares/ownProduct.middleware.js";

const router = Router();

router.get('/', findProducts);

router.get('/:pid', findProductById);

router.post('/new', authValidation(["admin", "premium"]), newProduct);

router.post('/update/:pid', ownerValidation(), authValidation("admin"), updateProduct);

router.post('/delete/:pid', ownerValidation(), authValidation("admin"), deleteProduct);
// Todavía tengo que probar una vez más siendo owner. X
// Probar sin estar logeado. X
// Probar sin ser owner. X
// Probar siendo admin? 
export default router;