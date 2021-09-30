import { Router } from "express";
import { recipeController } from "../controllers/recipeController";
import auth from "../middlewares/auth";
const router = Router()

router.post('/new', auth, recipeController.newRecipe)
router.post('/delete/:id', auth, recipeController.deleteRecipe)
router.post('/update/:id', auth, recipeController.updateRecipe)
router.post('/like/:id', auth, recipeController.likeRecipe)
router.get('/my', auth, recipeController.myRecipe)
router.get('/view/:id', auth, recipeController.oneRecipe)
router.get('/all', recipeController.allRecipe)

export default router