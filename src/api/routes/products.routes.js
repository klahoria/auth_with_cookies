import { Router } from 'express';
import products from '../../validators/schema/product.schema.js'
import { addProduct } from '../controllers/products.controller.js';
import { verifyAuth } from '../../utils/jsonToken.js';
const router = Router();

router.use(verifyAuth)
router.route('/product').put(products, addProduct)


export default router