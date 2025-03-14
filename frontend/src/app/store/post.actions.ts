import { inject, Injectable } from "@angular/core";
import { AiImage, Post } from "../models/post";
import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { AiImageRequestResponse, PostService } from "../services/post.service";
import { ChangePage, DeletePost, GetPaginatedPosts, GetPostById, GetPosts, RequestAiImage } from "./post.state";
import { tap } from "rxjs";

export interface PostStateModel {
    posts: Post[];
    currentPage: number;
    // totalPages: number;
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
    //   totalPages:0
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
            currentPage: state.currentPage,
            totalPages: Math.ceil(state.posts.length / state.postRecords)
        }
    }

    @Selector()
    static paginatedTasks(state: PostStateModel) {
        const start = (state.currentPage - 1) * state.postRecords;
        const end = start + state.postRecords;
        return state.posts.slice(start, end); // Paginate in Angular
    }

    static getPostById(id: number){
        return createSelector([PostState], (state: PostStateModel):Post | undefined => {
          return state.posts.find((post) => post.postId === id);
        });
      }

//     @Selector()
// static getPostById(postId: number) {
//   return (state: PostStateModel) =>
//     state.posts.find((post) => post.postId === postId);
// }

    // @Selector()
    // static getPostById(id:number):any{
    //     return (state:PostStateModel) => state.posts.find((post) => post.postId === id)
    // }

    @Action(ChangePage)
    changePage(ctx: StateContext<PostStateModel>, action: ChangePage) {
      ctx.patchState({ currentPage: action.page });
    }

    @Action(GetPosts)
    getPosts(ctx:StateContext<PostStateModel>) {
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

    @Action(GetPostById)
    getPostById(ctx:StateContext<PostStateModel>, {id}:GetPostById) {
        const state = ctx.getState()

        const existingPostIndex = state.posts.findIndex(post => post.postId === id)

        if (existingPostIndex !== -1) {
            return;
        }
        
        return this.postService.getIndividualPost(id).pipe(
            tap((post:Post) => {
                ctx.patchState({
                    posts:[...state.posts,post]
                })
            })
        )

 
    } 

    @Action(RequestAiImage)
    requestAiImage(ctx: StateContext<PostStateModel>, { aiImageRequest }: RequestAiImage) {
    const state = ctx.getState();

    const existingPostIndex = state.posts.findIndex(post => post.postId === aiImageRequest.postId);

    if (existingPostIndex === -1) {
        return; // If post not found, exit early
    }

    return this.postService.requestAiImage(aiImageRequest).pipe(
        tap((response: AiImageRequestResponse) => {
            // Create a new updated post object
            const updatedPost = {
                ...state.posts[existingPostIndex],  // Copy the existing post
                aiImageUrl: response.aiImageUrl       // Update with AI image response
            };

            // Create a new posts array with the updated post
            const updatedPosts = [...state.posts];
            updatedPosts[existingPostIndex] = updatedPost; // Replace the specific post

            // ✅ Update state with the new posts array
            ctx.patchState({ posts: updatedPosts });
        })
    );
}
  
    // @Action(GetPaginatedPosts)
    // getPosts(ctx:StateContext<PostStateModel>,{page}: GetPaginatedPosts) {
    //     // return this.postService.getAllPosts().pipe(
    //     //     tap((posts:Post[])=> {
    //     //         const state = ctx.getState();
    //     //         ctx.setState({
    //     //             ...state,
    //     //             posts:posts
    //     //         })
    //     //     })
    //     // )

    //     return this.postService.getPaginatedPosts(page).pipe(
    //         tap((response)=> {
    //             const state = ctx.getState();
    //             ctx.setState({
    //                 ...state,
    //                 posts:response.posts,
    //                 currentPage: response.currentPage,
    //                 totalPages:response.totalPages
    //             })
    //         })
    //     )
    // }

    // @Action(GetPostById)
    // getPostById(ctx: StateContext<PostStateModel>,{id}:GetPostById) {
    //     return this.postService.getIndividualPost(id).pipe(
    //         tap(post:Post) => {
    //             const state = ctx.getState();

    //             let existingPostIndex = state.posts.findIndex(post=>post.postId === id);


    //             ctx.patchState({
    //                 ...state,
    //                 posts:
    //             })
    //         }
    //     )
        
       

    // }

    @Action(DeletePost)
    deleteDataFromState(ctx: StateContext<PostStateModel>, { id }: DeletePost) {
        return this.postService.deletePostId(id).pipe(tap(returnData => {
            const state=ctx.getState();
            
            //Here we will create a new Array called filteredArray which won't contain the given id and set it equal to state.todo
            const filteredArray=state.posts.filter(post=>post.postId!==id);

            ctx.setState({
                ...state,
                posts:filteredArray
            })
        }))
    }
    // @Action(DeletePost)
    // deleteDataFromState(ctx: StateContext<PostStateModel>, { id }: DeletePost) {
    //     return this._du.deleteUser(id).pipe(tap(returnData => {
    //         const state=ctx.getState();
    //         console.log("The is is",id)
    //         //Here we will create a new Array called filteredArray which won't contain the given id and set it equal to state.todo
    //         const filteredArray=state.users.filter(contents=>contents.id!==id);

    //         ctx.setState({
    //             ...state,
    //             users:filteredArray
    //         })
    //     }))
    // }



//     @Action(GetTasks)
//   getTasks(ctx: StateContext<TaskStateModel>) {
//     return this.taskService.getTasks().pipe(
//       tap((tasks) => {
//         ctx.patchState({ tasks }); // Store tasks from API response
//       })
//     );
//   }



}