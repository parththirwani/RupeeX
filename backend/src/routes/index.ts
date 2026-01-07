import { Router } from "express"
import authRouter from "./auth.routes"
import profileRouter from "./profile.routes"
import userRouter from "./user.routes"

const router = Router()

router.use("/auth", authRouter)
router.use("/profile", profileRouter)
router.use("/",userRouter)

export default router
