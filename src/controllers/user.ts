import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: newUser._id,
        email,
        name,
        role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
