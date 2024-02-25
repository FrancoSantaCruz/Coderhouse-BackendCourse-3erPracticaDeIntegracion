import { isLogged } from "../controllers/views.controller.js";
import { findById } from "../services/carts.service.js";

export const cartInformation = () => {
    return async (req, res, next) => {
        try {
            let user = await isLogged(req, res);
            if (user) {

                let cart = await findById(user.cart._id);
                let cart_total = 0;

                cart.products.forEach((prod) => {
                    if(prod.product.sale){
                        // Precio con la oferta aplicada. 
                        prod.product.sale_price = prod.product.price - Math.round(( prod.product.sale_percent * prod.product.price ) / 100);
                        prod.subtotal = prod.product.sale_price * prod.quantity;
                    } else {
                        prod.subtotal = prod.product.price * prod.quantity;
                    }
                    
                    cart_total += prod.subtotal;
                })

                cart.products.total = cart_total
                res.cookie('Cart', cart);
            }
            next();
        } catch (error) {
            res.status(500).json(error.message);
        }

    }
}
