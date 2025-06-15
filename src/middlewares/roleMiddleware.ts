import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  console.log(user);
  if (user && user.role === "admin") return next();

  res.status(403).json({ message: "Access denied" });
};
