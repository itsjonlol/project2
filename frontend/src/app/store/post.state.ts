import { Post } from "../models/post";


export class GetPosts {
    static readonly type = '[Posts] Get Posts';
}


export class DeletePost {
    static readonly type = '[Post] Delete';
    constructor(public id: number) {}
}