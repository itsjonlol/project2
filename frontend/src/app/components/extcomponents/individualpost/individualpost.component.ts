import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AiImage, Post } from '../../../models/post';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotfoundComponent } from '../notfound/notfound.component';
import { Store } from '@ngxs/store';
import { PostState } from '../../../store/post.actions';
import { Observable } from 'rxjs'
import { ChangePage, DeletePost, GetPostById, RequestAiImage } from '../../../store/post.state';
import { IndividualpostsocialComponent } from "../individualpostsocial/individualpostsocial.component";

@Component({
  selector: 'app-individualpost',
  imports: [JsonPipe, NotfoundComponent, AsyncPipe, IndividualpostsocialComponent],
  templateUrl: './individualpost.component.html',
  styleUrl: './individualpost.component.css'
})
export class IndividualpostComponent implements OnInit,OnDestroy{
    postService = inject(PostService)
    postId!:number;
    activatedRoute = inject(ActivatedRoute)
    router = inject(Router)
    activatedRouteSubscription!:Subscription
    post:Post | undefined= {
      postId: 0,
      userId: '',
      username: '',
      title: '',
      description: '',
      aiComments: '',
      imageUrl: '',
      prompt: '',
      isActive: false,
      aiImageUrl: ''
    }
    errorMessage!:string;
    post$!:Observable<Post|undefined>

    postStore = inject(Store);
    canDelete:boolean=false;



    ngOnInit(): void {
      // this.activatedRoute.params.subscribe((params) => {
      //   this.postId = parseInt(params['postId']);
      // })

    //  this.activatedRouteSubscription= this.activatedRoute.params.pipe(
    //     switchMap((params) => {
    //      return this.postService.getIndividualPost(parseInt(params['postId']))
    //     })
    //   ).subscribe({
    //     next: (response:Post) => {
    //       this.post = response;
    //     },
    //     error: (error:HttpErrorResponse) => {
    //       this.errorMessage = error.error.message
    //     }
    //   } )
      this.activatedRoute.params.subscribe((params)=> {
        this.postId = parseInt(params['postId']);
        this.postStore.dispatch(new GetPostById(this.postId))
        this.postStore.select(PostState.getPostById(this.postId)).subscribe( d=> {
            this.post = d
            this.checkIfCanDelete()
        }
        )
      })
  

    }

    generateImage():void {
      const aiImageRequest:AiImage = {
        postId: this.post?.postId,
        prompt: this.post?.prompt
      }

      this.postStore.dispatch(new RequestAiImage(aiImageRequest))
    }

    deletePostById(id:number) {
        this.postStore.dispatch(new DeletePost(id));
        this.router.navigate(['/gallery'])
        this.postStore.dispatch(new ChangePage(1));
    }

    checkIfCanDelete() {
      const userId = sessionStorage.getItem("userid")
      if (userId === this.post?.userId) {
        this.canDelete=true // allow delete only for your own posts
      }
    }

    // this.emailService.requestEmailUpdates(emailRequest).subscribe({
    //   next: (response:EmailResponse)=> {
    //     alert(response.message)
    //   },
    //   error: (error:HttpErrorResponse)=> {
    //     this.errorMessage = error.error.message;
    //     alert(this.errorMessage)
    //   }
    // })

    ngOnDestroy(): void {
      // this.activatedRouteSubscription.unsubscribe();
    }
}
