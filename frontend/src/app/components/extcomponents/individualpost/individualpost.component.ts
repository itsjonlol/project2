import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AiImage, DeleteComment, Post, PostComment, PostLike, PostSocial } from '../../../models/post';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NotfoundComponent } from '../notfound/notfound.component';
import { Store } from '@ngxs/store';
import { PostState } from '../../../store/post.actions';
import { Observable } from 'rxjs'
import { ChangePage, DeletePost, GetPostById, RequestAiImage } from '../../../store/post.state';
import { IndividualpostsocialComponent } from "../individualpostsocial/individualpostsocial.component";
import { CommentService } from '../../../services/comment.service';
import { AddcommentComponent } from "../addcomment/addcomment.component";

import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-individualpost',
  imports: [JsonPipe, NotfoundComponent, AsyncPipe, IndividualpostsocialComponent, AddcommentComponent,
  AccordionComponent,AccordionPanelComponent
    
  ],
  templateUrl: './individualpost.component.html',
  styleUrl: './individualpost.component.css'
})
export class IndividualpostComponent implements OnInit,OnDestroy{
    commentService = inject(CommentService)
    postService = inject(PostService)
    postId!:string;
    activatedRoute = inject(ActivatedRoute)
    router = inject(Router)
    activatedRouteSubscription!:Subscription
    post:Post | undefined= {
      postId: '',
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

    postSocial$!:Observable<PostSocial>



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
        this.postId = params['postId'];
        this.postStore.dispatch(new GetPostById(this.postId))
        this.postStore.select(PostState.getPostById(this.postId)).subscribe( d=> {
            this.post = d
            this.checkIfCanDelete()
        }
        )
        this.postSocial$ = this.commentService.getPostSocial(this.postId)
      })
  

    }

    generateImage():void {
      const aiImageRequest:AiImage = {
        postId: this.post?.postId,
        prompt: this.post?.prompt
      }

      this.postStore.dispatch(new RequestAiImage(aiImageRequest))
    }

    deletePostById(id:string) {
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

    likePost() {
      const postLike:PostLike = {
        postId:this.postId,
        like:1
        
      }
      this.postSocial$ =this.commentService.postLike(postLike);
    }

    share = () => {
      const message = `
      Checkout this drawing! 🎨
    
      🖼️ Title: ${this.post?.title}
      📝 Description: ${this.post?.description}
      🤖 AI Comments: ${this.post?.aiComments}
  
      📷 Image: ${this.post?.imageUrl}
      `;
    
      navigator.clipboard.writeText(message)

      const message2 = 'Check out this image!'; // Optional message to accompany the image
      const imageUrl = this.post?.imageUrl || ''
    // Construct the Telegram share URL
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(message)}`;

    // Open the Telegram share URL in a new window
    window.open(telegramUrl, '_blank');

      
  
    };

    processPostComment($event:PostComment):void {
      this.postSocial$ =this.commentService.postComment($event);
    }

    processDeleteComment($event:DeleteComment):void {
      this.postSocial$ = this.commentService.deleteComment($event);
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
