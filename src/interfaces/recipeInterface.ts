import { Document, ObjectId, SchemaDefinitionProperty, Types } from "mongoose";

interface IRecipe extends Document {
    title: string,
    description: string,
    comments: [],
    likedBy: Types.ObjectId[],
    likes: number,
    owner: Types.ObjectId,
    photos: SchemaDefinitionProperty<Buffer>[]
}

export default IRecipe