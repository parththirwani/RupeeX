import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import prisma from "../../lib/db"
import { signinSchema, userSchema } from "../../schema/authSchema"

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY"

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedData = userSchema.safeParse(req.body)

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      })
    }

    const { phone, password, firstName, middleName, lastName } = parsedData.data

    const existingPhone = await prisma.user.findUnique({
      where: { phone }
    })

    if (existingPhone) {
      return res.status(400).json({
        message: "The number already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        firstName,
        middleName,
        lastName
      }
    })

    return res.status(201).json({
      message: "User successfully signed up",
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName
      }
    })
  } catch {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const signin = async (req: Request, res: Response) => {
  try {
    const parsedData = signinSchema.safeParse(req.body)

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      })
    }

    const { phone, password } = parsedData.data

    const foundUser = await prisma.user.findUnique({
      where: { phone }
    })

    if (!foundUser) {
      return res.status(404).json({ message: "User does not exist" })
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password)

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong credentials" })
    }

    const token = jwt.sign(
      { userId: foundUser.id, phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
      message: "User successfully signed in"
    })
  } catch {
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    })

    return res.status(200).json({ message: "Logged out successfully" })
  } catch {
    return res.status(500).json({ message: "Internal server error" })
  }
}

