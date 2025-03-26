import { Component, Input, Output } from '@angular/core';
import { DeleteComment, PostSocial } from '../../../models/post';

import { Observable, Subject} from 'rxjs';
import { AsyncPipe} from '@angular/common';


@Component({
  selector: 'app-individualpostsocial',
  imports: [AsyncPipe],
  templateUrl: './individualpostsocial.component.html',
  styleUrl: './individualpostsocial.component.css'
})
export class IndividualpostsocialComponent{
    


    @Input({required:true})
    postSocial$!:Observable<PostSocial>


    @Output()
    emitDeleteComment = new Subject<DeleteComment>()



    currentUsername:string = sessionStorage.getItem('username') || 'anony'
  
    //tell parent to delete comment
    deleteComment(postId:string,commentId:string) {
      const deleteComment:DeleteComment = {
        postId: postId,
        commentId: commentId
      }
      this.emitDeleteComment.next(deleteComment)
     
    }
    
   
}
