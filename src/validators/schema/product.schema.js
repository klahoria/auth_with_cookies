import Joi from 'joi';
import { validateRequestBody } from '../validate.js';

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    price: Joi.number()
        .min(50).required(),
    type: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(100).max(5000).required(),
    tags: Joi.array().items(
        Joi.string().min(3))
})


let products = validateRequestBody(schema);

export default products;
