import { Component, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostComment } from '../../../models/post';
import { Subject } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-addcomment',
  imports: [ReactiveFormsModule,JsonPipe],
  templateUrl: './addcomment.component.html',
  styleUrl: './addcomment.component.css'
})
export class AddcommentComponent implements OnInit{

  @Input({required:true})
  postId!: string;

  @Output()
  emitPostComment = new Subject<PostComment>()

  private fb = inject(FormBuilder)

  protected form!:FormGroup
  modalRef!: BsModalRef; // Reference to the modal
  constructor(private modalService: BsModalService) {}
  

  ngOnInit(): void {
    this.form = this.createForm();

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  processForm():void {
    const postComment:PostComment = {
      postId:this.postId,
      username: localStorage.getItem('username') || 'anonymous',
      comment: this.form.value.comment
    }
    this.emitPostComment.next(postComment);

    this.form = this.createForm();
    this.modalRef.hide(); // Close the modal
  }

//   export interface PostComment {
//     postId:string,
//     username:string;
//     comment:string;
// }
  createForm():FormGroup {
    return this.fb.group({
       comment: this.fb.control<string>('')
    })
  }

}
