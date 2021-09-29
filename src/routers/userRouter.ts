import {Router} from "express";
import { userController } from "../controllers/userController";
const router = Router()
import auth from '../middlewares/auth'

router.get('/', auth, userController.home)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/profile', auth, userController.profile)

export default router