import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const products = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: /^[A-Za-z ]+$/,  // equivalent to .alphanum()
        trim: true
    },
    type: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z ]{3,30}$/
    },
    description: {
        type: String,
        required: true,
        min: 100,
        max: 5000,
        match: /^[a-z A-Z]{100,5000}$/
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        match: /^\d+$/ // equivalent only numbers
    },
    tags: {
        type: [String],
        required: false,
        default: []
    }
}, {
    timestamps: true
});

const Products = mongoose.model('product', products);
export default Products;
