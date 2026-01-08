import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { getProfile, updateProfile } from "../api/profile"


const router = Router()

router.put("/", authMiddleware, updateProfile)
router.get("/",authMiddleware, getProfile)

export default router