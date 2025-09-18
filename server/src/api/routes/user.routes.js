import { Router } from "express";
import {Signup, Signin} from "../controllers/user.controller.js";
import RegisterUserData from '../../validators/schema/signup.schema.js'

const router = Router();

router.post('/register', RegisterUserData, Signup);
router.post('/login', RegisterUserData, Signin);
router.get('/', (req, res)=> res.send('Html user this.'));

export default router