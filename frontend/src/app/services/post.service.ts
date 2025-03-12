import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }
  httpClient = inject(HttpClient);

  private backendUrl = 'http://localhost:4000/api'

  getAllPosts():Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.backendUrl}/allposts`)
  }
  
}
