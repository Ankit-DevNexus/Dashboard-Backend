import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword, role, isActive, lastLogin } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check for existing email/phone
        const existingUser = await userModel.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email || existingUser.phone === phone) {
                return res.status(400).json({ message: "Email or Phone number already exists" });
            }
        }

        // Create admin
        const newUser = new userModel({
            name,
            email,
            phone,
            password,
            role,
            isActive,
            lastLogin
        });

        const savedUser = await newUser.save();

        const token = generateToken(savedUser);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({
             $or: [
                    { email: username },
                    { phone: isNaN(username) ? null : Number(username) } // safely parse phone numbers
                ]
         });

        if (!user || !user.isActive)
            return res.status(400).json({ msg: "Invalid username or account disabled" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
