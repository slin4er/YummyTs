import {LeanDocument, Model, ObjectId, SchemaDefinitionProperty} from 'mongoose'

interface IUser {
    _id: ObjectId,
    login: string,
    name: string,
    password: string,
    tokens: ConcatArray<string>[],
    avatar: SchemaDefinitionProperty<Buffer>,
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

export {IUserDocument, IUserModel, IUser}