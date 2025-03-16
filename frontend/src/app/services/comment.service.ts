import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DeleteComment, PostComment, PostLike, PostSocial } from '../models/post';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() { }

  httpClient = inject(HttpClient);

  // private backendUrl = 'http://localhost:4000/api'


  getPostSocial(postId:string): Observable<PostSocial> {
    return this.httpClient.get<PostSocial>(`${environment.backendUrl}/postsocial/${postId}`)
  }

  postComment(postComment:PostComment):Observable<PostSocial> {
    return this.httpClient.post<PostSocial>(`${environment.backendUrl}/comment`,postComment)
  }

  postLike(postLike:PostLike):Observable<PostSocial> {
    return this.httpClient.post<PostSocial>(`${environment.backendUrl}/like`,postLike)
  }

  deleteComment(deleteComment:DeleteComment):Observable<PostSocial> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: deleteComment
    };
    return this.httpClient.delete<PostSocial>(`${environment.backendUrl}/comment`,options)
  }
  
  
}
