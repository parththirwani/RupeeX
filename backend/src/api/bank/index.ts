import type { Request, Response } from "express";
import prisma from "../../lib/db";
import { transferSchema } from "../../schema/transferSchema";
import { transfer } from "../../lib/transfer";

export const balance = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { bank: true }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            message: "Balance fetched",
            user: {
                balance: user.bank?.balance
            }
        })
    } catch {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const transferById = async (req: Request, res: Response) => {
    try {
        const parsedData = transferSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ message: "Invalid input" });
        }

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.params.id) {
            return res.status(400).json({ message: "Receiver ID missing" }); 
        }

        const senderId = req.user.userId;
        const amount = parsedData.data.amount; 
        const receiverId = req.params.id;

        const receiver = await prisma.user.findUnique({
            where: { id: receiverId },
            include: { bank: true },
        });

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        const transaction = await transfer(senderId, receiverId, amount);

        return res.status(200).json({
            message: "Transaction completed successfully",
            receiver: transaction,
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("doesn't have enough")) {
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }
        console.error("Transfer error:", error);

        return res.status(500).json({ message: "Internal server error" });
    }
};