import { Router } from "express";
import {Signup, Signin} from "../controllers/user.controller.js";
import RegisterUserData from '../../validators/schema/signup.schema.js'

const router = Router();

router.post('/signup', RegisterUserData, Signup);
router.post('/signin', RegisterUserData, Signin);

export default router