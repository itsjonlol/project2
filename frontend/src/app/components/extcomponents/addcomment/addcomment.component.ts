import { Component, inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostComment } from '../../../models/post';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-addcomment',
  imports: [ReactiveFormsModule],
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
  modalRef!: BsModalRef; 
  constructor(private modalService: BsModalService) {}
  
  // create a form to add comment using a modal
  ngOnInit(): void {
    this.form = this.createForm();

  }
  // create modal to add comment
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  
  processForm():void {
    const postComment:PostComment = {
      postId:this.postId,
      username: sessionStorage.getItem('username') || 'anonymous',
      comment: this.form.value.comment
    }
    // to pass to parent
    this.emitPostComment.next(postComment);

    this.form = this.createForm();
    this.modalRef.hide(); 
  }


  createForm():FormGroup {
    return this.fb.group({
       comment: this.fb.control<string>('')
    })
  }

}
