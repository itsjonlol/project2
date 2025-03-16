import { Component, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { DeleteComment, PostSocial } from '../../../models/post';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
  selector: 'app-individualpostsocial',
  imports: [JsonPipe,AsyncPipe],
  templateUrl: './individualpostsocial.component.html',
  styleUrl: './individualpostsocial.component.css'
})
export class IndividualpostsocialComponent implements OnInit,OnDestroy{
    

    commentService = inject(CommentService)

    @Input({required:true})
    postSocial$!:Observable<PostSocial>
    // postId!: string

    @Output()
    emitDeleteComment = new Subject<DeleteComment>()



    currentUsername:string = localStorage.getItem('username') || 'anony'

   

    ngOnInit(): void {
      // this.postSocialSub = this.commentService.getPostSocial(this.postId).subscribe({
      //   next: (response:PostSocial) => {
      //     this.postSocial = response;
      //     this.errorMessage = null;

      //   },
      //   error: (error:HttpErrorResponse) => {
      //     this.errorMessage = error.error.message
      //   }
      // })
    }

    ngOnDestroy():void {
      // this.postSocialSub.unsubscribe();
    }

    deleteComment(postId:string,commentId:string) {
      const deleteComment:DeleteComment = {
        postId: postId,
        commentId: commentId
      }
      this.emitDeleteComment.next(deleteComment)
     
    }
    
   
}
