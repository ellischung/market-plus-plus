import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if(!existingUser) return res.status(404).json("User doesn't exist")

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect) return res.status(400).json("Invalid credentials.")

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" })

        res.status(200).json({ result: existingUser, token })

    } catch (error) {
        res.status(500).json({ message: 'Error signin 500.' })
    }
}

export const signup = async (req, res) => {
    const { name, password, email } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });

        if(existingUser) return res.status(400).json("User already exists")

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, given_name: name });

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" })

        res.status(200).json({ result: result, token })
    } catch (error) {
        res.status(500).json({ message: 'Error signup 500.' })
    }
}