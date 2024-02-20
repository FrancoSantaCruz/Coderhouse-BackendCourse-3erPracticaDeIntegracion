import { Router } from "express";
import { mockingProducts, loggerTest } from "../controllers/test.controller.js";

const router = Router();


router.get('/mockingproducts', mockingProducts);

router.get('/loggerTest', loggerTest)

export default router;