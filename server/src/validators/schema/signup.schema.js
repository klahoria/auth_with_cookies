import Joi from 'joi';
import { validateRequestBody } from '../validate.js';

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),

    repeat_password: Joi.ref('password'),

    // access_token: [
    //     Joi.string(),
    //     Joi.number().required()
    // ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max((new Date().getFullYear() - 10)).required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})


let RegisterUserData = validateRequestBody(schema);

export default RegisterUserData;
