import { Document, Types } from "mongoose";

interface IComment extends Document{
    name: string,
    comment: string,
    likes: number,
    post: Types.ObjectId,
    author: Types.ObjectId
}

export default IComment