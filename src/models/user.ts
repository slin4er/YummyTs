import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt, { Secret } from 'jsonwebtoken'
import {IUserDocument, IUserModel} from '../interfaces/userInterface'
import { keys } from '../keys'

const userSchema = new mongoose.Schema<IUserDocument>({
    login: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        default: 'Пользователь Yummy'
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
})

userSchema.statics.findByCredentials = async (login: string, password: string) => {
    const user = await User.findOne({login})
    if(!user) throw new Error('User was not found!')
    const isMatch: boolean = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('something went wrong!')
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token: string = jwt.sign({_id: user._id}, keys.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj.login
}

const User = mongoose.model<IUserDocument, IUserModel>('users', userSchema)

export default User