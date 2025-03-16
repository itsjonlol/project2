import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AiImage, Post } from '../models/post';
import { environment } from '../../environments/environment.development';

export interface DeleteResponse {
    message:string;
}

export interface PaginatedPostResponse {
   posts: Post[],
   currentPage:number,
   totalPosts:number,
   totalPages:number
}

export interface AiImageRequestResponse {
    postId:number;
    aiImageUrl:string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }
  httpClient = inject(HttpClient);

  // private backendUrl = 'http://localhost:4000/api'

  // getPaginatedPosts(page:number):Observable<PaginatedPostResponse> {
  //   return this.httpClient.get<PaginatedPostResponse>(`${this.backendUrl}/allposts?page=${page}`)
  // }

  getAllPosts():Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${environment.backendUrl}/allposts`)
  }

  getIndividualPost(postId:string):Observable<Post> {
    return this.httpClient.get<Post>(`${environment.backendUrl}/getpost/${postId}`)
  }
  
  deletePostId(postId:string):Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${environment.backendUrl}/deletepost/${postId}`)
  }

  /*
  @GetMapping(path="getpost",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostsByUsername(@RequestParam("username") String username) {
        List<Post> posts = postService.retrieveAllPostsByUsername(username);

        return ResponseEntity.status(200).body(posts);
    }
  */

  getPostsByUser(username:string):Observable<Post[]> {
    console.log(`${environment.backendUrl}/getposts?username=${username}`)
    return this.httpClient.get<Post[]>(`${environment.backendUrl}/getposts?username=${username}`);
  }

  requestAiImage(aiImageRequest:AiImage):Observable<AiImageRequestResponse> {
    return this.httpClient.post<AiImageRequestResponse>(`${environment.backendUrl}/generateimage`,aiImageRequest);
  }

  
  
}
