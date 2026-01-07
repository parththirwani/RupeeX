import type { Request, Response } from "express"
import prisma from "../../lib/db"

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName
            }
        })
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
}