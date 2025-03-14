import { AiImage, Post } from "../models/post";


export class GetPaginatedPosts {
    static readonly type = '[Posts] Get Posts';
    constructor(public page: number) {}
}

export class ChangePage {
    static readonly type = '[Page] Change Page';
    constructor(public page: number) {} // Pass the new page number
  }

export class GetPosts {
    static readonly type = '[Posts] Get Posts';
}

export class GetPostById {
    static readonly type = '[Post] Get Post By id'
    constructor(public id: number) {}
}

export class DeletePost {
    static readonly type = '[Post] Delete';
    constructor(public id: number) {}
}

export class RequestAiImage {
    static readonly type = '[aiImage] Get AI Image by id'
    constructor(public aiImageRequest:AiImage) {}
}
