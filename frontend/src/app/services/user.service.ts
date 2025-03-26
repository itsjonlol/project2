import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserInterface } from '../models/userinterface';
import { environment } from '../../environments/environment.development';




@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private httpClient: HttpClient) {}
  // when login, do a call to mysql backend to check if user exists
  // if user doesnt exist, create a user in mysql
  postUser(user:UserInterface):Observable<void> {
    return this.httpClient.post<void>(`${environment.backendUrl}/postuser`,user);
  }


 

  
}
