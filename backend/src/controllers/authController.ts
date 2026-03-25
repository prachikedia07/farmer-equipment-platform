import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role: role === "owner" ? "owner" : "farmer"
    });

    res.status(201).json({
      message: "User registered",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

   const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET as string,
  { expiresIn: "7d" }
);

 res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    role: user.role,
    name: user.name
  }
});

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET PROFILE
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.email = req.body.email || user.email;

    await user.save();

    res.json(user);
  } catch {
    res.status(500).json({ message: "Error updating profile" });
  }
};
