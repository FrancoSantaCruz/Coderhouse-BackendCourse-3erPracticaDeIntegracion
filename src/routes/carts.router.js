import { Router } from "express";
import { findCart, newCart, addProdToCart, removeProdFromCart, buyCart, clearCart } from "../controllers/carts.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/:cid', findCart);

router.post('/', newCart);

router.put('/clear/:cid', clearCart);

// Add one product to cart.
router.put('/add/:cid/products/:pid', authValidation(["user", "premium", "admin"]),  addProdToCart);

// Remove one product from cart.
router.put('/remove/:cid/products/:pid', authValidation(["user", "premium", "admin"]), removeProdFromCart);

// Buy cart
router.post('/:cid/purchase', authValidation(["user", "premium", "admin"]), buyCart);


export default router;