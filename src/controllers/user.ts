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

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: "Current user info", user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, email, role } = req.body;

  const currentUser = (req as any).user;

  if (currentUser.role !== "admin" && currentUser.id !== id) {
    res.status(403).json({ message: "Permission denied" });
    return;
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (currentUser.role === "admin" && role) {
      user.role = role;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400).json({ messsage: "Please provide old and new password" });
    return;
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Password is incorrect" });
      return;
    }

    const hasedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hasedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
