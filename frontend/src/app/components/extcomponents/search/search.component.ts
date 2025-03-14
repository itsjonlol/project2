import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  postService = inject(PostService)

  form!:FormGroup

  fb = inject(FormBuilder)

  posts$!:Observable<Post[]>


  ngOnInit(): void {
    this.form=this.createForm()
  }

  processForm():void {

    this.posts$ =  this.postService.getPostsByUser(this.form.value.query);


    this.form = this.createForm();
  }

  createForm():FormGroup {
    return this.fb.group({
      query:this.fb.control<string>('')
    })
  }
}
