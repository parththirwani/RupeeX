import { Router } from "express"
import { changePassword, signin, signup } from "../api/auth"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.put("/password", authMiddleware, changePassword)

export default router
