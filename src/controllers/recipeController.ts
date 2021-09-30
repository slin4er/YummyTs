import { Response, Request } from "express";
import Recipe from "../models/recipe";
import Comment from "../models/comment";
import IRecipe from "../interfaces/recipeInterface";
import IComment from "../interfaces/commentInterface";

class RecipeController {
    public async newRecipe (req: Request, res: Response) {
        try{
            const recipe: IRecipe = await new Recipe({owner: req.user._id, ...req.body}) as IRecipe
            await recipe.save()
            res.status(201).send(recipe)
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async deleteRecipe (req: Request, res: Response) {
        try {
            const recipe: IRecipe = await Recipe.findById(req.params.id) as IRecipe
            if(!recipe) throw new Error('Такого рецепта не существует!')
            if(!recipe.owner.equals(req.user._id)) throw new Error('Это не ваш рецепт!')
            await Comment.deleteMany({post: req.params.id})
            await recipe.remove()
            res.status(200).send('Успещно удалено!')
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async updateRecipe (req: Request, res: Response) {
        try {
            const recipe: IRecipe = await Recipe.findById(req.params.id) as IRecipe
            if(!recipe) throw new Error('Такого рецепта не существует!')
            if(!recipe.owner.equals(req.user._id)) throw new Error('Это не ваш рецепт!')
            await recipe.updateOne(req.body)
            res.status(201).send(recipe)
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async likeRecipe (req: Request, res: Response) {
        try {
            const recipe: IRecipe = await Recipe.findById(req.params.id) as IRecipe
            if(!recipe) throw new Error('Такого рецепта не существует!')
            const likeExists = recipe.likedBy.filter((id) => id.equals(req.user._id))
            let liked: boolean = false

            if(likeExists.length === 0) {
                recipe.likedBy = recipe.likedBy.concat(req.user._id)
                recipe.likes = recipe.likedBy.length
                liked = true
            } else {
                recipe.likedBy = recipe.likedBy.filter((id) => !id.equals(req.user._id))
                recipe.likes = recipe.likedBy.length
            }

            await recipe.save()
            res.status(200).send({recipe, liked})

        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async myRecipe (req: Request, res: Response) {
        try {
            const recipes: IRecipe[] = await Recipe.find({owner: req.user._id})
            if(recipes.length === 0) throw new Error('У вас нет никаких рецептов!')
            res.status(200).send(recipes)
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async oneRecipe (req: Request, res: Response) {
        try{
            const recipe: IRecipe = await Recipe.findById(req.params.id) as IRecipe
            if(!recipe) throw new Error('Такого рецепта не существует!')
            const comments: IComment[] = await Comment.find({post: req.params.id})
            res.status(200).send({ recipe, comments })
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async allRecipe (req: Request, res: Response) {
        try {
            const recipes: IRecipe[] = await Recipe.find({})
            if(recipes.length === 0) throw new Error('Нет ни одного рецепта!')
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }
}

export const recipeController = new RecipeController()