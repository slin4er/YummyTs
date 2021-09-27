import {Router} from "express";
import { userController } from "../controllers/userController";
const router = Router()

router.get('/', userController.home)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)

export default router