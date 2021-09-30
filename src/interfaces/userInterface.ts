import {LeanDocument, Model, ObjectId, SchemaDefinitionProperty, Types} from 'mongoose'

interface IUser {
    _id: Types.ObjectId,
    login: string,
    name: string,
    password: string,
    tokens: ConcatArray<string>[],
    avatar?: SchemaDefinitionProperty<Buffer>,
    generateAuthToken(): Promise<string>,
    toJSON: () => LeanDocument<this>,
    findByCredentials(login: string, password: string): Promise<IUser>
}

interface IUserDocument extends IUser, Document {
    generateAuthToken: () => Promise<string>
    toJSON: () => LeanDocument<this>,
    save: () => Promise<void>
}

interface IUserModel extends Model<IUserDocument> {
    findByCredentials: (login: string, password: string) => Promise<IUser>
}

export {IUserDocument, IUserModel, IUser}