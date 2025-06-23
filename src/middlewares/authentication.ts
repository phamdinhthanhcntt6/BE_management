import * as express from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "bearerAuth") {
    const token =
      request.body.token ||
      request.query.token ||
      request.headers["x-access-token"] ||
      request.headers.authorization?.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }

      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err: any, decoded: any) => {
          if (err) {
            reject(err);
          } else {
            // Kiểm tra quyền nếu cần
            if (scopes && scopes.length > 0) {
              if (decoded.role && scopes.includes(decoded.role)) {
                resolve(decoded);
              } else {
                reject(new Error("Insufficient scope"));
              }
            }
            resolve(decoded);
          }
        }
      );
    });
  }

  return Promise.reject(new Error("Invalid security name"));
}
