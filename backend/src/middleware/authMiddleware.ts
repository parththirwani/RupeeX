import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY"

interface JwtPayload {
  userId: string;
  phone: string;
  iat: number;
  exp: number;
}

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token
  
  if(!token){
    return res.status(403).json({
      message: "Token expired or doesn't exist"
    })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}