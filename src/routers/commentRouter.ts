import { Router } from "express";
import { commentController } from "../controllers/commentController";
import auth from "../middlewares/auth";
const router = Router()

router.post('/new', auth, commentController.newComment)
router.post('/delete', auth, commentController.deleteComment)

export default router
