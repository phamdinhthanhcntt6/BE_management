import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
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
