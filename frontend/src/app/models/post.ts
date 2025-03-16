export interface Post {
    postId:string;
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
    postId?:string;
    prompt?:string;
}

export interface PostSocial {
    postId:string;
    likes:number;
    comments: Array<Comments>

}

export interface Comments {
    commentId:string;
    username:string;
    comment:string;
}

export interface PostComment {
    postId:string,
    username:string;
    comment:string;
}

export interface PostLike {
    postId:string;
    like:number
}

export interface DeleteComment {
    postId:string;
    commentId:string;
}