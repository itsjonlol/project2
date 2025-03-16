import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserInterface } from '../models/userinterface';
import { environment } from '../../environments/environment.development';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private loginUrl = 'http://localhost:4000/api/user';
  // private logoutUrl = 'http://localhost:4000/logout';


  // private postLoginUrl = 'http://localhost:4000/api/postuser'

  constructor(private httpClient: HttpClient) {}

  postUser(user:UserInterface):Observable<void> {
    return this.httpClient.post<void>(`${environment.backendUrl}/postuser`,user);
  }


 

  
}
