import {Request, Response} from 'express'
import User from '../models/user'

class UserController {
    public home (req: Request, res: Response): void {
        res.send('Hey there!')
    }

    public async signUp (req: Request, res: Response): Promise<void> {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }

    public async signIn (req: Request, res: Response): Promise<void> {
        const user = await User.findByCredentials(req.body.login, req.body.password)
        if(!user) throw new Error('Что-то пошло не так!')
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    }

    public async profile (req: Request, res: Response): Promise<void> {
        res.status(200).send(req.user)
    }

    public async logout (req: Request, res: Response): Promise<void> {
        try {
            req.user.tokens = []
            await req.user.save()
            res.status(200).send('Вы успешно вышли из сети!')
        } catch (e: any) {
            res.status(500).send(e.message)
        }
    }

}

export const userController = new UserController()