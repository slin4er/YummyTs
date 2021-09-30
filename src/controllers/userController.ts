import {Request, Response} from 'express'
import { IUser } from '../interfaces/userInterface'
import User from '../models/user'

class UserController {
    public home (req: Request, res: Response): void {
        res.send('Hey there!')
    }

    public async signUp (req: Request, res: Response): Promise<void> {
        try{
            const user: IUser = new User(req.body)
            const token = await user.generateAuthToken()
            res.status(201).send({user, token})
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async signIn (req: Request, res: Response): Promise<void> {
        try{
            const user: IUser = await User.findByCredentials(req.body.login, req.body.password)
            if(!user) throw new Error('Что-то пошло не так!')
            const token = await user.generateAuthToken()
            res.status(200).send({user, token})
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async profile (req: Request, res: Response): Promise<void> {
        try{
            res.status(200).send(req.user)
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

    public async logout (req: Request, res: Response): Promise<void> {
        try {
            req.user.tokens = []
            await req.user.save()
            res.status(200).send('Вы успешно вышли из сети!')
        } catch (e) {
            res.status(500).send((e as Error).message)
        }
    }

}

export const userController = new UserController()