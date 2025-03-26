import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeleteComment, Post, PostComment, PostLike, PostSocial } from '../../../models/post';
import { NotfoundComponent } from '../notfound/notfound.component';
import { Store } from '@ngxs/store';
import { PostState } from '../../../store/post.actions';
import { Observable } from 'rxjs'
import { ChangePage, DeletePost, GetPostById } from '../../../store/post.state';
import { IndividualpostsocialComponent } from "../individualpostsocial/individualpostsocial.component";
import { CommentService } from '../../../services/comment.service';
import { AddcommentComponent } from "../addcomment/addcomment.component";

import { AccordionComponent, AccordionPanelComponent } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-individualpost',
  imports: [ NotfoundComponent,IndividualpostsocialComponent, AddcommentComponent,
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
    customClass = 'customClass';

    isGeneratingImage: boolean = false; 
    imageGenerationError: string | null = null;




    ngOnInit(): void {
      //get the post id from the url, then get the post from store/backend
      this.activatedRoute.params.subscribe((params)=> {
        this.postId = params['postId'];
        this.postStore.dispatch(new GetPostById(this.postId))
        this.postStore.select(PostState.getPostById(this.postId)).subscribe( d=> {
            this.post = d
            //delete button only for your own posts
            this.checkIfCanDelete()
        }
        )
        this.postSocial$ = this.commentService.getPostSocial(this.postId)
       
      })
  

    }
    
    //delete post for correct user
    deletePostById(id:string) {
        this.postStore.dispatch(new DeletePost(id));
        this.router.navigate(['/gallery'])
        this.postStore.dispatch(new ChangePage(1));
    }
    //delete posts if you are the correct user
    checkIfCanDelete() {
      const userId = sessionStorage.getItem("userId")
      
      if (userId === this.post?.userId) {
        this.canDelete=true // allow delete only for your own posts
      }
    }
    // like posts
    likePost() {
      const postLike:PostLike = {
        postId:this.postId,
        like:1
        
      }
      this.postSocial$ =this.commentService.postLike(postLike);
    }
    // to share on telegram
    share = () => {
      const message = `
      Checkout this drawing! 
    
      Title: ${this.post?.title}
      Description: ${this.post?.description}
      AI Comments: ${this.post?.aiComments}
      Image: ${this.post?.imageUrl}
      `;
    
      const imageUrl = this.post?.imageUrl || '' // fallback to empty string if imageUrl is undefined
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(message)}`;

      window.open(telegramUrl, '_blank');


  
    };
    // post or delete comments
    processPostComment($event:PostComment):void {
      this.postSocial$ =this.commentService.postComment($event);
    }

    processDeleteComment($event:DeleteComment):void {
      this.postSocial$ = this.commentService.deleteComment($event);
    }
   

    ngOnDestroy(): void {
      if (this.activatedRouteSubscription) {
        this.activatedRouteSubscription.unsubscribe();
      }

    }

    //generate image for ai -> to be used for future development

    // generateImage():void {

    //   this.isGeneratingImage = true;
    //   this.imageGenerationError = null;
    //   const aiImageRequest:AiImage = {
    //     postId: this.post?.postId,
    //     prompt: this.post?.prompt
    //   }

    //   // this.postStore.dispatch(new RequestAiImage(aiImageRequest))
    //   this.postStore.dispatch(new RequestAiImage(aiImageRequest)).subscribe({
    //     next: () => {
    //       this.isGeneratingImage = false;
         
    //     },
    //     error: (err) => {
    //       this.isGeneratingImage = false;
    //       this.imageGenerationError = 'Failed to generate image. ';
          
    //     }
    //   });
    // }
}
