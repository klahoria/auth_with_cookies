import User from "../../models/User.model.js";
import { signToken, setAuthCookie } from '../../utils/jsonToken.js'

async function Signup(req, res) {
    try {
        const { username, password, email, birth_year } = req.body;

        // console.log(username, password, email);

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password,
            birth_year
        });

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });



    } catch (error) {
        console.log(error);
    }
}


async function Signin(req, res) {
    try {
        const { username, password } = req.body;

        // console.log(username, password);

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email: username }, { username }]
        });

        let compare;
        if (existingUser) {
            compare = await existingUser.comparePassword(password)
        }

        if (!existingUser || !compare) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // useCookies.createCookie('auth')

        let token = signToken({ username })
        setAuthCookie(req, res, token);

        let data = (existingUser.toObject());
        delete data.password;
        delete data._id;
        data['token'] = token;
        // Create new user
        res.status(200).json(data)


    } catch (error) {
        console.log(error);
    }
}


export { Signup, Signin };


