import { isObjectIdOrHexString } from 'mongoose';
import products from '../../models/Product.model.js';

async function addProduct(req, res) {
    try {
        let { tags = [], price, description, type, name } = req.body;

        // Basic validation
        if (!name || !price || !description || !type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, price, description, type'
            });
        }

        await products.create({ name, tags, price, description, type });

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Add Product Error:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'Failed to add product'
        });
    }
}

async function getProducts(req, res) {
    try {
        let { productId } = req.params;
        if (!isObjectIdOrHexString(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid productId'
            });
        }
        let data = await products.find(productId ? { _id: productId } : {});
        res.status(200).json(data);
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({
            success: false,
            message: error?.message || 'Failed to fetch products'
        });
    }
}

async function updateProduct(req, res) {
    try {
        let { productId } = req.params;

        if (!productId || !isObjectIdOrHexString(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid productId'
            });
        }

        const update = await products.updateOne(
            { _id: productId },
            { $set: req.body },
            { runValidators: true }
        );

        if (update.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (update.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No values to update'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Values updated successfully'
        });
    } catch (error) {
        console.error('Update Product Error:', error, error?.statusCode);
        res.status(500).json({
            success: false,
            message: error?.message || 'Failed to update product'
        });
    }
}

async function deleteProduct(req, res) {
    try {
        let { productId } = req.params;

        if (!productId || !isObjectIdOrHexString(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid productId'
            });
        }

        const update = await products.deleteOne(
            { _id: productId },
            { $set: req.body },
            { runValidators: true }
        );

        if (update.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (update.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No values to update'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Values updated successfully'
        });
    } catch (error) {
        console.error('Update Product Error:', error, error?.statusCode);
        res.status(500).json({
            success: false,
            message: error?.message || 'Failed to update product'
        });
    }
}



export { addProduct, getProducts, updateProduct, deleteProduct };
