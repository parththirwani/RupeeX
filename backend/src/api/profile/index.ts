import type { Request, Response } from "express"
import prisma from "../../lib/db"
import { updateUserSchema } from "../../schema/authSchema"

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const parsedData = updateUserSchema.safeParse(req.body)

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedData.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      })
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { firstName, middleName, lastName } = parsedData.data

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId
      },
      data: {
        firstName,
        middleName,
        lastName
      }
    })

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        firstName: updatedUser.firstName,
        middleName: updatedUser.middleName,
        lastName: updatedUser.lastName
      }
    })
  } catch {
    return res.status(500).json({ message: "Internal server error" })
  }
}
