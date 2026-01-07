import { Router } from "express"
import { getUser } from "../api/user"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()

router.get("/user/:id",authMiddleware, getUser)

export default router