import { Router } from "express"
import authRouter from "./auth.routes"
import profileRouter from "./profile.routes"
import userRouter from "./user.routes"
import bankRouter from "./bank.routes"

const router = Router()

router.use("/auth", authRouter)
router.use("/profile", profileRouter)
router.use("/",userRouter)
router.use("/bank", bankRouter)

export default router
