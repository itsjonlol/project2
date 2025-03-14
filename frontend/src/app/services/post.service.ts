import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AiImage, Post } from '../models/post';

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

  private backendUrl = 'http://localhost:4000/api'

  // getPaginatedPosts(page:number):Observable<PaginatedPostResponse> {
  //   return this.httpClient.get<PaginatedPostResponse>(`${this.backendUrl}/allposts?page=${page}`)
  // }

  getAllPosts():Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${this.backendUrl}/allposts`)
  }

  getIndividualPost(postId:number):Observable<Post> {
    return this.httpClient.get<Post>(`${this.backendUrl}/getpost/${postId}`)
  }
  
  deletePostId(postId:number):Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${this.backendUrl}/deletepost/${postId}`)
  }

  /*
  @GetMapping(path="getpost",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostsByUsername(@RequestParam("username") String username) {
        List<Post> posts = postService.retrieveAllPostsByUsername(username);

        return ResponseEntity.status(200).body(posts);
    }
  */

  getPostsByUser(username:string):Observable<Post[]> {
    console.log(`${this.backendUrl}/getposts?username=${username}`)
    return this.httpClient.get<Post[]>(`${this.backendUrl}/getposts?username=${username}`);
  }

  requestAiImage(aiImageRequest:AiImage):Observable<AiImageRequestResponse> {
    return this.httpClient.post<AiImageRequestResponse>(`${this.backendUrl}/generateimage`,aiImageRequest);
  }

  
  
}
