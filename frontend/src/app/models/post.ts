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