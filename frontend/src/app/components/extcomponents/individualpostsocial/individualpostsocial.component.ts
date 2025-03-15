import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { PostSocial } from '../../../models/post';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-individualpostsocial',
  imports: [JsonPipe],
  templateUrl: './individualpostsocial.component.html',
  styleUrl: './individualpostsocial.component.css'
})
export class IndividualpostsocialComponent implements OnInit,OnDestroy{
    

    commentService = inject(CommentService)

    @Input({required:true})
    postId!: number

    postSocial!:PostSocial
    errorMessage:string | null = null;

    postSocialSub!: Subscription

    ngOnInit(): void {
      this.postSocialSub = this.commentService.getPostSocial(this.postId).subscribe({
        next: (response:PostSocial) => {
          this.postSocial = response;
          this.errorMessage = null;

        },
        error: (error:HttpErrorResponse) => {
          this.errorMessage = error.error.message
        }
      })
    }

    ngOnDestroy():void {
      this.postSocialSub.unsubscribe();
    }
}
