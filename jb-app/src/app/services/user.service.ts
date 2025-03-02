import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/gamemodels';




@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loginUrl = 'http://localhost:4000/api/user';
  private logoutUrl = 'http://localhost:4000/logout';

  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<User> {
    // Include withCredentials to send the session cookie along with the request
    return this.httpClient.get<User>(this.loginUrl, { withCredentials: true });
  }
  logout(): Observable<Object> {
    return this.httpClient.post(this.logoutUrl, {}, { withCredentials: true });
  }

  
}
