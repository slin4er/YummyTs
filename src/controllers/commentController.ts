import { Request, Response } from "express"
import IComment from "../interfaces/commentInterface"
import Comment from "../models/comment"

class CommentController {
    public async newComment (req: Request, res: Response) {
        try {
            const comment: IComment = await new Comment({
                name: req.user.name,
                comment: req.body.comment,
                post: req.params.id,
                author: req.user._id
            })

            await comment.save()
            res.status(201).send(comment)
        } catch (e: any) {
            res.status(500).send(e.message)
        }
    }

    public async deleteComment (req: Request, res: Response) {
        try {
            const comment: IComment = await Comment.findById(req.params.id) as IComment
            if(!comment) throw new Error('Такого комментария не существует!')
            if(!comment.author.equals(req.user._id)) throw new Error('Это не ваш комментарий!')
            await comment.remove()
            res.status(200).send('Ваш комментарий успешно удален!')
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }
}

export const commentController = new CommentController()