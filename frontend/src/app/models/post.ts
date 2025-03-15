export interface Post {
    postId:number;
    userId: string;
    username: string;
    title:string;
    description:string;
    aiComments:string;
    imageUrl:string;
    prompt:string;
    isActive:boolean;
    aiImageUrl:string;
}

export interface AiImage {
    postId?:number;
    prompt?:string;
}

export interface PostSocial {
    postId:number;
    likes:number;
    comments: Array<Comment>

}

export interface Comments {
    username:string;
    comment:string;
}

export interface PostComment {
    postId:number,
    username:string;
    comment:string;
}

export interface PostLike {
    postId:number;
    like:number
}