import { inject, Injectable } from "@angular/core";
import { Post } from "../models/post";
import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { PostService } from "../services/post.service";
import { DeletePost, GetPosts } from "./post.state";
import { tap } from "rxjs";

export interface PostStateModel {
    posts: Post[];
}


@State<PostStateModel>({
    name: 'posts',
    defaults: {
      posts:[]
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