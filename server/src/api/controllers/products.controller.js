import { isObjectIdOrHexString } from 'mongoose';
import products from '../../models/Product.model.js';

function handleServerError(res, error, context = '') {
    console.error(`${context} Error:`, error);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong on the server',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
}

// =========================
// Add Product
// =========================
export async function addProduct(req, res) {
    try {
        let { tags = [], price, description, type, name } = req.body;

        if (!name || !price || !description || !type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, price, description, type'
            });
        }

        await products.create({ name, tags, price, description, type });

        res.status(201).json({ success: true, message: 'Product created successfully' });
    } catch (error) {
        handleServerError(res, error, 'Add Product');
    }
}

// =========================
// Get Product(s)
// =========================
export async function getProducts(req, res) {
    try {
        let { productId } = req.params;

        if (productId && !isObjectIdOrHexString(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid productId'
            });
        }

        const query = productId ? { _id: productId } : {};
        const data = await products.find(query);

        if (productId && data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        handleServerError(res, error, 'Get Products');
    }
}

// =========================
// Update Product
// =========================
export async function updateProduct(req, res) {
    try {
        let { productId } = req.params;

        if (!productId || !isObjectIdOrHexString(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid productId'
            });
        }

        const result = await products.updateOne(
            { _id: productId },
            { $set: req.body },
            { runValidators: true }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (result.modifiedCount === 0) {
            return res.status(400).json({
                success: false,
                message: 'No values to update'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        handleServerError(res, error, 'Update Product');
    }
}

// =========================
// Delete Product
// =========================
export async function deleteProduct(req, res) {
    try {
        let { productId } = req.params;

        if (!productId || !isObjectIdOrHexString(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid productId'
            });
        }

        const result = await products.deleteOne({ _id: productId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        handleServerError(res, error, 'Delete Product');
    }
}
