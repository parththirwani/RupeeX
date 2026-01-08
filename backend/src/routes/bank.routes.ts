import { Router } from "express"
import { authMiddleware } from "../middleware/authMiddleware"
import { balance, transferById } from "../api/bank"


const router = Router()

router.get("/balance", authMiddleware, balance)
router.post("/transfer/:id", authMiddleware, transferById)


export default router