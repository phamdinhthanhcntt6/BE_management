import { Request, Response } from "express";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await (await import("../models/user")).default
      .find()
      .select("-password");

    res.json({ users });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
