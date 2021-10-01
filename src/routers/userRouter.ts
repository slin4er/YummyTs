import {Router, Request, Response, NextFunction} from "express";
import { userController } from "../controllers/userController";
const router = Router()
import auth from '../middlewares/auth'
import upload from "../middlewares/upload";

router.get('/', auth, userController.home)
router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/profile', auth, userController.profile)
router.post('/logout', auth, userController.logout)
router.post('/avatar', auth, upload.single('Загрузить фото'), userController.avatar,
(error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({error: error.message})
})
router.post('/delete/avatar', auth, userController.deleteAvatar)
router.get('/view/avatar', auth, userController.viewAvatar)

export default router