import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../../models/post';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ChangePage, GetPosts } from '../../../store/post.state';
import { PaginationInfo, PostState } from '../../../store/post.actions';


@Component({
  selector: 'app-gallery',
  imports: [AsyncPipe,RouterLink],
  templateUrl: './gallery.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  

  postService = inject(PostService);
  postStore = inject(Store);
  posts$!:Observable<Post[]>
  paginationInfo$!:Observable<PaginationInfo>
  currentPage$!:Observable<number>
  totalPages$!:Observable<number>

  
  

 
  ngOnInit(): void {
    // get all posts
    this.postStore.dispatch(new GetPosts)
    // get tasks based on pagniation
    this.posts$ = this.postStore.select(PostState.paginatedTasks);
    // get pagination info (current page and total pages)
    this.paginationInfo$ = this.postStore.select(PostState.getPaginationInfo);
  
  }

  onPageChange(page: number) {
    //change page
    this.postStore.dispatch(new ChangePage(page));
  }
}
