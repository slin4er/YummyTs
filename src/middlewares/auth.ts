import { Request, Response, NextFunction } from "express"
import User from "../models/user"
import jwt from "jsonwebtoken"
import { keys } from "../keys"
import { IUserDocument } from '../interfaces/userInterface'
import { Types } from "mongoose"


interface deocded {
    _id: Types.ObjectId,
    iat: number
}
declare global {
  namespace Express {
    interface Request {
      user: IUserDocument
      token: string
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token: string = req.header('Authorization')!.replace('Bearer ', '')
        const decoded = jwt.verify(token, keys.JWT_SECRET) as deocded
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user) throw new Error('Сначала авторизируйтесь!')
        req.user = user
        req.token = token

        next()
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

export default auth