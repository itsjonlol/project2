import { inject, Injectable } from "@angular/core";
import { AiImage, Post } from "../models/post";
import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { AiImageRequestResponse, PostService } from "../services/post.service";
import { ChangePage, DeletePost, GetPaginatedPosts, GetPostById, GetPosts, RequestAiImage } from "./post.state";
import { tap } from "rxjs";

export interface PostStateModel {
    posts: Post[];
    currentPage: number;

    postRecords:number;
}

export interface PaginationInfo {
    currentPage:number,
    totalPages:number
}

@State<PostStateModel>({
    name: 'posts',
    defaults: {
      posts:[],
      currentPage:1,
      postRecords:5
  
    },
  })

@Injectable(
    {providedIn:'root'}
)
export class PostState{

    postService = inject(PostService);
    
    
    @Selector()
    static getPosts(state: PostStateModel):Post[] {
      return state.posts;
    }

    @Selector()
    static getPaginationInfo(state: PostStateModel):PaginationInfo {
        return {
            // to create the pagination. 1 page will have 5 records
            currentPage: state.currentPage,
            totalPages: Math.ceil(state.posts.length / state.postRecords)
        }
    }
   
    // to get the tasks segmented by pagination
    @Selector()
    static paginatedTasks(state: PostStateModel) {
        const start = (state.currentPage - 1) * state.postRecords;
        const end = start + state.postRecords;
        return state.posts.slice(start, end); 
    }

    //get the individual post by id
    static getPostById(id: string){
        return createSelector([PostState], (state: PostStateModel):Post | undefined => 
            state.posts.find((post) => post.postId === id)
        )
      }
    // change page
    @Action(ChangePage)
    changePage(ctx: StateContext<PostStateModel>, action: ChangePage) {
      ctx.patchState({ currentPage: action.page });
    }
    //call backend to get all posts then update the state
    @Action(GetPosts)
    getPosts(ctx:StateContext<PostStateModel>) {
        //get all posts from the backend and update the state
        return this.postService.getAllPosts().pipe(
            tap((posts:Post[])=> {
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    posts:posts
                })
            })
        )

       
    }
    // check if the post already exist in the state, else do an api call
    @Action(GetPostById)
    getPostById(ctx:StateContext<PostStateModel>, {id}:GetPostById) {
        const state = ctx.getState()

        const existingPostIndex = state.posts.findIndex(post => post.postId === id)
        
        if (existingPostIndex !== -1) {
            return;
        }
        // else do an api call and modify the state
        return this.postService.getIndividualPost(id).pipe(
            tap((post:Post) => {
                ctx.patchState({
                    posts:[...state.posts,post]
                })
            })
        )

 
    } 
   
    // delete a post. filter the post from the state and update the state, and update backend
    @Action(DeletePost)
    deleteDataFromState(ctx: StateContext<PostStateModel>, { id }: DeletePost) {
        return this.postService.deletePostId(id).pipe(tap(returnData => {
            const state=ctx.getState();
            
            // remove the id from the state
            const filteredArray=state.posts.filter(post=>post.postId!==id);
            // update the state
            ctx.setState({
                ...state,
                posts:filteredArray
            })
        }))
    }

     // implemented but not used
//     @Action(RequestAiImage)
//     requestAiImage(ctx: StateContext<PostStateModel>, { aiImageRequest }: RequestAiImage) {
//     const state = ctx.getState();

//     const existingPostIndex = state.posts.findIndex(post => post.postId === aiImageRequest.postId);
//     // see if post already exist in the state
//     if (existingPostIndex === -1) {
//         return; 
//     }
    
//     return this.postService.requestAiImage(aiImageRequest).pipe(
//         tap((response: AiImageRequestResponse) => {
           
//             const updatedPost = {
//                 ...state.posts[existingPostIndex], 
//                 aiImageUrl: response.aiImageUrl      
//             };

//             // Create a new posts array with the updated post
//             const updatedPosts = [...state.posts];
//             updatedPosts[existingPostIndex] = updatedPost; 

//             ctx.patchState({ posts: updatedPosts });
//         })
//     );
// }
  







}