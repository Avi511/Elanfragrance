import User from "../models/User.js";
import { transformProduct } from "../services/productService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id, userId: id }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d",
    });
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                userId: updatedUser.userId,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const targetUserId = req.params.id || req.user._id;
        const isSelf = targetUserId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin === true;

        if (!isSelf && !isAdmin) {
            return res.status(403).json({ error: "Not authorized!" });
        }

        const user = await User.findById(targetUserId);
        if (user) {
            if (user.isAdmin) {
                return res.status(400).json({ error: "Administrative core signatures cannot be purged" });
            }
            await user.deleteOne();
            res.json({ message: "User removed successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const syncCart = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.cart = (cartItems || [])
                .filter(item => item && (item._id || item.id))
                .map(item => ({
                    productId: item._id || item.id,
                    qty: item.qty || 1
                }));

            await user.save();
            res.json({ message: "Cart synced successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Sync Cart Error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("cart.productId");
        if (user) {
            const cartData = user.cart
                .filter(item => item.productId)
                .map(item => {
                    const transformed = transformProduct(item.productId);
                    return {
                        ...transformed,
                        _id: transformed._id,
                        name: transformed.productName,
                        price: transformed.productPrice,
                        image: transformed.productImage,
                        qty: item.qty
                    };
                });
            res.json(cartData);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ error: error.message });
    }
};
