import { Router, Request, Response, NextFunction } from "express";
import { recipeController } from "../controllers/recipeController";
import auth from "../middlewares/auth";
import upload from "../middlewares/upload";
const router = Router()

router.post('/new', auth, recipeController.newRecipe)
router.post('/delete/:id', auth, recipeController.deleteRecipe)
router.post('/update/:id', auth, recipeController.updateRecipe)
router.post('/like/:id', auth, recipeController.likeRecipe)
router.get('/my', auth, recipeController.myRecipe)
router.get('/view/:id', auth, recipeController.oneRecipe)
router.get('/all', recipeController.allRecipe)
router.post('/photo/:id', auth, upload.single('Загрузить фото'), recipeController.photoRecipe,
(error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({error: error.message})
})
router.post('/:recipeId/photo/:photoId', auth, recipeController.photoDeleteRecipe)
router.get('/:recipeId/photo/view/:photoId', auth, recipeController.photoViewRecipe)

export default router