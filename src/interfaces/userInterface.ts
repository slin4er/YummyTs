import {LeanDocument, Model} from 'mongoose'

interface IUser {
    login: string,
    password: string,
    tokens: ConcatArray<string>[],
    generateAuthToken(): string,
    toJSON: () => LeanDocument<this>,
    findByCredentials(login: string, password: string): any
}

interface IUserDocument extends IUser, Document {
    generateAuthToken: () => string
    toJSON: () => LeanDocument<this>
}

interface IUserModel extends Model<IUserDocument> {
    findByCredentials: (login: string, password: string) => Promise<any>
}

export {IUserDocument, IUserModel}