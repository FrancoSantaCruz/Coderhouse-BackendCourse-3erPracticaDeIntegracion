import { Router } from "express";
import { mockingProducts, loggerTest } from "../controllers/test.controller.js";
import passport from "passport";

const router = Router();


router.get('/mockingproducts', mockingProducts);

router.get('/loggerTest', passport.authenticate("jwt", { session: false }), loggerTest)

export default router;