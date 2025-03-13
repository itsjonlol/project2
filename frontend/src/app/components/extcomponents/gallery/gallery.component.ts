import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../../models/post';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { GetPosts } from '../../../store/post.state';
import { PostState } from '../../../store/post.actions';

@Component({
  selector: 'app-gallery',
  imports: [AsyncPipe,JsonPipe,NgIf,NgFor,RouterLink],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  

  postService = inject(PostService);
  postStore = inject(Store);
  posts$!:Observable<Post[]>

  // posts$:Observable<Post[]> = this.postService.getAllPosts()
  ngOnInit(): void {
    this.postStore.dispatch(new GetPosts());
    this.posts$ = this.postStore.select(PostState.getPosts);
  }
}
