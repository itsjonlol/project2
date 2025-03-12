import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../../models/post';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [AsyncPipe,JsonPipe,NgIf,NgFor],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  

  postService = inject(PostService);

  posts$:Observable<Post[]> = this.postService.getAllPosts()
  ngOnInit(): void {
    
  }
}
