import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { updateProfile } from "../api/profile"


const router = Router()

router.put("/", authMiddleware, updateProfile)

export default router