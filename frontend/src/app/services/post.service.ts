import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

export interface DeleteResponse {
    message:string;
}

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

  getIndividualPost(postId:number):Observable<Post> {
    return this.httpClient.get<Post>(`${this.backendUrl}/getpost/${postId}`)
  }
  
  deletePostId(postId:number):Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${this.backendUrl}/deletepost/${postId}`)
  }
  
}
