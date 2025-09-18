import { Router } from 'express';
import products from '../../validators/schema/product.schema.js'
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/products.controller.js';
import { verifyAuth } from '../../utils/jsonToken.js';
const router = Router();

router.use(verifyAuth)
router.route('/product').get(getProducts)
    .post(products, addProduct)
router.route('/product/:productId').put(products, updateProduct).get(getProducts).delete(deleteProduct);



export default router