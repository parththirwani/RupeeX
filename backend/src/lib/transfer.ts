import prisma from "./db"

export function transfer(from: string, to: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const sender = await tx.bankAccount.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        userId: from,
      },
    })

    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`)
    }

    // 3. Increment the recipient's balance by amount
    const recipient = await tx.bankAccount.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        userId: to,
      },
    })

    return recipient
  })
}
