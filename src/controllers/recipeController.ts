import { Response, Request, NextFunction } from "express";
import Recipe from "../models/recipe";
import Comment from "../models/comment";
import IRecipe from "../interfaces/recipeInterface";
import IComment from "../interfaces/commentInterface";
import sharp from 'sharp'
import { Types } from "mongoose";

interface photos {
    photo: Buffer,
    _id: Types.ObjectId
}

class RecipeController {
    public async newRecipe (req: Request, res: Response) {
        try{
            const recipe: IRecipe = new Recipe({owner: req.user._id, ...req.body}) as IRecipe
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

    public async photoRecipe (req: Request, res: Response) {
        try {
            const recipe: IRecipe = await Recipe.findById(req.params.id) as IRecipe
            if(!recipe) throw new Error('Такого рецепта не существует!')
            if(!recipe.owner.equals(req.user._id)) throw new Error('Это не ваш рецепт!')
            const buffer = await sharp((req.file as Express.Multer.File).buffer).resize({width: 250, height: 250}).png().toBuffer()
            recipe.photos = recipe.photos.concat({photo: buffer})
            await recipe.save()
            res.status(200).send(recipe)
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async photoDeleteRecipe (req: Request, res: Response) {
        try{
            const recipe: IRecipe = await Recipe.findById(req.params.recipeId) as IRecipe
            if(!recipe) throw new Error('Такого рецепта не существует!')
            if(!recipe.owner.equals(req.user._id)) throw new Error('Это не ваш рецепт!')
            //@ts-ignore
            recipe.photos = recipe.photos.filter((photo) => !(photo._id).equals(req.params.photoId))
            await recipe.save()
            res.status(200).send('Удалено!')
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async photoViewRecipe (req: Request, res: Response) {
        try{
            const recipe = await Recipe.findById(req.params.recipeId)
            if(!recipe) throw new Error('Такого рецепта не сущуствует')
            //@ts-ignore
            const photo: photos[] = recipe.photos.filter((photo) => photo._id.equals(req.params.photoId))
            if(photo.length === 0) throw new Error('Такой фото не существует!')
            const photoBuffer = photo[0].photo
            res.set('Content-Type', 'image/png')
            res.send(photoBuffer)
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }
}

export const recipeController = new RecipeController()