import { Request, Response } from "express";
import User from "../models/user";
import removeAccents from "remove-accents";

export const getAllUser = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const keywordRaw = (req.query.keyword as string) || "";
  const keyword = removeAccents(keywordRaw).toLowerCase();

  try {
    const allUsers = await User.find().select("-password");

    const filtered = allUsers.filter((user) => {
      const name = removeAccents(user.name || "").toLowerCase();
      const email = removeAccents(user.email || "").toLowerCase();
      return name.includes(keyword) || email.includes(keyword);
    });

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    res.status(200).json({
      total,
      users: paginated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
