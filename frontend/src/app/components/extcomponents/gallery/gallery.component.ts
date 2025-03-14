import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../../models/post';
import { AsyncPipe, JsonPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ChangePage, GetPaginatedPosts, GetPosts } from '../../../store/post.state';
import { PaginationInfo, PostState } from '../../../store/post.actions';

@Component({
  selector: 'app-gallery',
  imports: [AsyncPipe,JsonPipe,NgIf,NgFor,RouterLink,NgStyle],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  

  postService = inject(PostService);
  postStore = inject(Store);
  posts$!:Observable<Post[]>
  paginationInfo$!:Observable<PaginationInfo>
  currentPage$!:Observable<number>
  totalPages$!:Observable<number>
  // currentPage!:number
  
  

  // posts$:Observable<Post[]> = this.postService.getAllPosts()
  ngOnInit(): void {
    // this.loadPage(1); // first page
    this.postStore.dispatch(new GetPosts)
    // this.posts$ = this.postStore.select(PostState.getPosts);
    this.posts$ = this.postStore.select(PostState.paginatedTasks);
    // this.paginationInfo$ = this.postStore.select(PostState.getPaginationInfo)
    this.paginationInfo$ = this.postStore.select(PostState.getPaginationInfo);
    // this.currentPage$.subscribe(d => this.currentPage = d)

    // this.totalPages$ = this.postStore.select(state => state.post.totalPages);
  }

  loadPage(page:number) {
    // this.postStore.dispatch(new GetPaginatedPosts(page));
  }
  onPageChange(page: number) {
    this.postStore.dispatch(new ChangePage(page));
  }
}
